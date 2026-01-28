import { ItemView, WorkspaceLeaf } from 'obsidian'

import { TODO_VIEW_TYPE } from './constants'
import App from './svelte/App.svelte'
import { groupTodos, parseTodos } from './utils'

import type { TodoSettings } from './settings'
import type TodoPlugin from './main'
import type { TodoGroup, TodoItem } from './_types'
export default class TodoListView extends ItemView {
  private _app: App
  private lastRerender = 0
  private groupedItems: TodoGroup[] = []
  private itemsByFile = new Map<string, TodoItem[]>()
  private searchTerm = ''

  constructor(
    leaf: WorkspaceLeaf,
    private plugin: TodoPlugin,
  ) {
    super(leaf)
  }

  getViewType(): string {
    return TODO_VIEW_TYPE
  }

  getDisplayText(): string {
    return 'Todo List'
  }

  getIcon(): string {
    return 'checkmark'
  }

  get todoTagArray() {
    return this.plugin
      .getSettingValue('todoPageName')
      .trim()
      .split('\n')
      .map(e => e.toLowerCase())
      .filter(e => e)
  }

  get visibleTodoTagArray() {
    return this.todoTagArray.filter(
      t => !this.plugin.getSettingValue('_hiddenTags').includes(t),
    )
  }

  async onClose() {
    this._app.$destroy()
  }

  async onOpen(): Promise<void> {
    this._app = new App({
      target: (this as any).contentEl,
      props: this.props(),
    })
    this.registerEvent(
      this.app.metadataCache.on('resolved', async () => {
        if (!this.plugin.getSettingValue('autoRefresh')) return
        await this.refresh()
      }),
    )
    this.registerEvent(
      this.app.workspace.on('active-leaf-change', async () => {
        if (!this.plugin.getSettingValue('showOnlyActiveFile')) return
        await this.refresh()
      })
    )
    this.registerEvent(
      this.app.vault.on('delete', file => this.deleteFile(file.path)),
    )
    this.refresh()
  }

  async refresh(all = false) {
    if (all) {
      this.lastRerender = 0
      this.itemsByFile.clear()
    }
    await this.calculateAllItems()
    this.groupItems()
    this.renderView()
    this.lastRerender = +new Date()
  }

  rerender() {
    this.renderView()
  }

  private deleteFile(path: string) {
    this.itemsByFile.delete(path)
    this.groupItems()
    this.renderView()
  }

  private props() {
    return {
      todoTags: this.todoTagArray,
      lookAndFeel: this.plugin.getSettingValue('lookAndFeel'),
      subGroupBy: this.plugin.getSettingValue('subGroupBy'),
      subHeaders: this.plugin.getSettingValue('subHeaders'),
      groupByProperty: this.plugin.getSettingValue('groupByProperty'),
      groupBy: this.plugin.getSettingValue('groupBy'),
      showChecked: this.plugin.getSettingValue('showChecked'),
      useMinimalThemeIcons: this.plugin.getSettingValue('useMinimalThemeIcons'),
      _collapsedSections: this.plugin.getSettingValue('_collapsedSections'),
      _hiddenTags: this.plugin.getSettingValue('_hiddenTags'),
      _hiddenGroups: this.plugin.getSettingValue('_hiddenGroups'),
      app: this.app,
      todoGroups: this.groupedItems,
      updateSetting: (updates: Partial<TodoSettings>) =>
        this.plugin.updateSettings(updates),
      onSearch: (val: string) => {
        this.searchTerm = val
        this.refresh()
      },
      onRefresh: () => this.refresh(true),
    }
  }

  private async calculateAllItems() {
    const todosForUpdatedFiles = await parseTodos(
      this.app.vault.getMarkdownFiles(),
      this.todoTagArray.length === 0 ? ['*'] : this.visibleTodoTagArray,
      this.app.metadataCache,
      this.app.vault,
      this.plugin.getSettingValue('includeFiles'),
      this.plugin.getSettingValue('showChecked'),
      this.plugin.getSettingValue('showAllTodos'),
      this.lastRerender,
    )
    for (const [file, todos] of todosForUpdatedFiles) {
      this.itemsByFile.set(file.path, todos)
    }
  }

  private groupItems() {
    const flattenedItems = Array.from(this.itemsByFile.values()).flat()
    const viewOnlyOpen = this.plugin.getSettingValue('showOnlyActiveFile');
    const openFile = this.app.workspace.getActiveFile();
    const filteredItems = viewOnlyOpen ? flattenedItems.filter(i => i.filePath === openFile.path) : flattenedItems;

    // Group all items first
    let grouped = groupTodos(
      filteredItems,
      this.plugin.getSettingValue('groupBy'),
      this.plugin.getSettingValue('sortDirectionGroups'),
      this.plugin.getSettingValue('sortDirectionItems'),
      this.plugin.getSettingValue('sortDirectionSubGroups'),
      this.plugin.getSettingValue('groupByProperty'),
      this.plugin.getSettingValue('subGroupBy'),
    )

    // Filter groups if there is a search term
    if (this.searchTerm) {
      grouped = this.filterGroups(grouped, this.searchTerm)
    }

    this.groupedItems = grouped
  }

  private filterGroups(groups: TodoGroup[], term: string): TodoGroup[] {
    const lowerTerm = term.toLowerCase()

    return groups.reduce((acc, group) => {
      const groupName = this.getGroupName(group).toLowerCase()
      const groupMatches = groupName.includes(lowerTerm)

      // If group matches, check if we need to filter subgroups (if the user wants to see ALL items in matched group, we just keep it)
      // However, if the group has subgroups, we should probably keep the structure.
      // If the group matches, we keep the group and ALL its contents.
      if (groupMatches) {
        acc.push(group)
        return acc
      }

      // If group name doesn't match, we check its items and subgroups

      // Filter todos
      const matchingTodos = group.todos.filter(t => t.originalText.toLowerCase().includes(lowerTerm))

      // Filter subgroups recursively
      const matchingSubGroups = group.groups ? this.filterGroups(group.groups, term) : undefined

      // If there are matches in todos or subgroups, we keep this group (with filtered content)
      if (matchingTodos.length > 0 || (matchingSubGroups && matchingSubGroups.length > 0)) {
        // Create a shallow copy to avoid mutating the original group structure if it's reused elsewhere
        // (Though groupTodos creates fresh groups each time, so it's likely safe, but good practice)
        const newGroup = { ...group }
        newGroup.todos = matchingTodos
        if (matchingSubGroups) {
          newGroup.groups = matchingSubGroups
        }
        acc.push(newGroup)
      }

      return acc
    }, [] as TodoGroup[])
  }

  private getGroupName(group: TodoGroup): string {
    if (group.type === 'page') return group.pageName || ''
    if (group.type === 'heading') return group.heading || ''
    if (group.type === 'folder') return group.folderName || ''
    if (group.type === 'property') return group.propertyValue || ''
    if (group.type === 'tag') {
      if (group.mainTag) {
        return `#${group.mainTag}${group.subTags ? '/' + group.subTags : ''}`
      }
      return 'No Tag'
    }
    return ''
  }

  private renderView() {
    this._app.$set(this.props())
  }
}

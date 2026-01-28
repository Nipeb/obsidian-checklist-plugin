<script lang="ts">
  import type {App} from 'obsidian'
  import type {LookAndFeel, TodoGroup, GroupByType} from 'src/_types'
  import type {TodoSettings} from 'src/settings'
  import ChecklistGroup from './ChecklistGroup.svelte'
  import Header from './Header.svelte'

  export let todoTags: string[]
  export let lookAndFeel: LookAndFeel
  export let _collapsedSections: string[]
  export let subHeaders: boolean
  export let _hiddenTags: string[]
  export let _hiddenGroups: string[]
  export let updateSetting: (updates: Partial<TodoSettings>) => Promise<void>

  export let onSearch: (str: string) => void
  export let onRefresh: () => void
  export let app: App
  export let groupByProperty: string
  export let groupBy: GroupByType
  export let subGroupBy: GroupByType
  export let showChecked: boolean
  export let useMinimalThemeIcons: boolean
  export let todoGroups: TodoGroup[] = []

  const visibleTags = todoTags.filter(t => !_hiddenTags.includes(t))

  const toggleGroup = (id: string) => {
    const newCollapsedSections = _collapsedSections.includes(id)
      ? _collapsedSections.filter(e => e !== id)
      : [..._collapsedSections, id]
    updateSetting({_collapsedSections: newCollapsedSections})
  }

  const hideGroup = (id: string) => {
    const newHiddenGroups = [..._hiddenGroups, id]
    updateSetting({_hiddenGroups: newHiddenGroups})
  }

  const resetHiddenGroups = () => {
    updateSetting({_hiddenGroups: []})
  }

  const updateTagStatus = (tag: string, status: boolean) => {
    const newHiddenTags = _hiddenTags.filter(t => t !== tag)
    if (!status) newHiddenTags.push(tag)
    updateSetting({_hiddenTags: newHiddenTags})
  }
</script>

<div class="checklist-plugin-main markdown-preview-view">
  <Header
    disableSearch={todoGroups.length === 0}
    {todoTags}
    hiddenTags={_hiddenTags}
    onTagStatusChange={updateTagStatus}
    {onSearch}
    {onRefresh}
    {updateSetting}
    {groupBy}
    {subGroupBy}
    {showChecked}
    {resetHiddenGroups}
    hiddenGroupCount={_hiddenGroups.length}
    sortDirectionGroups="new->old"
    sortDirectionItems="new->old" />
  {#if todoGroups.length === 0}
    <div class="empty">
      {#if _hiddenTags.length === todoTags.length}
        All checklist set to hidden
      {:else if visibleTags.length}
        No checklists found for tag{visibleTags.length > 1 ? 's' : ''}: {visibleTags
          .map(e => `#${e}`)
          .join(' ')}
      {:else}
        No checklists found in all files
      {/if}
    </div>
  {:else}
    {#each todoGroups as group}
      {#if !_hiddenGroups.includes(group.id)}
        <ChecklistGroup
          {group}
          {app}
          {lookAndFeel}
          {subHeaders}
          {useMinimalThemeIcons}
          isCollapsed={_collapsedSections.includes(group.id)}
          onToggle={toggleGroup}
          onHide={hideGroup}
          {_hiddenGroups}
          {_collapsedSections} />
      {/if}
    {/each}
  {/if}
</div>

<style>
  .empty {
    color: var(--text-faint);
    text-align: center;
    margin-top: 32px;
    font-style: italic;
  }

  .checklist-plugin-main {
    padding: initial;
    width: initial;
    height: initial;
    position: initial;
    overflow-y: initial;
    overflow-wrap: initial;
  }
</style>

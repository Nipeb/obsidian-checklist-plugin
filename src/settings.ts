import { App, PluginSettingTab, Setting } from 'obsidian'

import type TodoPlugin from './main'
import type { GroupByType, LookAndFeel, SortDirection } from './_types'

export interface TodoSettings {
  todoPageName: string
  showChecked: boolean
  showAllTodos: boolean
  showOnlyActiveFile: boolean
  autoRefresh: boolean
  groupBy: GroupByType
  subGroupBy: GroupByType
  groupByProperty: string
  subHeaders: boolean
  sortDirectionItems: SortDirection
  sortDirectionGroups: SortDirection
  sortDirectionSubGroups: SortDirection
  includeFiles: string
  lookAndFeel: LookAndFeel
  _collapsedSections: string[]
  _hiddenTags: string[]
  _hiddenGroups: string[]
  useMinimalThemeIcons: boolean
}

export const DEFAULT_SETTINGS: TodoSettings = {
  todoPageName: 'todo',
  showChecked: false,
  showAllTodos: false,
  showOnlyActiveFile: false,
  autoRefresh: true,
  subHeaders: false,
  groupBy: 'page',
  subGroupBy: 'heading',
  groupByProperty: 'priority',
  sortDirectionItems: 'new->old',
  sortDirectionGroups: 'new->old',
  sortDirectionSubGroups: 'new->old',
  includeFiles: '',
  lookAndFeel: 'classic',
  _collapsedSections: [],
  _hiddenTags: [],
  _hiddenGroups: [],
  useMinimalThemeIcons: false,
}

export class TodoSettingTab extends PluginSettingTab {
  constructor(
    app: App,
    private plugin: TodoPlugin,
  ) {
    super(app, plugin)
  }

  display(): void {
    this.containerEl.empty()

    this.containerEl.empty()

    /** GENERAL */
    this.containerEl.createEl('h2', { text: 'General' })

    new Setting(this.containerEl)
      .setName('Show Completed?')
      .addToggle(toggle => {
        toggle.setValue(this.plugin.getSettingValue('showChecked'))
        toggle.onChange(async value => {
          await this.plugin.updateSettings({ showChecked: value })
        })
      })

    new Setting(this.containerEl)
      .setName("Show Subheaders?")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.getSettingValue("subHeaders"))
        toggle.onChange(async (value) => {
          await this.plugin.updateSettings({ subHeaders: value })
        })
      })
      .setDesc("Show subheaders for each checklist item")

    new Setting(this.containerEl)
      .setName('Auto Refresh List?')
      .addToggle(toggle => {
        toggle.setValue(this.plugin.getSettingValue('autoRefresh'))
        toggle.onChange(async value => {
          await this.plugin.updateSettings({ autoRefresh: value })
        })
      })
      .setDesc(
        'It\'s recommended to leave this on unless you are expereince performance issues due to a large vault. You can then reload manually using the "Checklist: refresh" command',
      )

    /** DATA SOURCE */
    this.containerEl.createEl('h2', { text: 'Data Source' })

    new Setting(this.containerEl)
      .setName('Tag name')
      .setDesc(
        'e.g. "todo" will match #todo. You may add mutliple tags separated by a newline. Leave empty to capture all',
      )
      .addTextArea(text =>
        text
          .setPlaceholder('todo')
          .setValue(this.plugin.getSettingValue('todoPageName'))
          .onChange(async value => {
            await this.plugin.updateSettings({
              todoPageName: value,
            })
          }),
      )

    new Setting(this.containerEl)
      .setName('Include Files')
      .setDesc(
        'Include all files that match this glob pattern. Examples on plugin page/github readme. Leave empty to check all files.',
      )
      .setTooltip('**/*')
      .addText(text =>
        text
          .setValue(this.plugin.getSettingValue('includeFiles'))
          .onChange(async value => {
            await this.plugin.updateSettings({
              includeFiles: value,
            })
          }),
      )

    new Setting(this.containerEl)
      .setName('Show All Todos In File?')
      .setDesc(
        'Show all items in file if tag is present, or only items attached to the block where the tag is located. Only has an effect if Tag Name is not empty',
      )
      .addToggle(toggle => {
        toggle.setValue(this.plugin.getSettingValue('showAllTodos'))
        toggle.onChange(async value => {
          await this.plugin.updateSettings({ showAllTodos: value })
        })
      })

    new Setting(this.containerEl)
      .setName('Show only in currently active file?')
      .setDesc(
        'Show only todos present in currently active file?'
      )
      .addToggle(toggle => {
        toggle.setValue(this.plugin.getSettingValue('showOnlyActiveFile'))
        toggle.onChange(async value => {
          await this.plugin.updateSettings({ showOnlyActiveFile: value })
        })
      })


    /** GROUPING & SORTING */
    this.containerEl.createEl('h2', { text: 'Grouping & Sorting' })

    new Setting(this.containerEl).setName('Group By').addDropdown(dropdown => {
      dropdown.addOption('page', 'Page')
      dropdown.addOption('heading', 'Heading')
      dropdown.addOption('folder', 'Folder')
      dropdown.addOption('tag', 'Tag')
      dropdown.addOption('property', 'Property')
      dropdown.setValue(this.plugin.getSettingValue('groupBy'))
      dropdown.onChange(async (value: GroupByType) => {
        await this.plugin.updateSettings({ groupBy: value })
      })
    })

    new Setting(this.containerEl)
      .setName('Group By Property Name')
      .setDesc('The frontmatter property to group by (only used if Group By is set to Property)')
      .addText(text =>
        text
          .setValue(this.plugin.getSettingValue('groupByProperty'))
          .onChange(async value => {
            await this.plugin.updateSettings({ groupByProperty: value })
          })
      )

    new Setting(this.containerEl).setName('Sub-Group By').addDropdown(dropdown => {
      dropdown.addOption('page', 'Page')
      dropdown.addOption('heading', 'Heading')
      dropdown.addOption('folder', 'Folder')
      dropdown.addOption('tag', 'Tag')
      dropdown.addOption('property', 'Property')
      dropdown.setValue(this.plugin.getSettingValue('subGroupBy'))
      dropdown.onChange(async (value: GroupByType) => {
        await this.plugin.updateSettings({ subGroupBy: value })
      })
    })

    new Setting(this.containerEl)
      .setName('Item Sort')
      .addDropdown(dropdown => {
        dropdown.addOption('a->z', 'A -> Z')
        dropdown.addOption('z->a', 'Z -> A')
        dropdown.addOption('new->old', 'New -> Old')
        dropdown.addOption('old->new', 'Old -> New')
        dropdown.setValue(this.plugin.getSettingValue('sortDirectionItems'))
        dropdown.onChange(async (value: SortDirection) => {
          await this.plugin.updateSettings({
            sortDirectionItems: value,
          })
        })
      })
      .setDesc(
        'Time sorts are based on last time the file for a particular item was edited',
      )

    new Setting(this.containerEl)
      .setName('Group Sort')
      .addDropdown(dropdown => {
        dropdown.addOption('a->z', 'A -> Z')
        dropdown.addOption('z->a', 'Z -> A')
        dropdown.addOption('new->old', 'New -> Old')
        dropdown.addOption('old->new', 'Old -> New')
        dropdown.setValue(this.plugin.getSettingValue('sortDirectionGroups'))
        dropdown.onChange(async (value: SortDirection) => {
          await this.plugin.updateSettings({
            sortDirectionGroups: value,
          })
        })
      })
      .setDesc(
        'Time sorts are based on last time the file for the newest or oldest item in a group was edited',
      )

    new Setting(this.containerEl)
      .setName("Sub-Group Sort")
      .addDropdown((dropdown) => {
        dropdown.addOption("a->z", "A -> Z")
        dropdown.addOption("z->a", "Z -> A")
        dropdown.addOption("new->old", "New -> Old")
        dropdown.addOption("old->new", "Old -> New")
        dropdown.setValue(this.plugin.getSettingValue("sortDirectionSubGroups"))
        dropdown.onChange(async (value: SortDirection) => {
          await this.plugin.updateSettings({ sortDirectionSubGroups: value })
        })
      })
      .setDesc("Time sorts are based on last time the file for the newest or oldest item in a group was edited")

    /** STYLING */
    this.containerEl.createEl('h2', { text: 'Styling' })

    new Setting(this.containerEl)
      .setName('Look and Feel')
      .addDropdown(dropdown => {
        dropdown.addOption('classic', 'Classic')
        dropdown.addOption('compact', 'Compact')
        dropdown.addOption('minimal', 'Minimal 1')
        dropdown.addOption('native', 'Minimal 2')
        dropdown.setValue(this.plugin.getSettingValue('lookAndFeel'))
        dropdown.onChange(async (value: LookAndFeel) => {
          await this.plugin.updateSettings({ lookAndFeel: value })
        })
      })

    new Setting(this.containerEl)
      .setName('Use Minimal Theme Icons')
      .setDesc('Render Minimal Theme style icons for tasks (e.g. [?], [!], etc.)')
      .addToggle(toggle => {
        toggle.setValue(this.plugin.getSettingValue('useMinimalThemeIcons'))
        toggle.onChange(async value => {
          await this.plugin.updateSettings({ useMinimalThemeIcons: value })
        })
      })
  }
}

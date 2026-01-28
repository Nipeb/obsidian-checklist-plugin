<script lang="ts">
  import Icon from './Icon.svelte'
  import {clickOutside} from './clickOutside.directive'
  import type {GroupByType, SortDirection} from 'src/_types'
  import type {TodoSettings} from 'src/settings'

  export let todoTags: string[]
  export let hiddenTags: string[]
  export let disableSearch: boolean
  export let onTagStatusChange: (tag: string, status: boolean) => void
  export let onSearch: (str: string) => void
  export let onRefresh: () => void

  // New props for controlling settings from the header
  export let updateSetting: (updates: Partial<TodoSettings>) => Promise<void>
  export let groupBy: GroupByType
  export let subGroupBy: GroupByType
  export let sortDirectionGroups: SortDirection
  export let sortDirectionItems: SortDirection
  export let showChecked: boolean
  export let resetHiddenGroups: () => void
  export let hiddenGroupCount: number = 0

  let showPopover = false
  let search = ''
</script>

<div class="container">
  <input
    disabled={disableSearch && !search}
    class="search"
    placeholder="Search tasks"
    bind:value={search}
    on:input={() => onSearch(search)} />
  <div class="settings-container">
    <div class="clickable-icon" on:click={onRefresh} title="Refresh List">
      <Icon name="refresh-cw" />
    </div>
    <div
      class="clickable-icon"
      on:click={ev => {
        showPopover = !showPopover
      }}
      title="View Options">
      <!-- Using 'settings' icon for now, ideally 'sliders' or similar -->
      <Icon name="settings" />
    </div>

    {#if showPopover}
      <div
        use:clickOutside
        on:click_outside={ev => {
          showPopover = false
        }}
        class="popover">
        <section>
          <div class="section-title">Display Options</div>
          <div class="setting-item">
            <label>Group By</label>
            <select
              value={groupBy}
              on:change={e => updateSetting({groupBy: e.currentTarget.value})}>
              <option value="page">Page</option>
              <option value="heading">Heading</option>
              <option value="folder">Folder</option>
              <option value="tag">Tag</option>
              <option value="property">Property</option>
            </select>
          </div>
          <div class="setting-item">
            <label>Sub-Group By</label>
            <select
              value={subGroupBy}
              on:change={e =>
                updateSetting({subGroupBy: e.currentTarget.value})}>
              <option value="none">None</option>
              <option value="page">Page</option>
              <option value="heading">Heading</option>
              <option value="folder">Folder</option>
              <option value="tag">Tag</option>
              <option value="property">Property</option>
            </select>
          </div>
        </section>

        <section>
          <div class="section-title">Filters</div>
          <div class="setting-item">
            <label>
              <input
                type="checkbox"
                checked={showChecked}
                on:change={e =>
                  updateSetting({showChecked: e.currentTarget.checked})} />
              Show Completed
            </label>
          </div>
          {#if hiddenGroupCount > 0}
            <div class="setting-item">
              <button class="reset-btn" on:click={resetHiddenGroups}>
                Reset Hidden Groups ({hiddenGroupCount})
              </button>
            </div>
          {/if}
        </section>

        <section>
          <div class="section-title">Filter by Tags</div>
          {#each todoTags as tag}
            <div class="checkbox-item">
              <label
                ><input
                  type="checkbox"
                  checked={!hiddenTags.includes(tag)}
                  on:click|preventDefault={ev =>
                    onTagStatusChange(tag, hiddenTags.includes(tag))} /><span
                  class="hash">#</span
                >{tag}</label>
            </div>
          {/each}
          {#if todoTags.length === 0}
            <div class="empty">No tags found</div>
          {/if}
        </section>
      </div>
    {/if}
  </div>
</div>

<style>
  .empty {
    color: var(--text-faint);
    text-align: center;
    font-style: italic;
    font-size: 0.9em;
  }

  .container {
    height: 32px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
  }

  .search {
    flex: 1;
    background: var(--checklist-searchBackground);
    border: none;
    font-size: var(--checklist-contentFontSize);
    border-radius: var(--checklist-listItemBorderRadius);
    padding: 0px 8px;
    color: var(--checklist-textColor);
    height: 100%;
  }

  .search:focus {
    box-shadow: 0 0 0 2px var(--checklist-accentColor);
  }

  .settings-container {
    flex-shrink: 1;
    display: flex;
    align-items: center;
    position: relative;
  }

  .clickable-icon {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
  }
  .clickable-icon :global(svg) {
    width: 18px;
    height: 18px;
  }

  .clickable-icon:hover {
    background-color: var(--background-modifier-hover);
  }

  .popover {
    position: absolute;
    top: 36px;
    right: 0px;
    width: 280px;
    padding: 16px;
    border-radius: 8px;
    background: var(--background-primary);
    border: 1px solid var(--background-modifier-border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  .section-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: var(--text-normal);
    font-size: 0.9em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  section {
    margin-bottom: 20px;
    border-bottom: 1px solid var(--background-modifier-border);
    padding-bottom: 12px;
  }

  section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .setting-item label {
    font-size: 0.9em;
    color: var(--text-normal);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  select {
    background: var(--background-secondary);
    border: 1px solid var(--background-modifier-border);
    border-radius: 4px;
    color: var(--text-normal);
    padding: 2px 6px;
  }

  .checkbox-item label {
    gap: 6px;
    display: flex;
    align-items: center;
    height: 24px;
    font-size: 0.9em;
    cursor: pointer;
  }

  .hash {
    color: var(--text-muted);
  }

  .reset-btn {
    width: 100%;
    cursor: pointer;
  }
</style>

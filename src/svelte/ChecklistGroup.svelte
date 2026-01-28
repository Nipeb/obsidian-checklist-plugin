<script lang="ts">
  import type {App} from 'obsidian'

  import type {LookAndFeel, TodoGroup} from 'src/_types'
  import {navToFile} from 'src/utils'
  import ChecklistItem from './ChecklistItem.svelte'
  import Icon from './Icon.svelte'

  export let group: TodoGroup
  export let isCollapsed: boolean
  export let lookAndFeel: LookAndFeel
  export let subHeaders: boolean
  export let useMinimalThemeIcons: boolean
  export let app: App
  export let isSubGroup: boolean = false
  export let onToggle: (id: string) => void
  export let onHide: (id: string) => void
  export let _hiddenGroups: string[] = []
  export let isSoleSubgroup: boolean = false
  export let _collapsedSections: string[] = []

  function clickTitle(ev: MouseEvent) {
    if (group.type === 'page') navToFile(app, group.id, ev)
  }

  // Reactive statement to determine if header should be hidden
  // Using 'as any' here is valid in script context to access union properties safely after type check
  $: isNoValue =
    (group.type === 'heading' && group.heading === 'No Heading') ||
    (group.type === 'tag' && group.id.includes('#No Tag')) ||
    (group.type === 'folder' && group.folderName === '/') ||
    (group.type === 'property' && group.propertyValue === 'No Property')

  $: isHiddenHeader = isSubGroup && isSoleSubgroup && isNoValue
</script>

<section class="group {group.className} {lookAndFeel}">
  <header
    class={`group-header ${group.type}`}
    class:sub-group-header={isSubGroup}
    class:hidden-header={isHiddenHeader}>
    <div class="title" on:click={clickTitle}>
      {#if isNoValue}
        <span class="no-value">(Blank)</span>
      {:else if group.type === 'page'}
        {group.pageName}
      {:else if group.type === 'heading'}
        {group.heading}
      {:else if group.type === 'folder'}
        {group.folderName}
      {:else if group.type === 'property'}
        {group.propertyValue}
      {:else if group.type === 'tag' && group.mainTag}
        <span class="tag-base">#</span>
        <span class={group.subTags == null ? 'tag-sub' : 'tag-base'}
          >{`${group.mainTag}${group.subTags != null ? '/' : ''}`}</span>
        {#if group.subTags != null}
          <span class="tag-sub">{group.subTags}</span>
        {/if}
      {:else}
        No Tag
      {/if}
    </div>
    <div class="space" />
    <div class="count">{group.todos.length}</div>
    <button
      class="collapse"
      on:click={() => onHide(group.id)}
      title="Hide Group">
      <Icon name="eye-off" />
    </button>
    <button
      class="collapse"
      on:click={() => onToggle(group.id)}
      title="Toggle Group">
      <Icon name="chevron" direction={isCollapsed ? 'left' : 'down'} />
    </button>
  </header>
  {#if !isCollapsed}
    {#if group.groups}
      <div class="sub-group-container">
        {#each group.groups as subGroup}
          {#if !_hiddenGroups.includes(subGroup.id)}
            <svelte:self
              group={subGroup}
              {app}
              {lookAndFeel}
              {subHeaders}
              {useMinimalThemeIcons}
              isCollapsed={_collapsedSections.includes(subGroup.id)}
              isSubGroup={true}
              isSoleSubgroup={group.groups.length === 1}
              {_hiddenGroups}
              {_collapsedSections}
              {onToggle}
              {onHide} />
          {/if}
        {/each}
      </div>
    {:else}
      <ul>
        {#each group.todos as item}
          <ChecklistItem
            {item}
            {lookAndFeel}
            {app}
            {subHeaders}
            {useMinimalThemeIcons} />
        {/each}
      </ul>
    {/if}
  {/if}
</section>

<style>
  .page {
    margin: var(--checklist-pageMargin);
    color: var(--checklist-textColor);
    transition: opacity 150ms ease-in-out;
    cursor: pointer;
  }

  .file-link:hover {
    opacity: 0.8;
  }

  header {
    font-weight: var(--checklist-headerFontWeight);
    font-size: var(--checklist-headerFontSize);
    margin: var(--checklist-headerMargin);
    display: flex;
    gap: var(--checklist-headerGap);
    align-items: center;
  }

  .space {
    flex: 1;
  }
  button,
  .count,
  .title {
    flex-shrink: 1;
  }
  .count {
    padding: var(--checklist-countPadding);
    background: var(--checklist-countBackground);
    border-radius: var(--checklist-countBorderRadius);
    font-size: var(--checklist-countFontSize);
  }
  .title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
  }
  button {
    display: flex;
    padding: var(--checklist-buttonPadding);
    background: transparent;
    box-shadow: var(--checklist-buttonBoxShadow);
  }

  .tag-base {
    color: var(--checklist-tagBaseColor);
  }
  .tag-sub {
    color: var(--checklist-tagSubColor);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    padding-inline-start: initial !important;
  }

  .group {
    margin-bottom: var(--checklist-groupMargin);
  }

  .collapse {
    width: initial;
  }

  .sub-group-container {
    padding-left: 12px;
    border-left: 1px solid var(--background-modifier-border);
  }

  .hidden-header {
    display: none;
  }

  .sub-group-header {
    font-size: 0.9em; /* Smaller font for subgroups */
    opacity: 0.9;
  }

  .no-value {
    font-style: italic;
    opacity: 0.7;
  }

  /* Native (Minimal 2) Overrides */
  .native {
    margin-bottom: 4px; /* Reduce space between groups */
  }

  /* Main Group Header */
  .native > header:not(.sub-group-header) {
    font-size: var(--font-ui-medium);
    margin-bottom: 2px;
    color: var(--text-normal); /* Lighter main group */
    font-weight: 600;
  }

  /* Sub Group Header */
  .native > header.sub-group-header {
    color: var(--text-muted); /* Darker subgroup */
    font-weight: bold;
    font-size: var(
      --font-ui-small
    ); /* Same size as tasks (usually small/fine) */
    opacity: 1; /* Ensure opacity doesn't fade it too much if set elsewhere */
  }
</style>

<script lang="ts">
  import type {App} from 'obsidian'

  import type {LookAndFeel, TodoItem} from 'src/_types'
  import {navToFile, toggleTodoItem} from 'src/utils'
  import CheckCircle from './CheckCircle.svelte'

  export let item: TodoItem
  export let lookAndFeel: LookAndFeel
  export let subHeaders: boolean
  export let useMinimalThemeIcons: boolean
  export let app: App

  let contentDiv: HTMLDivElement

  const toggleItem = async (item: TodoItem) => {
    toggleTodoItem(item, app)
  }

  const handleClick = (ev: MouseEvent, item?: TodoItem) => {
    const target: HTMLElement = ev.target as any
    if (target.tagName === 'A') {
      ev.stopPropagation()
      if (target.dataset.type === 'link') {
        navToFile(app, target.dataset.filepath, ev, item?.line)
      } else if (target.dataset.type === 'tag') {
        // goto tag
      }
    } else {
      navToFile(app, item.filePath, ev, item?.line)
    }
  }
  $: {
    if (contentDiv) contentDiv.innerHTML = item.rawHTML
  }
</script>

<li class={`${lookAndFeel}`} style="--indentFactor: {item.spacesIndented}">
  <button
    class="toggle"
    on:click={ev => {
      toggleItem(item)
      ev.stopPropagation()
    }}>
    <CheckCircle
      checked={item.checked}
      status={item.status}
      usingMinimalThemeIcons={useMinimalThemeIcons} />
  </button>
  <div class="content-container">
    <div
      bind:this={contentDiv}
      on:click={ev => handleClick(ev, item)}
      class="content" />
    {#if subHeaders && item.subHeading}
      <div class="sub-header">{item.subHeading}</div>
    {/if}
  </div>
</li>

<style>
  .content-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .sub-header {
    font-size: 0.8em;
    color: var(--text-faint);
    margin-left: 4px;
  }
  li {
    display: flex;
    align-items: center;
    background-color: var(--checklist-listItemBackground);
    border-radius: var(--checklist-listItemBorderRadius);
    margin: var(--checklist-listItemMargin);
    margin-left: calc(var(--indentFactor) * 25px);
    cursor: pointer;
    transition: background-color 100ms ease-in-out;
  }
  li:hover {
    background-color: var(--checklist-listItemBackground--hover);
  }
  .toggle {
    padding: var(--checklist-togglePadding);
    background: transparent;
    box-shadow: var(--checklist-listItemBoxShadow);
    flex-shrink: 1;
    width: initial;
  }
  .content {
    padding: var(--checklist-contentPadding);
    flex: 1;
    font-size: var(--checklist-contentFontSize);
  }
  .compact {
    bottom: var(--checklist-listItemMargin--compact);
  }
  .compact > .content {
    padding: var(--checklist-contentPadding--compact);
  }
  .compact > .toggle {
    padding: var(--checklist-togglePadding--compact);
  }
  /* Minimal Theme Styles */
  .minimal {
    --checklist-listItemMargin: 0px; /* Override margin */
    background-color: transparent;
    margin: 0;
    padding: 0;
    box-shadow: none;
    border-radius: 0;
    /* Explicitly restore indent using the variable */
    margin-left: calc(var(--indentFactor) * 25px) !important;
  }
  .minimal:hover {
    background-color: transparent;
  }
  .minimal > .toggle {
    box-shadow: none;
    padding-left: 0;
    padding-right: 4px;
    /* Make toggle smaller in minimal if desired, or just tighter packing */
  }
  .minimal > .content-container {
    border-bottom: 1px solid var(--background-modifier-border);
    padding: 2px 0;
  }
  .minimal > .content-container > .content {
    padding: 0;
  }
  .minimal:last-child > .content-container {
    border-bottom: none;
  }

  /* Native Theme Styles */
  .native {
    background-color: transparent;
    margin: 0;
    box-shadow: none;
    border-radius: 0;
    padding: 0; /* Remove vertical padding completely for tighter look */
    /* Explicitly restore indent using the variable */
    margin-left: calc(var(--indentFactor) * 25px) !important;

    --checklist-checkboxSize: 13px; /* Tiny checkbox for native */
  }
  .native:hover {
    background-color: transparent;
  }
  .native > .toggle {
    background: transparent;
    box-shadow: none;
    padding: 0 4px 0 0; /* Tighter toggle padding */
  }
  .native > .content-container > .content {
    padding: 0;
    font-size: var(--font-ui-small); /* Tiny native font size */
    line-height: var(--line-height-tight);
    color: var(--text-muted);
  }

  .toggle:hover {
    opacity: 0.8;
  }
</style>

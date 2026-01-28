<script lang="ts">
  export let checked = false
  export let status: string = ' '
  export let usingMinimalThemeIcons: boolean = false

  // If not using minimal icons, we ignore custom status unless it's standard check
  $: char = usingMinimalThemeIcons ? (status ? status.trim() : '') : ''
</script>

<div class="checkbox" class:is-checked={checked} data-status={char}>
  {#if char === ''}
    <!-- Empty/Unchecked -->
  {:else if char === 'x' || char === 'X'}
    <!-- Standard Check -->
    <svg viewBox="0 0 100 100" class="icon"
      ><path
        d="M20,50 L40,70 L80,30"
        fill="none"
        stroke="currentColor"
        stroke-width="14"
        stroke-linecap="round"
        stroke-linejoin="round" /></svg>
  {:else if char === '/'}
    <!-- Incomplete -->
    <svg viewBox="0 0 100 100" class="icon"
      ><path
        d="M25,75 L75,25"
        fill="none"
        stroke="currentColor"
        stroke-width="14"
        stroke-linecap="round" /></svg>
  {:else if char === '-'}
    <!-- Canceled -->
    <svg viewBox="0 0 100 100" class="icon"
      ><line
        x1="20"
        y1="50"
        x2="80"
        y2="50"
        stroke="currentColor"
        stroke-width="14"
        stroke-linecap="round" /></svg>
  {:else if char === '>'}
    <!-- Forwarded -->
    <svg viewBox="0 0 100 100" class="icon"
      ><polyline
        points="35,20 65,50 35,80"
        fill="none"
        stroke="currentColor"
        stroke-width="14"
        stroke-linecap="round"
        stroke-linejoin="round" /></svg>
  {:else if char === '<'}
    <!-- Schedule -->
    <svg viewBox="0 0 100 100" class="icon"
      ><rect
        x="20"
        y="20"
        width="60"
        height="60"
        rx="5"
        fill="none"
        stroke="currentColor"
        stroke-width="10" /><line
        x1="20"
        y1="40"
        x2="80"
        y2="40"
        stroke="currentColor"
        stroke-width="6" /><line
        x1="50"
        y1="20"
        x2="50"
        y2="80"
        stroke="currentColor"
        stroke-width="6" /></svg>
  {:else if char === '?'}
    <!-- Question -->
    <svg
      viewBox="0 0 100 100"
      class="icon"
      stroke="currentColor"
      fill="none"
      stroke-width="12"
      stroke-linecap="round"
      ><path d="M30,30 C30,10 70,10 70,30 C70,50 50,50 50,60" /><circle
        cx="50"
        cy="80"
        r="5"
        fill="currentColor"
        stroke="none" /></svg>
  {:else if char === '!'}
    <!-- Important -->
    <svg viewBox="0 0 100 100" class="icon"
      ><line
        x1="50"
        y1="20"
        x2="50"
        y2="60"
        stroke="currentColor"
        stroke-width="12"
        stroke-linecap="round" /><circle
        cx="50"
        cy="80"
        r="6"
        fill="currentColor" /></svg>
  {:else if char === '*'}
    <!-- Star -->
    <svg viewBox="0 0 100 100" class="icon"
      ><path
        d="M50,15 L60,40 L90,40 L65,60 L75,90 L50,70 L25,90 L35,60 L10,40 L40,40 Z"
        fill="currentColor" /></svg>
  {:else if char === '"'}
    <!-- Quote -->
    <svg viewBox="0 0 100 100" class="icon"
      ><path
        d="M30,30 L30,50 L40,50 L40,30 Z M60,30 L60,50 L70,50 L70,30 Z"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="5" /></svg>
  {:else if char === 'l'}
    <!-- Location -->
    <svg
      viewBox="0 0 100 100"
      class="icon"
      fill="none"
      stroke="currentColor"
      stroke-width="10"
      ><path
        d="M50,20 C35,20 25,30 25,45 C25,70 50,90 50,90 C50,90 75,70 75,45 C75,30 65,20 50,20 Z" /><circle
        cx="50"
        cy="45"
        r="5"
        fill="currentColor"
        stroke="none" /></svg>
  {:else if char === 'i'}
    <!-- Info -->
    <svg viewBox="0 0 100 100" class="icon"
      ><circle cx="50" cy="25" r="6" fill="currentColor" /><line
        x1="50"
        y1="40"
        x2="50"
        y2="80"
        stroke="currentColor"
        stroke-width="12"
        stroke-linecap="round" /></svg>
  {:else if char === 'S'}
    <!-- Savings -->
    <svg
      viewBox="0 0 100 100"
      class="icon"
      fill="none"
      stroke="currentColor"
      stroke-width="10"
      ><path
        d="M60,25 C60,25 40,25 40,40 C40,55 70,55 70,70 C70,85 40,85 40,85"
        stroke-linecap="round" /><line
        x1="55"
        y1="15"
        x2="55"
        y2="95"
        stroke-width="10" /></svg>
  {:else if char === 'I'}
    <!-- Idea -->
    <svg
      viewBox="0 0 100 100"
      class="icon"
      fill="none"
      stroke="currentColor"
      stroke-width="8"
      ><path d="M35,45 C35,25 65,25 65,45 C65,60 50,60 50,70" /><line
        x1="35"
        y1="90"
        x2="65"
        y2="90"
        stroke-width="8" /></svg>
  {:else if char === 'p'}
    <!-- Pros (Thumbs Up approx / Smile) -->
    <svg
      viewBox="0 0 100 100"
      class="icon"
      fill="none"
      stroke="currentColor"
      stroke-width="10"
      ><path d="M20,60 C20,80 80,80 80,60" stroke-linecap="round" /></svg>
  {:else if char === 'c'}
    <!-- Cons (Thumbs Down approx / Frown) -->
    <svg
      viewBox="0 0 100 100"
      class="icon"
      fill="none"
      stroke="currentColor"
      stroke-width="10"
      ><path d="M20,80 C20,60 80,60 80,80" stroke-linecap="round" /></svg>
  {:else if char === 'f'}
    <!-- Fire -->
    <svg viewBox="0 0 100 100" class="icon" fill="currentColor"
      ><path
        d="M50,85 Q75,85 80,60 Q85,40 50,15 Q15,40 20,60 Q25,85 50,85 Z" /></svg>
  {:else if char === 'k'}
    <!-- Key -->
    <svg
      viewBox="0 0 100 100"
      class="icon"
      fill="none"
      stroke="currentColor"
      stroke-width="10"
      ><circle cx="35" cy="35" r="15" /><line
        x1="50"
        y1="50"
        x2="80"
        y2="80"
        stroke-width="12"
        stroke-linecap="round" /><line
        x1="60"
        y1="60"
        x2="70"
        y2="50"
        stroke-width="12"
        stroke-linecap="round" /></svg>
  {:else if char === 'w'}
    <!-- Win -->
    <svg
      viewBox="0 0 100 100"
      class="icon"
      fill="none"
      stroke="currentColor"
      stroke-width="8"
      ><path
        d="M20,30 L35,80 L50,50 L65,80 L80,30"
        stroke-linejoin="round" /></svg>
  {:else if char === 'u'}
    <!-- Up -->
    <svg viewBox="0 0 100 100" class="icon"
      ><polyline
        points="20,60 50,30 80,60"
        fill="none"
        stroke="currentColor"
        stroke-width="14"
        stroke-linecap="round"
        stroke-linejoin="round" /><line
        x1="50"
        y1="30"
        x2="50"
        y2="85"
        stroke="currentColor"
        stroke-width="14"
        stroke-linecap="round" /></svg>
  {:else if char === 'd'}
    <!-- Down -->
    <svg viewBox="0 0 100 100" class="icon"
      ><polyline
        points="20,40 50,70 80,40"
        fill="none"
        stroke="currentColor"
        stroke-width="14"
        stroke-linecap="round"
        stroke-linejoin="round" /><line
        x1="50"
        y1="15"
        x2="50"
        y2="70"
        stroke="currentColor"
        stroke-width="14"
        stroke-linecap="round" /></svg>
  {:else if char === 'b'}
    <!-- Bookmark -->
    <svg
      viewBox="0 0 100 100"
      class="icon"
      fill="none"
      stroke="currentColor"
      stroke-width="10"><path d="M30,10 L70,10 L70,90 L50,70 L30,90 Z" /></svg>
  {:else}
    <!-- Fallback to plain checked if it was considered checked but we don't have an icon, or just text -->
    <span class="text-icon">{char}</span>
  {/if}
</div>

<style>
  .checkbox {
    width: var(--checklist-checkboxSize);
    height: var(--checklist-checkboxSize);
    min-width: var(--checklist-checkboxSize);
    min-height: var(--checklist-checkboxSize);
    border-radius: 50%;
    border: var(--checklist-checkboxBorder);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--checklist-iconFill); /* Default color */
  }

  .is-checked {
    /* border-color: var(--text-muted); */
  }

  /* Specific color overrides based on minimal theme conventions if possible, otherwise inherit */
  .checkbox[data-status='!'] {
    color: var(--color-red);
  }
  .checkbox[data-status='?'] {
    color: var(--color-yellow);
  }
  .checkbox[data-status='*'] {
    color: var(--color-orange);
  }
  .checkbox[data-status='"'] {
    color: var(--text-muted);
  }
  .checkbox[data-status='f'] {
    color: var(--color-red);
  }
  .checkbox[data-status='w'] {
    color: var(--color-yellow);
  }
  .checkbox[data-status='I'] {
    color: var(--color-yellow);
  }
  .checkbox[data-status='<'] {
    color: var(--text-muted);
  }
  .checkbox[data-status='>'] {
    color: var(--text-muted);
  }

  .icon {
    width: 70%;
    height: 70%;
  }

  .text-icon {
    font-size: 0.8em;
    font-weight: bold;
    color: var(--text-muted);
  }
</style>

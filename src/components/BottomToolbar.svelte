<script>
  let { activeScreen = 'home', onGo = null } = $props()

  const items = [
    { id: 'home', label: 'Главная', disabled: false },
    { id: 'authors', label: 'Авторы', disabled: false },
    { id: 'track', label: 'Трек', disabled: false },
  ]
</script>

<menu class="toolbar backdrop-filter" style="--backdrop-filter: contrast(1.3) saturate(2) grayscale(.8) blur(1em);" type="toolbar">
  {#each items as item}
    <li>
      <button
        class="d_l_justify-items--center"
        type="button"
        class:prime={activeScreen === item.id || (item.id === 'track' && activeScreen === 'nowPlaying')}
        style="--grid-auto-flow: row"
        disabled={item.disabled}
        onclick={() => onGo?.(item.id)}
      >
        {#if item.id == 'home'}
          <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/home.svg);"></e-icon>
        {:else if item.id == 'authors'}
          <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/authors.svg);"></e-icon>
        {:else if item.id == 'track'}
          <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/track.svg);"></e-icon>
        {/if}
        <span class="d_l_font-size--s3 d_l_line-height--1">{item.label}</span>
      </button>
    </li>
  {/each}
</menu>

<style>
  .toolbar {
    position: sticky;
    bottom: .25em;
    margin-inline: .25em;
    margin-bottom: .25em;
    z-index: 20;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5em;
    padding: 0.5em;
    /* background: color-mix(in srgb, var(--positive, #fff) 96%, transparent); */
  }

  .toolbar button {
    width: 100%;
  }
</style>

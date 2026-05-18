<script>
  // @ts-nocheck
  
  let { activeScreen = 'home', onGo = null } = $props()

  const items = [
    { id: 'home', label: 'Главная' },
    { id: 'authors', label: 'Авторы' },
    { id: 'nowPlaying', label: 'Трек' },
  ]
</script>

<menu
  class="d_l_margin-inline--s3 d_l_margin-bottom--s3 d_l_display--grid d_l_gap--s2 d_l_padding--s2 d_l_grid-template-columns--3 backdrop-filter"
  style="--backdrop-filter: contrast(1.3) saturate(2) grayscale(.8) blur(1em);"
  type="toolbar"
>
  {#each items as item}
    <li>
      <button
        class="d_l_justify-items--center d_p_padding--s2 d_p_grid-auto-flow--row d_l_background-color--transparent"
        type="button"
        disabled={activeScreen === item.id}
        onclick={() => onGo?.(item.id)}
      >
        {#if item.id == 'home'}
          <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/home.svg)"></e-icon>
        {:else if item.id == 'authors'}
          <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/authors.svg)"></e-icon>
        {:else if item.id == 'nowPlaying'}
          <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/track.svg)"></e-icon>
        {/if}
        <span class="d_l_font-size--s3 d_l_line-height--1">{item.label}</span>
      </button>
    </li>
  {/each}
</menu>

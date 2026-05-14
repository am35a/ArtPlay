<script>
  import { createEventDispatcher } from 'svelte'

  export let activeScreen = 'home'
  export let canOpenAuthor = false
  export let canOpenAlbum = false

  const dispatch = createEventDispatcher()

  const items = [
    { id: 'home', label: 'Главная', disabled: false },
    { id: 'authors', label: 'Авторы', disabled: false },
    { id: 'author', label: 'Автор', disabled: !canOpenAuthor },
    { id: 'album', label: 'Альбом', disabled: !canOpenAlbum },
    { id: 'track', label: 'Трек', disabled: true },
  ]
</script>

<menu class="toolbar" type="toolbar">
  {#each items as item}
    <li>
      <button
        class="d_l_justify-items--center"
        type="button"
        class:prime={activeScreen === item.id}
        style="--grid-auto-flow: row"
        disabled={item.disabled}
        on:click={() => dispatch('go', { screen: item.id })}
      >
        <!-- {item.label} -->
        {#if item.id == 'home'}
          <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/home.svg);"></e-icon>
        {:else if  item.id == 'authors'}
          <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/authors.svg);"></e-icon>
        {:else if  item.id == 'author'}
          <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/author.svg);"></e-icon>
        {:else if  item.id == 'album'}
          <e-icon class="d_l_font-size--l3" aria-hidden="true" style="--image: url(/icons/album.svg);"></e-icon>
        {:else if  item.id == 'track'}
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
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.5em;
    padding: 0.5em;
    background: color-mix(in srgb, var(--positive, #fff) 96%, transparent);
  }

  .toolbar button {
    width: 100%;
  }
</style>

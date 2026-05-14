<script>
  import { createEventDispatcher } from 'svelte'

  export let artists = []

  const dispatch = createEventDispatcher()
  const EMPTY_PIXEL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJpY29uIGljb24tdGFibGVyIGljb25zLXRhYmxlci1vdXRsaW5lIGljb24tdGFibGVyLXgiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIgLz48cGF0aCBkPSJNMTggNmwtMTIgMTIiIC8+PHBhdGggZD0iTTYgNmwxMiAxMiIgLz48L3N2Zz4='

  function getTracksTotal(artist) {
    return artist.albums.reduce((sum, album) => sum + album.tracks.length, 0)
  }
</script>

<section class="screen">
  <header class="d_l_display--flex d_l_align-items--baseline">
    <h5 class="d_l_margin--unset">Авторы</h5>
    <span class="d_l_margin-left--auto">{artists.length}</span>
  </header>

  {#if artists.length === 0}
    <p>Ничего не найдено.</p>
  {:else}
    <div class="author-grid">
      {#each artists as artist}
        <button class="author-card" type="button" on:click={() => dispatch('open', { artistId: artist.id })}>
          <img class="author-cover" src={artist.photo ?? EMPTY_PIXEL} alt={artist.name} />
          <span class="author-main d_l_line-height--1 d_l_font-size--s1">
            <strong class="author-title">{artist.name}</strong>
            <small class="author-meta">{artist.albums.length} альбомов • {getTracksTotal(artist)} треков</small>
          </span>
        </button>
      {/each}
    </div>
  {/if}
</section>

<style>
  .screen {
    display: grid;
    gap: 0.75em;
  }

  .author-grid {
    display: grid;
    gap: 0.35em;
  }

  .author-card {
    width: 100%;
    display: grid;
    grid-template-columns: 2.5em 1fr;
    gap: 0.75em;
    align-items: center;
    text-align: left;
    padding: 0.5em;
    border-radius: 0.75em;
  }

  .author-cover {
    width: 2.5em;
    height: 2.5em;
    object-fit: cover;
    border-radius: 0.25em;
    background: color-mix(in srgb, var(--positive, #ddd) 70%, transparent);
  }

  .author-main {
    min-width: 0;
    display: grid;
    gap: 0.5em;
  }

  .author-title,
  .author-meta {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .author-meta {
    opacity: 0.75;
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte'

  export let artists = []

  const dispatch = createEventDispatcher()
  const EMPTY_PIXEL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJpY29uIGljb24tdGFibGVyIGljb25zLXRhYmxlci1vdXRsaW5lIGljb24tdGFibGVyLXgiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIgLz48cGF0aCBkPSJNMTggNmwtMTIgMTIiIC8+PHBhdGggZD0iTTYgNmwxMiAxMiIgLz48L3N2Zz4='
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
          <img src={artist.photo ?? EMPTY_PIXEL} alt={artist.name} />
          <strong>{artist.name}</strong>
          <div class="album-preview">
            {#each artist.albums as album}
              <article>
                <img src={album.cover ?? EMPTY_PIXEL} alt={album.title} />
                <span>{album.title}</span>
                <small>{album.tracks.length} треков</small>
              </article>
            {/each}
          </div>
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
    grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
    gap: 0.75em;
  }

  .author-card {
    text-align: left;
    display: grid;
    gap: 0.6em;
    padding: 0.65em;
    border-radius: 0.9em;
  }

  .author-card > img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: 0.75em;
    background: color-mix(in srgb, var(--positive, #ddd) 70%, transparent);
  }

  .album-preview {
    display: grid;
    gap: 0.45em;
  }

  .album-preview article {
    display: grid;
    grid-template-columns: 2.5em 1fr auto;
    gap: 0.55em;
    align-items: center;
  }

  .album-preview img {
    width: 2.5em;
    height: 2.5em;
    border-radius: 0.5em;
    object-fit: cover;
    background: color-mix(in srgb, var(--positive, #ddd) 70%, transparent);
  }

  .album-preview span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .album-preview small {
    opacity: 0.75;
  }
</style>

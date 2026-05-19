<script>
  // @ts-nocheck
  
  let { artists = [], onOpen = null } = $props()
  const EMPTY_PIXEL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJpY29uIGljb24tdGFibGVyIGljb25zLXRhYmxlci1vdXRsaW5lIGljb24tdGFibGVyLXgiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIgLz48cGF0aCBkPSJNMTggNmwtMTIgMTIiIC8+PHBhdGggZD0iTTYgNmwxMiAxMiIgLz48L3N2Zz4='

  function getTracksTotal(artist) {
    return artist.albums.reduce((sum, album) => sum + album.tracks.length, 0)
  }
</script>

<section class="d_l_display--grid d_l_gap--s1">
  <header class="d_l_display--flex d_l_align-items--baseline">
    <h5 class="d_l_margin--unset">Авторы</h5>
    <span class="d_l_margin-left--auto">{artists.length}</span>
  </header>

  {#if artists.length === 0}
    <p>Ничего не найдено.</p>
  {:else}
    <div class="d_l_display--grid d_l_gap--s2">
      {#each artists as artist}
        <button
          class="d_l_display--grid grid-template-columns d_l_align-items--center d_l_text-align--start d_l_width--100 d_l_gap--s1 d_l_padding--s2 d_l_border-radius--s1"
          type="button"
          onclick={() => onOpen?.(artist.id)}
          style="--grid-template-columns: 2.5em 1fr"
        >
          <img
            class="object-fit--cover width height d_l_border-radius--s3"
            src={artist.photo ?? EMPTY_PIXEL}
            alt={artist.name}
            style="--background-color: color-mix(in srgb, var(--positive) 70%, transparent); --width: 2.5em; --height: 2.5em"
            loading="lazy"
            onerror={(e) => { if (!e.currentTarget.src.startsWith('data')) e.currentTarget.src = EMPTY_PIXEL }}
          />
          <span class="element--truncate d_l_display--grid d_l_gap--s2 d_l_line-height--1 d_l_font-size--s1">
            <strong class="d_l_display--block element--truncate">{artist.name}</strong>
            <small class="d_l_display--block element--truncate d_l_color--negative--dark">{artist.albums.length} альбомов • {getTracksTotal(artist)} треков</small>
          </span>
        </button>
      {/each}
    </div>
  {/if}
</section>

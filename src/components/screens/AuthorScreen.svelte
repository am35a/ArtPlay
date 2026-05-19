<script>
  // @ts-nocheck

  import TrackRow from '../TrackRow.svelte'

  const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik05IDE4VjVsMTItMnYxMyIvPjxjaXJjbGUgY3g9IjYiIGN5PSIxOCIgcj0iMyIvPjxjaXJjbGUgY3g9IjE4IiBjeT0iMTYiIHI9IjMiLz48L3N2Zz4='

  let { artist = null, currentTrackId = null, onPlay = null, onOpenAlbum = null } = $props()
</script>

<section class="d_l_display--grid d_l_gap--s1">
  {#if !artist}
    <p>Автор не выбран.</p>
  {:else}
    <header class="d_l_display--flex d_l_align-items--baseline d_l_gap--s1">
      <h5 class="d_l_margin--unset">
        {artist.name}
      </h5>
      <span class="d_l_margin-left--auto">{artist.albums.reduce((sum, album) => sum + (album.tracks?.length || 0), 0)} тр.</span>
    </header>
    <div class="d_l_display--grid d_l_gap--l2">
      {#each artist.albums as album}
        <section class="d_l_display--grid d_l_gap--s2 d_l_border-radius--s1">
          <button class="d_l_width--100 d_l_text-align--start d_l_display--grid d_l_gap--md d_l_align-items--center d_l_padding--s2 grid-template-columns" type="button" style="--grid-template-columns: auto 1fr" onclick={() => onOpenAlbum?.(album.id)}>
            <img class="width height d_l_border-radius--s3 object-fit--cover background-color" style="--width: 4em; --height: 4em; --background-color: color-mix(in srgb, var(--positive) 70%, transparent)" src={album.cover ?? ''} alt={album.title} loading="lazy" onerror={(e) => { if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG }} />
            <span class="d_l_display--block element--truncate">
              <span class="d_l_display--block element--truncate">{album.title}</span>
              <small class="d_l_display--block d_l_color--negative--dark">{album.tracks.length} треков ·  {album.totalDurationLabel ?? '--:--'}</small>
            </span>
          </button>
          <e-line class="d_l_margin-block--s2" role="separator"></e-line>
          <div class="d_l_display--grid d_l_gap--s2">
            {#each album.tracks as track}
              <TrackRow
                track={track}
                active={currentTrackId === track.id}
                onPlay={onPlay}
              />
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {/if}
</section>
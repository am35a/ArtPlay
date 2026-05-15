<script>
  import TrackRow from '../TrackRow.svelte'

  export let artist = null
  export let currentTrackId = null
  export let onPlay = null
  export let onOpenAlbum = null
</script>

<section class="screen">

  {#if !artist}
    <p>Автор не выбран.</p>
  {:else}

    <header class="d_l_display--flex d_l_align-items--baseline">
      <h5 class="d_l_margin--unset">
        {artist.name}
      </h5>
      <span class="d_l_margin-left--auto">{artist.albums.reduce((sum, album) => sum + (album.tracks?.length || 0), 0)} тр.</span>
    </header>


    <div class="albums">
      {#each artist.albums as album}
        <section class="album-block">
          <button class="album-title" type="button" onclick={() => onOpenAlbum?.(album.id)}>
            <img src={album.cover ?? ''} alt={album.title} />
            <span>
              <span>{album.title}</span>
              <small>{album.tracks.length} треков ·  {album.totalDurationLabel ?? '--:--'}</small>
            </span>
          </button>

          <e-line class="d_l_margin-block--s2"></e-line>

          <div class="track-list">
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

<style>
  .screen {
    display: grid;
    gap: 0.75em;
  }

  .albums {
    display: grid;
    gap: 2em;
  }

  .album-block {
    display: grid;
    gap: 0.5em;
    /* padding: 0.5em; */
    border-radius: 0.75em;
    /* background: color-mix(in srgb, var(--positive, #fff) 88%, transparent); */
  }

  .album-title {
    width: 100%;
    text-align: left;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1em;
    align-items: center;
    padding: var(--padding--s2);
  }

  .album-title img {
    width: 4em;
    height: 4em;
    border-radius: 0.25em;
    object-fit: cover;
    background: color-mix(in srgb, var(--positive, #ddd) 70%, transparent);
  }

  .album-title span,
  .album-title small {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .album-title small {
    opacity: 0.75;
  }

  .track-list {
    display: grid;
    gap: 0.5em;
  }
</style>

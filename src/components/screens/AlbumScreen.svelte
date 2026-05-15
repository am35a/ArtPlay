<script>
  // @ts-nocheck
  
  import TrackRow from '../TrackRow.svelte'

  let { album = null, currentTrackId = null, onPlay = null } = $props()
</script>

<section class="screen">
  {#if !album}
    <p>Альбом не выбран.</p>
  {:else}
    <header class="album-header">
      <img src={album.cover ?? ''} alt={album.title} />
      <div class="d_l_text-align--center">
        <h5 class="d_l_margin-block--unset">{album.title}</h5>
        <small>{album.artistName} · {album.totalDurationLabel ?? '--:--'}</small>
      </div>
    </header>

    <div class="track-list">
      {#each album.tracks as track}
        <TrackRow
          track={track}
          active={currentTrackId === track.id}
          onPlay={onPlay}
        />
      {/each}
    </div>
  {/if}
</section>

<style>
  .screen {
    display: grid;
    gap: 0.75em;
  }

  .album-header {
    display: grid;
    gap: 0.75em;
    justify-content: center;
    justify-items: center;
  }

  .album-header img {
    width: 50%;
    max-width: 20em;
    border-radius: 0.75em;
    object-fit: cover;
    background: color-mix(in srgb, var(--positive, #ddd) 70%, transparent);
  }

  .track-list {
    display: grid;
    gap: 0.5em;
  }
</style>

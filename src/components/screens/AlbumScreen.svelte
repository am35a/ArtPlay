<script>
  // @ts-nocheck
  
  import TrackRow from '../TrackRow.svelte'

  let { album = null, currentTrackId = null, onPlay = null } = $props()
</script>

<section class="d_l_display--grid d_l_gap--s1">
  {#if !album}
    <p>Альбом не выбран.</p>
  {:else}
    <header class="d_l_display--grid d_l_gap--s1 d_l_justify-content--center d_l_justify-items--center">
      <img
        class="d_l_width--50 d_l_border-radius--s1 object-fit--cover max-width background-color"
        style="--max-width: 20em; --background-color: color-mix(in srgb, var(--positive) 70%, transparent)"
        src={album.cover ?? ''}
        alt={album.title}
      />
      <div class="d_l_text-align--center">
        <h5 class="d_l_margin-block--unset">{album.title}</h5>
        <small>{album.artistName} · {album.totalDurationLabel ?? '--:--'}</small>
      </div>
    </header>

    <div class="d_l_display--grid d_l_gap--s2">
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
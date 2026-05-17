<script>
  // @ts-nocheck
  
  import TrackRow from '../TrackRow.svelte'

  let { tracks = [], currentTrackId = null, onPlay = null } = $props()
</script>

<section class="screen d_l_display--grid d_l_gap--s1">
  <header class="d_l_display--flex d_l_align-items--baseline">
    <h5 class="d_l_margin--unset">Все треки</h5>
    <span class="d_l_margin-left--auto">{tracks.length} тр.</span>
  </header>

  {#if tracks.length === 0}
    <p>Ничего не найдено.</p>
  {:else}
    <div class="track-list d_l_display--grid d_l_gap--s2">
      {#each tracks as track}
        <TrackRow
          track={track}
          active={currentTrackId === track.id}
          onPlay={onPlay}
        />
      {/each}
    </div>
  {/if}
</section>
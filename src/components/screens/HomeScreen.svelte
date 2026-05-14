<script>
  import { createEventDispatcher } from 'svelte'
  import TrackRow from '../TrackRow.svelte'

  export let tracks = []
  export let currentTrackId = null

  const dispatch = createEventDispatcher()
</script>

<section class="screen">
  <header class="d_l_display--flex d_l_align-items--baseline">
    <h5 class="d_l_margin--unset">Все треки</h5>
    <span class="d_l_margin-left--auto">{tracks.length} тр.</span>
  </header>

  {#if tracks.length === 0}
    <p>Ничего не найдено.</p>
  {:else}
    <div class="track-list">
      {#each tracks as track}
        <TrackRow
          track={track}
          active={currentTrackId === track.id}
          on:play={(event) => dispatch('play', event.detail)}
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

  .track-list {
    display: grid;
    gap: 0.5em;
  }
</style>

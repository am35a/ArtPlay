<script>
  import { createEventDispatcher } from 'svelte'

  export let state
  export let track
  export let currentTimeLabel
  export let durationLabel

  const dispatch = createEventDispatcher()

  function onContainerKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      dispatch('open')
    }
  }

  function onSeek(event) {
    const value = Number(event.currentTarget.value)
    dispatch('seek', { value })
  }

  $: progressMax = Number.isFinite(state.duration) && state.duration > 0 ? state.duration : 0
  $: progressValue = Number.isFinite(state.currentTime) ? state.currentTime : 0
  $: title = track ? `${track.title} — ${track.artistName}` : 'Ничего не играет'
</script>

<section
  class="mini-player d_l_text-align--center d_l_box-shadow--md"
  role="button"
  tabindex="0"
  on:click={() => dispatch('open')}
  on:keydown={onContainerKeydown}
  theme="light"
>
    <div class="mini-controls d_l_font-size--l3 d_l_align-items--center">
      <div class="d_l_display--inline-flex d_l_gap--s2 d_l_flex-wrap--wrap d_l_justify-content--start d_l_font-size--s2">
        <button class="d_l_padding-inline--s3 d_l_border-radius--l2 d_l_background-color--transparent" type="button" on:click|stopPropagation={() => dispatch('shuffle')}>
          {#if state.shuffle}
            <e-icon aria-hidden="true" style="--image: url(/icons/shuffle.svg);"></e-icon>
          {:else}
            <e-icon aria-hidden="true" style="--image: url(/icons/shuffle-off.svg);"></e-icon>
          {/if}
        </button>
        <button class="d_l_padding-inline--s3 d_l_border-radius--l2 d_l_background-color--transparent" type="button" on:click|stopPropagation={() => dispatch('repeat')}>
          {#if state.repeatMode === 'off'}
            <e-icon aria-hidden="true" style="--image: url(/icons/repeat-off.svg);"></e-icon>
          {:else if state.repeatMode === 'all'}
            <e-icon aria-hidden="true" style="--image: url(/icons/repeat.svg);"></e-icon>
          {:else}
            <e-icon aria-hidden="true" style="--image: url(/icons/repeat-once.svg);"></e-icon>
          {/if}
        </button>        
      </div>
      <button class="d_l_padding-inline--s3 d_l_border-radius--l2 d_l_background-color--transparent" type="button" on:click|stopPropagation={() => dispatch('prev')}>
        <e-icon aria-hidden="true" style="--image: url(/icons/prev.svg)"></e-icon>
      </button>
      <button type="button" class="d_l_padding-inline--s3 d_l_border-radius--l2 d_l_font-size--l2 prime" on:click|stopPropagation={() => dispatch('toggle')}>
        {#if state.isPlaying}
          <e-icon aria-hidden="true" style="--image: url(/icons/pause.svg)"></e-icon>
        {:else}
          <e-icon aria-hidden="true" style="--image: url(/icons/play.svg)"></e-icon>
        {/if}
      </button>
      <button class="d_l_padding-inline--s3 d_l_border-radius--l2 d_l_background-color--transparent" type="button" on:click|stopPropagation={() => dispatch('next')}>
        <e-icon aria-hidden="true" style="--image: url(/icons/next.svg)"></e-icon>
      </button>
      <div class="d_l_display--inline-flex d_l_gap--s2 d_l_flex-wrap--wrap d_l_justify-content--end d_l_font-size--s2">
        <button class="d_l_padding-inline--s3 d_l_border-radius--l2 d_l_background-color--transparent" type="button" on:click|stopPropagation={() => dispatch('author')} disabled={!track}>
          <e-icon aria-hidden="true" style="--image: url(/icons/author.svg)"></e-icon>
        </button>
        <button class="d_l_padding-inline--s3 d_l_border-radius--l2 d_l_background-color--transparent" type="button" on:click|stopPropagation={() => dispatch('album')} disabled={!track}>
          <e-icon aria-hidden="true" style="--image: url(/icons/album.svg)"></e-icon>
        </button>
      </div>

    </div>

  <div class="mini-progress">
    <div class="d_l_display--flex d_l_align-items--center">
      <img class="mini-cover" src={track?.cover ?? ''} alt={track?.albumTitle ?? 'cover'} />
      <div class="mini-text d_l_flex-grow--1">
        <div class="marquee-wrap">
          <span class="marquee">{title}</span>
        </div>
      </div>
      <small class="d_l_text-wrap--nowrap d_l_padding-right--s2">{currentTimeLabel} / {durationLabel}</small>
    </div>  
    <input
      class="d_l_background-color--transparent"
      type="range"
      min="0"
      max={progressMax}
      step="0.1"
      value={progressValue}
      on:click|stopPropagation
      on:input={onSeek}
    />
  </div>
</section>

<style>
  .mini-player {
    position: sticky;
    bottom: 5em;
    z-index: 15;
    padding: 0.5em;
    margin: 0.75em 0.75em 0;
    border-radius: 1em;
    background: color-mix(in srgb, var(--positive, #fff) 92%, transparent);
  }

  .mini-cover {
    width: 2em;
    height: 2em;
    border-radius: 0.5em;
    object-fit: cover;
    background: color-mix(in srgb, var(--positive, #ddd) 70%, transparent);
  }

  .mini-text {
    min-width: 0;
    display: grid;
    gap: 0.1em;
  }

  .marquee-wrap {
    overflow: hidden;
    white-space: nowrap;
  }

  .marquee {
    display: inline-block;
    padding-right: 100%;
    animation: scroll-x 14s linear infinite;
  }

  .mini-controls {
    display: inline-flex;
    gap: 1em;
  }

  .mini-progress {
    width: 100%;
    margin-top: 0.4em;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }
  .mini-progress > :first-child {
    opacity: .5;
  }
  .mini-progress > * {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
  }

  @keyframes scroll-x {
    0% { transform: translateX(50%); }
    100% { transform: translateX(-50%); }
  }
</style>

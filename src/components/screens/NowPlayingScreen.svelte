<script>
  import { createEventDispatcher } from 'svelte'
  import { formatSeconds } from '../../lib/time.js'
  import Visualizer from '../Visualizer.svelte'

  export let state
  export let track
  export let analyser

  const dispatch = createEventDispatcher()

  $: duration = Number.isFinite(state.duration) ? state.duration : 0
  $: current = Number.isFinite(state.currentTime) ? state.currentTime : 0
</script>

<section class="now-playing d_l_align-items--center">
  <section class="hero">
    <strong class="d_l_flex-grow--1">{track?.albumTitle}</strong>
    <img class="cover d_l_box-shadow--md" src={track?.cover ?? ''} alt={track?.albumTitle ?? 'cover'} />
    <h2 class="d_l_margin-block--unset">{track?.title ?? 'Ничего не играет'}</h2>
    <span>{track?.artistName ?? ''}</span>
    <span>{formatSeconds(current)} / {formatSeconds(duration)}</span>
  </section>

  <section class="visual d_l_margin-top--auto d_l_margin-inline--auto">
    <e-group class="element--group d_l_display--inline-grid d_l_grid-template-columns--2" role="group">
      <button type="button" disabled={state.visualizerMode === 'spectrum'} on:click={() => dispatch('mode', { mode: 'spectrum' })}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M4 20h3" /><path d="M17 20h3" /><path d="M10.5 20h3" /><path d="M4 16h3" /><path d="M17 16h3" /><path d="M10.5 16h3" /><path d="M4 12h3" /><path d="M17 12h3" /><path d="M10.5 12h3" /><path d="M4 8h3" /><path d="M17 8h3" /><path d="M4 4h3" /></svg>
        спектр
      </button>
      <button type="button" disabled={state.visualizerMode === 'oscilloscope'} on:click={() => dispatch('mode', { mode: 'oscilloscope' })}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M21 12h-2c-.894 0 -1.662 -.857 -1.761 -2c-.296 -3.45 -.749 -6 -2.749 -6s-2.5 3.582 -2.5 8s-.5 8 -2.5 8s-2.452 -2.547 -2.749 -6c-.1 -1.147 -.867 -2 -1.763 -2h-2" /></svg>
        волна
      </button>
    </e-group>
  </section>

  <section class="playback-controls">
    <div class="playback-range d_l_display--grid d_l_position--relative">
      <Visualizer {analyser} mode={state.visualizerMode} />
      <input
        class="d_l_background-color--transparent"
        type="range"
        min="0"
        max={duration}
        step="0.1"
        value={current}
        on:input={(event) => dispatch('seek', { value: Number(event.currentTarget.value) })}
      />
    </div>

    <div class="control-row d_l_justify-items--center d_l_font-size--l3">
      <button class="d_l_padding-inline--s3 d_l_background-color--transparent" type="button" on:click={() => dispatch('prev')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M20 5v14l-12 -7l12 -7" /><path d="M4 5l0 14" /></svg>
      </button>
      <button class="d_l_padding-inline--s3 d_l_background-color--transparent" type="button" on:click={() => dispatch('rewind')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9l-3 -3l3 -3" /><path d="M15.997 17.918a6.002 6.002 0 0 0 -.997 -11.918h-11" /><path d="M6 14v6" /><path d="M9 15.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0" /></svg>
      </button>
      <button type="button" class="prime d_l_padding-inline--s3 d_l_border-radius--l2 d_l_font-size--l2" on:click={() => dispatch('toggle')}>
        {#if state.isPlaying}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M6 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -12" /><path d="M14 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -12" /></svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M7 4v16l13 -8l-13 -8" /></svg>
        {/if}
      </button>
      <button class="d_l_padding-inline--s3 d_l_background-color--transparent" type="button" on:click={() => dispatch('forward')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 9l3 -3l-3 -3" /><path d="M8 17.918a5.997 5.997 0 0 1 -5 -5.918a6 6 0 0 1 6 -6h11" /><path d="M12 14v6" /><path d="M15 15.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0" /></svg>
      </button>
      <button class="d_l_padding-inline--s3 d_l_background-color--transparent" type="button" on:click={() => dispatch('next')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M4 5v14l12 -7l-12 -7" /><path d="M20 5l0 14" /></svg>
      </button>
    </div>

    <div class="mode-row">
      <button type="button" on:click={() => dispatch('shuffle')}>
        Шаффл:
        {#if state.shuffle}
          <e-icon aria-hidden="true" style="--image: url(/icons/shuffle.svg);"></e-icon>
        {:else}
          <e-icon aria-hidden="true" style="--image: url(/icons/shuffle-off.svg);"></e-icon>
        {/if}
      </button>
      <button type="button" on:click={() => dispatch('repeat')}>
        Повтор:
        {#if state.repeatMode === 'off'}
          <e-icon aria-hidden="true" style="--image: url(/icons/repeat-off.svg);"></e-icon>
        {:else if state.repeatMode === 'all'}
          <e-icon aria-hidden="true" style="--image: url(/icons/repeat.svg);"></e-icon>
        {:else}
          <e-icon aria-hidden="true" style="--image: url(/icons/repeat-once.svg);"></e-icon>
        {/if}
      </button>
    </div>
  </section>
</section>

<style>
  .now-playing {
    padding: 0.85em 1em 1.25em;
    display: grid;
    gap: 0.75em;
  }

  .hero {
    display: grid;
    justify-items: center;
    text-align: center;
    gap: 0.5em;
  }

  .cover {
    width: min(68vw, 18em);
    aspect-ratio: 1;
    border-radius: 1em;
    object-fit: cover;
    background: color-mix(in srgb, var(--positive, #ddd) 70%, transparent);
  }

  .visual {
    display: grid;
    gap: 0.5em;
  }

  .playback-controls {
    display: grid;
    gap: .75em;
  }

  .playback-controls input {
    grid-row: 1/-1;
    grid-column: 1/-1;
  }

  /* .control-row, */
  .mode-row {
    display: grid;
    gap: 0.5em;
  }

  .control-row {
    display: flex;
    gap: 0.5em;
    justify-content: center;
    align-items: center;
  }

  .mode-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
</style>

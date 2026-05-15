<script>
  // @ts-nocheck
  
  import { formatSeconds } from '../../lib/time.js'
  import Visualizer from '../Visualizer.svelte'

  let {
    state,
    track,
    analyser,
    onSeek = null,
    onPrev = null,
    onNext = null,
    onRewind = null,
    onForward = null,
    onToggle = null,
    onShuffle = null,
    onRepeat = null,
    onMode = null,
  } = $props()

  const duration = $derived(Number.isFinite(state.duration) ? state.duration : 0)
  const current = $derived(Number.isFinite(state.currentTime) ? state.currentTime : 0)
</script>

<section class="now-playing d_l_align-content--center">
  <section class="hero">
    <h3 class="d_l_flex-grow--1 d_l_margin--unset">{track?.albumTitle}</h3>
    <img class="cover d_l_box-shadow--md" src={track?.cover ?? ''} alt={track?.albumTitle ?? 'cover'} />
    <h4 class="d_l_margin-block--unset">{track?.title ?? 'Ничего не играет'}</h4>
    <span>{track?.artistName ?? ''}</span>
    <span>{formatSeconds(current)} / {formatSeconds(duration)}</span>
  </section>

  <section class="visual d_l_margin-top--auto d_l_margin-inline--auto">
    <e-group class="element--group d_l_display--inline-grid d_l_grid-template-columns--2" role="group">
      <button type="button" disabled={state.visualizerMode === 'spectrum'} onclick={() => onMode?.('spectrum')}>
        <e-icon aria-hidden="true" style="--image: url(/icons/spectrum.svg)"></e-icon>
        спектр
      </button>
      <button type="button" disabled={state.visualizerMode === 'oscilloscope'} onclick={() => onMode?.('oscilloscope')}>
        <e-icon aria-hidden="true" style="--image: url(/icons/oscilloscope.svg)"></e-icon>
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
        oninput={(event) => onSeek?.(Number(event.currentTarget.value))}
      />
    </div>

    <div class="control-row d_l_justify-items--center d_l_font-size--l3">
      <button class="d_l_padding-inline--s3 d_l_background-color--transparent" type="button" onclick={() => onPrev?.()}>
        <e-icon aria-hidden="true" style="--image: url(/icons/prev.svg)"></e-icon>
      </button>
      <button class="d_l_padding-inline--s3 d_l_background-color--transparent" type="button" onclick={() => onRewind?.()}>
        <e-icon aria-hidden="true" style="--image: url(/icons/rewind.svg)"></e-icon>
      </button>
      <button type="button" class="prime d_l_padding-inline--s3 d_l_border-radius--l2 d_l_font-size--l2" onclick={() => onToggle?.()}>
        {#if state.isPlaying}
          <e-icon aria-hidden="true" style="--image: url(/icons/pause.svg)"></e-icon>
        {:else}
          <e-icon aria-hidden="true" style="--image: url(/icons/play.svg)"></e-icon>
        {/if}
      </button>
      <button class="d_l_padding-inline--s3 d_l_background-color--transparent" type="button" onclick={() => onForward?.()}>
        <e-icon aria-hidden="true" style="--image: url(/icons/forward.svg)"></e-icon>
      </button>
      <button class="d_l_padding-inline--s3 d_l_background-color--transparent" type="button" onclick={() => onNext?.()}>
        <e-icon aria-hidden="true" style="--image: url(/icons/next.svg)"></e-icon>
      </button>
    </div>

    <div class="mode-row">
      <button type="button" onclick={() => onShuffle?.()}>
        Шаффл:
        {#if state.shuffle}
          <e-icon aria-hidden="true" style="--image: url(/icons/shuffle.svg)"></e-icon>
        {:else}
          <e-icon aria-hidden="true" style="--image: url(/icons/shuffle-off.svg)"></e-icon>
        {/if}
      </button>
      <button type="button" onclick={() => onRepeat?.()}>
        Повтор:
        {#if state.repeatMode === 'off'}
          <e-icon aria-hidden="true" style="--image: url(/icons/repeat-off.svg)"></e-icon>
        {:else if state.repeatMode === 'all'}
          <e-icon aria-hidden="true" style="--image: url(/icons/repeat.svg)"></e-icon>
        {:else}
          <e-icon aria-hidden="true" style="--image: url(/icons/repeat-once.svg)"></e-icon>
        {/if}
      </button>
    </div>
  </section>
</section>

<style>
  .now-playing {
    padding: 0.75em;
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
    width: min(64vw, 16em);
    aspect-ratio: 1;
    border-radius: 1em;
    object-fit: cover;
    background: color-mix(in srgb, var(--positive) 70%, transparent);
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

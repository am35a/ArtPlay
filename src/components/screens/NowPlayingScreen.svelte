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
    onAlbum = null,
  } = $props()

  const duration = $derived(Number.isFinite(state.duration) ? state.duration : 0)
  const current = $derived(Number.isFinite(state.currentTime) ? state.currentTime : 0)
</script>

<section class="d_l_padding--s1 d_l_display--grid d_l_gap--s1 d_l_align-content--center">
  <section class="d_l_display--grid d_l_justify-items--center d_l_text-align--center d_l_gap--s2">
    <h3 class="d_l_flex-grow--1 d_l_margin--unset">{track?.albumTitle}</h3>
    <button type="button" class="d_l_background-color--transparent d_l_padding--unset d_l_border-style--none d_l_line-height--0" onclick={() => onAlbum?.()}>
      <img
        class="d_l_box-shadow--md d_l_aspect-ratio--1 d_l_border-radius--s3 d_l_object-fit--cover background-color width"
        style="--width: min(64vw, 16em); --background-color: color-mix(in srgb, var(--positive) 70%, transparent)"
        src={track?.cover ?? ''}
        alt={track?.albumTitle ?? 'cover'}
      />
    </button>
    <h4 class="d_l_margin-block--unset">{track?.title ?? 'Ничего не играет'}</h4>
    <span>{track?.artistName ?? ''}</span>
    <span>{formatSeconds(current)} / {formatSeconds(duration)}</span>
  </section>

  <section class="d_l_display--grid d_l_gap--s2 d_l_margin-top--auto d_l_margin-inline--auto">
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

  <section class="d_l_display--grid d_l_gap--s1 width d_l_margin-inline--auto" style="--width: min(100%, 32em)">
    <div class="d_l_display--grid d_l_position--relative">
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

    <div class="d_l_display--flex d_l_gap--s2 d_l_justify-content--center d_l_align-items--center d_l_justify-items--center d_l_font-size--l3">
      <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Предыдущий трек" onclick={() => onPrev?.()}>
        <e-icon aria-hidden="true" style="--image: url(/icons/prev.svg)"></e-icon>
      </button>
      <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Перемотка назад" onclick={() => onRewind?.()}>
        <e-icon aria-hidden="true" style="--image: url(/icons/rewind.svg)"></e-icon>
      </button>
      <button type="button" class="prime d_l_padding-inline--s3 d_l_border-radius--oval d_l_font-size--l2" aria-label={state.isPlaying ? 'Пауза' : 'Воспроизвести'} onclick={() => onToggle?.()}>
        {#if state.isPlaying}
          <e-icon aria-hidden="true" style="--image: url(/icons/pause.svg)"></e-icon>
        {:else}
          <e-icon aria-hidden="true" style="--image: url(/icons/play.svg)"></e-icon>
        {/if}
      </button>
      <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Перемотка вперёд" onclick={() => onForward?.()}>
        <e-icon aria-hidden="true" style="--image: url(/icons/forward.svg)"></e-icon>
      </button>
      <button class="d_l_padding-inline--s3 d_l_border-radius--oval d_l_background-color--transparent" type="button" aria-label="Следующий трек" onclick={() => onNext?.()}>
        <e-icon aria-hidden="true" style="--image: url(/icons/next.svg)"></e-icon>
      </button>
    </div>

    <div class="d_l_display--grid d_l_gap--s2 d_l_grid-template-columns--2">
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

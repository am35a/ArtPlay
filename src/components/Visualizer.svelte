<script>
  import { onDestroy } from 'svelte'

  export let analyser = null
  export let mode = 'spectrum'

  let canvas
  let raf = 0

  function resizeCanvas() {
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.max(1, Math.floor(rect.width * window.devicePixelRatio))
    canvas.height = Math.max(1, Math.floor(rect.height * window.devicePixelRatio))
  }

  function drawSpectrum(ctx, w, h, data) {
    const bars = data.length
    const barWidth = w / bars

    for (let i = 0; i < bars; i += 1) {
      const value = data[i] / 255
      const barHeight = h * value
      const color = value > 0.55 ? '#ff8f33' : '#34c759'
      ctx.fillStyle = color
      ctx.fillRect(i * barWidth, h - barHeight, Math.max(1, barWidth - 1), barHeight)
    }
  }

  function drawOscilloscope(ctx, w, h, data) {
    ctx.strokeStyle = '#34c759'
    ctx.lineWidth = 2
    ctx.beginPath()

    const step = w / (data.length - 1)
    for (let i = 0; i < data.length; i += 1) {
      const value = data[i] / 255
      const y = h * value
      const x = i * step
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }

    ctx.stroke()
  }

  function frame() {
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'
    ctx.fillRect(0, 0, w, h)

    if (!analyser) {
      ctx.fillStyle = 'rgba(255,255,255,0.72)'
      ctx.font = `${16 * window.devicePixelRatio}px sans-serif`
      ctx.fillText('Ошибка визуализации!', w / 2, h / 2)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      raf = requestAnimationFrame(frame)
      return
    }

    if (mode === 'oscilloscope') {
      const data = new Uint8Array(analyser.fftSize)
      analyser.getByteTimeDomainData(data)
      drawOscilloscope(ctx, w, h, data)
    } else {
      const data = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(data)
      drawSpectrum(ctx, w, h, data)
    }

    raf = requestAnimationFrame(frame)
  }

  $: if (canvas) {
    resizeCanvas()
  }

  $: {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(frame)
  }

  const onResize = () => resizeCanvas()
  window.addEventListener('resize', onResize)

  onDestroy(() => {
    window.removeEventListener('resize', onResize)
    cancelAnimationFrame(raf)
  })
</script>

<canvas bind:this={canvas} class="visualizer"></canvas>

<style>
  .visualizer {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 0.5em;
    background: #10141b;

    grid-row: 1/-1;
    grid-column: 1/-1;
  }

  /* .visualizer {
    width: 100%;
    height: 8em;
    border-radius: 0.9em;
    background: #10141b;
  } */
</style>

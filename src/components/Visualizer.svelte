<script>
  // @ts-nocheck
  
  let { analyser = null, mode = 'spectrum' } = $props()

  let canvas
  let raf = 0
  const MAX_CANVAS_WIDTH = 1280
  const MAX_CANVAS_HEIGHT = 32

  function resizeCanvas() {
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    const cssWidth = Math.min(rect.width, MAX_CANVAS_WIDTH)
    const cssHeight = Math.min(rect.height, MAX_CANVAS_HEIGHT)

    canvas.width = Math.max(1, Math.floor(cssWidth * dpr))
    canvas.height = Math.max(1, Math.floor(cssHeight * dpr))
  }

  function drawSpectrum(ctx, w, h, data) {
    const groupSize = 2
    const bars = Math.ceil(data.length / groupSize)
    const barWidth = w / bars
    const gap = barWidth * 0.5
    const actualBarWidth = Math.max(1, barWidth - gap)

    for (let i = 0; i < bars; i += 1) {
      const start = i * groupSize
      const end = Math.min(start + groupSize, data.length)

      let sum = 0
      for (let j = start; j < end; j += 1) {
        sum += data[j]
      }

      const value = (sum / Math.max(1, end - start)) / 255
      const barHeight = h * value
      const color = value > 0.55 ? '#ff8f33' : '#34c759'
      ctx.fillStyle = color
      ctx.fillRect(i * barWidth + gap * 0.5, h - barHeight, actualBarWidth, barHeight)
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

  $effect(() => {
    if (!canvas) return
    resizeCanvas()
  })

  $effect(() => {
    if (!canvas) return
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  })

  $effect(() => {
    const onResize = () => resizeCanvas()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  })
</script>

<canvas bind:this={canvas} class="visualizer"></canvas>

<style>
  .visualizer {
    position: absolute;
    width: min(100%, 1280px);
    max-width: 1280px;
    height: 32px;
    max-height: 32px;
    border-radius: 0.5em;
    background: #10141b;
    left: 50%;
    transform: translateX(-50%);

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

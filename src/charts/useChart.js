import { useEffect, useRef, useState } from 'react'
import { echarts } from './echarts.js'

// Creates an ECharts instance on the returned ref, resizes it with its container, disposes on unmount.
export function useChart() {
  const ref = useRef(null)
  const [chart, setChart] = useState(null)

  useEffect(() => {
    const el = ref.current
    const instance = echarts.init(el, null, { renderer: 'canvas' })
    setChart(instance)
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(el)
    return () => {
      ro.disconnect()
      instance.dispose()
      setChart(null)
    }
  }, [])

  return [ref, chart]
}

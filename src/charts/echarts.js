// Modular ECharts build: only what the charts use, to keep the bundle small.
import * as echarts from 'echarts/core'
import { BarChart, LineChart, ScatterChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, MarkLineComponent, GraphicComponent } from 'echarts/components'
import { UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { C } from './data.js'

echarts.use([
  BarChart, LineChart, ScatterChart,
  GridComponent, TooltipComponent, MarkLineComponent, GraphicComponent,
  UniversalTransition, CanvasRenderer,
])

export { echarts }

export const TT = {
  backgroundColor: 'rgba(16,22,34,.96)', borderColor: '#34435a', borderWidth: 1, padding: [8, 12],
  textStyle: { color: C.fg, fontFamily: 'Inter', fontSize: 12 },
  extraCssText: 'border-radius:10px;box-shadow:0 12px 30px rgba(0,0,0,.5);',
}

const AX = {
  axisLine: { lineStyle: { color: C.line } },
  axisTick: { show: false },
  axisLabel: { color: C.faint, fontFamily: 'JetBrains Mono', fontSize: 10 },
  splitLine: { lineStyle: { color: 'rgba(255,255,255,.05)' } },
}
export const ax = (o) => ({ ...AX, ...o })

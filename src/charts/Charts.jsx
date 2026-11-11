import { useEffect, useState } from 'react'
import { echarts, TT, ax } from './echarts.js'
import { useChart } from './useChart.js'
import { C, GROUPS, CUST, BIAS, HOURS, CALLS, CAP, USE } from './data.js'

const mono = (size) => ({ color: C.faint, fontFamily: 'JetBrains Mono', fontSize: size })

/* ---------- shared: segmented toggle that auto-cycles until the visitor takes over ---------- */
function useToggle(first, second, delay) {
  const [mode, setMode] = useState(first)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => {
      if (!document.hidden) setMode((m) => (m === first ? second : first))
    }, delay)
    return () => clearInterval(id)
  }, [auto, first, second, delay])
  const pick = (m) => { setAuto(false); setMode(m) }
  return [mode, pick]
}

function Seg({ options, mode, onPick, label }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map(([m, text]) => (
        <button key={m} className={mode === m ? 'on' : ''} onClick={() => onPick(m)}>{text}</button>
      ))}
    </div>
  )
}

/* ---------- 1. each customer vs group average ---------- */
function profileOption(mode) {
  if (mode === 'each') {
    return {
      animationDurationUpdate: 900,
      grid: { left: 44, right: 14, top: 30, bottom: 34 },
      tooltip: {
        trigger: 'item', ...TT,
        formatter: (p) => {
          const d = p.data.c
          return `<b>${GROUPS[d.g].k.slice(0, -1)}</b><br>Usually buys every ${d.gap} days<br>Quiet for ${d.quiet} days` +
            (d.drift ? `<br><b style="color:${C.red}">Out of character, worth a call</b>` : '')
        },
      },
      xAxis: ax({ type: 'log', name: 'usually buys every (days)', nameLocation: 'middle', nameGap: 22, nameTextStyle: mono(9), min: 1, max: 50 }),
      yAxis: ax({ type: 'value', name: 'days quiet', nameTextStyle: mono(9), max: 160 }),
      series: GROUPS.map((g, gi) => ({
        type: 'scatter', id: 'g' + gi, dataGroupId: 'g' + gi,
        universalTransition: { enabled: true, delay: () => Math.random() * 350 },
        data: CUST.filter((x) => x.g === gi).map((x) => ({
          value: [x.gap, x.quiet], c: x, symbolSize: x.drift ? 13 : 9,
          itemStyle: {
            color: x.drift ? C.red : g.col, opacity: x.drift ? 1 : 0.8,
            shadowBlur: x.drift ? 14 : 0, shadowColor: 'rgba(229,72,77,.8)',
            borderColor: 'rgba(10,14,20,.8)', borderWidth: 1,
          },
        })),
        emphasis: { scale: 1.6, itemStyle: { shadowBlur: 16, shadowColor: 'rgba(255,255,255,.5)' } },
      })),
    }
  }
  return {
    animationDurationUpdate: 900,
    grid: { left: 44, right: 14, top: 30, bottom: 34 },
    tooltip: {
      trigger: 'item', ...TT,
      formatter: (p) => {
        const g = GROUPS[p.dataIndex]
        return `<b>${g.k}</b><br>Average: ${g.avg} days quiet<br>Looks fine as a group<br><b style="color:${C.red}">${g.drift} customers inside are drifting</b>`
      },
    },
    xAxis: ax({ type: 'category', data: GROUPS.map((g) => g.k), axisLabel: { color: C.muted, fontFamily: 'JetBrains Mono', fontSize: 10 } }),
    yAxis: ax({ type: 'value', name: 'average days quiet', nameTextStyle: mono(9), max: 40 }),
    series: [{
      type: 'bar', id: 'avg', barWidth: '46%',
      universalTransition: { enabled: true, divideShape: 'clone' },
      data: GROUPS.map((g, gi) => ({ value: g.avg, groupId: 'g' + gi, itemStyle: { color: g.col, borderRadius: [6, 6, 0, 0] } })),
      label: { show: true, position: 'top', color: C.fg, fontFamily: 'JetBrains Mono', fontSize: 11, formatter: '{c} days' },
      emphasis: { itemStyle: { shadowBlur: 20, shadowColor: 'rgba(255,255,255,.35)' } },
    }],
  }
}

export function ProfileChart() {
  const [ref, chart] = useChart()
  const [mode, pick] = useToggle('each', 'avg', 4500)
  useEffect(() => { chart?.setOption(profileOption(mode), true) }, [chart, mode])
  const each = mode === 'each'
  return (
    <div className="pviz">
      <div className="ptool">
        <span className="mode">{each ? 'Each customer' : 'Group average'}</span>
        <Seg label="Chart view" mode={mode} onPick={pick} options={[['each', 'Each customer'], ['avg', 'Group average']]} />
      </div>
      <div className="viz" ref={ref} />
      <p className="ccap">
        {each
          ? 'Each dot is a customer. Red dots have gone quiet for much longer than they usually do.'
          : 'The same customers as group averages. Every group looks fine, and the drifting customers disappear.'}
      </p>
    </div>
  )
}

/* ---------- 2. unfair vs fair comparison ---------- */
function biasOption(mode) {
  const d = BIAS[mode]
  const hot = mode === 'raw' ? C.red : C.teal
  return {
    animationDurationUpdate: 900, animationEasingUpdate: 'cubicInOut',
    grid: { left: 118, right: 52, top: 24, bottom: 28 },
    tooltip: { trigger: 'item', ...TT, formatter: (p) => `${p.name}: ${p.value}% still here after 90 days` },
    xAxis: ax({ type: 'value', max: 100, axisLabel: { formatter: '{value}%', color: C.faint, fontFamily: 'JetBrains Mono', fontSize: 10 } }),
    yAxis: ax({ type: 'category', data: ['Everyone else', 'Program members'], axisLabel: { color: C.muted, fontFamily: 'JetBrains Mono', fontSize: 11 } }),
    graphic: [{ type: 'text', right: 8, top: 0, style: { text: `Gap: ${d.e - d.c} points`, fill: hot, font: '600 12px JetBrains Mono' } }],
    series: [{
      type: 'bar', barWidth: '42%',
      data: [
        { value: d.c, itemStyle: { color: '#56657c', borderRadius: [0, 6, 6, 0] } },
        { value: d.e, itemStyle: { color: hot, borderRadius: [0, 6, 6, 0], shadowBlur: 16, shadowColor: hot } },
      ],
      label: { show: true, position: 'right', color: C.fg, fontFamily: 'JetBrains Mono', fontSize: 12, formatter: '{c}%' },
      emphasis: { itemStyle: { shadowBlur: 22, shadowColor: 'rgba(255,255,255,.4)' } },
    }],
  }
}

export function BiasChart() {
  const [ref, chart] = useChart()
  const [mode, pick] = useToggle('raw', 'fair', 4000)
  useEffect(() => { chart?.setOption(biasOption(mode)) }, [chart, mode])
  const raw = mode === 'raw'
  return (
    <div className="pviz">
      <div className="ptool">
        <span className="mode">{raw ? 'Unfair comparison' : 'Fair comparison'}</span>
        <Seg label="Chart view" mode={mode} onPick={pick} options={[['raw', 'Unfair'], ['fair', 'Fair']]} />
      </div>
      <div className="viz" ref={ref} />
      <p className="ccap">
        {raw
          ? 'Share still with us after 90 days. Compared as-is, the program looks like a big win.'
          : 'Compared with similar customers, most of the gap disappears. They were better customers to begin with.'}
      </p>
    </div>
  )
}

/* ---------- 3. call capacity ---------- */
// Colour the line red above team capacity: gradient stops come from the line's own height range.
function capGrad(area) {
  const hi = Math.max(...CALLS)
  const lo = area ? 0 : Math.min(...CALLS)
  const t = Math.max(0, Math.min(1, (hi - CAP) / (hi - lo)))
  const r = area ? 'rgba(229,72,77,.32)' : C.red
  const a = area ? 'rgba(240,160,32,.10)' : C.amber
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: r }, { offset: t, color: r }, { offset: t, color: a },
    { offset: 1, color: area ? 'rgba(240,160,32,0)' : a },
  ])
}

export function CapacityChart({ mode, caption }) {
  const [ref, chart] = useChart()
  useEffect(() => {
    chart?.setOption({
      animationDuration: 1600,
      grid: { left: 38, right: 14, top: 20, bottom: 28 },
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'line', lineStyle: { color: 'rgba(255,255,255,.25)' } }, ...TT,
        formatter: (p) => {
          const v = p[0].value
          return `<b>${p[0].name}</b><br>${v} calls coming in<br>Team can take ${CAP}` +
            (v > CAP ? `<br><b style="color:${C.red}">${v - CAP} go unanswered</b>` : '')
        },
      },
      xAxis: ax({ type: 'category', boundaryGap: false, data: HOURS, splitLine: { show: false } }),
      yAxis: ax({ type: 'value', max: 100 }),
      series: [{
        type: 'line', smooth: true, symbol: 'circle', symbolSize: 7, showSymbol: false, data: CALLS,
        itemStyle: { color: C.amber },
        lineStyle: { width: 3, shadowBlur: 12, shadowColor: 'rgba(229,72,77,.45)', color: capGrad(false) },
        areaStyle: { color: capGrad(true) },
        emphasis: { focus: 'series', itemStyle: { shadowBlur: 14, shadowColor: '#fff' } },
        markLine: {
          silent: true, symbol: 'none', data: [{ yAxis: CAP }],
          lineStyle: { color: C.muted, type: 'dashed', width: 1.5 },
          label: { formatter: 'team capacity', color: C.muted, fontFamily: 'JetBrains Mono', fontSize: 10, position: 'insideStartTop' },
        },
      }],
    })
  }, [chart])
  return <StaticPanel mode={mode} caption={caption} vizRef={ref} />
}

/* ---------- 4. accounts far past their plan ---------- */
export function FraudChart({ mode, caption }) {
  const [ref, chart] = useChart()
  useEffect(() => {
    chart?.setOption({
      animationEasing: 'elasticOut',
      grid: { left: 40, right: 14, top: 20, bottom: 20 },
      tooltip: {
        trigger: 'item', ...TT,
        formatter: (p) => `Account ${p.dataIndex + 1}: ${p.value}% of plan` +
          (p.value > 100 ? `<br><b style="color:${C.red}">Flagged for review</b>` : ''),
      },
      xAxis: { type: 'category', data: USE.map((_, i) => i), axisLabel: { show: false }, axisTick: { show: false }, axisLine: { lineStyle: { color: C.line } } },
      yAxis: ax({ type: 'value', max: 600, axisLabel: { formatter: '{value}%', color: C.faint, fontFamily: 'JetBrains Mono', fontSize: 10 } }),
      series: [{
        type: 'bar', barWidth: '60%',
        data: USE.map((v) => ({
          value: v,
          itemStyle: { color: v > 100 ? C.red : 'rgba(201,212,227,.42)', borderRadius: [3, 3, 0, 0], shadowBlur: v > 100 ? 14 : 0, shadowColor: 'rgba(229,72,77,.8)' },
        })),
        emphasis: { itemStyle: { shadowBlur: 18, shadowColor: 'rgba(255,255,255,.6)' } },
        animationDelay: (i) => i * 28,
        markLine: {
          silent: true, symbol: 'none', data: [{ yAxis: 100 }],
          lineStyle: { color: C.muted, type: 'dashed', width: 1.2 },
          label: { formatter: 'plan limit', color: C.muted, fontFamily: 'JetBrains Mono', fontSize: 10, position: 'insideEndTop' },
        },
      }],
    })
  }, [chart])
  return <StaticPanel mode={mode} caption={caption} vizRef={ref} />
}

function StaticPanel({ mode, caption, vizRef }) {
  return (
    <div className="pviz">
      <div className="ptool"><span className="mode">{mode}</span></div>
      <div className="viz" ref={vizRef} />
      <p className="ccap">{caption}</p>
    </div>
  )
}

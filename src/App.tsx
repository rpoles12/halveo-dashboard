import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { gsap } from 'gsap'
import { animate } from 'animejs'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Database,
  Download,
  Droplets,
  Flame,
  Gauge,
  Info,
  LayoutDashboard,
  Play,
  Search,
  Settings,
  ShieldCheck,
  TriangleAlert,
  X,
  Zap,
} from 'lucide-react'
import logoUrl from './assets/logo-white.svg'
import symbolUrl from './assets/symbol.svg'
import {
  actionStatusOrder,
  anomalies,
  auditEvents,
  buildSeries,
  dataSources,
  initialActions,
  monthlySavings,
  resources,
  sites,
  type Anomaly,
  type OperationalAction,
  type ResourceId,
  type SiteId,
  type ViewId,
} from './data'

const primaryNav: Array<{ id: ViewId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'operations', label: 'Operations' },
  { id: 'anomalies', label: 'Anomalies' },
  { id: 'actions', label: 'Actions' },
  { id: 'performance', label: 'Performance' },
]

const moreNav: Array<{ id: ViewId; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'reporting', label: 'Reports', icon: ChartNoAxesCombined },
  { id: 'sources', label: 'Data Sources', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const resourceIcons = { water: Droplets, electricity: Zap, gas: Flame }
const resourceShare: Record<ResourceId, number> = { water: .53, electricity: .29, gas: .18 }
const siteFinancialShare: Record<SiteId, number> = { all: 1, hamilton: .44, 'trois-rivieres': .31, calgary: .25 }
const opportunityMix: Record<SiteId, [number, number, number]> = {
  all: [53, 29, 18],
  hamilton: [71, 18, 11],
  'trois-rivieres': [41, 22, 37],
  calgary: [28, 55, 17],
}

function formatCad(value: number) {
  return `CA$${new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 }).format(value)}`
}

function formatCadCompact(value: number) {
  return `CA$${new Intl.NumberFormat('en-CA', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`
}

function AmbientField() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(max-width: 800px)').matches) return
    let disposed = false
    let cleanup = () => {}

    void import('three').then((THREE) => {
      if (disposed || !host) return
      const width = host.clientWidth
      const height = host.clientHeight
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4))
      renderer.setSize(width, height)
      renderer.setClearAlpha(0)
      host.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
      camera.position.z = 6
      const geometry = new THREE.BufferGeometry()
      const positions: number[] = []
      for (let i = 0; i < 90; i += 1) {
        const column = i % 15
        const row = Math.floor(i / 15)
        positions.push((column - 7) * 0.45, (row - 2.5) * 0.55 + Math.sin(column * 0.7) * 0.18, (i % 4) * -0.35)
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      const material = new THREE.PointsMaterial({ color: 0x536977, size: 0.035, transparent: true, opacity: 0.48 })
      const points = new THREE.Points(geometry, material)
      points.rotation.z = -0.08
      scene.add(points)

      const render = (time: number) => {
        points.rotation.y = Math.sin(time * 0.00016) * 0.08
        points.position.y = Math.sin(time * 0.0004) * 0.04
        renderer.render(scene, camera)
      }
      renderer.setAnimationLoop(render)

      const resize = new ResizeObserver(() => {
        const nextWidth = host.clientWidth
        const nextHeight = host.clientHeight
        camera.aspect = nextWidth / nextHeight
        camera.updateProjectionMatrix()
        renderer.setSize(nextWidth, nextHeight)
      })
      resize.observe(host)

      cleanup = () => {
        resize.disconnect()
        renderer.setAnimationLoop(null)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return <div ref={hostRef} className="ambient-field" aria-hidden="true" />
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  const markRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!markRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const animation = animate(markRef.current, {
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 720,
      ease: 'out(4)',
    })
    return () => { animation.cancel() }
  }, [])

  return <img ref={markRef} className={compact ? 'brand-symbol' : 'brand-logo'} src={compact ? symbolUrl : logoUrl} alt={compact ? 'Halveo' : ''} />
}

function Chart({ labels, expected, observed, kind = 'line', title, unit = '', target }: { labels: string[]; expected?: number[]; observed: number[]; kind?: 'line' | 'bar' | 'pulse' | 'area'; title: string; unit?: string; target?: number }) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = chartRef.current
    if (!element) return
    let disposed = false
    let dispose = () => {}

    void import('echarts').then((echarts) => {
      if (disposed) return
      const chart = echarts.init(element, undefined, { renderer: 'canvas' })
      const isPulse = kind === 'pulse'
      const isArea = kind === 'area'
      const maxValue = Math.max(...observed, ...(expected ?? [])) * 1.12
      const lowerRange = expected?.map((value) => Number((value * .965).toFixed(2)))
      const rangeWidth = expected?.map((value) => Number((value * .07).toFixed(2)))
      const peakIndex = expected
        ? observed.reduce((best, value, index) => value - expected[index] > observed[best] - expected[best] ? index : best, 0)
        : observed.length - 1
      const peakDelta = expected ? Math.round(((observed[peakIndex] - expected[peakIndex]) / expected[peakIndex]) * 100) : 0
      chart.setOption({
        animationDuration: 820,
        animationDurationUpdate: 520,
        animationDelay: (index: number) => index * 18,
        animationEasing: 'cubicOut',
        animationEasingUpdate: 'cubicInOut',
        backgroundColor: 'transparent',
        grid: { left: 8, right: 18, top: isPulse ? 42 : 28, bottom: 8, containLabel: true },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#e5e4e2',
          borderColor: '#536977',
          textStyle: { color: '#0a0a0a', fontFamily: 'Schibsted Grotesk' },
          axisPointer: { lineStyle: { color: '#536977', type: 'dashed' } },
        },
        xAxis: {
          type: 'category', data: labels, boundaryGap: kind !== 'line' && !isArea,
          axisLine: { show: !isArea, lineStyle: { color: 'rgba(229,228,226,.1)' } },
          axisTick: { show: false },
          axisLabel: { color: 'rgba(240,239,236,.62)', fontFamily: 'Schibsted Grotesk', fontSize: 11, interval: labels.length > 12 ? 3 : 0 },
          splitLine: { show: isArea, lineStyle: { color: 'rgba(240,239,236,.045)', width: 1 } },
        },
        yAxis: {
          type: 'value', splitNumber: 4, scale: kind !== 'bar', max: kind === 'bar' && target ? Math.ceil(target / 50) * 50 : undefined,
          splitLine: { lineStyle: { color: 'rgba(229,228,226,.065)', type: 'dashed' } },
          axisLabel: { color: 'rgba(240,239,236,.58)', fontFamily: 'Schibsted Grotesk', fontSize: 11, formatter: unit === 'CA$K' ? (value: number) => `CA$${value}K` : undefined },
        },
        series: [
          ...(isPulse ? [{
            name: 'Operating range', type: 'bar', data: observed.map(() => maxValue), silent: true,
            barWidth: 24, barGap: '-100%', itemStyle: { color: 'transparent', borderColor: 'rgba(229,228,226,.12)', borderWidth: 1, borderType: 'dashed', borderRadius: [7, 7, 2, 2] },
          }] : []),
          ...(expected && lowerRange && rangeWidth ? [{
            name: 'Expected lower', type: 'line', data: lowerRange, stack: 'expected-range', symbol: 'none', silent: true,
            lineStyle: { opacity: 0 }, areaStyle: { opacity: 0 }, tooltip: { show: false }, z: 1,
          }, {
            name: 'Expected operating range', type: 'line', data: rangeWidth, stack: 'expected-range', symbol: 'none', silent: true,
            lineStyle: { opacity: 0 }, areaStyle: { color: 'rgba(240,239,236,.13)' }, tooltip: { show: false }, z: 1,
          }] : []),
          ...(expected ? [{
            name: 'Expected', type: 'line', data: expected, symbol: 'none', smooth: isArea ? 0.58 : 0.28,
            lineStyle: { color: isPulse ? '#91a8b7' : isArea ? 'rgba(240,239,236,.42)' : 'rgba(229,228,226,.28)', width: isPulse ? 1.6 : isArea ? 1.25 : 1, type: isPulse ? 'solid' : 'dashed' },
            z: 4,
          }] : []),
          {
            name: kind === 'bar' ? 'Verified savings' : 'Observed', type: isPulse ? 'bar' : isArea ? 'line' : kind, data: observed, symbol: 'none', smooth: isArea ? 0.6 : 0.32,
            barWidth: isPulse ? 24 : undefined,
            lineStyle: { color: isArea ? '#91a8b7' : '#7f96a5', width: isArea ? 3 : 2, shadowBlur: isArea ? 14 : 0, shadowColor: isArea ? 'rgba(145,168,183,.5)' : 'transparent' },
            itemStyle: {
              color: isPulse ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#91a8b7' }, { offset: 1, color: 'rgba(83,105,119,.18)' }]) : '#536977',
              borderRadius: kind === 'bar' || isPulse ? [7, 7, 2, 2] : 0,
            },
            areaStyle: isArea ? { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(145,168,183,.62)' }, { offset: .45, color: 'rgba(83,105,119,.28)' }, { offset: 1, color: 'rgba(83,105,119,0)' }]) } : kind === 'line' ? { color: 'rgba(83,105,119,.14)' } : undefined,
            markPoint: isArea && expected ? {
              symbol: 'circle', symbolSize: 36,
              label: { color: '#07090a', fontFamily: 'Schibsted Grotesk', fontSize: 10, fontWeight: 700, formatter: `${peakDelta > 0 ? '+' : ''}${peakDelta}%` },
              itemStyle: { color: '#f0efec', borderColor: '#536977', borderWidth: 3 },
              data: [{ coord: [labels[peakIndex], observed[peakIndex]] }],
            } : undefined,
            markLine: kind === 'bar' && target ? {
              symbol: 'none',
              label: { color: '#91a8b7', fontFamily: 'Schibsted Grotesk', fontSize: 11, formatter: `Annual target · CA$${target}K` },
              lineStyle: { color: '#91a8b7', width: 1, type: 'dashed' },
              data: [{ yAxis: target }],
            } : undefined,
            z: 3,
          },
          ...(isArea ? [{
            name: 'Current point', type: 'effectScatter', coordinateSystem: 'cartesian2d', data: [[labels.at(-1), observed.at(-1)]],
            symbolSize: 8, rippleEffect: { scale: 4, brushType: 'stroke' }, itemStyle: { color: '#f0efec', shadowBlur: 18, shadowColor: '#91a8b7' }, z: 8,
          }] : []),
        ],
      })
      const resize = new ResizeObserver(() => chart.resize())
      resize.observe(element)
      dispose = () => { resize.disconnect(); chart.dispose() }
    })

    return () => { disposed = true; dispose() }
  }, [expected, kind, labels, observed])

  return (
    <>
      <div ref={chartRef} className="chart" role="img" aria-label={title} />
      <p className="sr-only">{title}. Latest observed value: {observed.at(-1)}.</p>
    </>
  )
}

function SavingsChart({ resource, site }: { resource: ResourceId; site: SiteId }) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = chartRef.current
    if (!element) return
    let disposed = false
    let dispose = () => {}
    void import('echarts').then((echarts) => {
      if (disposed) return
      const chart = echarts.init(element, undefined, { renderer: 'canvas' })
      const scale = resourceShare[resource] * siteFinancialShare[site]
      const opportunity = [44, 56, 72, 90, 112, 134, 158, 183, 209, 235, 264, 300].map((value) => Number((value * scale).toFixed(1)))
      const verified = [8, 15, 23, 34, 49, 68, 91, 121, 156, 196, 238, 285].map((value) => Number((value * scale).toFixed(1)))
      chart.setOption({
        animationDuration: 900,
        animationDurationUpdate: 560,
        animationDelay: (index: number) => index * 28,
        animationEasing: 'cubicOut',
        animationEasingUpdate: 'cubicInOut',
        grid: { left: 6, right: 12, top: 24, bottom: 6, containLabel: true },
        tooltip: { trigger: 'axis', valueFormatter: (value: number) => `CA$${value}K`, backgroundColor: '#f0efec', borderWidth: 0, textStyle: { color: '#07090a', fontFamily: 'Schibsted Grotesk' } },
        xAxis: { type: 'category', data: monthlySavings.labels, boundaryGap: false, axisLine: { lineStyle: { color: 'rgba(240,239,236,.12)' } }, axisTick: { show: false }, axisLabel: { color: 'rgba(240,239,236,.6)', fontSize: 11, interval: 2 } },
        yAxis: { type: 'value', splitNumber: 3, splitLine: { lineStyle: { color: 'rgba(240,239,236,.075)', type: 'dashed' } }, axisLabel: { color: 'rgba(240,239,236,.58)', fontSize: 11, formatter: 'CA${value}K' } },
        series: [
          { name: 'Estimated opportunity', type: 'line', smooth: .42, symbol: 'none', data: opportunity, lineStyle: { color: 'rgba(240,239,236,.42)', width: 2, type: 'dashed' }, z: 2 },
          { name: 'Verified savings', type: 'line', smooth: .42, symbol: 'none', data: verified, lineStyle: { color: '#91a8b7', width: 4 }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(145,168,183,.42)' }, { offset: 1, color: 'rgba(83,105,119,0)' }]) }, z: 3 },
        ],
      })
      const resize = new ResizeObserver(() => chart.resize())
      resize.observe(element)
      dispose = () => { resize.disconnect(); chart.dispose() }
    })
    return () => { disposed = true; dispose() }
  }, [resource, site])

  return <div ref={chartRef} className="savings-chart" role="img" aria-label={`Twelve-month ${resources[resource].label.toLowerCase()} opportunity and verified savings trend`} />
}

function AnimatedValue({ value }: { value: string }) {
  const match = value.match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/)
  const target = match ? Number(match[2].replace(/,/g, '')) : Number.NaN
  const decimals = match?.[2].includes('.') ? match[2].split('.')[1].length : 0
  const leadingZeros = match && !match[2].includes(',') && !match[2].includes('.') && match[2].startsWith('0') ? match[2].length : 0
  const [display, setDisplay] = useState(Number.isFinite(target) ? 0 : Number.NaN)

  useEffect(() => {
    if (!Number.isFinite(target)) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setDisplay(target); return }
    let frame = 0
    const started = performance.now()
    const duration = 840
    const tick = (time: number) => {
      const progress = Math.min((time - started) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(target * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  if (!match || !Number.isFinite(target)) return <>{value}</>
  const numeric = leadingZeros
    ? String(Math.round(display)).padStart(leadingZeros, '0')
    : display.toLocaleString('en-CA', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return <span className="number-rise">{match[1]}{numeric}{match[3]}</span>
}

function ResourceSectorChart({ site }: { site: SiteId }) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = chartRef.current
    if (!element) return
    let disposed = false
    let dispose = () => {}
    void import('echarts').then((echarts) => {
      if (disposed) return
      const chart = echarts.init(element, undefined, { renderer: 'canvas' })
      const mix = opportunityMix[site]
      chart.setOption({
        animationType: 'scale',
        animationDuration: 920,
        animationDelay: (index: number) => index * 90,
        animationEasing: 'cubicOut',
        tooltip: { trigger: 'item', formatter: '{b}: {d}%', backgroundColor: '#f0efec', borderWidth: 0, textStyle: { color: '#07090a', fontFamily: 'Schibsted Grotesk' } },
        series: [{
          name: 'Opportunity mix', type: 'pie', radius: ['68%', '83%'], center: ['50%', '52%'], startAngle: 112, avoidLabelOverlap: true,
          itemStyle: { borderColor: '#101315', borderWidth: 5, borderRadius: 12 },
          label: { show: false }, labelLine: { show: false },
          emphasis: { scale: true, scaleSize: 10, itemStyle: { shadowBlur: 28, shadowColor: 'rgba(145,168,183,.28)' } },
          data: [
            { value: mix[0], name: 'Water', itemStyle: { color: '#91a8b7' } },
            { value: mix[1], name: 'Electricity', itemStyle: { color: 'rgba(240,239,236,0)', decal: { symbol: 'rect', symbolSize: .55, dashArrayX: [1, 0], dashArrayY: [1, 2], rotation: -.55, color: '#f0efec', backgroundColor: 'transparent' } } },
            { value: mix[2], name: 'Natural gas', itemStyle: { color: '#f0efec' } },
          ],
        }],
      })
      const resize = new ResizeObserver(() => chart.resize())
      resize.observe(element)
      dispose = () => { resize.disconnect(); chart.dispose() }
    })
    return () => { disposed = true; dispose() }
  }, [site])

  const totalOpportunity = 100000 * siteFinancialShare[site]
  const mix = opportunityMix[site]
  return <div className="sector-chart-wrap"><div ref={chartRef} className="sector-chart" role="img" aria-label={`Opportunity by resource: water ${mix[0]} percent, electricity ${mix[1]} percent, natural gas ${mix[2]} percent`} /><div className="sector-value"><strong><AnimatedValue value={formatCadCompact(totalOpportunity)} /></strong><span>annual opportunity</span></div></div>
}

function StatusPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'critical' | 'accent' }) {
  return <span className={`status-pill ${tone}`}>{children}</span>
}

function MetricCard({ label, value, note, icon: Icon, tone = 'neutral' }: { label: string; value: string; note: string; icon: typeof Droplets; tone?: 'neutral' | 'good' | 'warn' }) {
  return (
    <article className="metric-card">
      <div className="metric-top"><span>{label}</span><Icon size={16} /></div>
      <strong><AnimatedValue value={value} /></strong>
      <p className={tone}>{note}</p>
    </article>
  )
}

function SectionHeader({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="section-header">
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      {aside}
    </div>
  )
}

function AnomalyRow({ anomaly, onOpen }: { anomaly: Anomaly; onOpen: () => void }) {
  const tone = anomaly.severity === 'High' ? 'critical' : anomaly.severity === 'Medium' ? 'warn' : 'neutral'
  return (
    <button className="anomaly-row" onClick={onOpen}>
      <span className={`severity-dot ${tone}`} />
      <span className="anomaly-main"><b>{anomaly.asset}</b><small>{anomaly.site} · {anomaly.detected}</small></span>
      <span className="anomaly-deviation">{anomaly.deviation}<small>{anomaly.duration}</small></span>
      <ArrowUpRight size={15} />
    </button>
  )
}

function Topbar({ view, onView, onDemo, showDemo }: { view: ViewId; onView: (value: ViewId) => void; onDemo: () => void; showDemo: boolean }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const isMoreActive = moreNav.some((item) => item.id === view)
  const moreLabel = moreNav.find((item) => item.id === view)?.label ?? 'More'
  return (
    <header className="topbar">
      <div className="topbar-brand"><BrandMark /></div>
      <nav className="top-nav-capsule" aria-label="Primary navigation">
        {primaryNav.map((item) => <button key={item.id} className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => { onView(item.id); setMoreOpen(false); setNotificationsOpen(false) }}>{view === item.id && <motion.span layoutId="active-navigation" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}{item.label}</button>)}
        <div className="more-navigation">
          <button className={isMoreActive ? 'active' : ''} aria-expanded={moreOpen} aria-haspopup="menu" onClick={() => { setMoreOpen((current) => !current); setNotificationsOpen(false) }}>{isMoreActive && <motion.span layoutId="active-navigation" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}{moreLabel} <ChevronDown size={13} /></button>
          <AnimatePresence>{moreOpen && <motion.div className="more-menu" role="menu" initial={{ opacity: 0, y: -8, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: .98 }} transition={{ duration: .2, ease: [0.2, 0, 0, 1] }}>{moreNav.map((item) => { const Icon = item.icon; return <button role="menuitem" aria-current={view === item.id ? 'page' : undefined} key={item.id} onClick={() => { onView(item.id); setMoreOpen(false) }}><Icon size={16} />{item.label}</button> })}</motion.div>}</AnimatePresence>
        </div>
      </nav>
      <div className="topbar-actions">
        {showDemo && <button className="icon-button demo-icon" onClick={onDemo} aria-label="Start guided demo"><Play size={14} fill="currentColor" /></button>}
        <div className="notification-wrap">
          <button className="icon-button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen((current) => !current); setMoreOpen(false) }}><Bell size={17} /><span className="notification-dot" /></button>
          <AnimatePresence>{notificationsOpen && <motion.div className="notification-panel" initial={{ opacity: 0, y: -7, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: .98 }} transition={{ duration: .18 }}><p>Operational updates</p><button onClick={() => { onView('anomalies'); setNotificationsOpen(false) }}><b>Cooling Loop 02</b><span>31% above expected range</span></button><button onClick={() => { onView('sources'); setNotificationsOpen(false) }}><b>Meter review due</b><span>Hamilton · WT-018</span></button></motion.div>}</AnimatePresence>
        </div>
        <div className="avatar" title="Avery Morgan · Operations Lead">AM</div>
      </div>
    </header>
  )
}

function DashboardFilters({ view, site, setSite, resource, setResource }: { view: ViewId; site: SiteId; setSite: (value: SiteId) => void; resource: ResourceId; setResource: (value: ResourceId) => void }) {
  if (!['overview', 'operations'].includes(view)) return null
  return (
    <section className="dashboard-filters" aria-label="Dashboard filters">
      <label className="site-filter">
        <span>Operational scope</span>
        <select value={site} onChange={(event) => setSite(event.target.value as SiteId)} aria-label="Select company site">
          <option value="all">North Basin · All sites</option>
          {sites.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <ChevronDown size={16} aria-hidden="true" />
      </label>
      <div className="resource-filter" role="group" aria-label="Resource type">
        {(Object.entries(resources) as Array<[ResourceId, (typeof resources)[ResourceId]]>).map(([id, filterItem]) => {
          const Icon = resourceIcons[id]
          return <button key={id} className={resource === id ? 'active' : ''} aria-pressed={resource === id} onClick={() => setResource(id)}>{resource === id && <motion.span layoutId="active-resource-filter" transition={{ type: 'spring', stiffness: 420, damping: 30 }} />}<Icon size={18} /><b>{filterItem.label}</b></button>
        })}
      </div>
    </section>
  )
}

function Overview({ site, resource }: { site: SiteId; resource: ResourceId }) {
  const [period, setPeriod] = useState<'24H' | '7D' | '30D'>('24H')
  const item = resources[resource]
  const series = useMemo(() => buildSeries(site, resource), [site, resource])
  const ResourceIcon = resourceIcons[resource]
  const current = site === 'all' ? item.current : Number((item.current * (site === 'hamilton' ? 1.13 : site === 'trois-rivieres' ? 0.91 : 0.83)).toFixed(1))
  const baseline = site === 'all' ? item.baseline : Number((item.baseline * (site === 'hamilton' ? 1.13 : site === 'trois-rivieres' ? 0.91 : 0.83)).toFixed(1))
  const variance = ((current - baseline) / baseline) * 100
  const activeAnomalies = anomalies.filter((anomaly) => (site === 'all' || anomaly.siteId === site) && anomaly.resource === resource)
  const highPriority = activeAnomalies.filter((anomaly) => anomaly.severity === 'High').length
  const verifiedSavings = 284600 * resourceShare[resource] * siteFinancialShare[site]
  const siteLabel = site === 'all' ? 'All sites' : sites.find((candidate) => candidate.id === site)?.name ?? 'Selected site'
  const mix = opportunityMix[site]
  const displaySeries = useMemo(() => {
    if (period === '24H') return series
    const labels = period === '7D' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Aug 22', 'Aug 25', 'Aug 28', 'Aug 31', 'Sep 03', 'Sep 06', 'Sep 09', 'Sep 12', 'Sep 15', 'Sep 18']
    const expected = labels.map((_, index) => Number((current * (.84 + Math.sin(index * .82) * .055 + index * .018)).toFixed(1)))
    const observed = expected.map((value, index) => Number((value + (index === labels.length - 3 ? current * .14 : Math.cos(index * 1.3) * current * .025)).toFixed(1)))
    return { labels, expected, observed }
  }, [current, period, series])

  return (
    <div className="overview-editorial gsap-hero">
      <header className="editorial-heading">
        <h1>What is happening?</h1>
      </header>

      <section className="connected-board" aria-label="Operational overview">
        <article className="editorial-metric metric-demand">
          <div className="metric-label"><ResourceIcon size={22} />Current demand</div>
          <div className="editorial-number"><strong><AnimatedValue value={current.toLocaleString('en-CA', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} /></strong><span>{item.unit}</span></div>
          <p className="metric-detail"><span className="live-dot" />Updated 18 sec ago · Calibrated</p>
        </article>
        <article className="editorial-metric metric-variance">
          <div className="metric-label"><Activity size={22} />Variance</div>
          <div className="editorial-number"><strong><AnimatedValue value={`${variance >= 0 ? '+' : ''}${variance.toFixed(1)}`} /></strong><span>%</span></div>
          <p className="metric-detail">Against production-normalized baseline</p>
        </article>
        <article className="editorial-metric metric-anomalies">
          <div className="metric-label"><TriangleAlert size={22} />Active anomalies</div>
          <div className="editorial-number"><strong><AnimatedValue value={String(activeAnomalies.length).padStart(2, '0')} /></strong></div>
          <p className="metric-detail">{highPriority ? `${highPriority} high priority` : 'No high-priority events'}</p>
        </article>

        <article className="board-chart demand-analysis">
          <header><div><h2>Consumption</h2><p>{siteLabel} · observed against expected operating range</p></div><div className="segmented board-range">{(['24H', '7D', '30D'] as const).map((value) => <button key={value} aria-pressed={period === value} className={period === value ? 'active' : ''} onClick={() => setPeriod(value)}>{value}</button>)}</div></header>
          <div className="board-legend"><span><i />Observed</span><span className="range-key"><i />Expected range</span></div>
          <Chart labels={displaySeries.labels} expected={displaySeries.expected} observed={displaySeries.observed} kind="area" unit={item.unit} title={`${item.label} demand compared with its expected operating range`} />
        </article>

        <article className="board-chart savings-analysis">
          <header><div><h2>Opportunity → savings</h2><p>{item.label} · twelve-month view</p></div><strong><AnimatedValue value={formatCadCompact(verifiedSavings)} /></strong></header>
          <div className="board-legend"><span><i />Verified savings</span><span><i />Estimated opportunity</span></div>
          <SavingsChart resource={resource} site={site} />
        </article>

        <article className="board-chart sector-analysis">
          <header><div><h2>Opportunity mix</h2><p>{siteLabel} · all resources</p></div><StatusPill tone="neutral">All resources</StatusPill></header>
          <ResourceSectorChart site={site} />
          <div className="sector-legend"><span><i />Water <b>{mix[0]}%</b></span><span><i />Electricity <b>{mix[1]}%</b></span><span><i />Natural gas <b>{mix[2]}%</b></span></div>
        </article>
      </section>
    </div>
  )
}

function Operations({ site, resource }: { site: SiteId; resource: ResourceId }) {
  const [query, setQuery] = useState('')
  const [showMethodology, setShowMethodology] = useState(false)
  const series = useMemo(() => buildSeries(site, resource), [site, resource])
  const item = resources[resource]
  const rows = resource === 'water'
    ? [['Cooling systems', '48.2 m³/h', '+17.4%', 'Calibrated'], ['Process lines', '39.7 m³/h', '+3.1%', 'Calibrated'], ['Sanitation', '18.6 m³/h', '-6.8%', 'Imported'], ['Other', '5.9 m³/h', '+1.2%', 'Estimated']]
    : resource === 'electricity'
      ? [['Production lines', '8.4 MWh', '+4.8%', 'Calibrated'], ['Compressed air', '4.9 MWh', '+18.0%', 'Calibrated'], ['HVAC', '3.2 MWh', '-2.4%', 'Imported'], ['Other', '2.2 MWh', '+0.9%', 'Estimated']]
      : [['Boiler house', '38.4 GJ', '+9.0%', 'Imported'], ['Process heat', '14.7 GJ', '-1.6%', 'Calibrated'], ['HVAC', '8.7 GJ', '+2.8%', 'Imported']]
  const visibleRows = rows.filter((row) => row[0].toLowerCase().includes(query.trim().toLowerCase()))
  return (
    <div className="view-stack">
      <SectionHeader eyebrow="Operations" title="Where is demand drifting?" aside={<StatusPill tone="accent">{item.label} · 15 minute view</StatusPill>} />
      <div className="operations-grid">
        <article className="panel operations-chart"><Chart labels={series.labels} expected={series.expected} observed={series.observed} unit={item.unit} title={`${item.label} demand profile`} /></article>
        <aside className="panel method-panel"><p className="eyebrow">Comparison method</p><h3>Production-normalized baseline</h3><p>Median demand from the previous eight equivalent operating weeks, adjusted to hourly production output.</p><dl><div><dt>Window</dt><dd>8 weeks</dd></div><div><dt>Confidence</dt><dd>93%</dd></div><div><dt>Last recalculated</dt><dd>Today · 09:42 EDT</dd></div></dl><AnimatePresence>{showMethodology && <motion.div className="method-detail" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><b>Calculation note</b><p>Equivalent production hours are matched before the median range is calculated. Estimated readings remain visible but carry less weight.</p></motion.div>}</AnimatePresence><button className="secondary-button" aria-expanded={showMethodology} onClick={() => setShowMethodology((current) => !current)}>{showMethodology ? 'Hide methodology' : 'View methodology'}</button></aside>
      </div>
      <article className="panel table-panel">
        <SectionHeader eyebrow="Demand breakdown" title="Processes and equipment" aside={<div className="search-field"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an asset" aria-label="Find an asset" /></div>} />
        <div className="data-table operations-table" role="table"><div className="table-head" role="row"><span>Process / asset</span><span>Current</span><span>Variance</span><span>Data quality</span></div>{visibleRows.map((row) => <div className="table-row" role="row" key={row[0]}><span><b>{row[0]}</b><small>Updated within 60 sec</small></span><span>{row[1]}</span><span className={row[2].startsWith('+') ? 'bad' : 'good'}>{row[2]}</span><span><StatusPill tone={row[3] === 'Estimated' ? 'warn' : 'neutral'}>{row[3]}</StatusPill></span></div>)}</div>
        {visibleRows.length === 0 && <p className="empty-state">No assets match “{query}”.</p>}
      </article>
    </div>
  )
}

function AnomaliesView({ onAnomaly }: { onAnomaly: (anomaly: Anomaly) => void }) {
  const [severity, setSeverity] = useState('All')
  const visible = severity === 'All' ? anomalies : anomalies.filter((item) => item.severity === severity)
  const highCount = visible.filter((item) => item.severity === 'High').length
  const medianConfidence = visible.length ? Math.round([...visible].sort((a, b) => a.confidence - b.confidence)[Math.floor(visible.length / 2)].confidence) : 0
  const dailyExposure = visible.reduce((sum, item) => sum + Number(item.exposure.match(/[0-9]+/)?.[0] ?? 0), 0)
  return (
    <div className="view-stack">
      <SectionHeader eyebrow="Anomalies" title="What changed beyond expected?" aside={<div className="segmented">{['All', 'High', 'Medium', 'Low'].map((item) => <button key={item} className={severity === item ? 'active' : ''} onClick={() => setSeverity(item)}>{item}</button>)}</div>} />
      <div className="anomaly-summary"><span><b>{String(visible.length).padStart(2, '0')}</b> Active</span><span><b>{String(highCount).padStart(2, '0')}</b> High priority</span><span><b>{medianConfidence}%</b> Median confidence</span><span><b>{formatCad(dailyExposure)}</b> Daily exposure</span></div>
      <article className="panel anomaly-queue">
        <div className="queue-head"><span>Severity / asset</span><span>Deviation</span><span>Confidence</span><span>Status</span><span>Exposure</span></div>
        {visible.map((anomaly) => <button key={anomaly.id} onClick={() => onAnomaly(anomaly)}><span className="queue-asset"><i className={`severity-bar ${anomaly.severity.toLowerCase()}`} /><span><b>{anomaly.asset}</b><small>{anomaly.site} · {anomaly.resource}</small></span></span><span><b>{anomaly.deviation}</b><small>{anomaly.duration}</small></span><span>{anomaly.confidence}%</span><span><StatusPill tone={anomaly.status === 'New' ? 'critical' : anomaly.status === 'Investigating' ? 'warn' : 'neutral'}>{anomaly.status}</StatusPill></span><span>{anomaly.exposure}<ArrowUpRight size={15} /></span></button>)}
      </article>
    </div>
  )
}

function ActionsView({ actions, advance }: { actions: OperationalAction[]; advance: (id: string) => void }) {
  return (
    <div className="view-stack">
      <SectionHeader eyebrow="Actions" title="What should we do next?" aside={<StatusPill tone="neutral">Estimated impact · not verified</StatusPill>} />
      <div className="action-kpis"><MetricCard label="Estimated opportunity" value={formatCad(actions.reduce((sum, item) => sum + item.value, 0))} note="Annual value across open actions" icon={Gauge} /><MetricCard label="Approved or scheduled" value={String(actions.filter((item) => ['Approved', 'Scheduled'].includes(item.status)).length).padStart(2, '0')} note="Ready for operational follow-through" icon={ClipboardCheck} /><MetricCard label="Implemented" value={String(actions.filter((item) => item.status === 'Implemented').length).padStart(2, '0')} note="Awaiting a verification window" icon={Clock3} /></div>
      <div className="actions-list">
        {actions.map((action) => {
          const currentIndex = actionStatusOrder.indexOf(action.status)
          const next = actionStatusOrder[Math.min(currentIndex + 1, actionStatusOrder.length - 1)]
          const actionLabel: Record<string, string> = { 'Under review': 'Send to review', Approved: 'Approve action', Scheduled: 'Schedule action', Implemented: 'Mark implemented', Verified: 'Verify result' }
          return <article key={action.id} className="panel action-card"><div className="action-id"><span>{action.id}</span><StatusPill tone={action.status === 'Implemented' ? 'good' : action.status === 'Under review' ? 'warn' : 'accent'}>{action.status}</StatusPill></div><h3>{action.title}</h3><p>{action.site} · Evidence from {action.anomalyId}</p><div className="action-impact"><span><small>Estimated reduction</small><b>{action.impact}</b></span><span><small>Estimated annual value</small><b>{formatCad(action.value)}</b></span><span><small>Evidence confidence</small><b>{action.confidence}</b></span></div><div className="action-footer"><span>{action.owner} · Due {action.due}</span><button className="primary-button" disabled={action.status === 'Verified'} onClick={() => advance(action.id)}>{action.status === 'Verified' ? <><Check size={14} /> Verified</> : <>{actionLabel[next]} <ArrowRight size={14} /></>}</button></div></article>
        })}
      </div>
    </div>
  )
}

function PerformanceView() {
  return (
    <div className="view-stack">
      <SectionHeader eyebrow="Performance" title="What did we actually save?" aside={<StatusPill tone="good">FY 2026 · Year to date</StatusPill>} />
      <section className="metrics-grid performance-metrics"><MetricCard label="Verified savings" value={formatCad(284600)} note="Measured after implementation" icon={ShieldCheck} tone="good" /><MetricCard label="Water reduced" value="39,200 m³" note="Compared with approved baseline" icon={Droplets} tone="good" /><MetricCard label="Energy reduced" value="612 MWh" note="Electricity and converted fuels" icon={Zap} tone="good" /><MetricCard label="Target progress" value="78%" note="Annual target · 102 days remaining" icon={Gauge} /></section>
      <section className="performance-grid"><article className="panel performance-chart"><SectionHeader eyebrow="Cumulative verified savings" title="Twelve-month trend" /><Chart labels={monthlySavings.labels} observed={monthlySavings.values} kind="bar" unit="CA$K" target={365} title="Cumulative verified savings over twelve months" /></article><article className="panel verified-panel"><p className="eyebrow">Value classification</p><h3>Only measured outcomes count.</h3><div className="classification"><div><span>Verified savings</span><b>{formatCad(284600)}</b><i className="verified" /></div><div><span>Implemented · measuring</span><b>{formatCad(49200)}</b><i className="measuring" /></div><div><span>Estimated opportunity</span><b>{formatCad(100000)}</b><i className="estimated" /></div></div><p><Info size={13} /> Figures move into verified savings only after the observation window closes.</p></article></section>
    </div>
  )
}

function ReportingView() {
  const [exported, setExported] = useState(false)
  const exportCsv = () => {
    const rows = ['site,resource,period,value,unit,quality', 'Hamilton Works,water,2026 YTD,39200,m3,verified', 'All sites,electricity,2026 YTD,612,MWh,verified']
    const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'halveo-reporting-readiness.csv'
    anchor.click()
    URL.revokeObjectURL(url)
    setExported(true)
    window.setTimeout(() => setExported(false), 1800)
  }
  return (
    <div className="view-stack">
      <SectionHeader eyebrow="Reports" title="Can this evidence be reported?" aside={<button className="primary-button" onClick={exportCsv}>{exported ? <Check size={14} /> : <Download size={14} />} {exported ? 'CSV ready' : 'Export CSV'}</button>} />
      <div className="reporting-note"><Info size={17} /><div><b>Informational mapping only</b><p>This fictional prototype does not certify compliance or determine whether a facility has a reporting obligation.</p></div></div>
      <section className="reporting-grid"><article className="panel boundary-panel"><p className="eyebrow">Reporting boundary</p><h3>North Basin Manufacturing</h3><dl><div><dt>Period</dt><dd>Jan 1–Sep 20, 2026</dd></div><div><dt>Sites</dt><dd>3 Canadian facilities</dd></div><div><dt>Water coverage</dt><dd>97.1%</dd></div><div><dt>Energy coverage</dt><dd>96.4%</dd></div><div><dt>Method</dt><dd>Operational control</dd></div></dl></article><article className="panel mappings-panel"><p className="eyebrow">Disclosure mapping</p><h3>Available mappings</h3>{[['GRI 303', 'Water and Effluents', 'Ready'], ['CDP', 'Water Security', 'Partial'], ['CSDS 1 / 2', 'Readiness reference', 'Partial'], ['GHGRP', 'Optional emissions module', 'Not enabled']].map((item) => <div key={item[0]}><span><b>{item[0]}</b><small>{item[1]}</small></span><StatusPill tone={item[2] === 'Ready' ? 'good' : item[2] === 'Partial' ? 'warn' : 'neutral'}>{item[2]}</StatusPill></div>)}</article></section>
      <article className="panel table-panel"><SectionHeader eyebrow="Audit trail" title="Recent data events" /><div className="data-table"><div className="table-head"><span>Timestamp</span><span>Event</span><span>Detail</span><span>Actor</span><span /></div>{auditEvents.map((event) => <div className="table-row" key={event.time}><span>{event.time}</span><span><b>{event.event}</b></span><span>{event.detail}</span><span>{event.actor}</span><span><Check size={14} /></span></div>)}</div></article>
    </div>
  )
}

function SourcesView() {
  return (
    <div className="view-stack">
      <SectionHeader eyebrow="Data Sources" title="Can we trust the data?" aside={<StatusPill tone="good"><span className="live-dot" /> 5 sources online</StatusPill>} />
      <section className="metrics-grid"><MetricCard label="Trusted coverage" value="96.8%" note="Across the selected period" icon={ShieldCheck} tone="good" /><MetricCard label="Calibrated meters" value="18 / 20" note="One review due this month" icon={Gauge} /><MetricCard label="Connector health" value="99.4%" note="Last 30 days" icon={Activity} tone="good" /><MetricCard label="Manual readings" value="1.7%" note="Clearly identified in reports" icon={ClipboardCheck} /></section>
      <article className="panel table-panel"><SectionHeader eyebrow="Connected systems" title="Meters and imports" /><div className="data-table source-table"><div className="table-head"><span>Source</span><span>Site</span><span>Last reading</span><span>Coverage</span><span>Quality</span></div>{dataSources.map((source) => <div className="table-row" key={source.id}><span><b>{source.source}</b><small>{source.id} · {source.type}</small></span><span>{source.site}</span><span>{source.last}<small>Expected every {source.interval}</small></span><span>{source.coverage}</span><span><StatusPill tone={source.quality === 'Review due' ? 'warn' : source.quality === 'Calibrated' ? 'good' : 'neutral'}>{source.quality}</StatusPill></span></div>)}</div></article>
    </div>
  )
}

function SettingsView({ compact, setCompact, tour, setTour }: { compact: boolean; setCompact: (value: boolean) => void; tour: boolean; setTour: (value: boolean) => void }) {
  return (
    <div className="view-stack settings-view"><SectionHeader eyebrow="Settings" title="How should this workspace behave?" /><article className="panel settings-panel"><div><span><b>Compact data density</b><small>Reduce vertical spacing in operational tables.</small></span><label className="switch"><input type="checkbox" checked={compact} onChange={(event) => setCompact(event.target.checked)} /><i /></label></div><div><span><b>Offer guided demo</b><small>Show the portfolio walkthrough entry point.</small></span><label className="switch"><input type="checkbox" checked={tour} onChange={(event) => setTour(event.target.checked)} /><i /></label></div><div><span><b>Motion preference</b><small>Halveo follows your operating system’s reduced-motion setting.</small></span><StatusPill tone="neutral">System</StatusPill></div><div><span><b>Language and region</b><small>Formatting for dates, currency, and measurement units.</small></span><StatusPill tone="accent">English · Canada</StatusPill></div></article></div>
  )
}

function AnomalyDrawer({ anomaly, onClose, onCreateAction }: { anomaly: Anomaly | null; onClose: () => void; onCreateAction: (anomaly: Anomaly) => void }) {
  const reduced = useReducedMotion()
  return (
    <AnimatePresence>
      {anomaly && <><motion.button className="drawer-backdrop" aria-label="Close anomaly detail" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /><motion.aside className="drawer" role="dialog" aria-modal="true" aria-label={`Anomaly ${anomaly.id}`} initial={reduced ? { opacity: 0 } : { x: '100%' }} animate={{ x: 0, opacity: 1 }} exit={reduced ? { opacity: 0 } : { x: '100%' }} transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}><div className="drawer-header"><div><p className="eyebrow">{anomaly.id} · {anomaly.severity} priority</p><h2>{anomaly.asset}</h2><p>{anomaly.site}</p></div><button className="icon-button" onClick={onClose} aria-label="Close"><X /></button></div><div className="drawer-metrics"><span><small>Deviation</small><b>{anomaly.deviation}</b></span><span><small>Duration</small><b>{anomaly.duration}</b></span><span><small>Confidence</small><b>{anomaly.confidence}%</b></span></div><div className="evidence-block"><p className="eyebrow">Observed fact</p><p>Demand remained above the expected operating range while production output stayed within its normal corridor.</p></div><div className="evidence-block"><p className="eyebrow">Possible cause · hypothesis</p><p>{anomaly.hypothesis}</p></div><div className="evidence-block"><p className="eyebrow">Verification rule</p><p>Confirm that demand returns to the expected range for two equivalent operating cycles after intervention.</p></div><div className="drawer-footer"><button className="secondary-button" onClick={onClose}>Monitor</button><button className="primary-button" onClick={() => onCreateAction(anomaly)}>Create action <ArrowRight size={14} /></button></div></motion.aside></>}
    </AnimatePresence>
  )
}

const demoSteps: Array<{ label: string; title: string; copy: string; view: ViewId }> = [
  { label: '01 · Detect', title: 'See the deviation before it becomes normal.', copy: 'Hamilton’s overnight water demand has moved 31% beyond its expected range.', view: 'overview' },
  { label: '02 · Explain', title: 'Follow the evidence, not the assumption.', copy: 'The anomaly carries its source, confidence, duration, and a clearly labelled hypothesis.', view: 'anomalies' },
  { label: '03 · Act', title: 'Turn evidence into accountable work.', copy: 'The valve inspection has an owner, a maintenance window, and an estimated impact.', view: 'actions' },
  { label: '04 · Verify', title: 'Count the outcome only after measurement.', copy: 'Implemented actions remain separate from verified savings until the observation window closes.', view: 'performance' },
  { label: '05 · Report', title: 'One source of truth, prepared for disclosure.', copy: 'The same operational data supports a traceable reporting-readiness view.', view: 'reporting' },
]

function GuidedDemo({ step, setStep, onView }: { step: number | null; setStep: (step: number | null) => void; onView: (view: ViewId) => void }) {
  if (step === null) return null
  const item = demoSteps[step]
  const next = () => {
    if (step === demoSteps.length - 1) { setStep(null); return }
    const nextStep = step + 1
    setStep(nextStep)
    onView(demoSteps[nextStep].view)
  }
  return <motion.aside className="demo-guide" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}><div className="demo-guide-top"><span>{item.label}</span><button onClick={() => setStep(null)} aria-label="Close guided demo"><X size={16} /></button></div><h3>{item.title}</h3><p>{item.copy}</p><div className="demo-progress">{demoSteps.map((_, index) => <i key={index} className={index <= step ? 'active' : ''} />)}</div><button className="primary-button" onClick={next}>{step === demoSteps.length - 1 ? 'Finish demo' : 'Continue'} <ArrowRight size={14} /></button></motion.aside>
}

export default function App() {
  const appRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [view, setView] = useState<ViewId>('overview')
  const [site, setSite] = useState<SiteId>('all')
  const [resource, setResource] = useState<ResourceId>('water')
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null)
  const [demoStep, setDemoStep] = useState<number | null>(null)
  const [compact, setCompact] = useState(() => localStorage.getItem('halveo-compact') === 'true')
  const [tourEnabled, setTourEnabled] = useState(() => localStorage.getItem('halveo-tour') !== 'false')
  const [actions, setActions] = useState<OperationalAction[]>(() => {
    const stored = localStorage.getItem('halveo-actions')
    return stored ? JSON.parse(stored) as OperationalAction[] : initialActions
  })

  useLayoutEffect(() => {
    if (reduced || !appRef.current) return
    const context = gsap.context(() => {
      gsap.fromTo('.editorial-heading > *', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.58, stagger: 0.07, ease: 'power4.out' })
      gsap.fromTo('.editorial-metric', { y: 28, opacity: 0, scale: .975 }, { y: 0, opacity: 1, scale: 1, duration: 0.62, stagger: 0.06, ease: 'power4.out', delay: .08 })
      gsap.fromTo('.board-chart', { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .08, ease: 'power4.out', delay: .22 })
    }, appRef)
    return () => context.revert()
  }, [reduced])

  useEffect(() => { localStorage.setItem('halveo-actions', JSON.stringify(actions)) }, [actions])
  useEffect(() => { localStorage.setItem('halveo-compact', String(compact)) }, [compact])
  useEffect(() => { localStorage.setItem('halveo-tour', String(tourEnabled)) }, [tourEnabled])
  useEffect(() => { window.scrollTo(0, 0) }, [view])

  const advanceAction = (id: string) => {
    setActions((current) => current.map((action) => {
      if (action.id !== id) return action
      const index = actionStatusOrder.indexOf(action.status)
      return { ...action, status: actionStatusOrder[Math.min(index + 1, actionStatusOrder.length - 1)] }
    }))
  }

  const createAction = (anomaly: Anomaly) => {
    if (!actions.some((item) => item.anomalyId === anomaly.id)) {
      setActions((current) => [{ id: `AC-${230 + current.length}`, anomalyId: anomaly.id, site: anomaly.site, title: `Investigate ${anomaly.asset}`, impact: 'Pending validation', value: 0, confidence: 'Medium', owner: 'Unassigned', due: 'Not scheduled', status: 'Proposed' }, ...current])
    }
    setSelectedAnomaly(null)
    setView('actions')
  }

  const renderView = () => {
    switch (view) {
      case 'overview': return <Overview site={site} resource={resource} />
      case 'operations': return <Operations site={site} resource={resource} />
      case 'anomalies': return <AnomaliesView onAnomaly={setSelectedAnomaly} />
      case 'actions': return <ActionsView actions={actions} advance={advanceAction} />
      case 'performance': return <PerformanceView />
      case 'reporting': return <ReportingView />
      case 'sources': return <SourcesView />
      case 'settings': return <SettingsView compact={compact} setCompact={setCompact} tour={tourEnabled} setTour={setTourEnabled} />
    }
  }

  return (
    <div className={`app top-layout${compact ? ' compact-density' : ''}`} ref={appRef}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {view === 'overview' && <AmbientField />}
      <div className="app-main">
        <Topbar view={view} onView={setView} showDemo={tourEnabled} onDemo={() => { setDemoStep(0); setView('overview') }} />
        <main id="main-content">
          <DashboardFilters view={view} site={site} setSite={setSite} resource={resource} setResource={setResource} />
          <AnimatePresence mode="wait" initial={false}><motion.div className="page-reveal" key={view} initial={reduced ? { opacity: 0 } : { opacity: 0, y: -14, clipPath: 'circle(0% at 50% -5%)' }} animate={{ opacity: 1, y: 0, clipPath: 'circle(150% at 50% -5%)' }} exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: .99 }} transition={{ duration: reduced ? .15 : .52, ease: [0.16, 1, 0.3, 1] }}>{renderView()}</motion.div></AnimatePresence>
        </main>
      </div>
      <AnomalyDrawer anomaly={selectedAnomaly} onClose={() => setSelectedAnomaly(null)} onCreateAction={createAction} />
      <GuidedDemo step={demoStep} setStep={setDemoStep} onView={setView} />
    </div>
  )
}

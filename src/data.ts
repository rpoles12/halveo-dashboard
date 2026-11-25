export type ViewId = 'overview' | 'operations' | 'anomalies' | 'actions' | 'performance' | 'reporting' | 'sources' | 'settings'
export type SiteId = 'all' | 'hamilton' | 'trois-rivieres' | 'calgary'
export type ResourceId = 'water' | 'electricity' | 'gas'
export type Severity = 'High' | 'Medium' | 'Low'
export type ActionStatus = 'Proposed' | 'Under review' | 'Approved' | 'Scheduled' | 'Implemented' | 'Verified'

export interface Site {
  id: Exclude<SiteId, 'all'>
  name: string
  province: string
  timezone: string
  focus: string
  coverage: number
  variance: number
}

export interface Anomaly {
  id: string
  siteId: Exclude<SiteId, 'all'>
  site: string
  asset: string
  resource: ResourceId
  severity: Severity
  deviation: string
  duration: string
  detected: string
  confidence: number
  hypothesis: string
  status: 'New' | 'Investigating' | 'Monitoring'
  exposure: string
}

export interface OperationalAction {
  id: string
  anomalyId: string
  site: string
  title: string
  impact: string
  value: number
  confidence: 'High' | 'Medium'
  owner: string
  due: string
  status: ActionStatus
}

export const sites: Site[] = [
  { id: 'hamilton', name: 'Hamilton Works', province: 'ON', timezone: 'EDT', focus: 'Process water · Cooling', coverage: 98.4, variance: 12.8 },
  { id: 'trois-rivieres', name: 'Trois-Rivières Mill', province: 'QC', timezone: 'EDT', focus: 'Steam · Water recovery', coverage: 95.7, variance: -4.2 },
  { id: 'calgary', name: 'Calgary Assembly', province: 'AB', timezone: 'MDT', focus: 'Electricity · Compressed air', coverage: 96.1, variance: 6.4 },
]

export const anomalies: Anomaly[] = [
  {
    id: 'AN-1048', siteId: 'hamilton', site: 'Hamilton Works', asset: 'Cooling Loop 02', resource: 'water', severity: 'High',
    deviation: '+31%', duration: '2h 47m', detected: 'Today · 03:12 EDT', confidence: 94,
    hypothesis: 'Return valve may be failing to close completely during the off-shift cycle.', status: 'New', exposure: 'CAD 116/day',
  },
  {
    id: 'AN-1044', siteId: 'calgary', site: 'Calgary Assembly', asset: 'Compressed Air Main', resource: 'electricity', severity: 'High',
    deviation: '+18%', duration: '6h 20m', detected: 'Yesterday · 22:40 MDT', confidence: 91,
    hypothesis: 'Off-shift base load indicates a leak or an isolation sequence that did not complete.', status: 'Investigating', exposure: 'CAD 82/day',
  },
  {
    id: 'AN-1039', siteId: 'trois-rivieres', site: 'Trois-Rivières Mill', asset: 'Boiler House', resource: 'gas', severity: 'Medium',
    deviation: '+9%', duration: '4h 05m', detected: 'Sep 18 · 14:25 EDT', confidence: 86,
    hypothesis: 'Steam demand is above the production-normalized range.', status: 'Monitoring', exposure: 'CAD 64/day',
  },
  {
    id: 'AN-1036', siteId: 'hamilton', site: 'Hamilton Works', asset: 'Rinse Line 04', resource: 'water', severity: 'Medium',
    deviation: '+14%', duration: '1h 12m', detected: 'Sep 18 · 09:08 EDT', confidence: 82,
    hypothesis: 'Rinse cycle duration may have drifted from the approved recipe.', status: 'Investigating', exposure: 'CAD 41/day',
  },
  {
    id: 'AN-1028', siteId: 'calgary', site: 'Calgary Assembly', asset: 'Paint Booth 01', resource: 'gas', severity: 'Low',
    deviation: '+6%', duration: '42m', detected: 'Sep 17 · 11:34 MDT', confidence: 74,
    hypothesis: 'Short-duration variation remains within the broader weekly range.', status: 'Monitoring', exposure: 'CAD 19/day',
  },
]

export const initialActions: OperationalAction[] = [
  { id: 'AC-221', anomalyId: 'AN-1048', site: 'Hamilton Works', title: 'Inspect Cooling Loop 02 return valve', impact: '14,800 m³/year', value: 38400, confidence: 'High', owner: 'Maya Chen', due: 'Sep 22', status: 'Approved' },
  { id: 'AC-218', anomalyId: 'AN-1044', site: 'Calgary Assembly', title: 'Run compressed-air isolation test', impact: '172 MWh/year', value: 29100, confidence: 'High', owner: 'Noah Williams', due: 'Sep 24', status: 'Scheduled' },
  { id: 'AC-209', anomalyId: 'AN-1039', site: 'Trois-Rivières Mill', title: 'Review boiler setpoint against production load', impact: '1,120 GJ/year', value: 17600, confidence: 'Medium', owner: 'Élise Tremblay', due: 'Sep 26', status: 'Under review' },
  { id: 'AC-197', anomalyId: 'AN-1036', site: 'Hamilton Works', title: 'Restore rinse recipe timing', impact: '6,240 m³/year', value: 14900, confidence: 'Medium', owner: 'Maya Chen', due: 'Sep 18', status: 'Implemented' },
]

export const resources = {
  water: { label: 'Water', unit: 'm³/h', current: 112.4, baseline: 103.5, annualUnit: 'm³' },
  electricity: { label: 'Electricity', unit: 'MWh', current: 18.7, baseline: 17.2, annualUnit: 'MWh' },
  gas: { label: 'Natural gas', unit: 'GJ', current: 61.8, baseline: 58.4, annualUnit: 'GJ' },
} as const

const siteFactor: Record<SiteId, number> = { all: 1, hamilton: 1.13, 'trois-rivieres': 0.91, calgary: 0.83 }
const resourceFactor: Record<ResourceId, number> = { water: 1, electricity: 0.74, gas: 0.58 }

export function buildSeries(site: SiteId, resource: ResourceId) {
  const sf = siteFactor[site]
  const rf = resourceFactor[resource]
  const labels = Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}:00`)
  const expected = labels.map((_, index) => Number(((93 + Math.sin(index / 3.2) * 8 + Math.cos(index / 2.1) * 3) * sf * rf).toFixed(1)))
  const observed = expected.map((value, index) => Number((value + Math.sin(index * 1.4) * 2.2 + (index >= 15 && index <= 18 ? 14 * rf : 0)).toFixed(1)))
  return { labels, expected, observed }
}

export const monthlySavings = {
  labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  values: [18, 32, 49, 68, 89, 116, 148, 179, 208, 237, 261, 285],
}

export const dataSources = [
  { id: 'WT-021', site: 'Hamilton Works', source: 'Cooling Loop 02', type: 'Ultrasonic meter', last: '18 sec ago', interval: '15 sec', quality: 'Calibrated', coverage: '99.2%' },
  { id: 'EN-114', site: 'Calgary Assembly', source: 'Compressed Air Main', type: 'Power meter', last: '42 sec ago', interval: '60 sec', quality: 'Calibrated', coverage: '98.7%' },
  { id: 'GS-037', site: 'Trois-Rivières Mill', source: 'Boiler House', type: 'SCADA import', last: '3 min ago', interval: '5 min', quality: 'Imported', coverage: '96.4%' },
  { id: 'WT-018', site: 'Hamilton Works', source: 'Rinse Line 04', type: 'Magnetic meter', last: '1 min ago', interval: '60 sec', quality: 'Review due', coverage: '92.1%' },
  { id: 'PR-003', site: 'All sites', source: 'Production output', type: 'ERP import', last: '18 min ago', interval: '30 min', quality: 'Imported', coverage: '97.5%' },
]

export const auditEvents = [
  { time: 'Sep 20, 2026 · 09:42 EDT', event: 'Baseline recalculated', detail: 'Hamilton · Cooling Loop 02', actor: 'System' },
  { time: 'Sep 20, 2026 · 08:15 MDT', event: 'Action scheduled', detail: 'Compressed-air isolation test', actor: 'Noah Williams' },
  { time: 'Sep 19, 2026 · 16:28 EDT', event: 'Manual reading approved', detail: 'Trois-Rivières · Intake meter', actor: 'Élise Tremblay' },
  { time: 'Sep 19, 2026 · 11:04 EDT', event: 'Meter calibration imported', detail: 'Hamilton · WT-021', actor: 'Connector' },
]

export const actionStatusOrder: ActionStatus[] = ['Proposed', 'Under review', 'Approved', 'Scheduled', 'Implemented', 'Verified']

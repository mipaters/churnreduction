import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Database,
  FileSearch,
  Gauge,
  GitBranch,
  Headphones,
  HeartHandshake,
  Info,
  Layers3,
  Lightbulb,
  Menu,
  MessageSquareText,
  Moon,
  Network,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  WalletCards,
  X,
  Zap,
} from 'lucide-react'
import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  agentDefinitions,
  auditSteps,
  campaigns,
  channelPerformance,
  churnTrend,
  contributions,
  conversationSteps,
  customers,
  DISCLAIMER,
  explanationModes,
  offers,
  reasonCodes,
  riskDistribution,
  timeline,
  walkthrough,
  type Customer,
  type QueueStatus,
} from './data'

type Outcome = 'Accepted' | 'Declined' | 'Countered' | 'Saved' | 'Churned'
type ExplanationMode = keyof typeof explanationModes

const navItems = [
  ['/', 'Executive Dashboard', BarChart3],
  ['/queue', 'Churn Risk Queue', Users],
  ['/customer', 'Customer 360', UserCheck],
  ['/assist', 'Live Save Assist', Headphones],
  ['/trace', 'Agent Decision Trace', GitBranch],
  ['/offers', 'Offer Intelligence', WalletCards],
  ['/performance', 'Campaign Performance', TrendingUp],
  ['/roi', 'Retention ROI', CircleDollarSign],
  ['/walkthrough', 'Executive Walkthrough', Play],
  ['/architecture', 'Microsoft Architecture', Network],
  ['/governance', 'Governance & Controls', ShieldCheck],
] as const

const formatMoney = (value: number, compact = false) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? 'compact' : 'standard',
  }).format(value)

const riskLevel = (risk: number) => {
  if (risk >= 70) return 'Critical'
  if (risk >= 50) return 'High'
  if (risk >= 35) return 'Medium'
  return 'Low'
}

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(customers[0])
  const [analysisRun, setAnalysisRun] = useState(false)
  const [offerState, setOfferState] = useState<'none' | 'primary' | 'fallback' | 'approval'>('none')
  const [conversationStep, setConversationStep] = useState(1)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [campaignAdjustment, setCampaignAdjustment] = useState(0)
  const [walkthroughStep, setWalkthroughStep] = useState(0)
  const [walkthroughPlaying, setWalkthroughPlaying] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!walkthroughPlaying) return
    const timer = window.setInterval(() => {
      setWalkthroughStep((step) => {
        if (step >= walkthrough.length - 1) {
          setWalkthroughPlaying(false)
          return step
        }
        const next = step + 1
        navigate(walkthrough[next].route)
        return next
      })
    }, 7000)
    return () => window.clearInterval(timer)
  }, [walkthroughPlaying, navigate])

  const resetDemo = () => {
    setSelectedCustomer(customers[0])
    setAnalysisRun(false)
    setOfferState('none')
    setConversationStep(1)
    setOutcome(null)
    setCampaignAdjustment(0)
    setWalkthroughStep(0)
    setWalkthroughPlaying(false)
    navigate('/')
  }

  const recordOutcome = (next: Outcome) => {
    setOutcome(next)
    setCampaignAdjustment(next === 'Saved' || next === 'Accepted' ? 1 : 0)
  }

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onMenu={() => setMobileOpen(!mobileOpen)}
        onReset={resetDemo}
      />
      <div className="shell-body">
        <Sidebar open={mobileOpen} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard analysisRun={analysisRun} onRun={() => setAnalysisRun(true)} />} />
            <Route
              path="/queue"
              element={
                <RiskQueue
                  selected={selectedCustomer}
                  onSelect={(customer) => {
                    setSelectedCustomer(customer)
                    navigate('/customer')
                  }}
                />
              }
            />
            <Route
              path="/customer"
              element={
                <Customer360
                  customer={selectedCustomer}
                  analysisRun={analysisRun}
                  onRun={() => setAnalysisRun(true)}
                />
              }
            />
            <Route
              path="/assist"
              element={
                <LiveAssist
                  customer={selectedCustomer}
                  offerState={offerState}
                  setOfferState={setOfferState}
                  step={conversationStep}
                  setStep={setConversationStep}
                  outcome={outcome}
                  recordOutcome={recordOutcome}
                />
              }
            />
            <Route path="/trace" element={<DecisionTrace outcome={outcome} />} />
            <Route path="/offers" element={<OfferIntelligence offerState={offerState} setOfferState={setOfferState} />} />
            <Route path="/performance" element={<Performance adjustment={campaignAdjustment} />} />
            <Route path="/roi" element={<RoiCalculator />} />
            <Route
              path="/walkthrough"
              element={
                <Walkthrough
                  step={walkthroughStep}
                  setStep={setWalkthroughStep}
                  playing={walkthroughPlaying}
                  setPlaying={setWalkthroughPlaying}
                />
              }
            />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/governance" element={<Governance />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
      {location.pathname !== '/walkthrough' && (
        <button
          className="walkthrough-fab"
          onClick={() => navigate('/walkthrough')}
          aria-label="Open Executive Walkthrough"
        >
          <Play size={16} fill="currentColor" /> Executive Walkthrough
        </button>
      )}
    </div>
  )
}

function Header({
  theme,
  onTheme,
  onMenu,
  onReset,
}: {
  theme: 'dark' | 'light'
  onTheme: () => void
  onMenu: () => void
  onReset: () => void
}) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Toggle navigation">
        <Menu size={20} />
      </button>
      <Link className="brand" to="/">
        <span className="brand-mark">R</span>
        <span>
          <strong>Rogers Churn Prevention Agent</strong>
          <small>Retention Intelligence</small>
        </span>
      </Link>
      <div className="header-status">
        <span className="status-pill active"><span /> Retention Intelligence Active</span>
        <span className="status-pill synthetic">Synthetic Data</span>
      </div>
      <div className="header-actions">
        <Link className="button ghost walkthrough-header" to="/walkthrough">
          <Play size={15} /> Walkthrough
        </Link>
        <button className="button ghost" onClick={onReset}>
          <RotateCcw size={15} /> <span className="button-label">Reset Demo</span>
        </button>
        <button className="icon-button" onClick={onTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}

function Sidebar({ open }: { open: boolean }) {
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <nav>
        <p className="nav-label">Retention command centre</p>
        {navItems.map(([path, label, Icon]) => (
          <NavLink key={path} to={path} end={path === '/'}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-message">
        <Sparkles size={18} />
        <p><strong>Strategic message</strong>Predict the risk. Understand the reason. Make the right save.</p>
      </div>
    </aside>
  )
}

function Footer() {
  return (
    <footer>
      <div><strong>Rogers Churn Prevention Agent</strong> · Synthetic concept demonstration · No live customer action</div>
      <p>{DISCLAIMER}</p>
    </footer>
  )
}

function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="page-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  )
}

function SimulatedBadge() {
  return <span className="sim-badge">Simulated</span>
}

function KpiCard({
  label,
  value,
  detail,
  icon,
  accent = 'red',
}: {
  label: string
  value: string
  detail: string
  icon: ReactNode
  accent?: 'red' | 'blue' | 'green' | 'amber' | 'violet'
}) {
  return (
    <article className={`kpi-card ${accent}`}>
      <div className="kpi-top"><span className="kpi-icon">{icon}</span><SimulatedBadge /></div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      <small>{detail}</small>
    </article>
  )
}

function Card({
  children,
  className = '',
  title,
  action,
}: {
  children: ReactNode
  className?: string
  title?: string
  action?: ReactNode
}) {
  return (
    <section className={`card ${className}`}>
      {title && <div className="card-heading"><h2>{title}</h2>{action}</div>}
      {children}
    </section>
  )
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => <span key={item.name} style={{ color: item.color }}>{item.name}: {item.value}</span>)}
      <small>Illustrative</small>
    </div>
  )
}

function Dashboard({ analysisRun, onRun }: { analysisRun: boolean; onRun: () => void }) {
  return (
    <>
      <PageHeader
        eyebrow="Executive retention dashboard"
        title="From Churn Prediction to Churn Prevention"
        description="Explainable AI connects churn signals to timely, personalized, and measurable retention action."
        actions={<button className="button primary" onClick={onRun}><Zap size={16} /> {analysisRun ? 'Analysis refreshed' : 'Run Retention Analysis'}</button>}
      />
      <div className="kpi-grid">
        <KpiCard label="Customers scored today" value="124,800" detail="Daily + event-triggered" icon={<Users size={18} />} />
        <KpiCard label="High-risk customers" value="8,460" detail="6.8% of scored base" icon={<AlertTriangle size={18} />} accent="amber" />
        <KpiCard label="Annualized revenue at risk" value="$18.7M" detail="Across active risk cohorts" icon={<CircleDollarSign size={18} />} accent="blue" />
        <KpiCard label="Priority interventions" value="3,240" detail="H0 and H1 action queue" icon={<Target size={18} />} accent="violet" />
        <KpiCard label="Current save rate" value="68%" detail="+2 pts month over month" icon={<HeartHandshake size={18} />} accent="green" />
        <KpiCard label="Retention lift vs control" value="+8.4 pts" detail="Incremental, not gross saves" icon={<TrendingUp size={18} />} accent="green" />
        <KpiCard label="Average cost per save" value="$186" detail="Offer + contact cost" icon={<WalletCards size={18} />} accent="blue" />
        <KpiCard label="Estimated campaign ROI" value="4.1x" detail="Illustrative portfolio view" icon={<Gauge size={18} />} accent="violet" />
      </div>

      <div className="dashboard-grid">
        <Card title="Churn and save performance" action={<SimulatedBadge />} className="span-2 chart-card">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={churnTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" domain={[0, 2]} />
              <YAxis yAxisId="right" orientation="right" domain={[40, 80]} />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="churn" name="Churn rate %" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="save" name="Save rate %" stroke="#10b981" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="control" name="Control retention %" stroke="#64748b" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Risk distribution" action={<SimulatedBadge />} className="chart-card">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={3}>
                {riskDistribution.map((entry) => <Cell key={entry.name} fill={entry.colour} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="legend-list">
            {riskDistribution.map((item) => <span key={item.name}><i style={{ background: item.colour }} />{item.name}<strong>{item.value.toLocaleString()}</strong></span>)}
          </div>
        </Card>
        <Card title="Save rate by channel" action={<SimulatedBadge />} className="chart-card">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={channelPerformance} layout="vertical" margin={{ left: 15 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="channel" width={88} tick={{ fontSize: 11 }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="save" name="Save rate %" fill="#e31837" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Retention Supervisor Agent" className="span-2 supervisor-card">
          <div className="agent-narrative">
            <div className={`agent-orb ${analysisRun ? 'thinking' : ''}`}><Bot size={26} /></div>
            <div>
              <span className="eyebrow">Executive narrative · illustrative</span>
              <p>“Churn exposure increased this week among customers approaching contract expiry and customers with recent service friction. The most immediate opportunity is the H0 cancel-intent cohort. The largest preventable value pool is the H1 contract-expiry cohort, where proactive renewal and device-upgrade interventions are outperforming generic outreach in the simulated control comparison.”</p>
            </div>
          </div>
          <div className="agent-status-row">
            <span><CheckCircle2 size={15} /> Evidence completeness 91%</span>
            <span><Clock3 size={15} /> Refreshed 10:42 ET</span>
            <span><ShieldCheck size={15} /> Human decision required</span>
          </div>
        </Card>
        <Card title="Prioritized action plan" className="action-plan">
          {[
            'Contact immediate cancel-intent customers.',
            'Proactively engage contract-expiry customers.',
            'Escalate unresolved service-friction cases.',
            'Target overdue-device customers with eligible upgrades.',
            'Review the underperforming generic discount campaign.',
            'Protect high-value customers from offer fatigue.',
          ].map((item, index) => <div key={item}><span>{index + 1}</span><p>{item}</p><ArrowRight size={15} /></div>)}
        </Card>
      </div>
      <AgentWorkflow analysisRun={analysisRun} onRun={onRun} />
    </>
  )
}

function AgentWorkflow({ analysisRun, onRun }: { analysisRun: boolean; onRun: () => void }) {
  return (
    <Card title="Five-agent retention team" action={<button className="button secondary" onClick={onRun}><RefreshCw size={15} /> Run analysis</button>} className="agent-section">
      <div className="workflow-line">
        {['Customer identified', 'Risk scored', 'Risk explained', 'Urgency classified', 'Actions evaluated', 'Human reviews', 'Outcome recorded'].map((step, index) => (
          <div key={step} className={analysisRun ? 'complete' : index === 0 ? 'active' : ''}>
            <span>{analysisRun || index === 0 ? <Check size={13} /> : index + 1}</span><small>{step}</small>
          </div>
        ))}
      </div>
      <div className="agent-grid">
        {agentDefinitions.map((agent, index) => (
          <article key={agent.name} className={`agent-card ${analysisRun ? 'ran' : ''}`} style={{ animationDelay: `${index * 120}ms` }}>
            <div className="agent-card-top">
              <span className="agent-number">{index + 1}</span>
              <span className={`status-dot ${analysisRun ? 'online' : ''}`}>{analysisRun ? 'Complete' : 'Ready'}</span>
            </div>
            <h3>{agent.name}</h3>
            <p>{agent.task}</p>
            <dl>
              <div><dt>Input</dt><dd>{agent.input}</dd></div>
              <div><dt>Output</dt><dd>{analysisRun ? agent.output : 'Awaiting run'}</dd></div>
              <div><dt>Confidence</dt><dd>{analysisRun ? `${agent.confidence}%` : '—'}</dd></div>
              <div><dt>Authority</dt><dd>{agent.authority}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </Card>
  )
}

function RiskQueue({ selected, onSelect }: { selected: Customer; onSelect: (customer: Customer) => void }) {
  const [search, setSearch] = useState('')
  const [urgency, setUrgency] = useState('All')
  const [reason, setReason] = useState('All')
  const [brand, setBrand] = useState('All')
  const [status, setStatus] = useState('All')
  const [sort, setSort] = useState('Highest churn risk')

  const filtered = useMemo(() => {
    const result = customers.filter((customer) =>
      `${customer.name} ${customer.id} ${customer.product}`.toLowerCase().includes(search.toLowerCase()) &&
      (urgency === 'All' || customer.urgency === urgency) &&
      (reason === 'All' || customer.reason === reason) &&
      (brand === 'All' || customer.brand === brand) &&
      (status === 'All' || customer.status === status))
    return [...result].sort((a, b) => {
      if (sort === 'Highest revenue at risk') return b.revenueAtRisk - a.revenueAtRisk
      if (sort === 'Most urgent') return a.urgency.localeCompare(b.urgency)
      if (sort === 'Highest customer lifetime value') return b.clv - a.clv
      if (sort === 'Highest expected save value') return b.expectedSaveValue - a.expectedSaveValue
      if (sort === 'Strongest recommendation confidence') return b.confidence - a.confidence
      return b.risk - a.risk
    })
  }, [search, urgency, reason, brand, status, sort])

  return (
    <>
      <PageHeader eyebrow="Operational work queue" title="Churn Risk Queue" description="Prioritize the right synthetic customer, at the right moment, with a governed next-best action." />
      <div className="urgency-strip">
        {[
          ['H0', '0–7 days', 'Immediate'],
          ['H1', '8–30 days', 'Act now'],
          ['H2', '31–90 days', 'Proactive'],
          ['H3', '91+ days', 'Nurture'],
        ].map(([code, range, label]) => <div key={code}><strong>{code}</strong><span>{range}</span><small>{label}</small></div>)}
      </div>
      <Card className="filter-card">
        <div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search synthetic customers" /></div>
        <FilterSelect label="Urgency" value={urgency} onChange={setUrgency} options={['All', 'H0', 'H1', 'H2', 'H3']} />
        <FilterSelect label="Reason" value={reason} onChange={setReason} options={['All', ...Array.from(new Set(customers.map((item) => item.reason)))]} />
        <FilterSelect label="Brand" value={brand} onChange={setBrand} options={['All', 'Rogers', 'Fido', 'chatr']} />
        <FilterSelect label="Status" value={status} onChange={setStatus} options={['All', ...Array.from(new Set(customers.map((item) => item.status)))]} />
        <FilterSelect label="Sort" value={sort} onChange={setSort} options={['Highest churn risk', 'Highest revenue at risk', 'Most urgent', 'Highest customer lifetime value', 'Highest expected save value', 'Strongest recommendation confidence']} />
      </Card>
      <div className="queue-summary"><span><strong>{filtered.length}</strong> customers shown</span><span><ShieldCheck size={15} /> Control groups protected</span><SimulatedBadge /></div>
      <Card className="table-card">
        <div className="data-table-wrap">
          <table className="data-table queue-table">
            <thead><tr><th>Customer</th><th>Relationship</th><th>Value</th><th>Risk</th><th>Urgency</th><th>Reason</th><th>Next best action</th><th>Status</th><th /></tr></thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className={selected.id === customer.id ? 'selected-row' : ''}>
                  <td><strong>{customer.name}</strong><small>{customer.id} · {customer.brand}</small></td>
                  <td>{customer.product}<small>{customer.region} · {customer.tenure} months</small></td>
                  <td>{formatMoney(customer.mrc)}/mo<small>CLV {formatMoney(customer.clv)}</small></td>
                  <td><span className={`risk-badge ${riskLevel(customer.risk).toLowerCase()}`}>{customer.risk}%</span><small>{customer.percentile}</small></td>
                  <td><span className={`horizon ${customer.urgency.toLowerCase()}`}>{customer.urgency}</span></td>
                  <td>{customer.reason}<small>{customer.secondaryReasons.join(' · ')}</small></td>
                  <td>{customer.status === 'Control group' ? <span className="locked-text"><ShieldCheck size={14} /> No intervention</span> : customer.nextAction}<small>{customer.channel}</small></td>
                  <td><StatusBadge status={customer.status} /></td>
                  <td><button className="icon-button" onClick={() => onSelect(customer)} aria-label={`Open ${customer.name}`}><ChevronRight size={17} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="select-wrap"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label>
  )
}

function StatusBadge({ status }: { status: QueueStatus }) {
  return <span className={`status-badge ${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>
}

function Customer360({ customer, analysisRun, onRun }: { customer: Customer; analysisRun: boolean; onRun: () => void }) {
  const [mode, setMode] = useState<ExplanationMode>('Executive')
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [rescored, setRescored] = useState(false)
  const isSarah = customer.id === 'CTN-8A3F'

  return (
    <>
      <PageHeader
        eyebrow="Customer 360 · Simulated Customer"
        title={customer.name}
        description={`${customer.id} · ${customer.brand} · ${customer.product} · ${customer.region}`}
        actions={
          <>
            <button className="button secondary" onClick={() => setRescored(true)}><RefreshCw size={15} /> {rescored ? 'Re-scored · just now' : 'Event-triggered re-score'}</button>
            <Link className="button primary" to="/assist"><Headphones size={15} /> Open Live Save Assist</Link>
          </>
        }
      />
      <div className="notice-bar"><Info size={17} /><p>{DISCLAIMER}</p></div>
      <div className="profile-hero">
        <div className="customer-avatar">{customer.name.split(' ').map((part) => part[0]).join('')}</div>
        <div><span className="sim-customer">Simulated Customer</span><h2>{customer.name}</h2><p>{isSarah ? 'Current inbound retention call · “My bill keeps going up, my phone is old, and after the service problems last month I’m wondering if I should switch.”' : `${customer.reason} · ${customer.nextAction}`}</p></div>
        <div className="profile-risk"><span>90-day risk</span><strong>{rescored && isSarah ? '38%' : `${customer.risk}%`}</strong><small>{customer.percentile} · {customer.urgency}</small></div>
      </div>
      <div className="profile-grid">
        <Card title="Relationship summary">
          <DescriptionGrid items={[
            ['Products', customer.product],
            ['Monthly spend', `${formatMoney(customer.mrc)} / month`],
            ['Tenure', `${customer.tenure} months`],
            ['Lifetime value', formatMoney(customer.clv)],
            ['Contract position', isSarah ? 'Expires in 12 days' : `${customer.urgency} intervention window`],
            ['Device status', isSarah ? '847 days since upgrade' : customer.secondaryReasons[0]],
            ['Bundle status', customer.product.includes('+') ? 'Converged' : 'Not converged'],
            ['Consent status', 'Assisted care permitted'],
          ]} />
        </Card>
        <Card title="Churn-risk summary">
          <div className="risk-rings">
            {[['30 day', 24], ['60 day', 32], ['90 day', customer.risk]].map(([label, value]) => <div key={label}><div className="mini-ring" style={{ '--value': `${value as number * 3.6}deg` } as React.CSSProperties}><span>{value}%</span></div><small>{label}</small></div>)}
          </div>
          <DescriptionGrid items={[
            ['Risk trend', rescored ? '↑ 7 points from interaction' : '↑ Elevated'],
            ['Confidence', `${customer.confidence}%`],
            ['Model version', 'CHURN-90D-v4.7'],
            ['Last scored', rescored ? 'Just now · event triggered' : 'Today · 10:42 ET'],
          ]} />
        </Card>
        <Card title="Customer value">
          <div className="value-hero"><span>Expected value of save</span><strong>{formatMoney(customer.expectedSaveValue)}</strong><SimulatedBadge /></div>
          <DescriptionGrid items={[
            ['Recurring revenue', `${formatMoney(customer.mrc)} / month`],
            ['Contribution estimate', formatMoney(customer.mrc * 0.42)],
            ['Revenue at risk', formatMoney(customer.revenueAtRisk)],
            ['Acquisition cost avoided', formatMoney(420)],
          ]} />
        </Card>
      </div>
      <Card title="Explainable churn diagnosis" action={<button className="button secondary" onClick={onRun}><BrainCircuit size={15} /> {analysisRun ? 'Analysis complete' : 'Run five-agent analysis'}</button>} className="explanation-card">
        <div className="mode-tabs">
          {(Object.keys(explanationModes) as ExplanationMode[]).map((item) => <button key={item} className={mode === item ? 'active' : ''} onClick={() => setMode(item)}>{item}</button>)}
        </div>
        <div className="explanation-layout">
          <div>
            <span className="eyebrow">Plain-language explanation</span>
            <h3>{isSarah ? 'Risk is driven by a combination—not price alone.' : `${customer.reason} is the primary preventable risk.`}</h3>
            <p>{isSarah ? explanationModes[mode] : `${customer.name}'s illustrative risk is primarily associated with ${customer.reason.toLowerCase()}, supported by ${customer.secondaryReasons.join(' and ').toLowerCase()}. The recommendation remains subject to eligibility and human review.`}</p>
            <div className="reason-stack">
              {(isSarah ? [
                ['1', 'Contract expiry', 'Ends in 12 days · largest contribution'],
                ['2', 'Device overdue', '847 days since last upgrade'],
                ['3', 'Service friction', 'Negative sentiment · three care contacts'],
              ] : [
                ['1', customer.reason, 'Primary elevated-risk signal'],
                ['2', customer.secondaryReasons[0], 'Supporting customer context'],
                ['3', customer.secondaryReasons[1] ?? 'Channel fit', customer.channel],
              ]).map(([number, title, detail]) => <div key={number}><span>{number}</span><p><strong>{title}</strong><small>{detail}</small></p></div>)}
            </div>
          </div>
          <div className="contribution-chart">
            <div className="probability-result"><span>Illustrative probability</span><strong>{customer.risk}%</strong><small>Base 6% + contributions</small></div>
            {contributions.map((item) => (
              <div className="contribution-row" key={item.name}>
                <span>{item.name}</span>
                <div><i className={item.type} style={{ width: `${Math.abs(item.value) * 4.5}%` }} /></div>
                <strong>{item.value > 0 && item.type !== 'base' ? '+' : ''}{item.value} pts</strong>
              </div>
            ))}
            <small className="chart-note">SHAP-inspired illustration; not a live SHAP calculation.</small>
          </div>
        </div>
        <button className="evidence-toggle" onClick={() => setEvidenceOpen(!evidenceOpen)}><FileSearch size={16} /> Supporting evidence and lineage <ChevronDown className={evidenceOpen ? 'rotated' : ''} size={16} /></button>
        {evidenceOpen && <div className="evidence-drawer">
          {[
            ['Observed synthetic signals', 'Contract date, device age, care contacts, bill views, digital activity'],
            ['Model prediction', `${customer.risk}% illustrative 90-day churn probability · ${customer.confidence}% confidence`],
            ['Agent explanation', `${customer.reason}; ${customer.secondaryReasons.join('; ')}`],
            ['Business rules', `${customer.urgency} urgency · eligibility and authority controls`],
            ['Human decision', 'Pending authorized employee review'],
          ].map(([title, text]) => <div key={title}><strong>{title}</strong><p>{text}</p></div>)}
        </div>}
      </Card>
      <Card title="Customer experience timeline" action={<SimulatedBadge />} className="timeline-card">
        <div className="timeline">
          {timeline.map((event) => <div key={event.date + event.title}><span className="timeline-dot" /><time>{event.date}</time><div><strong>{event.title}</strong><p>{event.detail}</p><small>{event.type}</small></div></div>)}
        </div>
      </Card>
    </>
  )
}

function DescriptionGrid({ items }: { items: string[][] }) {
  return <dl className="description-grid">{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
}

function LiveAssist({
  customer,
  offerState,
  setOfferState,
  step,
  setStep,
  outcome,
  recordOutcome,
}: {
  customer: Customer
  offerState: 'none' | 'primary' | 'fallback' | 'approval'
  setOfferState: (state: 'none' | 'primary' | 'fallback' | 'approval') => void
  step: number
  setStep: (step: number) => void
  outcome: Outcome | null
  recordOutcome: (outcome: Outcome) => void
}) {
  const [confirm, setConfirm] = useState<null | 'primary' | 'fallback' | 'approval'>(null)
  const currentMessages = conversationSteps.slice(0, Math.max(1, step))

  const completeAction = () => {
    if (confirm) setOfferState(confirm)
    setConfirm(null)
  }

  return (
    <>
      <PageHeader eyebrow="Frontline retention workspace" title="Live Save Assist" description="Real-time, reason-led assistance with governed offers and the employee in control." actions={<span className="live-indicator"><i /> Live synthetic interaction · 04:12</span>} />
      <div className="assist-grid">
        <Card className="context-column">
          <div className="compact-profile"><div className="customer-avatar small">{customer.name.split(' ').map((part) => part[0]).join('')}</div><div><span className="sim-customer">Simulated</span><h2>{customer.name}</h2><p>{customer.id} · {customer.brand}</p></div></div>
          <div className="context-risk"><span>Churn risk</span><strong>{customer.risk}%</strong><em>{customer.urgency} · {customer.percentile}</em></div>
          <DescriptionGrid items={[
            ['Product', customer.product],
            ['Monthly spend', formatMoney(customer.mrc)],
            ['Contract expiry', customer.id === 'CTN-8A3F' ? '12 days' : customer.urgency],
            ['Device age', customer.id === 'CTN-8A3F' ? '847 days' : 'Review recommended'],
            ['Lifetime value', formatMoney(customer.clv)],
          ]} />
          <h3 className="subheading">Top churn reasons</h3>
          {[customer.reason, ...customer.secondaryReasons].map((reason, index) => <div className="reason-chip" key={reason}><span>{index + 1}</span>{reason}</div>)}
          <Link className="button secondary full" to="/customer"><FileSearch size={15} /> View full explanation</Link>
        </Card>

        <Card className="conversation-column" title="Live conversation" action={<span className="status-pill active"><span /> Coaching active</span>}>
          <div className="transcript">
            {currentMessages.map((message, index) => (
              <div key={index} className={`message ${message.speaker.toLowerCase()}`}>
                <span>{message.speaker}</span><p>{message.text}</p>
              </div>
            ))}
          </div>
          <div className="coaching-prompt"><Lightbulb size={18} /><div><strong>Real-time coaching</strong><p>{conversationSteps[Math.min(step - 1, conversationSteps.length - 1)].coaching}</p></div></div>
          <div className="conversation-actions">
            <button className="button secondary" onClick={() => setStep(Math.max(1, step - 1))} disabled={step <= 1}><ChevronLeft size={15} /> Back</button>
            <span>{step} / {conversationSteps.length}</span>
            <button className="button primary" onClick={() => setStep(Math.min(conversationSteps.length, step + 1))} disabled={step >= conversationSteps.length}>Advance conversation <ChevronRight size={15} /></button>
          </div>
          <div className="guardrails">
            <span><ShieldCheck size={14} /> Do not disclose churn score</span>
            <span><UserCheck size={14} /> Confirm consent before changes</span>
            <span><AlertTriangle size={14} /> Escalate disputed charges</span>
          </div>
        </Card>

        <Card className="recommendation-column">
          <span className="eyebrow">Primary recommendation · 89% confidence</span>
          <h2>Device upgrade + 24-month renewal</h2>
          <p className="recommendation-summary">Acknowledge the recent service experience, then address the overdue device and expiring contract together.</p>
          <div className="offer-bullets">
            {['Eligible premium device upgrade', 'Monthly plan within affordability threshold', 'One-time service-recovery credit', 'Waived activation fee'].map((item) => <span key={item}><CheckCircle2 size={15} /> {item}</span>)}
          </div>
          <div className="offer-metrics">
            <Metric label="Acceptance" value="76%" />
            <Metric label="Retained value" value="$1,760" />
            <Metric label="Offer cost" value="$168" />
            <Metric label="Margin impact" value="-2.8 pts" />
          </div>
          <div className="compliance-row"><BadgeCheck size={17} /><span><strong>Compliant and eligible</strong>Employee confirmation required</span></div>
          {offerState !== 'none' && <div className={`action-result ${offerState}`}><CheckCircle2 size={17} /> {offerState === 'primary' ? 'Primary offer staged for presentation' : offerState === 'fallback' ? 'Fallback selected' : 'Supervisor approval requested'}<small>No account was changed.</small></div>}
          <button className="button primary full" onClick={() => setConfirm('primary')}>Present recommended offer</button>
          <button className="button secondary full" onClick={() => setConfirm('fallback')}>Present fallback</button>
          <div className="button-pair"><button className="button ghost" onClick={() => setOfferState('fallback')}>Modify within authority</button><button className="button ghost" onClick={() => setConfirm('approval')}>Request approval</button></div>
          <div className="button-pair"><Link className="button ghost" to="/offers">Explain recommendation</Link><button className="button ghost" onClick={() => setOfferState('none')}>Decline recommendation</button></div>
        </Card>
      </div>

      <Card title="Record interaction outcome" className="outcome-card" action={<span className="human-required"><UserCheck size={15} /> Human input required</span>}>
        <p>Record what happened to close the simulated learning loop. This does not update a customer account or send any communication.</p>
        <div className="outcome-buttons">
          {(['Accepted', 'Declined', 'Countered', 'Saved', 'Churned'] as Outcome[]).map((item) => <button key={item} className={outcome === item ? 'selected' : ''} onClick={() => recordOutcome(item)}>{outcome === item && <Check size={14} />}{item}</button>)}
        </div>
        {outcome && <div className="outcome-confirmation"><CheckCircle2 size={18} /><span><strong>{outcome} outcome recorded in the synthetic measurement layer.</strong>Audit event EVT-DEMO-1048 created; campaign metrics updated illustratively.</span></div>}
      </Card>

      {confirm && (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirm(null)}>
          <div className="confirm-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setConfirm(null)} aria-label="Close"><X size={18} /></button>
            <div className="modal-icon"><UserCheck size={26} /></div>
            <span className="eyebrow">Human confirmation gate</span>
            <h2>{confirm === 'approval' ? 'Request simulated supervisor approval?' : `Stage the ${confirm} recommendation?`}</h2>
            <p>This is a concept demonstration. No customer communication, account change, discount approval, or transaction will occur.</p>
            <div className="modal-actions"><button className="button secondary" onClick={() => setConfirm(null)}>Cancel</button><button className="button primary" onClick={completeAction}>Confirm simulated action</button></div>
          </div>
        </div>
      )}
    </>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><span>{label}</span><strong>{value}</strong><small>Illustrative</small></div>
}

function OfferIntelligence({ offerState, setOfferState }: { offerState: string; setOfferState: (state: 'none' | 'primary' | 'fallback' | 'approval') => void }) {
  const [tab, setTab] = useState<'ranked' | 'library' | 'excluded'>('ranked')
  const ranked = [...offers].sort((a, b) => b.fit - a.fit)
  return (
    <>
      <PageHeader eyebrow="Governed offer management" title="Offer Intelligence" description="Rank one primary action and one fallback using reason fit, eligibility, expected value, margin, and compliance." />
      <div className="segmented-tabs">
        <button className={tab === 'ranked' ? 'active' : ''} onClick={() => setTab('ranked')}>Next-best action</button>
        <button className={tab === 'library' ? 'active' : ''} onClick={() => setTab('library')}>Offer library</button>
        <button className={tab === 'excluded' ? 'active' : ''} onClick={() => setTab('excluded')}>Excluded offers <span>9</span></button>
      </div>
      {tab === 'ranked' && (
        <>
          <div className="offer-comparison">
            {ranked.slice(0, 2).map((offer, index) => (
              <Card key={offer.id} className={`ranked-offer ${index === 0 ? 'primary-offer' : ''}`}>
                <div className="offer-rank"><span>{index === 0 ? 'Recommended' : 'Fallback'}</span><strong>#{index + 1}</strong></div>
                <h2>{offer.name}</h2><p>{offer.description}</p>
                <div className="fit-score"><span>Reason fit</span><strong>{offer.fit}%</strong><div><i style={{ width: `${offer.fit}%` }} /></div></div>
                <div className="offer-metrics">
                  <Metric label="Acceptance" value={`${offer.acceptance}%`} />
                  <Metric label="Save probability" value={`${offer.saveRate}%`} />
                  <Metric label="Retained value" value={formatMoney(offer.retainedValue)} />
                  <Metric label="Offer cost" value={formatMoney(offer.cost)} />
                </div>
                <DescriptionGrid items={[
                  ['Reasons addressed', offer.reasons.join(', ')],
                  ['Approval', offer.approval],
                  ['Margin floor', offer.marginFloor],
                  ['Compliance', offer.compliance],
                ]} />
                <button className={`button full ${index === 0 ? 'primary' : 'secondary'}`} onClick={() => setOfferState(index === 0 ? 'primary' : 'fallback')}>{offerState === (index === 0 ? 'primary' : 'fallback') ? <><Check size={15} /> Selected</> : `Select ${index === 0 ? 'recommendation' : 'fallback'}`}</button>
              </Card>
            ))}
          </div>
          <Card title="How the recommendation was ranked" className="ranking-card">
            {[
              ['Churn-reason fit', 96, 'Contract expiry + device overdue + service friction'],
              ['Predicted acceptance', 76, 'Strong for inbound assisted channel'],
              ['Expected retained value', 88, '$1,760 after illustrative costs'],
              ['Customer preference fit', 84, 'Recent device-upgrade page visits'],
              ['Channel fit', 92, 'Current inbound retention call'],
              ['Compliance and eligibility', 100, 'Approved catalogue and authority limits'],
            ].map(([label, score, text]) => <div className="ranking-row" key={label as string}><span>{label}</span><div><i style={{ width: `${score}%` }} /></div><strong>{score}%</strong><small>{text}</small></div>)}
          </Card>
        </>
      )}
      {tab === 'library' && <OfferLibrary />}
      {tab === 'excluded' && <ExcludedOffers />}
    </>
  )
}

function OfferLibrary() {
  return (
    <Card className="table-card">
      <div className="data-table-wrap">
        <table className="data-table offer-table">
          <thead><tr><th>Offer</th><th>Reasons / products</th><th>Governance</th><th>Performance</th><th>Status</th></tr></thead>
          <tbody>{offers.map((offer) => <tr key={offer.id}>
            <td><strong>{offer.name}</strong><small>{offer.id} · v{offer.version}</small><p>{offer.description}</p></td>
            <td>{offer.reasons.join(', ')}<small>{offer.products} · {offer.brands}</small></td>
            <td>{offer.approval}<small>Margin {offer.marginFloor} · cooldown {offer.cooldown}</small></td>
            <td>{offer.acceptance}% acceptance<small>{offer.saveRate}% save · {formatMoney(offer.costPerSave)} / save</small></td>
            <td><span className={`status-badge ${offer.status.toLowerCase().replaceAll(' ', '-')}`}>{offer.status}</span><small>{offer.compliance}</small></td>
          </tr>)}</tbody>
        </table>
      </div>
    </Card>
  )
}

function ExcludedOffers() {
  const exclusions = [
    ['Ignite bundle', 'Product mismatch', 'Sarah does not currently have an eligible home-services footprint.'],
    ['Home Internet bundle', 'Channel rule', 'Requires a separate needs assessment and explicit cross-sell consent.'],
    ['Premium support', 'Offer status', 'Under review; unapproved offers cannot be presented.'],
    ['Family-line incentive', 'Product mismatch', 'No family-line intent detected in the current interaction.'],
    ['Roaming benefit', 'Reason fit', 'No qualifying travel need or roaming friction signal.'],
    ['Loyalty reward', 'Cooldown', 'A synthetic loyalty benefit was applied within the 365-day cooldown.'],
    ['Data bonus', 'Low expected value', 'Does not address the overdue device or service concern.'],
    ['Plan right-sizing', 'Fallback only', 'Eligible, but lower predicted acceptance than the primary action.'],
    ['Technical resolution callback', 'Component action', 'Included as service follow-up, not ranked as the primary commercial save.'],
  ]
  return <Card title="Excluded interventions" className="excluded-list">{exclusions.map(([name, rule, detail]) => <div key={name}><X size={17} /><span><strong>{name}</strong><em>{rule}</em><p>{detail}</p></span></div>)}</Card>
}

function DecisionTrace({ outcome }: { outcome: Outcome | null }) {
  const [expanded, setExpanded] = useState('Model card')
  const metadata = [
    ['Model card', 'CHURN-90D-v4.7 · approved for synthetic demonstration · calibration 0.94 · drift stable'],
    ['Prompt version', 'EXPLAIN-v2.8 and CONVERSATION-v3.1 · approved content templates'],
    ['Agent version', 'Retention agent team release 1.6.0'],
    ['Offer version', 'Offer catalogue v6.1 · device renewal offer v4.2'],
    ['Policy version', 'Eligibility v5.3 · authority v2.7 · control protection v1.9'],
    ['Input lineage', 'Synthetic CRM, billing, device, network, care, sentiment, and digital event domains'],
    ['Data freshness', 'Interaction real-time · billing T-1 · device T-1 · network 15 minutes'],
    ['Audit event ID', outcome ? 'EVT-DEMO-1048 · outcome appended' : 'EVT-DEMO-1047 · recommendation created'],
  ]
  return (
    <>
      <PageHeader eyebrow="Auditable recommendation record" title="Agent Decision Trace" description="Inspect concise decisions, evidence, policies, and human involvement—without exposing hidden prompts or chain-of-thought." actions={<span className="status-pill active"><span /> Audit complete</span>} />
      <div className="trace-summary">
        <div><Bot size={21} /><span><strong>5 agents</strong>Orchestrated</span></div>
        <div><Database size={21} /><span><strong>8 sources</strong>Synthetic lineage</span></div>
        <div><ShieldCheck size={21} /><span><strong>7 policies</strong>Applied</span></div>
        <div><UserCheck size={21} /><span><strong>1 gate</strong>Human decision</span></div>
      </div>
      <Card className="trace-card">
        <div className="trace-list">
          {auditSteps.map((row, index) => {
            const displayRow = index === auditSteps.length - 1 && outcome ? [new Date().toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }), row[1], row[2], `${outcome} outcome recorded`, '100%', row[5], 'Employee confirmed', row[7], 'Complete'] : row
            return <div className="trace-row" key={index}>
              <span className={`trace-index ${displayRow[8] === 'Open' ? 'open' : ''}`}>{displayRow[8] === 'Open' ? <Clock3 size={15} /> : <Check size={15} />}</span>
              <time>{displayRow[0]}</time>
              <div className="trace-main"><strong>{index + 1}. {displayRow[3]}</strong><span>{displayRow[1]} · {displayRow[2]}</span></div>
              <div><small>Confidence</small><strong>{displayRow[4]}</strong></div>
              <div><small>Policy</small><strong>{displayRow[5]}</strong></div>
              <div><small>Human involvement</small><strong>{displayRow[6]}</strong></div>
              <div><small>Evidence</small><strong>{displayRow[7]}</strong></div>
            </div>
          })}
        </div>
      </Card>
      <Card title="Technical and governance evidence">
        <div className="accordion">
          {metadata.map(([title, detail]) => <div key={title}><button onClick={() => setExpanded(expanded === title ? '' : title)}><span>{title}</span><ChevronDown className={expanded === title ? 'rotated' : ''} size={16} /></button>{expanded === title && <p>{detail}</p>}</div>)}
        </div>
      </Card>
    </>
  )
}

function Performance({ adjustment }: { adjustment: number }) {
  const [channel, setChannel] = useState('All channels')
  return (
    <>
      <PageHeader eyebrow="Closed-loop measurement" title="Campaign and Cohort Performance" description="Measure incremental retention—not just gross save rate—across churn reasons, cohorts, channels, and governed interventions." />
      <Card className="filter-card compact">
        <FilterSelect label="Channel" value={channel} onChange={setChannel} options={['All channels', 'Save desk', 'Inbound care', 'Outbound', 'Digital']} />
        <FilterSelect label="Urgency" value="All horizons" onChange={() => undefined} options={['All horizons', 'H0', 'H1', 'H2', 'H3']} />
        <FilterSelect label="Product" value="All products" onChange={() => undefined} options={['All products', 'Wireless', 'Internet', 'Converged']} />
        <FilterSelect label="Period" value="Last 30 days" onChange={() => undefined} options={['Last 30 days', 'Last 90 days', 'Year to date']} />
      </Card>
      {adjustment > 0 && <div className="success-banner"><CheckCircle2 size={18} /> Synthetic outcome from Live Save Assist has been added to the Immediate save desk campaign.</div>}
      <div className="performance-kpis">
        <KpiCard label="Incremental saves" value={(11770 + adjustment).toLocaleString()} detail="Above natural retention" icon={<HeartHandshake size={18} />} accent="green" />
        <KpiCard label="Revenue retained" value="$23.4M" detail="Gross illustrative value" icon={<CircleDollarSign size={18} />} accent="blue" />
        <KpiCard label="Weighted retention lift" value="+12.6 pts" detail="Versus control groups" icon={<TrendingUp size={18} />} accent="green" />
        <KpiCard label="Portfolio ROI" value="4.1x" detail="After offer + contact cost" icon={<Gauge size={18} />} accent="violet" />
      </div>
      <div className="dashboard-grid">
        <Card title="Intervention vs natural retention" className="span-2 chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaigns}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-12} height={70} />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Bar dataKey="natural" name="Natural retention %" fill="#64748b" radius={[5, 5, 0, 0]} />
              <Bar dataKey="intervention" name="Intervention save %" fill="#e31837" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Revenue retained by campaign" className="chart-card">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={campaigns}>
              <defs><linearGradient id="retainedFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.65}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0.03}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="retained" name="Revenue retained $M" stroke="#3b82f6" fill="url(#retainedFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="table-card" title="Campaign scorecard" action={<SimulatedBadge />}>
        <div className="data-table-wrap"><table className="data-table">
          <thead><tr><th>Campaign</th><th>Funnel</th><th>Control</th><th>Retention</th><th>Lift</th><th>Financial outcome</th></tr></thead>
          <tbody>{campaigns.map((campaign) => <tr key={campaign.name}>
            <td><strong>{campaign.name}</strong></td>
            <td>{campaign.eligible.toLocaleString()} eligible<small>{campaign.contacted.toLocaleString()} contacted · {campaign.accepted.toLocaleString()} accepted</small></td>
            <td>{campaign.control.toLocaleString()} customers<small>Protected holdout</small></td>
            <td>{campaign.intervention}% intervention<small>{campaign.natural}% natural</small></td>
            <td><span className="positive">+{campaign.lift} pts</span><small>{campaign.saved + (campaign.name === 'Immediate save desk' ? adjustment : 0)} saved</small></td>
            <td>{formatMoney(campaign.retained * 1_000_000, true)} retained<small>{formatMoney(campaign.cost * 1_000_000, true)} cost · {campaign.roi}x ROI</small></td>
          </tr>)}</tbody>
        </table></div>
      </Card>
    </>
  )
}

interface RoiInputs {
  scored: number
  highRisk: number
  baseline: number
  contactRate: number
  presentationRate: number
  acceptanceRate: number
  incrementalSave: number
  mrr: number
  retainedMonths: number
  offerCost: number
  contactCost: number
  platformCost: number
  investment: number
}

const roiScenarios: Record<string, RoiInputs> = {
  Conservative: { scored: 124800, highRisk: 8460, baseline: 22, contactRate: 52, presentationRate: 62, acceptanceRate: 48, incrementalSave: 28, mrr: 91, retainedMonths: 14, offerCost: 210, contactCost: 18, platformCost: 420000, investment: 2800000 },
  Base: { scored: 124800, highRisk: 8460, baseline: 22, contactRate: 64, presentationRate: 72, acceptanceRate: 58, incrementalSave: 36, mrr: 98, retainedMonths: 18, offerCost: 186, contactCost: 16, platformCost: 420000, investment: 2800000 },
  Upside: { scored: 124800, highRisk: 8460, baseline: 22, contactRate: 72, presentationRate: 78, acceptanceRate: 66, incrementalSave: 43, mrr: 104, retainedMonths: 22, offerCost: 172, contactCost: 14, platformCost: 420000, investment: 2800000 },
}

function RoiCalculator() {
  const [scenario, setScenario] = useState('Base')
  const [inputs, setInputs] = useState<RoiInputs>(roiScenarios.Base)
  const reached = inputs.highRisk * inputs.contactRate / 100
  const presented = reached * inputs.presentationRate / 100
  const accepting = presented * inputs.acceptanceRate / 100
  const saves = accepting * inputs.incrementalSave / 100
  const atRisk = inputs.highRisk * inputs.mrr * 12
  const gross = saves * inputs.mrr * inputs.retainedMonths
  const retentionCost = saves * inputs.offerCost
  const contactTotal = reached * inputs.contactCost
  const net = gross - retentionCost - contactTotal - inputs.platformCost
  const roi = net / inputs.investment
  const monthlyNet = net / Math.max(inputs.retainedMonths, 1)
  const payback = inputs.investment / Math.max(monthlyNet, 1)

  const chooseScenario = (next: string) => {
    setScenario(next)
    setInputs(roiScenarios[next])
  }

  return (
    <>
      <PageHeader eyebrow="Illustrative value modelling" title="Retention ROI" description="Adjust assumptions, compare scenarios, and inspect the formulas behind the estimated business value." />
      <div className="notice-bar"><Info size={17} /><p>{DISCLAIMER} Results are not guaranteed and are not Rogers commitments.</p></div>
      <div className="scenario-tabs">{Object.keys(roiScenarios).map((item) => <button key={item} className={scenario === item ? 'active' : ''} onClick={() => chooseScenario(item)}>{item}<small>{item === 'Conservative' ? 'Lower reach and lift' : item === 'Base' ? 'Planning illustration' : 'Stronger adoption and lift'}</small></button>)}</div>
      <div className="roi-layout">
        <Card title="Editable assumptions" className="roi-inputs">
          {[
            ['scored', 'Customers scored', '', 1000],
            ['highRisk', 'High-risk population', '', 100],
            ['baseline', 'Baseline churn rate', '%', 1],
            ['contactRate', 'Contact rate', '%', 1],
            ['presentationRate', 'Offer presentation rate', '%', 1],
            ['acceptanceRate', 'Offer acceptance rate', '%', 1],
            ['incrementalSave', 'Incremental save rate', '%', 1],
            ['mrr', 'Average monthly recurring revenue', '$', 1],
            ['retainedMonths', 'Average retained months', ' months', 1],
            ['offerCost', 'Average offer cost', '$', 1],
            ['contactCost', 'Cost per contact', '$', 1],
            ['platformCost', 'Platform operating cost', '$', 10000],
            ['investment', 'Implementation investment', '$', 100000],
          ].map(([key, label, suffix, step]) => <label className="roi-input" key={key as string}><span>{label}<small>Illustrative</small></span><div>{suffix === '$' && <em>$</em>}<input type="number" step={step as number} value={inputs[key as keyof RoiInputs]} onChange={(event) => setInputs({ ...inputs, [key]: Number(event.target.value) })} />{suffix !== '$' && <em>{suffix}</em>}</div></label>)}
        </Card>
        <div className="roi-results">
          <div className="roi-hero">
            <span>Estimated ROI</span><strong>{roi.toFixed(2)}x</strong><small>{scenario} illustrative scenario</small>
            <div className="roi-hero-grid"><div><span>Net retained value</span><strong>{formatMoney(net, true)}</strong></div><div><span>Payback</span><strong>{payback.toFixed(1)} mo</strong></div></div>
          </div>
          <div className="roi-kpis">
            <Metric label="At-risk revenue" value={formatMoney(atRisk, true)} />
            <Metric label="Customers reached" value={Math.round(reached).toLocaleString()} />
            <Metric label="Offers presented" value={Math.round(presented).toLocaleString()} />
            <Metric label="Customers accepting" value={Math.round(accepting).toLocaleString()} />
            <Metric label="Incremental saves" value={Math.round(saves).toLocaleString()} />
            <Metric label="Gross retained revenue" value={formatMoney(gross, true)} />
          </div>
          <Card title="Calculation flow" className="formula-card">
            {[
              ['At-risk revenue', 'High-risk customers × MRR × 12', atRisk],
              ['Customers reached', 'High-risk customers × contact rate', reached],
              ['Offers presented', 'Customers reached × presentation rate', presented],
              ['Customers accepting', 'Offers presented × acceptance rate', accepting],
              ['Incremental saves', 'Customers accepting × incremental save rate', saves],
              ['Gross retained revenue', 'Incremental saves × MRR × retained months', gross],
              ['Retention cost', 'Incremental saves × average offer cost', retentionCost],
              ['Contact cost', 'Customers reached × cost per contact', contactTotal],
              ['Net retained value', 'Gross value − retention − contact − platform cost', net],
            ].map(([label, formula, result]) => <div key={label as string}><span><strong>{label}</strong><small>{formula}</small></span><b>{typeof result === 'number' && label.toString().includes('customer') ? Math.round(result).toLocaleString() : formatMoney(result as number, true)}</b></div>)}
          </Card>
        </div>
      </div>
    </>
  )
}

function Walkthrough({ step, setStep, playing, setPlaying }: { step: number; setStep: (step: number) => void; playing: boolean; setPlaying: (playing: boolean) => void }) {
  const navigate = useNavigate()
  const current = walkthrough[step]
  const updateStep = (next: number) => {
    const bounded = Math.max(0, Math.min(walkthrough.length - 1, next))
    setStep(bounded)
  }
  return (
    <div className="walkthrough-page">
      <div className="walkthrough-top">
        <span className="eyebrow">Executive Walkthrough · Step {step + 1} of {walkthrough.length}</span>
        <div className="walkthrough-controls">
          <button className="button ghost" onClick={() => updateStep(0)}><RotateCcw size={15} /> Restart</button>
          <button className="button secondary" onClick={() => setPlaying(!playing)}>{playing ? <><Pause size={15} /> Pause</> : <><Play size={15} /> Auto Play</>}</button>
          <button className="button ghost" onClick={() => navigate('/')}><X size={15} /> Exit</button>
        </div>
      </div>
      <div className="walkthrough-progress">{walkthrough.map((_, index) => <button key={index} className={index === step ? 'active' : index < step ? 'complete' : ''} onClick={() => updateStep(index)} aria-label={`Go to step ${index + 1}`} />)}</div>
      <div className="walkthrough-stage">
        <div className="walkthrough-copy">
          <span className="step-number">0{step + 1}</span>
          <span className="focus-label"><Target size={15} /> Focus: {current.focus}</span>
          <h1>{current.title}</h1>
          <p>“{current.text}”</p>
          {step === walkthrough.length - 1 && <blockquote>Predict the risk. Explain the reason. Recommend the action. Help the employee. Measure the save.</blockquote>}
          <div className="walkthrough-nav">
            <button className="button secondary" disabled={step === 0} onClick={() => updateStep(step - 1)}><ChevronLeft size={16} /> Back</button>
            {step < walkthrough.length - 1 ? <button className="button primary" onClick={() => updateStep(step + 1)}>Next <ChevronRight size={16} /></button> : <button className="button primary" onClick={() => navigate('/')}><Check size={16} /> Finish</button>}
          </div>
        </div>
        <div className="walkthrough-visual">
          <WalkthroughVisual step={step} />
        </div>
      </div>
      <div className="walkthrough-disclaimer"><Info size={16} /><p>{DISCLAIMER}</p></div>
    </div>
  )
}

function WalkthroughVisual({ step }: { step: number }) {
  const icons = [AlertTriangle, Zap, BrainCircuit, Clock3, Target, UserCheck, MessageSquareText, Database, TrendingUp, Layers3]
  const Icon = icons[step]
  return (
    <div className={`walkthrough-art art-${step}`}>
      <div className="art-orb"><Icon size={42} /></div>
      <div className="art-panel">
        <span>Retention Intelligence</span>
        <strong>{walkthrough[step].focus}</strong>
        <div className="art-bars"><i /><i /><i /></div>
      </div>
      <div className="art-card one"><CheckCircle2 size={18} /><span>Explainable</span></div>
      <div className="art-card two"><ShieldCheck size={18} /><span>Governed</span></div>
      <div className="art-card three"><TrendingUp size={18} /><span>Measurable</span></div>
    </div>
  )
}

function Architecture() {
  const [selectedLayer, setSelectedLayer] = useState('Agent and reasoning')
  const layers = [
    ['Experience', ['Contact-centre desktop', 'Dynamics 365 option', 'Digital save journeys', 'MyRogers option', 'Supervisor workspace', 'Power BI', 'Teams alerts']],
    ['Agent and reasoning', ['Microsoft Foundry', 'Azure OpenAI', 'Five retention agents', 'Tool and API calling', 'Evaluation and observability', 'Human approval workflows']],
    ['Data and intelligence', ['Microsoft Fabric', 'OneLake', 'Real-Time Intelligence', 'Eventstreams', 'Azure Machine Learning', 'Churn + value models', 'Azure AI Search']],
    ['Proposed source integrations', ['CRM', 'Billing', 'Subscriber master', 'Contract + device lifecycle', 'Usage + network quality', 'Care interactions', 'Digital analytics', 'Consent + preferences']],
    ['Activation', ['Contact-centre desktop', 'CRM task', 'Outbound queue', 'Digital journey', 'SMS and email options', 'Supervisor approval', 'Outcome write-back']],
    ['Integration', ['Azure API Management', 'Azure Functions', 'Logic Apps', 'Event Hubs', 'Secure batch + streaming', 'Enterprise integration services', 'TM Forum APIs']],
    ['Security and governance', ['Microsoft Entra ID', 'Managed identities', 'RBAC', 'Key Vault', 'Purview', 'Defender for Cloud', 'Azure Monitor', 'PII masking + audit']],
  ]
  return (
    <>
      <PageHeader eyebrow="Proposed Microsoft architecture" title="A governed, event-driven retention platform" description="A conceptual reference architecture subject to Rogers architecture, security, privacy, procurement, and integration approval." actions={<span className="proposal-badge">Proposed—not implemented</span>} />
      <div className="notice-bar"><Info size={17} /><p>{DISCLAIMER} Every connector and integration shown is conceptual and subject to Rogers approval.</p></div>
      <div className="architecture-flow">
        {['Customer signals', 'Fabric + OneLake', 'Features + models', 'Explainability', 'Agent orchestration', 'Eligible actions', 'Human decision', 'Interaction', 'Outcome + learning'].map((item, index) => <div key={item}><span>{index + 1}</span><small>{item}</small>{index < 8 && <ArrowRight size={15} />}</div>)}
      </div>
      <div className="architecture-layout">
        <div className="layer-nav">
          {layers.map(([name], index) => <button key={name as string} className={selectedLayer === name ? 'active' : ''} onClick={() => setSelectedLayer(name as string)}><span>{index + 1}</span>{name as string}<ChevronRight size={15} /></button>)}
        </div>
        <Card className="architecture-detail">
          <div className="architecture-heading"><div><span className="eyebrow">Selected architecture layer</span><h2>{selectedLayer}</h2></div><ArchitectureIcon layer={selectedLayer} /></div>
          <div className="service-grid">{(layers.find(([name]) => name === selectedLayer)?.[1] as string[]).map((service) => <div key={service}><CheckCircle2 size={16} /><span>{service}</span><small>Conceptual component</small></div>)}</div>
          <div className="architecture-note"><ShieldCheck size={18} /><p><strong>Design principle:</strong> Agents recommend and orchestrate. Existing approved enterprise systems would execute only after authorization, policy checks, and human confirmation.</p></div>
        </Card>
      </div>
      <Card title="Proposed implementation roadmap" action={<span className="proposal-badge">Sequence, not commitment</span>}>
        <div className="roadmap">
          {[
            ['01', 'Explainable foundation', 'Increase scoring frequency · event-triggered scoring · customer explanations · urgency · model monitoring'],
            ['02', 'Governed offer decisioning', 'Approved catalogue · eligibility · margin floors · cooldowns · budget controls · frontline integration'],
            ['03', 'Closed-loop measurement', 'Holdouts · defined outcomes · lift over control · cost per save · reason and channel analysis'],
            ['04', 'Continuous optimisation', 'Outcome feedback · offer re-ranking · drift detection · allocation optimization · channel expansion'],
          ].map(([number, title, detail]) => <div key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p></div>)}
        </div>
      </Card>
    </>
  )
}

function ArchitectureIcon({ layer }: { layer: string }) {
  const icons: Record<string, ReactNode> = {
    Experience: <BriefcaseBusiness size={30} />,
    'Agent and reasoning': <BrainCircuit size={30} />,
    'Data and intelligence': <Database size={30} />,
    'Proposed source integrations': <Building2 size={30} />,
    Activation: <Zap size={30} />,
    Integration: <GitBranch size={30} />,
    'Security and governance': <ShieldCheck size={30} />,
  }
  return <div className="architecture-icon">{icons[layer]}</div>
}

function Governance() {
  const [reasonOpen, setReasonOpen] = useState(false)
  const controls = [
    ['Model version', 'CHURN-90D-v4.7', 'Approved'],
    ['Feature freshness', '98.7% within SLA', 'Healthy'],
    ['Drift status', 'Stable · PSI 0.08', 'Healthy'],
    ['Agent version', 'Retention team 1.6.0', 'Approved'],
    ['Prompt version', 'Explain 2.8 · Conversation 3.1', 'Approved'],
    ['Offer version', 'Catalogue 6.1', 'Approved'],
    ['Policy version', 'Eligibility 5.3 · Authority 2.7', 'Active'],
    ['Data classification', 'Confidential customer data', 'Controlled'],
    ['Consent status', 'Assisted care permitted', 'Verified'],
    ['Permitted purpose', 'Customer retention assistance', 'Verified'],
    ['Evidence completeness', '96%', 'Healthy'],
    ['Recommendation confidence', '89%', 'Reviewable'],
    ['Control-group protection', 'Enforced', 'Active'],
    ['Policy violation rate', '0.0%', 'Healthy'],
    ['Override rate', '7.8%', 'Monitored'],
    ['Agent latency', '1.8 seconds', 'Within SLA'],
  ]
  return (
    <>
      <PageHeader eyebrow="Responsible AI and operating controls" title="Governance and Controls" description="Make every recommendation inspectable, authorized, policy-compliant, and subject to accountable human judgement." />
      <div className="governance-principle"><ShieldCheck size={28} /><div><span className="eyebrow">Primary operating principle</span><h2>Agents recommend. Authorized Rogers employees decide.</h2><p>No customer-impacting action occurs autonomously in this concept demonstration.</p></div></div>
      <div className="control-grid">{controls.map(([label, value, status]) => <article key={label}><div><span>{label}</span><strong>{value}</strong></div><em className={status === 'Reviewable' ? 'review' : ''}><CheckCircle2 size={13} />{status}</em></article>)}</div>
      <div className="governance-layout">
        <Card title="Authority model">
          <div className="authority-flow">
            {[
              ['Observe', 'Read signals and customer context.', Activity],
              ['Explain', 'Describe risk and contributing factors.', FileSearch],
              ['Recommend', 'Recommend an eligible action and talk track.', Sparkles],
              ['Approve', 'Human selects and confirms authority.', UserCheck],
              ['Execute', 'Approved enterprise system performs transaction.', Zap],
              ['Learn', 'Outcome feeds future evaluation.', TrendingUp],
            ].map(([title, text, Icon], index) => {
              const AuthorityIcon = Icon as typeof Activity
              return <div key={title as string}><span><AuthorityIcon size={18} /></span><p><strong>{title as string}</strong><small>{text as string}</small></p>{index < 5 && <ArrowRight size={15} />}</div>
            })}
          </div>
        </Card>
        <Card title="Operating principles" className="principles">
          {[
            'No unapproved offer may be presented.',
            'Eligibility, margin, cooldown, and authority rules are enforced.',
            'Control-group customers do not receive interventions.',
            'Least privilege, masking, consent, and permitted purpose apply.',
            'Protected characteristics are not used for discriminatory treatment.',
            'Low-confidence recommendations are routed for review.',
            'Every recommendation has an inspectable explanation.',
            'Employees can override with a recorded reason.',
            'Financial estimates remain visibly illustrative.',
            'Models, agents, and offers are monitored for drift and bias.',
          ].map((item, index) => <div key={item}><span>{index + 1}</span><p>{item}</p></div>)}
        </Card>
      </div>
      <Card title="Churn reason-code governance" action={<button className="button secondary" onClick={() => setReasonOpen(!reasonOpen)}><SlidersHorizontal size={15} /> {reasonOpen ? 'Collapse catalogue' : 'Open reason catalogue'}</button>}>
        <p className="section-intro">Standard reason codes connect model explanations to operational action, channel strategy, approvals, and measurement.</p>
        {reasonOpen && <div className="data-table-wrap"><table className="data-table reason-table"><thead><tr><th>Code</th><th>Description</th><th>Horizon / signals</th><th>Intervention</th><th>Risk / control</th></tr></thead><tbody>{reasonCodes.map((row) => <tr key={row[0]}><td><strong>{row[0]}</strong><small>{row[1]}</small></td><td>{row[2]}</td><td>{row[3]}<small>{row[4]}</small></td><td>{row[5]}<small>{row[6]}</small></td><td>{row[7]}<small>{row[8]} confidence · {row[9]}</small></td></tr>)}</tbody></table></div>}
      </Card>
      <Card title="About this demonstration" className="about-card">
        <Info size={22} /><div><p>{DISCLAIMER}</p><strong>No live integrations · no real customers · no autonomous decisions · no guaranteed outcomes</strong></div>
      </Card>
    </>
  )
}

export default App

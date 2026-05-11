import { useRef, useEffect, useState } from 'react'
import { SectionHeading } from './About'
import { ChevronRightIcon, GithubMarkIcon, SparkleIcon } from './Icons'
import { trackEvent } from '../lib/analytics'
import mazeGif from '../assets/demo.gif'

function formatHost(url) {
  if (!url) return 'local-preview'
  try {
    return new URL(url).host
  } catch {
    return 'live-preview'
  }
}

const IFRAME_W = 1200

function ProjectPreview({ url, title, forceDark = false }) {
  const containerRef = useRef(null)
  const [scale, setScale] = useState(0.37)
  const [iframeH, setIframeH] = useState(703)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      const s = width / IFRAME_W
      setScale(s)
      setIframeH(height / s)
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [])

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative flex-1 min-h-[210px] overflow-hidden group/preview"
      onClick={() => trackEvent('project_live_demo_click', { project: title, source: 'iframe_preview' })}
    >
      <div ref={containerRef} className="absolute inset-0">
        <iframe
          src={url}
          title={`${title} live preview`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${IFRAME_W}px`,
            height: `${iframeH}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            border: 'none',
            pointerEvents: 'none',
            colorScheme: forceDark ? 'dark' : undefined,
          }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/50 transition-colors duration-200 flex items-center justify-center">
        <span className="opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 px-3 py-1.5 text-xs font-semibold bg-cyan-500 text-slate-950 rounded-md">
          Open Live Demo
        </span>
      </div>
    </a>
  )
}

const PROXY_POOL = [
  { tag: 'GET',     url: 'http://example.com/index.html',        ms: 142,  type: 'hit'    },
  { tag: 'CONNECT', url: 'api.github.com:443',                   ms: 23,   type: 'tunnel' },
  { tag: 'GET',     url: 'http://cdn.jquery.com/jquery.min.js',  ms: 312,  type: 'miss'   },
  { tag: 'BLOCK',   url: 'http://malicious-ads.net/',            ms: 0,    type: 'block'  },
  { tag: 'GET',     url: 'http://news.ycombinator.com/',         ms: 89,   type: 'hit'    },
  { tag: 'CONNECT', url: 'www.google.com:443',                   ms: 18,   type: 'tunnel' },
  { tag: 'GET',     url: 'http://example.com/style.css',         ms: 56,   type: 'hit'    },
  { tag: 'BLOCK',   url: 'http://doubleclick.net/ads',           ms: 0,    type: 'block'  },
  { tag: 'GET',     url: 'http://httpbin.org/get',               ms: 287,  type: 'miss'   },
  { tag: 'CONNECT', url: 'github.com:443',                       ms: 31,   type: 'tunnel' },
  { tag: 'GET',     url: 'http://old-api.example.com/data',      ms: 44,   type: 'hit'    },
  { tag: 'BLOCK',   url: 'http://tracker.spy.com/pixel.gif',    ms: 0,    type: 'block'  },
]
const DELAYS = [380, 550, 300, 420, 480, 250, 360, 500, 280, 600, 420, 340]
const TAG_COLOR = { GET: 'text-cyan-400', CONNECT: 'text-violet-400', BLOCK: 'text-rose-400' }
const BADGE = {
  hit:    { label: 'HIT',  cls: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  miss:   { label: 'MISS', cls: 'text-amber-400   border-amber-500/30   bg-amber-500/10'   },
  tunnel: { label: 'TUN',  cls: 'text-violet-400  border-violet-500/30  bg-violet-500/10'  },
  block:  { label: 'BAN',  cls: 'text-rose-400    border-rose-500/30    bg-rose-500/10'    },
}

// ── DBMS Demo ────────────────────────────────────────────────────────────────
const SQL_SEQUENCE = [
  { type: 'query', text: 'SELECT team_name, wins, losses FROM TeamWinLoss ORDER BY wins DESC LIMIT 4;' },
  { type: 'row',   cols: ['FaZe Clan',    '24', '6'],  widths: ['flex-1','w-8','w-8'], colors: ['text-white','text-emerald-400','text-rose-400'] },
  { type: 'row',   cols: ['Team Liquid',  '21', '9'],  widths: ['flex-1','w-8','w-8'], colors: ['text-white','text-emerald-400','text-rose-400'] },
  { type: 'row',   cols: ['Cloud9',       '18', '12'], widths: ['flex-1','w-8','w-8'], colors: ['text-white','text-emerald-400','text-rose-400'] },
  { type: 'row',   cols: ['NaVi',         '17', '13'], widths: ['flex-1','w-8','w-8'], colors: ['text-white','text-emerald-400','text-rose-400'] },
  { type: 'ok',    text: '4 rows in set (0.003 sec)' },
  { type: 'gap' },
  { type: 'query', text: 'SELECT alias, PlayerKDA(player_id) AS kda FROM Player ORDER BY kda DESC LIMIT 3;' },
  { type: 'row',   cols: ['s1mple',  '4.82'], widths: ['flex-1','w-16'], colors: ['text-white','text-cyan-400'] },
  { type: 'row',   cols: ['ZywOo',   '4.31'], widths: ['flex-1','w-16'], colors: ['text-white','text-cyan-400'] },
  { type: 'row',   cols: ['device',  '3.97'], widths: ['flex-1','w-16'], colors: ['text-white','text-cyan-400'] },
  { type: 'ok',    text: '3 rows in set (0.008 sec)' },
  { type: 'gap' },
  { type: 'query', text: "INSERT INTO PlayerMatchStats (player_id, match_id, kills, deaths, assists) VALUES (203, 88, 22, 4, 9);" },
  { type: 'trigger', text: '[TRIGGER] player #203 status: New → Active' },
  { type: 'ok',    text: '1 row affected (0.011 sec)' },
]
const SQL_DELAYS = [600,220,220,220,220,400,300,600,220,220,220,400,300,600,500,400]

function DBMSDemo() {
  const [items, setItems] = useState([])
  const idxRef = useRef(0)

  useEffect(() => {
    let timer
    function tick() {
      const i = idxRef.current
      if (i >= SQL_SEQUENCE.length) {
        timer = setTimeout(() => { idxRef.current = 0; setItems([]); tick() }, 2200)
        return
      }
      idxRef.current++
      setItems(prev => [...prev, { ...SQL_SEQUENCE[i], key: i }])
      timer = setTimeout(tick, SQL_DELAYS[i] ?? 300)
    }
    timer = setTimeout(tick, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 bg-[#060a12] font-mono text-[11px] flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 bg-[#080d1a] shrink-0">
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
        <span className="text-slate-600 text-[10px]">esports_db</span>
        <div className="ml-auto flex items-center gap-3 text-[10px] text-slate-500">
          <span>TABLES <span className="text-white font-bold">15</span></span>
          <span>VIEWS <span className="text-white font-bold">1</span></span>
          <span>TRIGGERS <span className="text-white font-bold">2</span></span>
        </div>
      </div>
      <div className="flex-1 min-h-0 px-4 py-3 flex flex-col justify-end gap-1 overflow-hidden">
        {items.map((item) => {
          if (item.type === 'gap') return <div key={item.key} className="h-1" />
          if (item.type === 'query') return (
            <div key={item.key} className="flex gap-2 animate-[fadeIn_0.15s_ease_forwards]">
              <span className="text-violet-400 shrink-0">›</span>
              <span className="text-violet-200 break-all">{item.text}</span>
            </div>
          )
          if (item.type === 'row') return (
            <div key={item.key} className="flex gap-3 pl-4 animate-[fadeIn_0.15s_ease_forwards]">
              {item.cols.map((col, ci) => (
                <span key={ci} className={`${item.widths[ci]} ${item.colors[ci]} truncate`}>{col}</span>
              ))}
            </div>
          )
          if (item.type === 'trigger') return (
            <div key={item.key} className="pl-4 text-amber-400 animate-[fadeIn_0.15s_ease_forwards]">{item.text}</div>
          )
          if (item.type === 'ok') return (
            <div key={item.key} className="pl-4 text-slate-600 animate-[fadeIn_0.15s_ease_forwards]">{item.text}</div>
          )
          return null
        })}
        <span className="text-violet-400 animate-pulse mt-0.5">▋</span>
      </div>
    </div>
  )
}

const PREFILL = 10

function NetworksDemo() {
  const [lines, setLines] = useState(() => {
    const now = Date.now()
    return PROXY_POOL.slice(0, PREFILL).map((log, i) => ({
      ...log,
      time: new Date(now - (PREFILL - i) * 480).toLocaleTimeString('en-US', { hour12: false }),
      key: i - 1000,
    }))
  })
  const [stats, setStats] = useState(() => ({
    total:   PREFILL,
    hits:    PROXY_POOL.slice(0, PREFILL).filter(l => l.type === 'hit').length,
    blocked: PROXY_POOL.slice(0, PREFILL).filter(l => l.type === 'block').length,
  }))
  const idxRef = useRef(PREFILL)

  useEffect(() => {
    let timer
    function tick() {
      const i   = idxRef.current % PROXY_POOL.length
      const log = PROXY_POOL[i]
      idxRef.current++
      const entry = { ...log, time: new Date().toLocaleTimeString('en-US', { hour12: false }), key: idxRef.current }
      setLines(prev => [...prev.slice(-PREFILL), entry])
      setStats(prev => ({
        total:   prev.total + 1,
        hits:    prev.hits    + (log.type === 'hit'   ? 1 : 0),
        blocked: prev.blocked + (log.type === 'block' ? 1 : 0),
      }))
      timer = setTimeout(tick, DELAYS[i])
    }
    timer = setTimeout(tick, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 bg-[#060a12] font-mono text-[11px] flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/5 bg-[#080d1a] shrink-0">
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
        <span className="text-slate-600 text-[10px]">0.0.0.0:8080</span>
        <div className="ml-auto flex items-center gap-3 text-[10px]">
          <span className="text-slate-500">REQ <span className="text-white font-bold">{stats.total}</span></span>
          <span className="text-emerald-500">HIT <span className="text-white font-bold">{stats.hits}</span></span>
          <span className="text-rose-500">BLK <span className="text-white font-bold">{stats.blocked}</span></span>
        </div>
      </div>
      <div className="flex-1 min-h-0 px-4 py-2.5 flex flex-col gap-1.5 overflow-hidden">
        {lines.map((line, i) => {
          const badge = BADGE[line.type]
          return (
            <div key={line.key} className={`flex items-center gap-2 leading-none ${i === lines.length - 1 ? 'animate-[fadeIn_0.2s_ease_forwards]' : ''}`}>
              <span className="text-slate-600 shrink-0">{line.time}</span>
              <span className={`shrink-0 font-bold w-[52px] ${TAG_COLOR[line.tag]}`}>{line.tag}</span>
              <span className="text-slate-300 truncate flex-1 min-w-0">{line.url}</span>
              {line.ms > 0 && <span className="shrink-0 text-slate-600">{line.ms}ms</span>}
              <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded border font-bold ${badge.cls}`}>{badge.label}</span>
            </div>
          )
        })}
        <span className="text-violet-400 animate-pulse leading-none mt-0.5">▋</span>
      </div>
    </div>
  )
}

const projects = [
  {
    title: 'Course Management System',
    context: 'Academic Full-Stack Project',
    period: '2026',
    featured: true,
    highlights: [
      'Built a responsive UI with React & Tailwind using reusable components and clean routing',
      'Integrated Node.js/Express APIs with MongoDB for enrollment, browsing, and course management flows',
      'Implemented JWT auth with protected routes and deployed backend services on Render',
    ],
    tech: ['React', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
    liveUrl: 'https://khaliya-3a-allah.github.io/course-management-system/',
    codeUrl: 'https://github.com/Khaliya-3a-Allah/course-management-system',
    forceDark: true,
  },
  {
    title: 'Sports Goods Store Management System',
    context: 'Software Engineering Project',
    period: '2026',
    highlights: [
      'Designed a web system for product listings, order management, and inventory workflows',
      'Documented requirements with IEEE SRS and modeled behavior using UML diagrams',
      'Applied MVC & client-server architecture for modular and scalable structure',
    ],
    tech: ['MVC', 'UML', 'IEEE SRS', 'Client-Server Architecture'],
    liveUrl: 'https://jer-s-eys.vercel.app/',
    codeUrl: 'https://github.com/SE-Pr0/jerSEys',
  },
  {
    title: 'Networks Proxy Server',
    context: 'Computer Networks Project',
    period: '2026',
    highlights: [
      'Implemented a proxy server to mediate client-server communication over network sockets',
      'Handled request forwarding and response relaying with attention to protocol behavior',
      'Strengthened debugging and traffic analysis skills through practical networking scenarios',
    ],
    tech: ['Computer Networks', 'Sockets', 'Proxy Server', 'Client-Server'],
    liveUrl: 'https://jadalhassan.github.io/Networks-Proxy-Server/#',
    codeUrl: 'https://github.com/jadalhassan/Networks-Proxy-Server',
    networkDemo: true,
  },
  {
    title: 'Esports Performance Tracker',
    context: 'Database Systems Project',
    period: '2025',
    dbmsDemo: true,
    addressBar: 'esports_db — MySQL 8.0',
    highlights: [
      'Designed a relational schema with ER modeling and normalization best practices',
      'Created analytical SQL queries using joins, aggregations, and nested subqueries',
      'Implemented triggers & views to automate reporting and ensure data consistency',
    ],
    tech: ['SQL', 'ER Modeling', 'Normalization', 'Triggers & Views'],
    codeUrl: 'https://github.com/jadalhassan/Esports-Team-Performance-Tracker',
  },
  {
    title: 'AI Maze Game',
    context: 'Python + AI Logic Project',
    period: '2025',
    highlights: [
      'Developed an interactive maze game in Python Turtle with timers and difficulty levels',
      'Integrated A* pathfinding for hints, solution rendering, and optimal path guidance',
      'Tracked player metrics and exported session data to CSV with pandas for analysis',
    ],
    tech: ['Python', 'Turtle', 'A* Pathfinding', 'Pandas', 'CSV Analytics'],
    codeUrl: 'https://github.com/jadalhassan/Maze-Game',
    jsLiveUrl: 'https://jadalhassan.github.io/Maze-Game/',
    demoGif: mazeGif,
    addressBar: 'maze_game.py — Python Turtle',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <SectionHeading number={3} title="Projects" />
        <div className="flex flex-col gap-5">
          {projects.map((project, i) => (
            <div
              key={project.title}
              data-reveal
              style={{ '--reveal-delay': `${80 + i * 90}ms` }}
              className={`relative group bg-white/5 border rounded-2xl p-6 sm:p-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 ${
                project.featured
                  ? 'border-violet-500/25 hover:border-violet-500/50 hover:shadow-violet-500/10'
                  : 'border-white/10 hover:border-violet-500/25 hover:shadow-violet-500/5'
              }`}
            >
              <div className={(!project.hideDemo) ? 'grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]' : ''}>
                {!project.hideDemo && (
                  <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0b0f1a] flex flex-col">
                    <div className="h-11 shrink-0 px-3 flex items-center gap-2 border-b border-white/10 bg-[#0a0d16]">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400/90" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
                      <span className="ml-2 text-[11px] text-slate-500 font-mono truncate">{project.addressBar || formatHost(project.liveUrl || project.codeUrl)}</span>
                    </div>
                    {project.liveUrl ? (
                      <ProjectPreview url={project.liveUrl} title={project.title} forceDark={project.forceDark} />
                    ) : project.dbmsDemo ? (
                      <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('project_github_click', { project: project.title, source: 'demo_panel' })} className="flex-1 relative group/demo min-h-[210px]">
                        <DBMSDemo />
                        <div className="absolute inset-0 bg-black/0 group-hover/demo:bg-black/50 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                          <span className="opacity-0 group-hover/demo:opacity-100 transition-opacity duration-200 px-3 py-1.5 text-xs font-semibold bg-white/10 border border-white/20 text-white rounded-md backdrop-blur-sm">View on GitHub</span>
                        </div>
                      </a>
                    ) : project.networkDemo ? (
                      <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('project_github_click', { project: project.title, source: 'demo_panel' })} className="flex-1 relative group/demo min-h-[210px]">
                        <NetworksDemo />
                        <div className="absolute inset-0 bg-black/0 group-hover/demo:bg-black/50 transition-colors duration-200 flex items-center justify-center pointer-events-none">
                          <span className="opacity-0 group-hover/demo:opacity-100 transition-opacity duration-200 px-3 py-1.5 text-xs font-semibold bg-white/10 border border-white/20 text-white rounded-md backdrop-blur-sm">View on GitHub</span>
                        </div>
                      </a>
                    ) : project.demoGif ? (
                      <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('project_github_click', { project: project.title, source: 'demo_panel' })} className="flex-1 min-h-[210px] overflow-hidden block relative group/demo">
                        <img
                          src={project.demoGif}
                          alt={`${project.title} demo`}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/demo:bg-black/50 transition-colors duration-200 flex items-center justify-center">
                          <span className="opacity-0 group-hover/demo:opacity-100 transition-opacity duration-200 px-3 py-1.5 text-xs font-semibold bg-white/10 border border-white/20 text-white rounded-md backdrop-blur-sm">View on GitHub</span>
                        </div>
                      </a>
                    ) : (
                      <div className="relative flex-1 min-h-[210px] p-5 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-cyan-400/20 flex items-center justify-center">
                        <span className="inline-flex w-fit items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white/10 border border-white/15 text-slate-200 rounded-md">
                          Demo Not Available
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  {project.featured && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 bg-violet-500/20 border border-violet-500/30 rounded-full text-violet-300 text-xs font-mono">
                      <SparkleIcon className="w-3.5 h-3.5" /> Featured
                    </span>
                  )}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors duration-300 break-words">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-sm sm:text-base">{project.context}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 text-xs font-mono text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-md"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-slate-300 text-xs sm:text-sm font-mono">
                      {project.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {project.highlights.map((point, j) => (
                      <li key={j} className="flex gap-3 text-slate-400 text-sm leading-relaxed">
                        <span className="text-violet-500/80 shrink-0 mt-0.5">
                          <ChevronRightIcon className="w-4 h-4" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3 pt-5 border-t border-white/5">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('project_live_demo_click', { project: project.title })}
                        aria-label={`Open live demo for ${project.title}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.jsLiveUrl && (
                      <a
                        href={project.jsLiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('project_live_demo_click', { project: project.title, version: 'js' })}
                        aria-label={`Open JS live demo for ${project.title}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg transition-colors"
                      >
                        Live Demo
                        <span className="text-[10px] font-bold tracking-wide bg-slate-950/20 rounded px-1.5 py-0.5">JS</span>
                      </a>
                    )}
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent('project_github_click', { project: project.title })}
                      aria-label={`Open GitHub repository for ${project.title}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#161b22] hover:bg-[#1f2630] border border-[#30363d] text-[#f0f6fc] rounded-lg transition-colors"
                    >
                      <GithubMarkIcon className="w-3.5 h-3.5" />
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}




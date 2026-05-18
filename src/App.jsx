import { useState, useEffect, useRef } from "react";
import minhaFoto from './ciber.jpg';
import emailjs from '@emailjs/browser';

/* ─── DATA ─────────────────────────────────────────────── */
const NAV = ["Home", "Sobre", "Experiência", "Projetos", "Contato"];

const PROJECTS = [
  { 
    id: 1, 
    category: "Jogo", 
    title: "DarkMaze — Jogo em Assembly", 
    desc: "Jogo de exploração e desvio de obstáculos desenvolvido em Assembly para o emulador da CPU do ICMC. Projeto da disciplina de Organização e Arquitetura de Computadores — USP.", 
    tags: ["Assembly", "ICMC", "Arquitetura de Computadores"], 
    icon: "🧙‍♂️", 
    github: "https://github.com/cibele-soares/DarkMaze" 
  },
  { 
    id: 2, 
    category: "Jogo", 
    title: "Projeto POO — Jogo em Java", 
    desc: "Jogo 2D desenvolvido em Java com padrões de orientação a objetos: herói, inimigos, bombas, power-ups e sistema de fases. Projeto da disciplina de Programação Orientada a Objetos — USP.", 
    tags: ["Java", "POO", "Swing"], 
    icon: "🎮", 
    github: "https://github.com/cibele-soares/Projeto-POO" 
  },
  { 
    id: 3, 
    category: "Web", 
    title: "Sistema Web de Relacionamento", 
    desc: "Plataforma full-stack desenvolvida como TCC com autenticação, feed dinâmico e painel administrativo.", 
    tags: ["React", "JavaScript", "MongoDB"], 
    icon: "🌐"
  },
  { 
    id: 4, 
    category: "Educação", 
    title: "Programação Web Para Meninas", 
    desc: "Mentoria de estudantes do ensino médio em Python, Django, HTML e CSS com foco em inclusão feminina na tech.", 
    tags: ["Python", "Django", "HTML", "CSS"], 
    icon: "👩‍💻"
  },
  { 
    id: 5, 
    category: "Pesquisa", 
    title: "Pensamento Computacional — IC USP", 
    desc: "Iniciação Científica investigando aplicações de pensamento computacional em contextos educacionais.", 
    tags: ["Pesquisa", "Python", "IA"], 
    icon: "🔬"
  },
  { 
    id: 6, 
    category: "Segurança", 
    title: "Análise de Vulnerabilidades", 
    desc: "Laboratórios práticos de análise de redes e identificação de vetores de ataque — trilha da certificação Cisco.", 
    tags: ["Cibersegurança", "Linux", "Redes"], 
    icon: "🔐"
  },
];

const SKILLS = [
  { label: "Desenvolvimento Web", pct: 88 },
  { label: "Back-end & APIs", pct: 80 },
  { label: "Cibersegurança & Redes", pct: 70 },
  { label: "Android / Mobile", pct: 62 },
];

const TECH = ["Python","JavaScript","Java","PHP","C","React","Django","HTML","CSS","MySQL","MongoDB","PostgreSQL","Git","Linux","IA"];

const TIMELINE = [
  { type: "exp", role: "Bolsista de Iniciação Científica", period: "2025 – 2026", place: "USP São Carlos", bullets: ["Pesquisa em pensamento computacional e aplicações educacionais","Produção de artigos e relatórios científicos","Investigação de metodologias ativas com uso de tecnologia"] },
  { type: "exp", role: "Monitora — Programação Web Para Meninas", period: "2024 – 2026", place: "USP São Carlos", bullets: ["Mentoria de alunas do ensino médio em programação web","Ensino de Python, Django, HTML e CSS","Promoção da inclusão feminina em tecnologia"] },
  { type: "edu", role: "Bacharelado em Sistemas de Informação", period: "2024 – 2027", place: "USP — São Carlos", bullets: ["Foco em Cibersegurança e Desenvolvimento de Software"] },
  { type: "edu", role: "Técnico em Desenvolvimento de Sistemas", period: "2021 – 2023", place: "ETEC João Belarmino — Amparo", bullets: ["TCC: Sistema Web de Relacionamento full-stack"] },
];

/* ─── HELPERS ───────────────────────────────────────────── */
function useInView(ref, threshold = 0.12) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, threshold]);
  return vis;
}

function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const vis = useInView(ref);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)", transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function TypedText({ items }) {
  const [idx, setIdx] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (hold) { const t = setTimeout(() => setHold(false), 1600); return () => clearTimeout(t); }
    const word = items[idx];
    const t = setTimeout(() => {
      if (!del) {
        const next = word.slice(0, txt.length + 1);
        setTxt(next);
        if (next === word) { setDel(true); setHold(true); }
      } else {
        const next = word.slice(0, txt.length - 1);
        setTxt(next);
        if (next === "") { setDel(false); setIdx(i => (i + 1) % items.length); }
      }
    }, del ? 40 : 85);
    return () => clearTimeout(t);
  }, [txt, del, hold, idx, items]);
  return <span style={{ color: "#60a5fa" }}>{txt}<span style={{ animation: "blink 1s step-end infinite" }}>|</span></span>;
}

function SkillBar({ label, pct, delay }) {
  const ref = useRef(null);
  const vis = useInView(ref);
  return (
    <div ref={ref} style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: "#8896b0", letterSpacing: ".03em" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#60a5fa" }}>{pct}%</span>
      </div>
      <div style={{ height: 2, background: "rgba(99,179,237,0.10)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: vis ? `${pct}%` : "0%", background: "linear-gradient(90deg, #3b82f6, #60a5fa)", borderRadius: 99, transition: `width 1.1s cubic-bezier(.4,0,.2,1) ${delay}ms` }} />
      </div>
    </div>
  );
}

/* ─── MAIN ──────────────────────────────────────────────── */
export default function Portfolio() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState("Home");
  const [filter, setFilter] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cats = ["Todos", ...Array.from(new Set(PROJECTS.map(p => p.category)))];
  const shown = filter === "Todos" ? PROJECTS : PROJECTS.filter(p => p.category === filter);

  const nav = id => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setActive(id); setMenuOpen(false);
  };

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      const els = NAV.map(l => ({ l, el: document.getElementById(l.toLowerCase()) }));
      for (let i = els.length - 1; i >= 0; i--) {
        if (els[i].el && els[i].el.getBoundingClientRect().top <= 110) { setActive(els[i].l); break; }
      }
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #06090f; color: #f0f4ff; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden; }

    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes pulseRing { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.7);opacity:0} }
    @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

    .nav-item { background:none; border:none; cursor:pointer; color:#8896b0; font-family:'Inter',sans-serif; font-size:13px; font-weight:500; letter-spacing:.04em; padding:6px 2px; position:relative; transition:color .2s; }
    .nav-item::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:1px; background:#60a5fa; transform:scaleX(0); transition:transform .25s; transform-origin:left; }
    .nav-item:hover { color:#f0f4ff; }
    .nav-item.on { color:#60a5fa; }
    .nav-item.on::after { transform:scaleX(1); }

    .btn-p { display:inline-flex; align-items:center; gap:8px; background:#60a5fa; color:#06090f; border:none; border-radius:8px; padding:13px 28px; font-family:'Inter',sans-serif; font-size:14px; font-weight:600; cursor:pointer; letter-spacing:.02em; transition:all .2s; white-space:nowrap; }
    .btn-p:hover { background:#93c5fd; transform:translateY(-2px); box-shadow:0 8px 24px rgba(96,165,250,.3); }

    .btn-g { display:inline-flex; align-items:center; gap:8px; background:transparent; color:#f0f4ff; border:1px solid rgba(99,179,237,.28); border-radius:8px; padding:12px 28px; font-family:'Inter',sans-serif; font-size:14px; font-weight:500; cursor:pointer; letter-spacing:.02em; transition:all .2s; white-space:nowrap; }
    .btn-g:hover { border-color:#60a5fa; color:#60a5fa; background:rgba(96,165,250,.08); }

    .card { background:#111827; border:1px solid rgba(99,179,237,.10); border-radius:12px; transition:border-color .25s, transform .25s, box-shadow .25s; }
    .card:hover { border-color:rgba(99,179,237,.28); }

    .proj-card { background:#111827; border:1px solid rgba(99,179,237,.10); border-radius:12px; transition:all .25s; overflow:hidden; display:flex; flex-direction:column; height: 100%; }    .proj-card:hover { border-color:#3b82f6; box-shadow:0 12px 40px rgba(96,165,250,.1); transform:translateY(-4px); }
    .proj-card:hover .proj-icon { background:rgba(96,165,250,.18); }
    .proj-card:hover .proj-arr { opacity:1; transform:translate(0,0); }

    .pill { background:transparent; border:1px solid rgba(99,179,237,.10); color:#8896b0; font-family:'Inter',sans-serif; font-size:12px; font-weight:500; letter-spacing:.05em; padding:7px 18px; border-radius:99px; cursor:pointer; transition:all .2s; }
    .pill:hover { border-color:rgba(99,179,237,.28); color:#f0f4ff; }
    .pill.on { background:rgba(96,165,250,.08); border-color:#60a5fa; color:#60a5fa; }

    .field { width:100%; background:#0f1520; border:1px solid rgba(99,179,237,.10); color:#f0f4ff; font-family:'Inter',sans-serif; font-size:14px; padding:13px 16px; border-radius:8px; transition:border-color .2s; outline:none; resize:vertical; }
    .field:focus { border-color:#60a5fa; }
    .field::placeholder { color:#4b5a72; }

    .tech-b { background:rgba(96,165,250,.08); border:1px solid rgba(99,179,237,.10); color:#60a5fa; font-size:12px; font-weight:500; padding:5px 14px; border-radius:99px; letter-spacing:.03em; transition:all .2s; }
    .tech-b:hover { background:rgba(96,165,250,.16); border-color:#60a5fa; }

    .soc-btn { width:40px; height:40px; border-radius:10px; border:1px solid rgba(99,179,237,.10); display:flex; align-items:center; justify-content:center; color:#4b5a72; text-decoration:none; font-size:13px; font-weight:700; transition:all .2s; }
    .soc-btn:hover { border-color:#60a5fa; color:#60a5fa; background:rgba(96,165,250,.08); }

    .scroll-top { position:fixed; bottom:28px; right:28px; width:42px; height:42px; background:#60a5fa; color:#06090f; border:none; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:200; transition:all .2s; font-weight:700; box-shadow:0 4px 20px rgba(96,165,250,.35); }
    .scroll-top:hover { transform:translateY(-3px); background:#93c5fd; }

    .divider { border:none; border-top:1px solid rgba(99,179,237,.10); }
    .sec-label { font-size:11px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:#60a5fa; margin-bottom:14px; }

    /* ── Playfair nos títulos de seção ── */
    .sec-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 5vw, 52px);
      font-weight: 700;
      line-height: 1.15;
      margin-bottom: 20px;
    }

    .gh-link { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:#60a5fa; text-decoration:none; border:1px solid rgba(96,165,250,.25); border-radius:99px; padding:4px 12px; transition:all .2s; background:rgba(96,165,250,.06); }
    .gh-link:hover { background:rgba(96,165,250,.14); border-color:#60a5fa; }

    @media (max-width: 768px) {
      .desktop-nav { display:none !important; }
      .mobile-toggle { display:flex !important; }
      .hero-grid { flex-direction:column !important; gap:48px !important; }
      .hero-orb { display:none !important; }
      .two-col { flex-direction:column !important; gap:40px !important; }
      .stats-row { grid-template-columns:1fr 1fr !important; }
      .proj-grid { grid-template-columns:1fr !important; }
      .contact-grid { flex-direction:column !important; gap:40px !important; }
      .form-row { grid-template-columns:1fr !important; }
      .sec-pad { padding:72px 20px !important; }
    }
    @media (min-width:769px) { .mobile-toggle { display:none !important; } }
  `;

  return (
    <div style={{ background: "#06090f", color: "#f0f4ff", minHeight: "100vh" }}>
      <style>{CSS}</style>

      {/* NAV */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(6,9,15,.9)" : "rgba(7, 49, 79, 0.40)", backdropFilter: scrolled ? "blur(18px)" : "none", borderBottom: scrolled ? "1px solid rgba(99,179,237,.10)" : "1px solid transparent", transition: "all .35s" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => nav("Home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#06090f" }}>CS</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#f0f4ff", letterSpacing: ".01em" }}>Meu Portfólio</span>
          </button>

          <nav className="desktop-nav" style={{ display: "flex", gap: 32 }}>
            {NAV.map(l => <button key={l} className={`nav-item ${active === l ? "on" : ""}`} onClick={() => nav(l)}>{l}</button>)}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn-p" style={{ padding: "9px 20px", fontSize: 13 }} onClick={() => nav("Contato")}>Contato</button>
            <button className="mobile-toggle" onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "1px solid rgba(99,179,237,.2)", color: "#f0f4ff", width: 38, height: 38, borderRadius: 8, cursor: "pointer", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ background: "#0b1018", borderTop: "1px solid rgba(99,179,237,.10)", padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV.map(l => <button key={l} className={`nav-item ${active === l ? "on" : ""}`} onClick={() => nav(l)} style={{ textAlign: "left", padding: "12px 0", fontSize: 15 }}>{l}</button>)}
          </div>
        )}
      </header>

      {/* HOME */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 64, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,179,237,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,.06) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "15%", right: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="sec-pad" style={{ maxWidth: 1180, margin: "0 auto", padding: "30px 24px", width: "100%", position: "relative" }}>
          <div className="hero-grid" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 60 }}>

            {/* Texto — lado esquerdo */}
            <div style={{ flex: 1, maxWidth: 560 }}>

              <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(42px, 6.5vw, 80px)", lineHeight: 1.05, marginBottom: 20, animation: "fadeUp .7s ease .1s both" }}>
                Cibele Soares
              </h1>

              <h2 style={{ fontWeight: 400, fontSize: "clamp(15px,2vw,21px)", color: "#8896b0", marginBottom: 24, lineHeight: 1.5, animation: "fadeUp .7s ease .2s both" }}>
                <TypedText items={["Desenvolvedora Full-Stack", "Estudante de Cibersegurança", "Pesquisadora — USP São Carlos", "Monitora de Programação"]} />
              </h2>

              <p style={{ color: "#8896b0", fontSize: 15, lineHeight: 1.9, maxWidth: 480, marginBottom: 36, animation: "fadeUp .7s ease .3s both" }}>
                Estudante de Sistemas de Informação na USP com experiência full-stack em Web e Android. Direcionando a carreira para Cibersegurança, com base sólida em arquitetura de software e análise de vulnerabilidades.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40, animation: "fadeUp .7s ease .4s both" }}>
                <button className="btn-p" onClick={() => nav("Projetos")} style={{ padding: "14px 32px", fontSize: 14, borderRadius: 50, letterSpacing: ".04em" }}>
                  Ver Projetos
                </button>
                <button className="btn-g" onClick={() => nav("Contato")} style={{ padding: "14px 32px", fontSize: 14, borderRadius: 50, letterSpacing: ".04em" }}>
                  Entrar em Contato
                </button>
              </div>

              <div style={{ display: "flex", gap: 10, animation: "fadeUp .7s ease .5s both" }}>
                {[
                  { label: "LinkedIn", href: "https://linkedin.com/in/cibele-soares-0x7d5", icon: "in" },
                  { label: "GitHub", href: "https://github.com/cibele-soares", icon: "</>" },
                  { label: "Email", href: "mailto:cibele.almeida1212@gmail.com", icon: "@" },
                ].map(({ label, href, icon }) => (
                  <a key={label} href={href} title={label} target="_blank" rel="noreferrer"
                    style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(99,179,237,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8896b0", textDecoration: "none", fontSize: 13, fontWeight: 700, transition: "all .2s", background: "rgba(96,165,250,.04)" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#60a5fa"; e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.background = "rgba(96,165,250,.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(99,179,237,.2)"; e.currentTarget.style.color = "#8896b0"; e.currentTarget.style.background = "rgba(96,165,250,.04)"; }}>
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Orb com foto — lado direito */}
            <div className="hero-orb" style={{ flex: "0 0 auto", width: 360, height: 360, position: "relative", animation: "fadeUp .9s ease .2s both" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px dashed rgba(96,165,250,.35)", animation: "rotateSlow 35s linear infinite" }} />
              <div style={{ position: "absolute", inset: 24, borderRadius: "50%", border: "1px solid rgba(96,165,250,.15)" }} />
              <div style={{ position: "absolute", inset: 52, borderRadius: "50%", border: "1px solid rgba(96,165,250,.08)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 220, height: 220, borderRadius: "50%", border: "2px solid rgba(96,165,250,.4)", overflow: "hidden", boxShadow: "0 0 40px rgba(96,165,250,.15)" }}>
                  <img src={minhaFoto} alt="Cibele Soares" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
              <div style={{ position: "absolute", inset: "28%", borderRadius: "50%", border: "1px solid rgba(96,165,250,.2)", animation: "pulseRing 2.8s ease-out infinite" }} />
            </div>

          </div>

          {/* Stats */}
          <Reveal delay={200} style={{ marginTop: 60 }}>
            <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, textAlign: "center" }}>
              {[["USP", "São Carlos"], ["2+", "Anos de Projetos"], ["4+", "Projetos Entregues"], ["Cisco", "Em Andamento"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(20px,3vw,36px)", fontWeight: 700, color: "#60a5fa", lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 10, color: "#4b5a72", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 6, lineHeight: 1.4 }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>

        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" style={{ background: "#0b1018", borderTop: "1px solid rgba(99,179,237,.10)" }}>
        <div className="sec-pad" style={{ maxWidth: 1180, margin: "0 auto", padding: "50px 24px", width: "100%", position: "relative" }}>          <Reveal>
            <p className="sec-label">Sobre mim</p>
            <h2 className="sec-title">Código, segurança<br /><span style={{ color: "#60a5fa" }}>e propósito.</span></h2>
          </Reveal>

          <div className="two-col" style={{ display: "flex", gap: 64, marginTop: 52 }}>
            <Reveal delay={100} style={{ flex: 1 }}>
              <p style={{ color: "#8896b0", fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
                Sou Cibele, estudante de Sistemas de Informação na USP São Carlos. Minha formação técnica pela ETEC me deu uma base prática antes mesmo de entrar na universidade — desenvolvimento full-stack em Web e Android desde cedo.
              </p>
              <p style={{ color: "#8896b0", fontSize: 15, lineHeight: 1.9, marginBottom: 32 }}>
                Hoje direciono a carreira para Cibersegurança. Entender como sistemas são <em style={{ color: "#f0f4ff", fontStyle: "normal", fontWeight: 500 }}>construídos</em> é o melhor ponto de partida para aprender como <em style={{ color: "#60a5fa", fontStyle: "normal", fontWeight: 500 }}>protegê-los</em>. Atualmente aprofundo conhecimentos em segurança de redes pela certificação Cisco.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
                {[["💻","Full-Stack","Web e Android do zero ao deploy"],["🔐","Segurança","Vulnerabilidades e segurança de redes"],["🔬","Pesquisa","IC em pensamento computacional — USP"],["👩‍🏫","Ensino","Mentoria de estudantes em programação"]].map(([icon, title, desc]) => (
                  <div key={title} className="card" style={{ padding: "18px 16px" }}>
                    <div style={{ fontSize: 20, marginBottom: 10 }}>{icon}</div>
                    <h4 style={{ fontWeight: 600, fontSize: 13, marginBottom: 5, color: "#f0f4ff" }}>{title}</h4>
                    <p style={{ color: "#4b5a72", fontSize: 12, lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "#0f1520", border: "1px solid rgba(99,179,237,.10)", borderRadius: 10, padding: "18px 20px" }}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#4b5a72", marginBottom: 14 }}>Idiomas</p>
                <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                  {[["🇧🇷","Português","Nativo"],["🇺🇸","Inglês","Intermediário"],["🇪🇸","Espanhol","Básico"]].map(([flag, lang, lvl]) => (
                    <div key={lang} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{flag}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#f0f4ff" }}>{lang}</div>
                        <div style={{ fontSize: 11, color: "#4b5a72" }}>{lvl}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} style={{ flex: 1 }}>
              <div className="card" style={{ padding: "28px 24px", marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#4b5a72", marginBottom: 24 }}>Habilidades técnicas</p>
                {SKILLS.map((s, i) => <SkillBar key={s.label} {...s} delay={i * 130} />)}
              </div>
              <div className="card" style={{ padding: "24px" }}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#4b5a72", marginBottom: 16 }}>Tecnologias</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TECH.map(t => <span key={t} className="tech-b">{t}</span>)}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* EXPERIÊNCIA */}
      <section id="experiência" style={{ borderTop: "1px solid rgba(99,179,237,.10)" }}>
        <div className="sec-pad" style={{ maxWidth: 1180, margin: "0 auto", padding: "50px 24px" }}>
          <Reveal>
            <p className="sec-label">Trajetória</p>
            <h2 className="sec-title">Experiência &amp;<br /><span style={{ color: "#60a5fa" }}>Formação</span></h2>
          </Reveal>

          <div className="two-col" style={{ display: "flex", gap: 48, marginTop: 56 }}>
            <div style={{ flex: 1 }}>
              <Reveal>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#4b5a72", marginBottom: 28 }}>Experiência Acadêmica</p>
                {TIMELINE.filter(t => t.type === "exp").map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", gap: 18 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#60a5fa", boxShadow: "0 0 0 4px rgba(96,165,250,.15)", flexShrink: 0, marginTop: 5 }} />
                      {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: "rgba(99,179,237,.12)", marginTop: 8, minHeight: 40 }} />}
                    </div>
                    <div style={{ paddingBottom: i < arr.length - 1 ? 36 : 0, flex: 1 }}>
                      <span style={{ background: "rgba(96,165,250,.08)", color: "#60a5fa", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, border: "1px solid rgba(99,179,237,.2)", display: "inline-block", marginBottom: 8 }}>{item.period}</span>
                      <h4 style={{ fontWeight: 600, fontSize: 15, color: "#f0f4ff", marginBottom: 4 }}>{item.role}</h4>
                      <p style={{ fontSize: 13, color: "#8896b0", marginBottom: 10 }}>{item.place}</p>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {item.bullets.map((b, j) => (
                          <li key={j} style={{ fontSize: 13, color: "#4b5a72", lineHeight: 1.75, marginBottom: 3, paddingLeft: 16, position: "relative" }}>
                            <span style={{ position: "absolute", left: 0, color: "#60a5fa" }}>›</span>{b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </Reveal>
            </div>

            <div style={{ flex: 1 }}>
              <Reveal delay={100}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#4b5a72", marginBottom: 28 }}>Formação</p>
                {TIMELINE.filter(t => t.type === "edu").map((item, i, arr) => (
                  <div key={i} style={{ display: "flex", gap: 18 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 0 4px rgba(129,140,248,.15)", flexShrink: 0, marginTop: 5 }} />
                      {i < arr.length - 1 && <div style={{ width: 1, flex: 1, background: "rgba(99,179,237,.12)", marginTop: 8, minHeight: 40 }} />}
                    </div>
                    <div style={{ paddingBottom: i < arr.length - 1 ? 36 : 0, flex: 1 }}>
                      <span style={{ background: "rgba(129,140,248,.1)", color: "#818cf8", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, border: "1px solid rgba(129,140,248,.2)", display: "inline-block", marginBottom: 8 }}>{item.period}</span>
                      <h4 style={{ fontWeight: 600, fontSize: 15, color: "#f0f4ff", marginBottom: 4 }}>{item.role}</h4>
                      <p style={{ fontSize: 13, color: "#8896b0", marginBottom: 10 }}>{item.place}</p>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {item.bullets.map((b, j) => (
                          <li key={j} style={{ fontSize: 13, color: "#4b5a72", lineHeight: 1.75, paddingLeft: 16, position: "relative" }}>
                            <span style={{ position: "absolute", left: 0, color: "#818cf8" }}>›</span>{b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 8 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#4b5a72", marginBottom: 16 }}>Certificação</p>
                  <div className="card" style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <h4 style={{ fontWeight: 600, fontSize: 14, color: "#f0f4ff", marginBottom: 6 }}>CISCO — Analista de Cibersegurança Jr.</h4>
                        <p style={{ fontSize: 12, color: "#4b5a72", lineHeight: 1.6 }}>Fundamentos de segurança da informação e análise de vulnerabilidades</p>
                      </div>
                      <span style={{ background: "rgba(52,211,153,.08)", color: "#34d399", fontSize: 11, fontWeight: 600, padding: "5px 12px", borderRadius: 99, border: "1px solid rgba(52,211,153,.2)", whiteSpace: "nowrap" }}>Em andamento</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* PROJETOS */}
      <section id="projetos" style={{ background: "#0b1018", borderTop: "1px solid rgba(99,179,237,.10)" }}>
        <div className="sec-pad" style={{ maxWidth: 1180, margin: "0 auto", padding: "50px 24px" }}>
          <Reveal>
            <p className="sec-label">Portfólio</p>
            <h2 className="sec-title">Projetos &amp;<br /><span style={{ color: "#60a5fa" }}>Trabalhos</span></h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 28, marginBottom: 48 }}>
              {cats.map(c => <button key={c} className={`pill ${filter === c ? "on" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}
            </div>
          </Reveal>

            <div className="proj-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, alignItems: "stretch" }}>            {shown.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <div className="proj-card">
                  <div style={{ padding: "24px 22px 18px", borderBottom: "1px solid rgba(99,179,237,.08)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div className="proj-icon" style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(96,165,250,.08)", border: "1px solid rgba(99,179,237,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, transition: "background .25s" }}>{p.icon}</div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#4b5a72", background: "#0f1520", padding: "4px 10px", borderRadius: 99, border: "1px solid rgba(99,179,237,.08)" }}>{p.category}</span>
                      <span className="proj-arr" style={{ color: "#60a5fa", fontSize: 16, opacity: 0, transform: "translate(-4px,4px)", transition: "all .22s" }}>→</span>
                    </div>
                  </div>
                  <div style={{ padding: "18px 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "#f0f4ff", marginBottom: 10, lineHeight: 1.3 }}>{p.title}</h3>
                    <p style={{ fontSize: 13, color: "#8896b0", lineHeight: 1.75, marginBottom: 16, flex: 1 }}>{p.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {p.tags.map(t => <span key={t} style={{ fontSize: 11, fontWeight: 500, color: "#4b5a72", background: "#0f1520", border: "1px solid rgba(99,179,237,.08)", padding: "4px 10px", borderRadius: 99 }}>{t}</span>)}
                      </div>
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" className="gh-link">
                          &lt;/&gt; GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" style={{ borderTop: "1px solid rgba(99,179,237,.10)" }}>
        <div className="sec-pad" style={{ maxWidth: 1180, margin: "0 auto", padding: "50px 24px" }}>
          <Reveal>
            <p className="sec-label">Contato</p>
            <h2 className="sec-title">Vamos <span style={{ color: "#60a5fa" }}>conversar.</span></h2>
            <p style={{ color: "#8896b0", fontSize: 15, lineHeight: 1.85, maxWidth: 440, marginBottom: 56 }}>Aberta a estágios, projetos e parcerias em desenvolvimento e cibersegurança. Respondo em até 24h.</p>
          </Reveal>

          <div className="contact-grid" style={{ display: "flex", gap: 64 }}>
            <Reveal delay={100} style={{ flex: "0 0 260px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {[
                  { icon: "✉", label: "Email", val: "cibele.almeida1212@gmail.com", href: "mailto:cibele.almeida1212@gmail.com" },
                  { icon: "</>", label: "GitHub", val: "cibele-soares", href: "https://github.com/cibele-soares" },
                  { icon: "🔗", label: "LinkedIn", val: "cibele-soares-0x7d5", href: "https://linkedin.com/in/cibele-soares-0x7d5" },
                  { icon: "📍", label: "Localização", val: "São Carlos — SP, Brasil" },
                ].map(({ icon, label, val, href }) => (
                  <div key={label}>
                    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#4b5a72", marginBottom: 6 }}>{label}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{icon}</span>
                      {href
                        ? <a href={href} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "#60a5fa", textDecoration: "none", wordBreak: "break-all" }} onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"} onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>{val}</a>
                        : <span style={{ fontSize: 14, color: "#8896b0" }}>{val}</span>}
                    </div>
                  </div>
                ))}
                <hr className="divider" />
                <div>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#4b5a72", marginBottom: 14 }}>Redes</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { label: "LinkedIn", href: "https://linkedin.com/in/cibele-soares-0x7d5", icon: "in" },
                      { label: "GitHub", href: "https://github.com/cibele-soares", icon: "</>" },
                      { label: "Email", href: "mailto:cibele.almeida1212@gmail.com", icon: "@" },
                    ].map(({ label, href, icon }) => (
                      <a key={label} href={href} title={label} className="soc-btn" target="_blank" rel="noreferrer">{icon}</a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} style={{ flex: 1 }}>
              {sent ? (
                <div style={{ background: "rgba(52,211,153,.05)", border: "1px solid rgba(81, 76, 178, 0.18)", borderRadius: 12, padding: "56px 40px", textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "#1a64b7", marginBottom: 8 }}>Mensagem enviada!</h3>
                  <p style={{ color: "#4b5a72", fontSize: 14 }}>Responderei em até 24 horas.</p>
                </div>
              ) : (
                <div className="card" style={{ padding: "34px 32px" }}>
                  <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <input className="field" placeholder="Seu nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <input className="field" placeholder="Seu e-mail" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <textarea className="field" rows={6} placeholder="Sua mensagem…" value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} style={{ marginBottom: 8, display: "block" }} />

                  {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</p>}

                  <button
                    className="btn-p"
                    style={{ width: "100%", justifyContent: "center", opacity: sending ? .7 : 1 }}
                    onClick={async () => {
                      if (!form.name || !form.email || !form.msg) {
                        setError("Preencha todos os campos."); return;
                      }
                      setSending(true); setError("");
                      try {
                        await emailjs.send(
                          process.env.REACT_APP_EMAILJS_SERVICE_ID,  
                          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                          { name: form.name, email: form.email, message: form.msg },
                          process.env.REACT_APP_EMAILJS_PUBLIC_KEY, 
                        );
                        setSent(true);
                      } catch (err) {
                        console.error("Erro EmailJS:", err);
                        setError("Erro ao enviar. Tente pelo e-mail direto.");
                      } finally {
                        setSending(false);
                      }
                    }}
                  >
                    {sending ? "Enviando…" : "Enviar Mensagem"}
                  </button>

                  <p style={{ fontSize: 14, color: "#4b5a72", textAlign: "center", marginTop: 16 }}>
                    <a href="mailto:cibele.almeida1212@gmail.com" style={{ color: "#60a5fa", textDecoration: "none" }}>cibele.almeida1212@gmail.com</a>
                  </p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0b1018", borderTop: "1px solid rgba(99,179,237,.10)", padding: "28px 24px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#06090f" }}>CS</div>
            <span style={{ fontSize: 14, color: "#8896b0" }}>Cibele Soares · Sistemas de Informação USP</span>
          </div>
          <p style={{ fontSize: 13, color: "#4b5a72" }}>© 2025 — Feito com React</p>
        </div>
      </footer>

      <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} title="Voltar ao topo">↑</button>
    </div>
  );
}

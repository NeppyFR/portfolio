import { useEffect, useRef } from "react";

/* ---------- Data ---------- */
const SKILLS = [
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "Access", icon: null },
];

const LANGS = [
  { flag: "🇩🇪", name: "German", tag: "fluent" },
  { flag: "🇬🇧", name: "English", tag: "fluent" },
  { flag: "🇮🇳", name: "Panjabi", tag: null },
  { flag: "🇵🇰", name: "Urdu", tag: null },
  { flag: "🇮🇳", name: "Hindi", tag: null },
  { flag: "🇫🇷", name: "French", tag: "basics" },
];

const PROJECTS = [
  {
    name: "Grade Tracker",
    href: "https://neppyfr.github.io/gradetracker/",
    desc: "A web app for tracking school grades on the Swiss 1–6 scale, with weighted exams, live per-class averages, and cloud sync.",
  },
  {
    name: "Traffic Mesh",
    href: "https://neppyfr.github.io/traffic-mesh/",
    desc: "A traffic simulation with no lights and no stop signs — every car runs the same rule to negotiate each crossing, on a demo grid or on real city streets.",
  },
];

/* ---------- Theme ---------- */
const C = {
  bg: "#08080a",
  bgSoft: "#131018",
  border: "#241d33",
  text: "#ece9f2",
  muted: "#9a90ad",
  accent: "#a371f7",
  accent2: "#7c3aed",
};

/* ---------- Cursor-reactive background ---------- */
function CursorField() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999, tx: -9999, ty: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf, w, h, dpr, points = [];
    const GAP = 34;
    const RADIUS = 170;

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = [];
      const cols = Math.ceil(w / GAP) + 1;
      const rows = Math.ceil(h / GAP) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          points.push({ ox: i * GAP, oy: j * GAP });
        }
      }
    };

    const move = (e) => {
      mouse.current.tx = e.clientX;
      mouse.current.ty = e.clientY;
    };
    const leave = () => {
      mouse.current.tx = -9999;
      mouse.current.ty = -9999;
    };

    const draw = () => {
      const m = mouse.current;
      // smooth follow
      m.x += (m.tx - m.x) * 0.12;
      m.y += (m.ty - m.y) * 0.12;

      ctx.clearRect(0, 0, w, h);

      // glow that follows the cursor
      if (m.tx > -9000) {
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 260);
        g.addColorStop(0, "rgba(124,58,237,0.20)");
        g.addColorStop(0.5, "rgba(124,58,237,0.07)");
        g.addColorStop(1, "rgba(124,58,237,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      for (const p of points) {
        const dx = p.ox - m.x;
        const dy = p.oy - m.y;
        const dist = Math.hypot(dx, dy);
        let px = p.ox, py = p.oy, size = 1, alpha = 0.16;

        if (dist < RADIUS) {
          const f = 1 - dist / RADIUS; // 0..1, stronger near cursor
          const push = f * 26; // displacement away from cursor
          const ang = Math.atan2(dy, dx);
          px = p.ox + Math.cos(ang) * push;
          py = p.oy + Math.sin(ang) * push;
          size = 1 + f * 2.6;
          alpha = 0.16 + f * 0.75;
        }

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(163,113,247,${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    build();
    draw();
    window.addEventListener("resize", build);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", build);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

/* ---------- Small UI pieces ---------- */
function SectionTitle({ children }) {
  return (
    <h2 style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: 2, color: C.muted, marginBottom: 22 }}>
      {children}
      <span style={{ flex: 1, height: 1, background: C.border }} />
    </h2>
  );
}

function Btn({ href, children }) {
  const ref = useRef(null);
  return (
    <a
      ref={ref}
      href={href}
      onMouseEnter={() => { const s = ref.current.style; s.transform = "translateY(-2px)"; s.borderColor = C.accent; s.background = "#1e1830"; }}
      onMouseLeave={() => { const s = ref.current.style; s.transform = "none"; s.borderColor = C.border; s.background = C.bgSoft; }}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", border: `1px solid ${C.border}`, borderRadius: 10, background: C.bgSoft, color: C.text, textDecoration: "none", fontSize: "0.92rem", fontWeight: 500, transition: "transform .15s, border-color .15s, background .15s" }}
    >
      {children}
    </a>
  );
}

function Card({ children, style, hover = true, href }) {
  const ref = useRef(null);
  // renders as an anchor when href is given, so the whole card is the click target
  const Tag = href ? "a" : "div";
  return (
    <Tag
      ref={ref}
      href={href}
      onMouseEnter={hover ? () => { const s = ref.current.style; s.transform = "translateY(-3px)"; s.borderColor = C.accent; } : undefined}
      onMouseLeave={hover ? () => { const s = ref.current.style; s.transform = "none"; s.borderColor = C.border; } : undefined}
      style={{ border: `1px solid ${C.border}`, borderRadius: 14, background: C.bgSoft, transition: "transform .15s, border-color .15s", ...(href && { display: "block", color: "inherit", textDecoration: "none" }), ...style }}
    >
      {children}
    </Tag>
  );
}

/* ---------- Main ---------- */
export default function Portfolio() {
  const year = new Date().getFullYear();

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: C.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', lineHeight: 1.6, background: `radial-gradient(900px 500px at 15% -10%, rgba(124,58,237,0.18), transparent 60%), radial-gradient(800px 500px at 100% 0%, rgba(163,113,247,0.12), transparent 55%), ${C.bg}` }}>
      <CursorField />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "72px 24px 96px" }}>

        {/* Intro */}
        <header style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 116, height: 116, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", fontSize: 44, fontWeight: 700, color: "#fff", background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`, boxShadow: "0 10px 34px rgba(124,58,237,0.4)", letterSpacing: 1 }}>
            AS
          </div>
          <div style={{ flex: "1 1 300px" }}>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", lineHeight: 1.15, letterSpacing: "-0.5px", margin: 0 }}>Angad Singh</h1>
            <p style={{ marginTop: 12, color: C.muted, fontSize: "1.05rem" }}>
              Zurich-based developer, currently studying to become an <strong style={{ color: C.text }}>application developer</strong>. I enjoy building things across the stack — from databases to interfaces — and I'm always picking up new tools and languages along the way.
            </p>
          </div>
        </header>

        {/* Skills */}
        <section style={{ marginTop: 60 }}>
          <SectionTitle>Skills &amp; Tools</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
            {SKILLS.map((s) => (
              <Card key={s.name} style={{ display: "flex", alignItems: "center", gap: 11, padding: 14 }}>
                {s.icon ? (
                  <img src={s.icon} alt={s.name} width={30} height={30} style={{ flexShrink: 0 }} />
                ) : (
                  <svg width="30" height="30" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><rect x="2" y="4" width="20" height="16" rx="2" fill="#A4373A" /><path d="M8 8.5 6 15.5h1.4l.4-1.6h2l.4 1.6H11.6L9.6 8.5H8zm.1 4.2.6-2.5.6 2.5H8.1zM12.5 8.5h3.2v1.2h-1.9v1.6h1.7v1.2h-1.7v1.7h2v1.2h-3.3V8.5z" fill="#fff" /></svg>
                )}
                <span style={{ fontSize: "0.92rem", fontWeight: 500 }}>{s.name}</span>
              </Card>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section style={{ marginTop: 60 }}>
          <SectionTitle>Languages</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {LANGS.map((l, i) => (
              <span key={i} style={{ padding: "8px 15px", border: `1px solid ${C.border}`, borderRadius: 999, background: C.bgSoft, fontSize: "0.92rem" }}>
                {l.flag} <b style={{ fontWeight: 600 }}>{l.name}</b>
                {l.tag && <span style={{ color: C.muted, fontSize: "0.78rem", marginLeft: 6 }}>{l.tag}</span>}
              </span>
            ))}
          </div>
        </section>

        {/* Education */}
        <section style={{ marginTop: 60 }}>
          <SectionTitle>Education</SectionTitle>
          <Card hover={false} style={{ padding: "20px 22px" }}>
            <h3 style={{ fontSize: "1.05rem", margin: 0 }}>Application Development — In Progress</h3>
            <p style={{ color: C.muted, fontSize: "0.95rem", marginTop: 4 }}>Training to become an application developer near Zurich, Switzerland.</p>
          </Card>
        </section>

        {/* Projects */}
        <section style={{ marginTop: 60 }}>
          <SectionTitle>Projects</SectionTitle>
          <div style={{ display: "grid", gap: 14 }}>
            {PROJECTS.map((p, i) => (
              <Card key={i} href={p.href} style={{ padding: "20px 22px" }}>
                <h3 style={{ fontSize: "1.08rem", margin: 0 }}>{p.name}</h3>
                <p style={{ color: C.muted, fontSize: "0.95rem", marginTop: 6 }}>{p.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <footer style={{ marginTop: 72, paddingTop: 24, borderTop: `1px solid ${C.border}`, color: C.muted, fontSize: "0.85rem", textAlign: "center" }}>
          © {year} Angad Singh · Built near Zurich 🇨🇭
        </footer>
      </div>
    </div>
  );
}

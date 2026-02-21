import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, ZoomIn, ZoomOut, Maximize2, RefreshCw, ExternalLink, Link2 } from "lucide-react";
import axios from "axios";
import { useTheme } from "./theme-provider";

/* ────────────────────────────────────────────────────────────────── */
/* Types                                                              */
/* ────────────────────────────────────────────────────────────────── */

interface Bucket { _id: string; title: string; link?: string; description?: string; }

interface CardNode {
  id: string;
  fullTitle: string;
  label: string;           // truncated
  link?: string;
  description?: string;
  x: number; y: number;   // top-left corner of card
  vx: number; vy: number;
  w: number; h: number;   // card dimensions
  accent: string;          // accent color hex
  accentAlpha: string;     // accent color with alpha for bg
  isCenter?: boolean;
}

interface GEdge { src: string; tgt: string; secondary?: boolean; }

/* ────────────────────────────────────────────────────────────────── */
/* Palette — vivid but tight, 8 accent colors                         */
/* ────────────────────────────────────────────────────────────────── */

const ACCENTS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#a855f7", // purple
];

const CENTER_ACCENT = "#6366f1";

/* card sizing */
const CW = 110; // card width
const CH = 34;  // card height — compact
const CR = 5;   // corner radius

/* ────────────────────────────────────────────────────────────────── */
/* Component                                                          */
/* ────────────────────────────────────────────────────────────────── */

export const MemoryMapView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const nodesRef = useRef<CardNode[]>([]);
  const edgesRef = useRef<GEdge[]>([]);

  const panRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragNodeRef = useRef<string | null>(null);
  const clickOriRef = useRef({ x: 0, y: 0 });

  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pinned, setPinned] = useState<string | null>(null);
  const { theme } = useTheme();

  const isDark = useMemo(() =>
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : theme === "dark"
    , [theme]);

  /* ── design tokens ──────────────────────────────────────────────── */
  const tok = useMemo(() => ({
    cardBg: isDark ? "#111111" : "#ffffff",
    cardBg2: isDark ? "#0e0e0e" : "#fafafa",   // center card bg
    border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    borderHl: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.20)",
    shadow: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.10)",
    shadowHl: isDark ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.16)",
    gridLine: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.04)",
    edge: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    edgeHl: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)",
    label: isDark ? "#ededed" : "#171717",
    labelMuted: isDark ? "#737373" : "#8a8a8a",
    dot: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
  }), [isDark]);

  /* ── fetch ──────────────────────────────────────────────────────── */
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/buckets/list`, {
        headers: { auth: localStorage.getItem("token") || "" },
      })
      .then(r => setBuckets(r.data.contents || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── build graph ────────────────────────────────────────────────── */
  const buildGraph = useCallback(() => {
    if (!buckets.length) return;
    const el = canvasRef.current?.parentElement;
    const W = el?.clientWidth ?? 900;
    const H = el?.clientHeight ?? 600;
    const cx = W / 2 - CW / 2;
    const cy = H / 2 - CH / 2;

    const center: CardNode = {
      id: "center", fullTitle: "BrainBucket", label: "BrainBucket",
      x: cx, y: cy, vx: 0, vy: 0, w: 170, h: 60,
      accent: CENTER_ACCENT, accentAlpha: "#6366f122", isCenter: true,
    };

    const orbitR = Math.min(W, H) * 0.32;
    const angleStep = (2 * Math.PI) / buckets.length;

    const children: CardNode[] = buckets.map((b, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const jitter = (Math.random() - 0.5) * 50;
      const acc = ACCENTS[i % ACCENTS.length];
      const label = b.title.length > 17 ? b.title.slice(0, 17) + "…" : b.title;
      return {
        id: b._id, fullTitle: b.title, label,
        link: b.link, description: b.description,
        x: cx + Math.cos(angle) * (orbitR + jitter) - CW / 2,
        y: cy + Math.sin(angle) * (orbitR + jitter) - CH / 2,
        vx: 0, vy: 0, w: CW, h: CH,
        accent: acc, accentAlpha: acc + "18",
      };
    });

    const edges: GEdge[] = children.map(n => ({ src: "center", tgt: n.id }));
    for (let i = 0; i < children.length; i++) {
      if (Math.random() > 0.62)
        edges.push({ src: children[i].id, tgt: children[(i + 1) % children.length].id, secondary: true });
    }

    nodesRef.current = [center, ...children];
    edgesRef.current = edges;
  }, [buckets]);

  useEffect(() => { buildGraph(); }, [buildGraph]);

  /* ── hit test (card-based) ──────────────────────────────────────── */
  const hitNode = useCallback((mx: number, my: number): CardNode | null => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const sx = (n.x + panRef.current.x) * zoom;
      const sy = (n.y + panRef.current.y) * zoom;
      if (mx >= sx && mx <= sx + n.w * zoom && my >= sy && my <= sy + n.h * zoom) return n;
    }
    return null;
  }, [zoom]);

  /* ── render loop ────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      const dpr = devicePixelRatio || 1;
      canvas.width = p.clientWidth * dpr;
      canvas.height = p.clientHeight * dpr;
      canvas.style.width = p.clientWidth + "px";
      canvas.style.height = p.clientHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    /* rounded rect helper (supports ctx.roundRect natively or fallback) */
    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    };

    /* ── S-curve bezier (workflow-style) ─────────────────────────── */
    const bezierEdge = (ax: number, ay: number, bx: number, by: number) => {
      const dx = Math.abs(bx - ax) * 0.55;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.bezierCurveTo(ax + dx, ay, bx - dx, by, bx, by);
    };

    const tick = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const dpr = devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      /* ── clear + bg ── */
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = isDark ? "#0a0a0a" : "#ffffff";
      ctx.fillRect(0, 0, W, H);

      /* ── 64px grid (same as .bg-grid in index.css) ── */
      const gs = 64 * zoom;
      const gox = ((panRef.current.x * zoom) % gs + gs) % gs;
      const goy = ((panRef.current.y * zoom) % gs + gs) % gs;
      ctx.strokeStyle = tok.gridLine;
      ctx.lineWidth = 1;
      for (let gx = gox - gs; gx < W + gs; gx += gs) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = goy - gs; gy < H + gs; gy += gs) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }

      if (!nodes.length) { animRef.current = requestAnimationFrame(tick); return; }

      /* ── physics ── */
      const DAMP = 0.80, REP = 40000, SPRING_LEN = 230, SPRING_K = 0.005;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const acx = a.x + a.w / 2, acy = a.y + a.h / 2;
          const bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
          const dx = acx - bcx, dy = acy - bcy;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const f = REP / (d * d);
          const fx = dx / d * f, fy = dy / d * f;
          if (!a.isCenter && dragNodeRef.current !== a.id) { a.vx += fx; a.vy += fy; }
          if (!b.isCenter && dragNodeRef.current !== b.id) { b.vx -= fx; b.vy -= fy; }
        }
      }

      for (const e of edges) {
        const a = nodes.find(n => n.id === e.src)!;
        const b = nodes.find(n => n.id === e.tgt)!;
        if (!a || !b) continue;
        const acx = a.x + a.w / 2, acy = a.y + a.h / 2;
        const bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
        const dx = bcx - acx, dy = bcy - acy;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = (d - SPRING_LEN) * SPRING_K;
        const fx = dx / d * f, fy = dy / d * f;
        if (!a.isCenter && dragNodeRef.current !== a.id) { a.vx += fx; a.vy += fy; }
        if (!b.isCenter && dragNodeRef.current !== b.id) { b.vx -= fx; b.vy -= fy; }
      }

      for (const n of nodes) {
        if (n.isCenter || dragNodeRef.current === n.id) continue;
        n.vx *= DAMP; n.vy *= DAMP;
        n.x += n.vx; n.y += n.vy;
      }

      /* ── transform ── */
      ctx.save();
      ctx.translate(panRef.current.x * zoom, panRef.current.y * zoom);
      ctx.scale(zoom, zoom);

      /* ── draw edges ── */
      for (const e of edges) {
        const a = nodes.find(n => n.id === e.src)!;
        const b = nodes.find(n => n.id === e.tgt)!;
        if (!a || !b) continue;

        const isHl = pinned === a.id || pinned === b.id;

        /* exit point = right-center of source; entry = left-center of target */
        let ax = a.x + a.w, ay = a.y + a.h / 2;
        let bx = b.x, by = b.y + b.h / 2;

        /* if target is to the left, flip so we exit left of source */
        if (b.x + b.w / 2 < a.x + a.w / 2) {
          ax = a.x; bx = b.x + b.w;
        }

        ctx.save();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        bezierEdge(ax, ay, bx, by);
        ctx.strokeStyle = isHl ? (e.secondary ? b.accent + "99" : a.accent + "bb") : tok.edge;
        ctx.lineWidth = isHl ? 1.5 : 1;
        ctx.stroke();

        /* connection dot at entry */
        ctx.beginPath();
        ctx.arc(bx, by, isHl ? 3 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isHl ? b.accent : tok.dot;
        ctx.fill();

        /* connection dot at exit */
        ctx.beginPath();
        ctx.arc(ax, ay, isHl ? 3 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isHl ? a.accent : tok.dot;
        ctx.fill();
        ctx.restore();
      }

      /* ── draw nodes ── */
      /* render center last (on top) */
      const sorted = [...nodes].sort((a, b) => (a.isCenter ? 1 : 0) - (b.isCenter ? 1 : 0));

      for (const n of sorted) {
        const isPn = pinned === n.id;

        /* shadow */
        ctx.save();
        ctx.shadowColor = isPn ? n.accent + "44" : tok.shadow;
        ctx.shadowBlur = isPn ? 18 : 10;
        ctx.shadowOffsetY = isPn ? 3 : 2;

        /* card body */
        rr(n.x, n.y, n.w, n.h, CR);
        ctx.fillStyle = tok.cardBg;
        ctx.fill();
        ctx.restore();

        /* accent bg tint (top stripe using clip) */
        ctx.save();
        ctx.beginPath();
        ctx.rect(n.x, n.y, n.w, 3);
        ctx.fillStyle = n.accent;
        ctx.fill();

        /* clip the stripe within card radius */
        rr(n.x, n.y, n.w, n.h, CR);
        ctx.clip();
        ctx.beginPath();
        ctx.rect(n.x, n.y, n.w, 3);
        ctx.fillStyle = n.accent;
        ctx.fill();
        ctx.restore();

        /* card border */
        rr(n.x, n.y, n.w, n.h, CR);
        ctx.strokeStyle = isPn ? n.accent + "66" : tok.border;
        ctx.lineWidth = isPn ? 1.5 : 1;
        ctx.stroke();

        /* accent dot (top-left indicator, like reference image) */
        ctx.beginPath();
        ctx.arc(n.x + 14, n.y + n.h / 2 + 1, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = n.accent;
        ctx.fill();
        /* dot inner */
        ctx.beginPath();
        ctx.arc(n.x + 14, n.y + n.h / 2 + 1, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();

        /* label */
        const fsize = n.isCenter ? 11 : 10;
        const fweight = isPn ? "600" : n.isCenter ? "600" : "500";
        ctx.font = `${fweight} ${fsize}px "Geist",-apple-system,sans-serif`;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = tok.label;
        ctx.fillText(n.label ?? "", n.x + 24, n.y + n.h / 2 + 1);

        /* subtitle (link domain, muted) */
        if (n.link && !n.isCenter) {
          ctx.font = `400 9px "Geist",-apple-system,sans-serif`;
          ctx.fillStyle = tok.labelMuted;
          ctx.textBaseline = "bottom";
          try {
            const domain = new URL(n.link).hostname.replace("www.", "");
            ctx.fillText(domain, n.x + 26, n.y + n.h - 7);
          } catch {
            ctx.fillText("link", n.x + 26, n.y + n.h - 7);
          }
        }
        ctx.textBaseline = "alphabetic";
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [buckets, zoom, pinned, tok, isDark]);

  /* ── pointer handlers ── */
  const onDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    clickOriRef.current = { x: e.clientX, y: e.clientY };
    const n = hitNode(e.clientX - rect.left, e.clientY - rect.top);
    if (n && !n.isCenter) { dragNodeRef.current = n.id; }
    else { draggingRef.current = true; dragStartRef.current = { x: e.clientX - panRef.current.x * zoom, y: e.clientY - panRef.current.y * zoom }; }
  };

  const onMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;

    if (dragNodeRef.current) {
      const n = nodesRef.current.find(x => x.id === dragNodeRef.current);
      if (n) {
        n.x = (mx - panRef.current.x * zoom) / zoom - n.w / 2;
        n.y = (my - panRef.current.y * zoom) / zoom - n.h / 2;
        n.vx = 0; n.vy = 0;
      }
    } else if (draggingRef.current) {
      panRef.current = { x: (e.clientX - dragStartRef.current.x) / zoom, y: (e.clientY - dragStartRef.current.y) / zoom };
    }
  };

  const onUp = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const didMove = Math.abs(e.clientX - clickOriRef.current.x) > 5 || Math.abs(e.clientY - clickOriRef.current.y) > 5;
    const wasOnNode = dragNodeRef.current; // capture BEFORE clearing

    draggingRef.current = false;
    dragNodeRef.current = null;

    if (!didMove && rect) {
      if (wasOnNode) {
        // tap on a node — toggle pinned
        const n = nodesRef.current.find(x => x.id === wasOnNode);
        if (n && !n.isCenter) setPinned(prev => prev === n.id ? null : n.id);
      } else {
        // tap on canvas — dismiss
        setPinned(null);
      }
    }
  };

  const onLeave = () => { draggingRef.current = false; dragNodeRef.current = null; };
  const onWheel = (e: React.WheelEvent) => { e.preventDefault(); setZoom(z => Math.max(0.25, Math.min(3, z - e.deltaY * 0.001))); };
  const reset = () => { setZoom(1); panRef.current = { x: 0, y: 0 }; };

  /* pinned card */
  const tipNode = pinned ? nodesRef.current.find(n => n.id === pinned) ?? null : null;

  /* ────────────────────────────────────────────────────────────── */
  /* JSX                                                            */
  /* ────────────────────────────────────────────────────────────── */
  return (
    <div className="h-full w-full relative overflow-hidden bg-background bg-grid select-none">

      {/* Ambient color blobs — same as Chat */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px]
          bg-gradient-to-b from-indigo-500/[0.12] via-purple-500/[0.07] to-transparent
          rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] right-[8%] w-[420px] h-[300px]
          bg-gradient-to-tl from-sky-500/[0.09] via-cyan-500/[0.05] to-transparent
          rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[3%] w-[260px] h-[200px]
          bg-gradient-to-r from-violet-500/[0.06] to-transparent
          rounded-full blur-[90px]" />
      </div>

      {/* ── Header ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="absolute top-3 left-12 z-20 flex items-center gap-2 px-2.5 py-1.5
          rounded-md bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm"
      >
        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500/25 to-purple-500/25
          border border-indigo-500/20 flex items-center justify-center">
          <Network className="w-3 h-3 text-indigo-400" strokeWidth={1.5} />
        </div>
        <span className="text-[12px] font-semibold text-foreground tracking-[-0.01em]">Memory Map</span>
        {!loading && (
          <span className="text-[10px] text-muted-foreground/50 font-mono tabular-nums">
            {buckets.length} nodes
          </span>
        )}
      </motion.div>

      {/* ── Controls ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="absolute top-4 right-4 z-20 flex items-center gap-0.5 p-1
          rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm"
      >
        {([
          { Icon: ZoomIn, fn: () => setZoom(z => Math.min(3, z + 0.2)), tip: "Zoom in" },
          { Icon: ZoomOut, fn: () => setZoom(z => Math.max(0.25, z - 0.2)), tip: "Zoom out" },
          { Icon: Maximize2, fn: reset, tip: "Reset" },
          { Icon: RefreshCw, fn: buildGraph, tip: "Shuffle" },
        ]).map((b, i) => (
          <button key={i} title={b.tip} onClick={b.fn}
            className="w-7 h-7 flex items-center justify-center rounded-md
              text-muted-foreground hover:text-foreground hover:bg-accent/60
              transition-all cursor-pointer">
            <b.Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        ))}
      </motion.div>

      {/* ── Canvas / Loading / Empty ──────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full gap-2.5 relative z-10">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: `${i * 110}ms` }} />
            ))}
          </div>
          <p className="text-[12px] text-muted-foreground/50">Building your graph…</p>
        </div>
      ) : buckets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-4 relative z-10 text-center">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center
            bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/10">
            <Network className="w-6 h-6 text-indigo-400/60" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-foreground">No nodes yet</p>
            <p className="text-[12px] text-muted-foreground/60 mt-1 max-w-[220px] mx-auto">
              Create buckets to build your knowledge graph
            </p>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ cursor: "grab" }}
          onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
          onMouseLeave={onLeave} onWheel={onWheel}
        />
      )}

      {/* ── Pinned detail card — bottom-left ─────────────────────── */}
      <AnimatePresence>
        {tipNode && (
          <motion.div
            key={tipNode.id}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-12 left-4 z-30 w-56"
          >
            <div className="rounded-md bg-background border border-border/60 shadow-xl overflow-hidden">
              {/* Top accent stripe */}
              <div className="h-[3px]" style={{ background: tipNode.accent }} />

              <div className="p-3 space-y-2">
                {/* Title */}
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-[5px] shrink-0"
                    style={{ background: tipNode.accent }} />
                  <p className="text-[13px] font-semibold text-foreground leading-[1.4]">
                    {tipNode.fullTitle}
                  </p>
                </div>

                {/* Link */}
                {tipNode.link ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
                    bg-secondary/50 border border-border/40">
                    <Link2 className="w-3 h-3 text-indigo-400 shrink-0" strokeWidth={1.5} />
                    <span className="text-[11px] text-indigo-400 truncate">{tipNode.link}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md
                    border border-dashed border-border/30">
                    <Link2 className="w-3 h-3 text-muted-foreground/30 shrink-0" strokeWidth={1.5} />
                    <span className="text-[11px] text-muted-foreground/30 italic">No link</span>
                  </div>
                )}

                {/* Description */}
                {tipNode.description?.replace(/<[^>]*>/g, "").trim() ? (
                  <p className="text-[11.5px] text-muted-foreground leading-relaxed line-clamp-4
                    border-t border-border/30 pt-2">
                    {tipNode.description.replace(/<[^>]*>/g, "").trim()}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground/30 italic border-t border-border/30 pt-2">
                    No description
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-3.5 py-2 bg-secondary/20 border-t border-border/30
                flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wide font-mono">
                  Bucket
                </span>
                <button
                  onClick={() => setPinned(null)}
                  className="text-[10px] text-muted-foreground/50 hover:text-foreground
                    flex items-center gap-1 cursor-pointer transition-colors pointer-events-auto">
                  <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.5} />
                  dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hint bar ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-md
          bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm
          text-[11px] text-muted-foreground/50">
          <span>Scroll · zoom</span>
          <span className="w-px h-3 bg-border/40" />
          <span>Drag · pan</span>
          <span className="w-px h-3 bg-border/40" />
          <span>Click a node to inspect</span>
        </div>
      </motion.div>
    </div>
  );
};

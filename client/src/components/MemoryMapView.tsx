import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Network, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import axios from "axios";

interface Bucket {
  _id: string;
  title: string;
  link?: string;
}

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  borderColor: string;
}

interface Edge {
  source: string;
  target: string;
}

// SaaS-style muted gradient palette
const NODE_STYLES = [
  { color: "rgba(99, 102, 241, 0.65)", glowColor: "rgba(99, 102, 241, 0.12)", borderColor: "rgba(99, 102, 241, 0.25)" },
  { color: "rgba(139, 92, 246, 0.65)", glowColor: "rgba(139, 92, 246, 0.12)", borderColor: "rgba(139, 92, 246, 0.25)" },
  { color: "rgba(59, 130, 246, 0.65)", glowColor: "rgba(59, 130, 246, 0.12)", borderColor: "rgba(59, 130, 246, 0.25)" },
  { color: "rgba(6, 182, 212, 0.65)", glowColor: "rgba(6, 182, 212, 0.12)", borderColor: "rgba(6, 182, 212, 0.25)" },
  { color: "rgba(16, 185, 129, 0.55)", glowColor: "rgba(16, 185, 129, 0.10)", borderColor: "rgba(16, 185, 129, 0.20)" },
  { color: "rgba(245, 158, 11, 0.55)", glowColor: "rgba(245, 158, 11, 0.10)", borderColor: "rgba(245, 158, 11, 0.20)" },
  { color: "rgba(236, 72, 153, 0.55)", glowColor: "rgba(236, 72, 153, 0.10)", borderColor: "rgba(236, 72, 153, 0.20)" },
  { color: "rgba(168, 85, 247, 0.55)", glowColor: "rgba(168, 85, 247, 0.10)", borderColor: "rgba(168, 85, 247, 0.20)" },
];

export const MemoryMapView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const panOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const draggedNode = useRef<string | null>(null);

  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/buckets/list`, {
          headers: { auth: localStorage.getItem("token") || "" }
        });
        setBuckets(res.data.contents || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuckets();
  }, []);

  useEffect(() => {
    if (buckets.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const w = canvas.parentElement?.clientWidth || 800;
    const h = canvas.parentElement?.clientHeight || 600;
    const centerX = w / 2;
    const centerY = h / 2;

    const nodes: Node[] = [
      {
        id: "center",
        label: "BrainBucket",
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        radius: 24,
        color: "rgba(99, 102, 241, 0.9)",
        glowColor: "rgba(99, 102, 241, 0.15)",
        borderColor: "rgba(99, 102, 241, 0.4)",
      },
    ];

    const angleStep = (2 * Math.PI) / buckets.length;
    const baseRadius = Math.min(centerX, centerY) * 0.45;

    buckets.forEach((bucket, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const dist = baseRadius + Math.random() * 40 - 20;
      const style = NODE_STYLES[i % NODE_STYLES.length];
      nodes.push({
        id: bucket._id,
        label: bucket.title.length > 16 ? bucket.title.slice(0, 16) + "…" : bucket.title,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: 10 + Math.random() * 4,
        ...style,
      });
    });

    const edges: Edge[] = buckets.map((b) => ({ source: "center", target: b._id }));
    for (let i = 0; i < buckets.length; i++) {
      const next = (i + 1) % buckets.length;
      if (Math.random() > 0.6) {
        edges.push({ source: buckets[i]._id, target: buckets[next]._id });
      }
    }

    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [buckets]);

  const getNodeAt = useCallback((mx: number, my: number): Node | null => {
    const nodes = nodesRef.current;
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const sx = (n.x + panOffset.current.x) * zoom;
      const sy = (n.y + panOffset.current.y) * zoom;
      const r = n.radius * zoom * 1.5;
      if ((mx - sx) ** 2 + (my - sy) ** 2 < r * r) return n;
    }
    return null;
  }, [zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        canvas.style.width = parent.clientWidth + "px";
        canvas.style.height = parent.clientHeight + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      if (nodes.length === 0) {
        ctx.clearRect(0, 0, w, h);
        animRef.current = requestAnimationFrame(tick);
        return;
      }

      // Physics
      const damping = 0.93;
      const repulsion = 1800;
      const springLen = 140;
      const springK = 0.008;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (nodes[i].id !== "center" && draggedNode.current !== nodes[i].id) {
            nodes[i].vx += fx; nodes[i].vy += fy;
          }
          if (nodes[j].id !== "center" && draggedNode.current !== nodes[j].id) {
            nodes[j].vx -= fx; nodes[j].vy -= fy;
          }
        }
      }

      for (const edge of edges) {
        const a = nodes.find((n) => n.id === edge.source);
        const b = nodes.find((n) => n.id === edge.target);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - springLen) * springK;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (a.id !== "center" && draggedNode.current !== a.id) { a.vx += fx; a.vy += fy; }
        if (b.id !== "center" && draggedNode.current !== b.id) { b.vx -= fx; b.vy -= fy; }
      }

      for (const node of nodes) {
        if (node.id === "center" || draggedNode.current === node.id) continue;
        node.vx *= damping; node.vy *= damping;
        node.x += node.vx; node.y += node.vy;
      }

      // Render
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(panOffset.current.x * zoom, panOffset.current.y * zoom);
      ctx.scale(zoom, zoom);

      // Draw edges as curved lines
      for (const edge of edges) {
        const a = nodes.find((n) => n.id === edge.source);
        const b = nodes.find((n) => n.id === edge.target);
        if (!a || !b) continue;

        const isHighlighted = hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode);

        ctx.beginPath();
        // Slight curve for visual interest
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const offset = Math.sqrt(dx * dx + dy * dy) * 0.05;
        const cpX = midX - dy * 0.08;
        const cpY = midY + dx * 0.08;

        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cpX, cpY, b.x, b.y);

        if (isHighlighted) {
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, a.borderColor);
          grad.addColorStop(1, b.borderColor);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.8;
        } else {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 1;
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw ring particles on edges (subtle animation)
      const time = Date.now() * 0.001;

      // Draw nodes
      for (const node of nodes) {
        const isHovered = hoveredNode === node.id;
        const isCenter = node.id === "center";
        const r = node.radius * (isHovered ? 1.15 : 1);

        // Outer glow
        if (isHovered || isCenter) {
          const glowSize = r * (isCenter ? 3.5 : 3);
          ctx.beginPath();
          ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(node.x, node.y, r * 0.3, node.x, node.y, glowSize);
          grad.addColorStop(0, node.glowColor);
          grad.addColorStop(0.5, node.glowColor.replace(/[\d.]+\)$/, "0.05)"));
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Node shadow (SaaS depth)
        if (isCenter) {
          ctx.beginPath();
          ctx.arc(node.x, node.y + 2, r + 1, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fill();
        }

        // Main circle with gradient fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        const fillGrad = ctx.createRadialGradient(
          node.x - r * 0.3, node.y - r * 0.3, 0,
          node.x, node.y, r
        );
        fillGrad.addColorStop(0, node.color.replace(/[\d.]+\)$/, "1)"));
        fillGrad.addColorStop(1, node.color);
        ctx.fillStyle = fillGrad;
        ctx.fill();

        // Border ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered ? "rgba(255,255,255,0.35)" : node.borderColor;
        ctx.lineWidth = isHovered ? 1.5 : 0.8;
        ctx.stroke();

        // Inner highlight (glass effect)
        ctx.beginPath();
        ctx.arc(node.x, node.y - r * 0.2, r * 0.7, 0, Math.PI * 2);
        const highlightGrad = ctx.createRadialGradient(
          node.x, node.y - r * 0.4, 0,
          node.x, node.y - r * 0.2, r * 0.7
        );
        highlightGrad.addColorStop(0, "rgba(255,255,255,0.15)");
        highlightGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = highlightGrad;
        ctx.fill();

        // Label
        const fontSize = isCenter ? 12 : 10;
        ctx.font = `${isHovered ? "600" : "500"} ${fontSize}px "Geist", -apple-system, sans-serif`;
        ctx.textAlign = "center";

        // Text shadow
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillText(node.label, node.x + 0.5, node.y + r + 15.5);

        // Text
        ctx.fillStyle = isHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)";
        ctx.fillText(node.label, node.x, node.y + r + 15);
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [buckets, zoom, hoveredNode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const node = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
    if (node && node.id !== "center") {
      draggedNode.current = node.id;
    } else {
      isDragging.current = true;
      dragStart.current = { x: e.clientX - panOffset.current.x * zoom, y: e.clientY - panOffset.current.y * zoom };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (draggedNode.current) {
      const node = nodesRef.current.find((n) => n.id === draggedNode.current);
      if (node) {
        node.x = (mx - panOffset.current.x * zoom) / zoom;
        node.y = (my - panOffset.current.y * zoom) / zoom;
        node.vx = 0; node.vy = 0;
      }
    } else if (isDragging.current) {
      panOffset.current = {
        x: (e.clientX - dragStart.current.x) / zoom,
        y: (e.clientY - dragStart.current.y) / zoom,
      };
    } else {
      const node = getNodeAt(mx, my);
      setHoveredNode(node?.id || null);
    }
  };

  const handleMouseUp = () => { isDragging.current = false; draggedNode.current = null; };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.3, Math.min(3, prev - e.deltaY * 0.001)));
  };

  const resetView = () => { setZoom(1); panOffset.current = { x: 0, y: 0 }; };

  return (
    <div className="h-full w-full overflow-hidden bg-background relative">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[250px] h-[250px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
        <button onClick={() => setZoom((z) => Math.min(3, z + 0.2))} className="p-2 rounded-lg bg-secondary/40 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all cursor-pointer">
          <ZoomIn className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.2))} className="p-2 rounded-lg bg-secondary/40 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all cursor-pointer">
          <ZoomOut className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button onClick={resetView} className="p-2 rounded-lg bg-secondary/40 backdrop-blur-md border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all cursor-pointer">
          <Maximize2 className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-secondary/40 backdrop-blur-md border border-border/50"
        >
          <Network className="w-4 h-4 text-indigo-400" strokeWidth={1.5} />
          <span className="text-[13px] font-medium text-foreground">Memory Map</span>
          <span className="text-[11px] text-muted-foreground/60 ml-1">{buckets.length} nodes</span>
        </motion.div>
      </div>

      {/* Canvas */}
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      ) : buckets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/10 flex items-center justify-center">
            <Network className="w-8 h-8 text-indigo-400/50" strokeWidth={1} />
          </div>
          <div>
            <p className="text-[16px] text-foreground font-semibold tracking-[-0.01em]">No nodes yet</p>
            <p className="text-[13px] text-muted-foreground mt-1 max-w-[260px]">Create buckets to visualize connections in your knowledge graph</p>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      )}

      {/* Footer hints */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/30 backdrop-blur-md border border-border/50 text-[11px] text-muted-foreground/50">
          <span>Scroll to zoom</span>
          <span className="w-px h-3 bg-border/30" />
          <span>Drag to pan</span>
          <span className="w-px h-3 bg-border/30" />
          <span>Drag nodes to rearrange</span>
        </div>
      </div>
    </div>
  );
};

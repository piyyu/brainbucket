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
}

interface Edge {
  source: string;
  target: string;
}

const COLORS = [
  "rgba(99, 102, 241, 0.8)",   // indigo
  "rgba(168, 85, 247, 0.8)",   // purple
  "rgba(59, 130, 246, 0.8)",   // blue
  "rgba(14, 165, 233, 0.8)",   // sky
  "rgba(20, 184, 166, 0.8)",   // teal
  "rgba(34, 197, 94, 0.8)",    // green
  "rgba(245, 158, 11, 0.8)",   // amber
  "rgba(239, 68, 68, 0.8)",    // red
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

  // Initialize nodes and edges when buckets change
  useEffect(() => {
    if (buckets.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create center node
    const nodes: Node[] = [
      {
        id: "center",
        label: "BrainBucket",
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        radius: 28,
        color: "rgba(99, 102, 241, 1)",
      },
    ];

    // Create bucket nodes in a circle around center
    const angleStep = (2 * Math.PI) / buckets.length;
    const baseRadius = Math.min(centerX, centerY) * 0.5;

    buckets.forEach((bucket, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const dist = baseRadius + Math.random() * 60 - 30;
      nodes.push({
        id: bucket._id,
        label: bucket.title.length > 18 ? bucket.title.slice(0, 18) + "…" : bucket.title,
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        radius: 14 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
      });
    });

    // Create edges from center to each bucket
    const edges: Edge[] = buckets.map((b) => ({
      source: "center",
      target: b._id,
    }));

    // Add some cross-links between nearby buckets for visual interest
    for (let i = 0; i < buckets.length; i++) {
      const next = (i + 1) % buckets.length;
      if (Math.random() > 0.5) {
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
      const dx = mx - sx;
      const dy = my - sy;
      if (dx * dx + dy * dy < (n.radius * zoom) * (n.radius * zoom) * 2) {
        return n;
      }
    }
    return null;
  }, [zoom]);

  // Physics simulation + render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * window.devicePixelRatio;
        canvas.height = parent.clientHeight * window.devicePixelRatio;
        canvas.style.width = parent.clientWidth + "px";
        canvas.style.height = parent.clientHeight + "px";
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      if (nodes.length === 0) {
        ctx.clearRect(0, 0, w, h);
        animRef.current = requestAnimationFrame(tick);
        return;
      }

      // Simple force simulation
      const damping = 0.92;
      const repulsion = 2000;
      const springLength = 150;
      const springK = 0.01;

      // Repulsive forces between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          if (nodes[i].id !== "center" && draggedNode.current !== nodes[i].id) {
            nodes[i].vx += fx;
            nodes[i].vy += fy;
          }
          if (nodes[j].id !== "center" && draggedNode.current !== nodes[j].id) {
            nodes[j].vx -= fx;
            nodes[j].vy -= fy;
          }
        }
      }

      // Spring forces along edges
      for (const edge of edges) {
        const a = nodes.find((n) => n.id === edge.source);
        const b = nodes.find((n) => n.id === edge.target);
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - springLength) * springK;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        if (a.id !== "center" && draggedNode.current !== a.id) {
          a.vx += fx;
          a.vy += fy;
        }
        if (b.id !== "center" && draggedNode.current !== b.id) {
          b.vx -= fx;
          b.vy -= fy;
        }
      }

      // Apply velocity and damping
      for (const node of nodes) {
        if (node.id === "center" || draggedNode.current === node.id) continue;
        node.vx *= damping;
        node.vy *= damping;
        node.x += node.vx;
        node.y += node.vy;
      }

      // Render
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(panOffset.current.x * zoom, panOffset.current.y * zoom);
      ctx.scale(zoom, zoom);

      // Draw edges
      for (const edge of edges) {
        const a = nodes.find((n) => n.id === edge.source);
        const b = nodes.find((n) => n.id === edge.target);
        if (!a || !b) continue;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode)
          ? "rgba(99, 102, 241, 0.4)"
          : "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode) ? 1.5 : 0.8;
        ctx.stroke();
      }

      // Draw nodes
      for (const node of nodes) {
        const isHovered = hoveredNode === node.id;
        const r = node.radius * (isHovered ? 1.2 : 1);

        // Glow
        if (isHovered || node.id === "center") {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(node.x, node.y, r * 0.5, node.x, node.y, r * 2.5);
          grad.addColorStop(0, node.color.replace("0.8", "0.2"));
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Border
        ctx.strokeStyle = isHovered ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)";
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.stroke();

        // Label
        ctx.fillStyle = isHovered ? "#fff" : "rgba(255,255,255,0.7)";
        ctx.font = `${isHovered ? "600" : "500"} ${node.id === "center" ? 13 : 11}px Geist, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + r + 16);
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

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const node = getNodeAt(mx, my);
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
        node.vx = 0;
        node.vy = 0;
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

  const handleMouseUp = () => {
    isDragging.current = false;
    draggedNode.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.3, Math.min(3, prev - e.deltaY * 0.001)));
  };

  const resetView = () => {
    setZoom(1);
    panOffset.current = { x: 0, y: 0 };
  };

  return (
    <div className="h-full w-full overflow-hidden bg-background relative">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
        <button onClick={() => setZoom((z) => Math.min(3, z + 0.2))} className="p-2 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer">
          <ZoomIn className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.2))} className="p-2 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer">
          <ZoomOut className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button onClick={resetView} className="p-2 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer">
          <Maximize2 className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Header overlay */}
      <div className="absolute top-4 left-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-secondary/30 backdrop-blur-sm border border-border/50"
        >
          <Network className="w-4 h-4 text-indigo-400" strokeWidth={1.5} />
          <span className="text-[13px] font-medium text-foreground">Memory Map</span>
          <span className="text-[11px] text-muted-foreground">{buckets.length} nodes</span>
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
        <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
          <Network className="w-12 h-12 text-muted-foreground/20" strokeWidth={1} />
          <div>
            <p className="text-[15px] text-foreground font-medium">No nodes yet</p>
            <p className="text-[13px] text-muted-foreground mt-0.5">Create buckets to visualize your knowledge graph</p>
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

      {/* Bottom info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-secondary/20 backdrop-blur-sm border border-border/50 text-[11px] text-muted-foreground">
          <span>Scroll to zoom</span>
          <span className="text-border">·</span>
          <span>Drag to pan</span>
          <span className="text-border">·</span>
          <span>Drag nodes to rearrange</span>
        </div>
      </div>
    </div>
  );
};

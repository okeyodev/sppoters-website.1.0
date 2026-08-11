/**
 * ==========================================================================
 * FILE: js/digital-strategy.js
 * PURPOSE: "Strategic Command Center" animation for Digital Strategy page
 * SYNC: Works with main.js (theme toggle, hamburger). Respects light/dark.
 * COLORS: Blue #0A66FF dominant, Green #00C896 secondary, Orange #FF6B1C accent
 * ARCHITECTURE (as per brief):
 *  1. Network engine - canvas particles + connections + mouse
 *  2. Roadmap engine - SVG stroke-dashoffset 8s loop
 *  3. Stage activation - sequential glow matching below-fold sections
 * COMMENTS: For easy collaboration
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  /* -----------------------------------------------------------------------
   * 1. NETWORK ENGINE - Blue/Green/Orange particles
   * --------------------------------------------------------------------- */
  class DSNetwork {
    constructor(id) {
      this.canvas = document.getElementById(id);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.particles = [];
      this.mouse = { x: -9999, y: -9999, r: 140 };
      this.cfg = {
        count: window.innerWidth < 768 ? 28 : 44,
        linkDist: 160,
        speed: 0.26,
      };
      this.init();
    }
    init() {
      this.resize();
      this.create();
      this.bind();
      this.animate();
      setTimeout(() => {
        document.querySelector(".grid-overlay")?.classList.add("is-visible");
      }, 120);
    }
    resize() {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = this.canvas.offsetWidth * dpr;
      this.canvas.height = this.canvas.offsetHeight * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = this.canvas.offsetWidth;
      this.h = this.canvas.offsetHeight;
    }
    create() {
      this.particles = [];
      const colors = [
        "rgba(10,102,255,0.9)", // blue dominant
        "rgba(10,102,255,0.6)",
        "rgba(0,200,150,0.7)", // green secondary
        "rgba(255,107,28,0.55)", // orange accent - fewer
      ];
      for (let i = 0; i < this.cfg.count; i++) {
        // Weighted: 50% blue, 35% green, 15% orange
        let c;
        const r = Math.random();
        if (r < 0.5) c = colors[0];
        else if (r < 0.85) c = colors[2];
        else c = colors[3];
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * this.cfg.speed,
          vy: (Math.random() - 0.5) * this.cfg.speed,
          r: Math.random() * 1.4 + 0.9,
          color: c,
          pulse: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.5 + 0.4,
        });
      }
    }
    bind() {
      window.addEventListener("resize", () => this.resize());
      window.addEventListener("mousemove", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      window.addEventListener("mouseleave", () => {
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      });
    }
    animate = () => {
      requestAnimationFrame(this.animate);
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.w, this.h);
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const lineBase = isDark ? "80,120,255" : "10,102,255";

      // Update particles
      for (let p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;
        p.pulse += 0.012;

        // Mouse interaction - executive focus
        const dx = p.x - this.mouse.x,
          dy = p.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < this.mouse.r) {
          const f = ((this.mouse.r - d) / this.mouse.r) * 0.022;
          p.x += dx * f;
          p.y += dy * f;
        }

        // Draw
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r + Math.sin(p.pulse) * 0.35, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }

      // Connections - blue dominant lines
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i],
            b = this.particles[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < this.cfg.linkDist) {
            const op = (1 - dist / this.cfg.linkDist) * (isDark ? 0.18 : 0.12);
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = `rgba(${lineBase},${op})`;
            this.ctx.lineWidth = 0.7;
            this.ctx.stroke();
          }
        }
      }
    };
  }

  /* -----------------------------------------------------------------------
   * 2. ROADMAP ENGINE - 8s storyboard loop
   * --------------------------------------------------------------------- */
  class DSRoadmap {
    constructor() {
      this.progress = document.querySelector(".road-progress");
      this.base = document.querySelector(".road-path");
      this.svg = document.querySelector(".roadmap-svg");
      this.board = document.querySelector(".roadmap-board");
      if (!this.progress) return;
      this.length = this.progress.getTotalLength();
      this.progress.style.strokeDasharray = this.length;
      this.progress.style.strokeDashoffset = this.length;
      this.start = performance.now();
      this.isMobile = window.innerWidth <= 480;
      this.buildPath();
      this.initCards();
      this.animate();
      window.addEventListener("resize", () => {
        this.isMobile = window.innerWidth <= 480;
        this.buildPath();
      });
    }
    buildPath() {
      if (!this.svg || !this.base || !this.progress) return;
      const w = this.svg.clientWidth,
        h = this.svg.clientHeight;
      let d;
      if (this.isMobile) {
        d = `M 10 10 L 10 ${h - 10}`;
      } else {
        // Premium slight wave - keeps blueprint feel
        d = `M 40 40 C ${w * 0.22} 20, ${w * 0.28} 60, ${w * 0.33} 40 S ${w * 0.66} 40, ${w * 0.68} 40 S ${w * 0.95} 20, ${w - 20} 40`;
      }
      this.base.setAttribute("d", d);
      this.progress.setAttribute("d", d);
      this.length = this.progress.getTotalLength();
      this.progress.style.strokeDasharray = this.length;
    }
    initCards() {
      document.querySelectorAll(".floating-card").forEach((c, i) => {
        setTimeout(() => c.classList.add("is-visible"), 700 + i * 240);
      });
    }
    animate = (now) => {
      requestAnimationFrame(this.animate);
      const elapsed = (now - this.start) / 1000;
      const t = elapsed % 8; // 8s loop per brief
      let prog = 0;
      if (t < 6.5) prog = t / 6.5;
      else prog = 1;

      // Drive SVG
      const offset = this.length * (1 - prog);
      this.progress.style.strokeDashoffset = offset;

      // Idle pulse 6.5-8s
      if (t > 6.5 && this.board) {
        const fy = Math.sin((t - 6.5) * 1.2) * 2.5;
        this.board.style.transform = `translateY(${fy}px)`;
        const glow = 6 + Math.sin((t - 6.5) * 2) * 2;
        this.progress.style.filter = `drop-shadow(0 0 ${glow}px rgba(10,102,255,0.45))`;
      }
    };
  }

  /* -----------------------------------------------------------------------
   * 3. STAGE ACTIVATION - Mirrors sections below fold
   * Discovery -> Documentation -> Planning -> Roadmap
   * --------------------------------------------------------------------- */
  class DSStages {
    constructor() {
      this.order = ["discovery", "documentation", "planning", "roadmap"];
      this.els = this.order.map((s) => document.querySelector(`.stage.${s}`));
      this.timings = [1000, 2000, 3500, 5200]; // per storyboard
      this.loop();
    }
    activate(i) {
      const el = this.els[i];
      if (el) el.classList.add("active");
      // Also highlight matching below-fold section
      const below = document.querySelector(`.ds-step.${this.order[i]}`);
      if (below) {
        below.style.transform = "translateY(-4px)";
        below.style.boxShadow = "0 16px 48px rgba(10,102,255,0.12)";
        setTimeout(() => {
          below.style.transform = "";
          below.style.boxShadow = "";
        }, 1600);
      }
    }
    loop() {
      // First run
      this.order.forEach((_, i) => {
        setTimeout(() => this.activate(i), this.timings[i]);
      });
      // 8s interval reset
      setInterval(() => {
        this.els.forEach((e) => e && e.classList.remove("active"));
        this.order.forEach((_, i) => {
          setTimeout(() => this.activate(i), this.timings[i]);
        });
      }, 8000);
    }
  }

  /* -----------------------------------------------------------------------
   * 4. Board tilt - premium micro-interaction (desktop only)
   * --------------------------------------------------------------------- */
  function initTilt() {
    const board = document.querySelector(".roadmap-board");
    const hero = document.querySelector(".strategy-hero");
    if (!board || !hero || window.innerWidth < 992) return;
    hero.addEventListener("mousemove", (e) => {
      const r = board.getBoundingClientRect();
      const cx = r.left + r.width / 2,
        cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width,
        dy = (e.clientY - cy) / r.height;
      board.style.transform = `perspective(1200px) rotateY(${dx * 5}deg) rotateX(${-dy * 3}deg)`;
    });
    hero.addEventListener("mouseleave", () => {
      board.style.transform = "perspective(1200px) rotateY(0) rotateX(0)";
    });
  }

  // Launch all 3 systems
  new DSNetwork("networkCanvas");
  new DSRoadmap();
  new DSStages();
  initTilt();

  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document
      .querySelectorAll(".gradient-orb")
      .forEach((o) => (o.style.animation = "none"));
  }
});

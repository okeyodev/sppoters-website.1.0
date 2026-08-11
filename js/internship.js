/**
 * ==========================================================================
 * FILE: js/internship.js
 * PURPOSE: Internship Program page - Journey narrative engine
 * SYNC: Works with main.js (theme, hamburger, back-to-top, reveal)
 * COLORS: Blue #0A66FF dominant > Green #00C896 > Orange #FF6B1C
 * ARCHITECTURE:
 *  1. InternNetwork - canvas particles + mouse interaction
 *  2. JourneyProgress - SVG stroke-dashoffset 8s loop
 *  3. JourneyStages - milestones activation + board highlight
 *  4. Board tilt + floating cards + form handling
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
   * 1. NETWORK ENGINE - particles for journey canvas
   * --------------------------------------------------------------------- */
  class InternNetwork {
    constructor(id) {
      this.canvas = document.getElementById(id);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.particles = [];
      this.mouse = { x: -9999, y: -9999, r: 140 };
      this.cfg = {
        count: window.innerWidth < 768 ? 26 : 42,
        linkDist: 155,
        speed: 0.24,
      };
      this.init();
    }
    init() {
      this.resize();
      this.create();
      this.bind();
      if (!isReducedMotion) this.animate();
      else this.drawStatic();
      setTimeout(() => {
        document.querySelector(".grid-overlay")?.classList.add("is-visible");
      }, 120);
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width || this.canvas.offsetWidth;
      const h = rect.height || this.canvas.offsetHeight;
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w;
      this.h = h;
    }
    create() {
      this.particles = [];
      for (let i = 0; i < this.cfg.count; i++) {
        const r = Math.random();
        let color;
        if (r < 0.55) color = "rgba(10,102,255,0.9)"; // blue dominant
        else if (r < 0.85) color = "rgba(0,200,150,0.75)"; // green secondary
        else color = "rgba(255,107,28,0.6)"; // orange accent
        this.particles.push({
          x: Math.random() * (this.w || 800),
          y: Math.random() * (this.h || 600),
          vx: (Math.random() - 0.5) * this.cfg.speed,
          vy: (Math.random() - 0.5) * this.cfg.speed,
          r: Math.random() * 1.3 + 0.9,
          color: color,
          pulse: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.4 + 0.4,
        });
      }
    }
    bind() {
      window.addEventListener("resize", () => {
        this.resize();
      });
      const hero = document.querySelector(".intern-hero");
      if (!hero) return;
      hero.addEventListener("mousemove", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      hero.addEventListener("mouseleave", () => {
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      });
    }
    drawStatic() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.w, this.h);
      for (let p of this.particles) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fill();
      }
      this.ctx.globalAlpha = 1;
    }
    animate = () => {
      requestAnimationFrame(this.animate);
      if (!this.ctx || !this.w) return;
      this.ctx.clearRect(0, 0, this.w, this.h);
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const lineBase = isDark ? "100,140,255" : "10,102,255";

      for (let p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;
        p.pulse += 0.01;

        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < this.mouse.r) {
          const f = ((this.mouse.r - d) / this.mouse.r) * 0.022;
          p.x += dx * f;
          p.y += dy * f;
        }

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r + Math.sin(p.pulse) * 0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fill();
      }
      this.ctx.globalAlpha = 1;

      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < this.cfg.linkDist) {
            const op = (1 - dist / this.cfg.linkDist) * (isDark ? 0.18 : 0.11);
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = `rgba(${lineBase},${op})`;
            this.ctx.lineWidth = 0.6;
            this.ctx.stroke();
          }
        }
      }
    };
  }

  /* -----------------------------------------------------------------------
   * 2. JOURNEY PROGRESS - 8s loop storyboard
   * --------------------------------------------------------------------- */
  class JourneyProgress {
    constructor() {
      this.progress = document.querySelector(".journey-progress");
      this.base = document.querySelector(".journey-path");
      this.svg = document.querySelector(".journey-svg");
      this.board = document.querySelector(".journey-board");
      if (!this.progress) return;
      try {
        this.length = this.progress.getTotalLength();
        this.progress.style.strokeDasharray = this.length;
        this.progress.style.strokeDashoffset = this.length;
      } catch {
        this.length = 400;
      }
      this.start = performance.now();
      this.isMobile = window.innerWidth <= 480;
      if (!isReducedMotion) this.animate();
      else {
        this.progress.style.strokeDashoffset = 0;
      }
      window.addEventListener("resize", () => {
        this.isMobile = window.innerWidth <= 480;
        try {
          this.length = this.progress.getTotalLength();
          this.progress.style.strokeDasharray = this.length;
        } catch {}
      });
    }
    animate = (now) => {
      requestAnimationFrame(this.animate);
      if (!this.progress) return;
      const elapsed = (now - this.start) / 1000;
      const t = elapsed % 8; // 8s loop
      let prog = 0;
      if (t < 6.5) prog = t / 6.5;
      else prog = 1;

      const offset = this.length * (1 - prog);
      this.progress.style.strokeDashoffset = offset;

      if (t > 6.5 && this.board && !this.isMobile) {
        const fy = Math.sin((t - 6.5) * 1.2) * 2.2;
        this.board.style.transform = `translateY(${fy}px)`;
        const glow = 6 + Math.sin((t - 6.5) * 2) * 2;
        this.progress.style.filter = `drop-shadow(0 0 ${glow}px rgba(10,102,255,0.45))`;
      } else if (this.board && !this.isMobile) {
        // keep tilt handled by separate class, only reset Y if no mouse tilt active
        if (!this.board.dataset.tilting) {
          this.board.style.transform = "";
        }
      }
    };
  }

  /* -----------------------------------------------------------------------
   * 3. JOURNEY STAGES - sequential glow matching milestones
   * --------------------------------------------------------------------- */
  class JourneyStages {
    constructor() {
      this.order = ["learn", "build", "deploy", "launch"];
      this.els = this.order.map((s) => document.querySelector(`.milestone.${s}`));
      this.timings = [800, 1800, 3200, 4800];
      this.belowMap = {
        learn: document.querySelector(".stack-card.native"),
        build: document.querySelector(".stack-card.cross"),
        deploy: document.querySelector(".stack-card.scale"),
        launch: document.querySelector(".stack-card.launch"),
      };
      this.init();
    }
    init() {
      // initial floating cards
      document.querySelectorAll(".floating-card").forEach((c, i) => {
        setTimeout(() => c.classList.add("is-visible"), 600 + i * 180);
      });
      this.loop();
    }
    activate(i) {
      const key = this.order[i];
      const el = this.els[i];
      if (el) el.classList.add("active");

      const below = this.belowMap[key];
      if (below && window.innerWidth > 768) {
        below.style.transform = "translateY(-4px)";
        below.style.boxShadow = "0 16px 48px rgba(10,102,255,0.12)";
        setTimeout(() => {
          below.style.transform = "";
          below.style.boxShadow = "";
        }, 1400);
      }
    }
    loop() {
      // first run
      this.order.forEach((_, i) => {
        setTimeout(() => this.activate(i), this.timings[i]);
      });

      // repeat every 8s
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
    const board = document.querySelector(".journey-board");
    const hero = document.querySelector(".intern-hero");
    if (!board || !hero || window.innerWidth < 992 || isReducedMotion) return;
    hero.addEventListener("mousemove", (e) => {
      const r = board.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      board.dataset.tilting = "1";
      board.style.transform = `perspective(1200px) rotateY(${dx * 5}deg) rotateX(${-dy * 3}deg)`;
    });
    hero.addEventListener("mouseleave", () => {
      board.dataset.tilting = "";
      board.style.transform = "perspective(1200px) rotateY(0) rotateX(0)";
      setTimeout(() => {
        if (!board.dataset.tilting) board.style.transform = "";
      }, 400);
    });
  }

  /* -----------------------------------------------------------------------
   * 5. Stack cards reveal (like digital-strategy)
   * --------------------------------------------------------------------- */
  function initStackReveal() {
    const cards = document.querySelectorAll(".stack-card");
    if (!cards.length) return;
    if (isReducedMotion) {
      cards.forEach((c) => c.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, idx) => {
          if (en.isIntersecting) {
            setTimeout(() => en.target.classList.add("in"), idx * 90);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    cards.forEach((c) => obs.observe(c));
  }

  /* -----------------------------------------------------------------------
   * 6. Form handling
   * --------------------------------------------------------------------- */
  function initForm() {
    const form = document.getElementById("internForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const original = btn ? btn.textContent : "";
      if (btn) {
        btn.textContent = "Submitting...";
        btn.disabled = true;
      }

      setTimeout(() => {
        if (window.showToast) window.showToast("Application received — we'll reach out in 48h!");
        else alert("Application received — we'll reach out in 48h!");
        form.reset();
        if (btn) {
          btn.textContent = original || "Submit application →";
          btn.disabled = false;
        }
      }, 900);
    });
  }

  /* -----------------------------------------------------------------------
   * Launch all systems
   * --------------------------------------------------------------------- */
  new InternNetwork("journeyCanvas");
  new JourneyProgress();
  new JourneyStages();
  initTilt();
  initStackReveal();
  initForm();

  if (isReducedMotion) {
    document.querySelectorAll(".gradient-orb").forEach((o) => (o.style.animation = "none"));
    document.querySelectorAll(".floating-card").forEach((c) => (c.style.animation = "none"));
  }
});

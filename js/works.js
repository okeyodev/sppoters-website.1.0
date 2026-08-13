/**
 * ==========================================================================
 * FILE: js/works.js
 * PURPOSE: Works Page - "Ideas become infrastructure"
 *          Hundreds deployed, 5 flagship showcased
 * 
 * SYNC: Works with js/main.js (theme toggle, hamburger, drawer, back-to-top,
 *       button magnet, reveal). This file ONLY handles works-specific
 *       hero animation. Header/footer logic lives in main.js - edit there
 *       and it updates everywhere.
 *
 * COLORS: Blue #0A66FF dominant 60% > Purple #7C3AED 15% > Green #00C896 15% > Orange #FF6B1C 10%
 *         Matches works.v2.html spec
 *
 * ARCHITECTURE (from works.v2 React version):
 *  1. PortfolioNetwork - canvas 46 particles + connections + mouse repel
 *     (same system as industries/digital-strategy)
 *  2. HundredsCanvas - 80 mini dots floating representing hundreds deployed
 *  3. ProjectActivation - 5 cards diamond, active cycle 2.2s (StudyPod->Telecare->FinTech->ICAN->IUFMP)
 *  4. DeployCounter - 0-100% loop every 50ms, timeline fill sync, core progress circle
 *  5. MiniProjects - 30 static mini-dots layer for hundreds concept
 *  6. Parallax - mouse move on hero: background 14px, network 8px, core 4px
 *  7. Board tilt + reveal + form handling (if any)
 *
 * STORYBOARD:
 *  0-0.5s  Grid + orbs fade
 *  0.5-1s  Portfolio network fade + links draw
 *  1-2s    Central core halo pulse, rings rotate
 *  2.2s+   Project cards sequential activation loop
 *
 * RESPONSIVE: 1200 / 992 / 768 / 600 / 480
 * COLLABORATION: Search WORKS-LOGIC for sections
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
   * WORKS-LOGIC 1: PORTFOLIO NETWORK - 46 particles with links (main canvas)
   * Same as other premium pages: blue dominant, mouse repel
   * --------------------------------------------------------------------- */
  class PortfolioNetwork {
    constructor(id) {
      this.canvas = document.getElementById(id);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.particles = [];
      this.mouse = { x: -9999, y: -9999 };
      this.cfg = { count: 46, linkDist: 150, speed: 0.24 };
      this.raf = null;
      this.init();
    }
    init() {
      this.resize();
      this.create();
      this.bind();
      if (!isReduced) this.animate();
      else this.drawStatic();
      // Fade in after 120ms - matches works.v2
      setTimeout(() => {
        this.canvas.classList.add("is-visible");
        document.querySelector(".grid-overlay")?.classList.add("is-visible");
      }, 120);
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width || this.canvas.offsetWidth || 560;
      const h = rect.height || this.canvas.offsetHeight || 580;
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
        // Blue 55% / Purple 15% / Green 18% / Orange 12% - matches spec
        if (r < 0.55) color = "rgba(10,102,255,0.92)";
        else if (r < 0.7) color = "rgba(124,58,237,0.72)";
        else if (r < 0.88) color = "rgba(0,200,150,0.78)";
        else color = "rgba(255,107,28,0.62)";
        this.particles.push({
          x: Math.random() * (this.w || 560),
          y: Math.random() * (this.h || 580),
          vx: (Math.random() - 0.5) * this.cfg.speed,
          vy: (Math.random() - 0.5) * this.cfg.speed,
          r: Math.random() * 1.4 + 0.9,
          color,
          opacity: Math.random() * 0.38 + 0.42,
        });
      }
    }
    bind() {
      window.addEventListener("resize", () => this.resize());
      const hero = document.querySelector(".works-hero");
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
      this.raf = requestAnimationFrame(this.animate);
      if (!this.ctx || !this.w) return;
      this.ctx.clearRect(0, 0, this.w, this.h);
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const lineBase = isDark ? "120,150,255" : "10,102,255";

      // Move + mouse interaction
      for (let p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;
        // Mouse repel - executive focus
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 120 && d > 0.1) {
          const f = (120 - d) / 120 * 0.04;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
      }

      // Connections
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i], b = this.particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < this.cfg.linkDist) {
            const op = (1 - dist / this.cfg.linkDist) * 0.18;
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = `rgba(${lineBase},${op})`;
            this.ctx.lineWidth = 0.6;
            this.ctx.stroke();
          }
        }
      }

      // Dots
      for (let p of this.particles) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fill();
      }
      this.ctx.globalAlpha = 1;
    };
  }

  /* -----------------------------------------------------------------------
   * WORKS-LOGIC 2: HUNDREDS CANVAS - 80 mini dots floating (hundreds concept)
   * Represents 100+ deployed projects as ambient dots
   * --------------------------------------------------------------------- */
  class HundredsCanvas {
    constructor(id) {
      this.canvas = document.getElementById(id);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.dots = [];
      this.raf = null;
      this.init();
    }
    init() {
      this.resize();
      this.create();
      if (!isReduced) this.animate();
      else this.drawStatic();
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width || 560;
      const h = rect.height || 580;
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w;
      this.h = h;
    }
    create() {
      this.dots = [];
      for (let i = 0; i < 80; i++) {
        this.dots.push({
          x: Math.random() * 560,
          y: Math.random() * 580,
          r: Math.random() * 1.2 + 0.6,
          opacity: Math.random() * 0.25 + 0.08,
          pulse: Math.random() * Math.PI * 2,
          // 4 colors cycle
          color: i % 4 === 0 ? "10,102,255" : i % 4 === 1 ? "0,200,150" : i % 4 === 2 ? "255,107,28" : "124,58,237",
        });
      }
    }
    drawStatic() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.w, this.h);
      for (let d of this.dots) {
        this.ctx.beginPath();
        this.ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${d.color},${d.opacity})`;
        this.ctx.fill();
      }
    }
    animate = () => {
      this.raf = requestAnimationFrame(this.animate);
      if (!this.ctx || !this.w) return;
      const w = this.w || 560, h = this.h || 580;
      this.ctx.clearRect(0, 0, w, h);
      for (let d of this.dots) {
        d.pulse += 0.02;
        d.x += Math.sin(d.pulse) * 0.1;
        d.y += Math.cos(d.pulse * 0.7) * 0.1;
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;
        const op = d.opacity + Math.sin(d.pulse) * 0.08;
        this.ctx.beginPath();
        this.ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${d.color},${op})`;
        this.ctx.fill();
      }
    };
  }

  /* -----------------------------------------------------------------------
   * WORKS-LOGIC 3: PROJECT ACTIVATION - 5 cards diamond, cycle every 2.2s
   * StudyPod -> Telecare -> FinTech -> ICAN -> IUFMP
   * --------------------------------------------------------------------- */
  class ProjectActivation {
    constructor() {
      this.cards = document.querySelectorAll(".project-card");
      this.deployCounter = document.getElementById("deployCounter");
      this.coreLabel = document.getElementById("coreLabel");
      if (!this.cards.length) return;
      this.index = 0;
      this.deployCount = 100;
      this.init();
    }
    init() {
      this.activate(0);
      // Cycle every 2200ms - matches works.v2
      setInterval(() => {
        this.index = (this.index + 1) % 5;
        this.activate(this.index);
        // Update deploy counter visual
        this.deployCount = 100 + this.index;
        if (this.deployCounter) this.deployCounter.textContent = `${this.deployCount} Deployed`;
      }, 2200);
    }
    activate(idx) {
      this.cards.forEach((c, i) => {
        c.classList.toggle("active", i === idx);
      });
      // Update core label to show active project initial
      const titles = ["StudyPod", "Telecare", "FinTech", "ICAN", "IUFMP"];
      if (this.coreLabel) {
        // Keep percentage, but could show project
        // this.coreLabel.textContent = titles[idx].charAt(0);
      }
    }
  }

  /* -----------------------------------------------------------------------
   * WORKS-LOGIC 4: DEPLOY COUNTER - 0-100% loop every 50ms, timeline fill sync
   * Core progress circle stroke-dashoffset animation
   * --------------------------------------------------------------------- */
  class DeployCounter {
    constructor() {
      this.timelineFill = document.getElementById("timelineFill");
      this.timelinePercent = document.getElementById("timelinePercent");
      this.coreProgress = document.getElementById("coreProgressCircle");
      this.coreLabel = document.getElementById("coreLabel");
      this.progress = 0;
      this.init();
    }
    init() {
      if (!this.timelineFill && !this.coreProgress) return;
      setInterval(() => {
        this.progress += 0.8;
        if (this.progress > 100) this.progress = 0;
        const p = Math.round(this.progress);
        if (this.timelineFill) this.timelineFill.style.width = `${p}%`;
        if (this.timelinePercent) this.timelinePercent.textContent = `${p}%`;
        if (this.coreProgress) {
          const circumference = 2 * Math.PI * 45; // r=45
          const offset = circumference - (p / 100) * circumference;
          this.coreProgress.style.strokeDashoffset = offset;
        }
        if (this.coreLabel) {
          // Show percentage in core
          // this.coreLabel.textContent = `${p}%`;
        }
      }, 50);
    }
  }

  /* -----------------------------------------------------------------------
   * WORKS-LOGIC 5: MINI PROJECTS LAYER - 30 static mini-dots for hundreds concept
   * Creates absolute positioned dots with random positions/colors
   * --------------------------------------------------------------------- */
  class MiniProjectsLayer {
    constructor() {
      this.layer = document.getElementById("miniProjectsLayer");
      if (!this.layer) return;
      this.init();
    }
    init() {
      for (let i = 0; i < 30; i++) {
        const dot = document.createElement("div");
        dot.className = `mini-dot ${["", "green", "orange", "purple"][i % 4]}`.trim();
        dot.style.left = `${Math.random() * 90 + 5}%`;
        dot.style.top = `${Math.random() * 90 + 5}%`;
        dot.style.animationDelay = `${Math.random() * 6}s`;
        this.layer.appendChild(dot);
      }
    }
  }

  /* -----------------------------------------------------------------------
   * WORKS-LOGIC 6: PARALLAX - mouse move on hero (bg 14px / network 8px / core 4px)
   * Matches other premium pages for consistency
   * --------------------------------------------------------------------- */
  class Parallax {
    constructor() {
      this.hero = document.querySelector(".works-hero");
      this.network = document.querySelector(".portfolio-network");
      this.core = document.querySelector(".central-deployment");
      this.cards = document.querySelectorAll(".project-card");
      if (!this.hero) return;
      this.bind();
    }
    bind() {
      this.hero.addEventListener("mousemove", (e) => {
        if (isReduced || window.innerWidth < 768) return;
        const rect = this.hero.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        if (this.network) this.network.style.transform = `translate(${x * 8}px, ${y * 8}px)`;
        if (this.core) this.core.style.transform = `translate(-50%, -50%) translate(${x * 4}px, ${y * 4}px)`;
        this.cards.forEach((card, i) => {
          const factor = 6 + i * 1.5;
          card.style.transform = card.classList.contains("active")
            ? `translate(${x * factor}px, ${y * factor}px) scale(1.02)`
            : `translate(${x * factor}px, ${y * factor}px)`;
          // Keep centered cards centered
          if (card.classList.contains("studypod") || card.classList.contains("iufmp")) {
            const base = "translateX(-50%)";
            card.style.transform = card.classList.contains("active")
              ? `${base} translate(${x * factor}px, ${y * factor}px) scale(1.02)`
              : `${base} translate(${x * factor}px, ${y * factor}px)`;
          }
        });
      });
      this.hero.addEventListener("mouseleave", () => {
        if (this.network) this.network.style.transform = "translate(0,0)";
        if (this.core) this.core.style.transform = "translate(-50%, -50%)";
        this.cards.forEach((card) => {
          if (card.classList.contains("studypod") || card.classList.contains("iufmp")) {
            card.style.transform = "translateX(-50%)";
            if (card.classList.contains("active")) card.style.transform = "translateX(-50%) scale(1.02)";
          } else {
            card.style.transform = "translate(0,0)";
            if (card.classList.contains("active")) card.style.transform = "scale(1.02)";
          }
        });
      });
    }
  }

  /* -----------------------------------------------------------------------
   * INIT ALL SYSTEMS
   * --------------------------------------------------------------------- */
  new PortfolioNetwork("portfolioCanvas");
  new HundredsCanvas("hundredsCanvas");
  new ProjectActivation();
  new DeployCounter();
  new MiniProjectsLayer();
  new Parallax();

  /* Ensure button magnet works even if main.js loads after (same as software-training.js) */
  document.querySelectorAll(".btn-primary, .btn-secondary").forEach((btn) => {
    if (btn.dataset.magnetBound) return;
    btn.dataset.magnetBound = "1";
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });
});

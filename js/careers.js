/**
 * ==========================================================================
 * FILE: js/careers.js
 * PURPOSE: Careers Page - Aspirational growth narrative
 * CONCEPT: "Build the future with people who care."
 * SYNC: Works with main.js (theme, hamburger, drawer, reveal, back-to-top)
 * STORYBOARD 8s loop:
 * Scene1 0-1s   : Grid fade + glowing vertical career path + nodes
 * Scene2 1-2.5s : Job cards slide in (React, Web, App) with glow
 * Scene3 2.5-4.5s: Collaboration network active (dev/design/strat/PM lines)
 * Scene4 4.5-6.5s: Blue thread moves upward, milestones light, badges appear
 * Scene5 6.5-8s  : Premium idle - float, pulse, soft glow loop
 * ARCHITECTURE:
 *  1. CareerNetwork - canvas particles + mouse repel
 *  2. CareerPathProgress - SVG path stroke-dashoffset 8s loop
 *  3. CareerStages - job cards + milestone activation
 *  4. Parallax - board 6px / cards 10px / badges 14px
 *  5. Tilt + reveal + hiring pulse
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
   * 1. NETWORK - particle network behind board (optimistic motion)
   * --------------------------------------------------------------------- */
  class CareerNetwork {
    constructor(id) {
      this.canvas = document.getElementById(id);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.particles = [];
      this.mouse = { x: -9999, y: -9999, r: 160 };
      this.cfg = {
        count: window.innerWidth < 768 ? 28 : 44,
        linkDist: 150,
        speed: 0.26,
      };
      this.init();
    }
    init() {
      this.resize();
      this.create();
      this.bind();
      if (!isReduced) this.animate();
      else this.drawStatic();
      setTimeout(() => {
        document.querySelector(".grid-overlay")?.classList.add("is-visible");
      }, 140);
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width || this.canvas.offsetWidth || 800;
      const h = rect.height || this.canvas.offsetHeight || 600;
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w; this.h = h;
    }
    create() {
      this.particles = [];
      for (let i = 0; i < this.cfg.count; i++) {
        const r = Math.random();
        let color;
        if (r < 0.56) color = "rgba(10,102,255,0.92)";       // blue dominant
        else if (r < 0.84) color = "rgba(0,200,150,0.78)";   // green secondary
        else color = "rgba(255,107,28,0.62)";               // orange accent
        this.particles.push({
          x: Math.random() * (this.w || 800),
          y: Math.random() * (this.h || 600),
          vx: (Math.random() - 0.5) * this.cfg.speed,
          vy: (Math.random() - 0.5) * this.cfg.speed,
          r: Math.random() * 1.4 + 0.9,
          color,
          pulse: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.35 + 0.45,
        });
      }
    }
    bind() {
      window.addEventListener("resize", () => this.resize());
      const hero = document.querySelector(".careers-hero");
      if (!hero) return;
      hero.addEventListener("mousemove", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      hero.addEventListener("mouseleave", () => {
        this.mouse.x = -9999; this.mouse.y = -9999;
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
      const lineBase = isDark ? "120,150,255" : "10,102,255";

      for (let p of this.particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;
        p.pulse += 0.012;

        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < this.mouse.r) {
          const f = ((this.mouse.r - d) / this.mouse.r) * 0.024;
          p.x += dx * f; p.y += dy * f;
        }

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r + Math.sin(p.pulse) * 0.25, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fill();
      }
      this.ctx.globalAlpha = 1;

      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i], b = this.particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < this.cfg.linkDist) {
            const op = (1 - dist / this.cfg.linkDist) * (isDark ? 0.20 : 0.12);
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
   * 2. CAREER PATH PROGRESS - 8s loop upward growth
   * --------------------------------------------------------------------- */
  class CareerPathProgress {
    constructor() {
      this.progress = document.querySelector(".career-progress");
      this.path = document.querySelector(".career-path");
      this.board = document.querySelector(".career-board");
      if (!this.progress) return;
      try {
        this.len = this.progress.getTotalLength();
        this.progress.style.strokeDasharray = this.len;
        this.progress.style.strokeDashoffset = this.len;
      } catch { this.len = 420; }
      this.start = performance.now();
      this.isMobile = window.innerWidth < 768;
      if (!isReduced) this.animate();
      else {
        this.progress.style.strokeDashoffset = 0;
      }
      window.addEventListener("resize", () => {
        this.isMobile = window.innerWidth < 768;
      });
    }
    animate = (now) => {
      requestAnimationFrame(this.animate);
      if (!this.progress) return;
      const elapsed = (now - this.start) / 1000;
      const t = elapsed % 8; // 8s loop
      let prog = 0;
      if (t < 0.2) prog = 0;
      else if (t < 6.5) prog = (t - 0.2) / 6.3;
      else prog = 1;

      const offset = this.len * (1 - prog);
      this.progress.style.strokeDashoffset = offset;

      // premium idle float for board
      if (t > 6.5 && this.board && !this.isMobile) {
        const fy = Math.sin((t - 6.5) * 1.15) * 2.4;
        // keep tilt transform if active
        if (!this.board.dataset.tilting) {
          this.board.style.transform = `translateY(${fy}px)`;
        }
        const glow = 7 + Math.sin((t - 6.5) * 2) * 2.5;
        this.progress.style.filter = `drop-shadow(0 0 ${glow}px rgba(10,102,255,0.5))`;
      } else if (this.board && !this.isMobile && !this.board.dataset.tilting) {
        this.board.style.transform = "";
        this.progress.style.filter = "drop-shadow(0 0 8px rgba(10,102,255,0.45))";
      }

      // collaboration pulse between 2.5-4.5s
      if (t >= 2.5 && t <= 4.5) {
        const pulse = 0.5 + Math.sin((t - 2.5) * 4) * 0.5;
        this.progress.style.opacity = 0.7 + pulse * 0.3;
      }
    };
  }

  /* -----------------------------------------------------------------------
   * 3. CAREER STAGES - job cards entrance + badges
   * --------------------------------------------------------------------- */
  class CareerStages {
    constructor() {
      this.cards = [
        document.querySelector(".job-card.react"),
        document.querySelector(".job-card.web"),
        document.querySelector(".job-card.app"),
      ].filter(Boolean);
      this.badges = document.querySelectorAll(".floating-card");
      this.init();
    }
    init() {
      // Scene 2: Roles emerge 1-2.5s
      if (!isReduced) {
        this.cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add("visible");
            setTimeout(() => card.classList.add("active"), 260);
          }, 900 + i * 420); // 0.9s, 1.32s, 1.74s
        });

        // Scene 4: Growth badges 4.5-6.5s
        this.badges.forEach((badge, i) => {
          setTimeout(() => badge.classList.add("is-visible"), 4400 + i * 280);
        });

        // Loop every 8s - re-trigger glow
        setInterval(() => {
          this.cards.forEach(c => c.classList.remove("active"));
          setTimeout(() => this.cards.forEach(c => c.classList.add("active")), 1200);
          this.badges.forEach(b => b.classList.remove("is-visible"));
          setTimeout(() => {
            this.badges.forEach((badge, i) => {
              setTimeout(() => badge.classList.add("is-visible"), i * 280);
            });
          }, 3400);
        }, 8000);
      } else {
        this.cards.forEach(c => { c.classList.add("visible","active"); });
        this.badges.forEach(b => b.classList.add("is-visible"));
      }
    }
  }

  /* -----------------------------------------------------------------------
   * 4. BOARD TILT - premium micro-interaction desktop only
   * --------------------------------------------------------------------- */
  function initTilt() {
    const board = document.querySelector(".career-board");
    const hero = document.querySelector(".careers-hero");
    if (!board || !hero || window.innerWidth < 992 || isReduced) return;
    hero.addEventListener("mousemove", (e) => {
      const r = board.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      board.dataset.tilting = "1";
      board.style.transform = `perspective(1300px) rotateY(${dx * 5.5}deg) rotateX(${-dy * 3.5}deg) translateZ(0)`;
    });
    hero.addEventListener("mouseleave", () => {
      board.dataset.tilting = "";
      board.style.transform = "perspective(1300px) rotateY(0) rotateX(0)";
      setTimeout(() => { if (!board.dataset.tilting) board.style.transform = ""; }, 420);
    });
  }

  /* -----------------------------------------------------------------------
   * 5. CURSOR PARALLAX - restrained movement
   * Board 6px / Job cards 10px / Floating 14px
   * --------------------------------------------------------------------- */
  function initParallax() {
    const hero = document.querySelector(".careers-hero");
    const board = document.querySelector(".career-board");
    const jobCards = document.querySelectorAll(".job-card");
    const floaters = document.querySelectorAll(".floating-card");
    if (!hero || isReduced || window.innerWidth < 992) return;

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.width / 2, cy = rect.height / 2;
      const mx = (e.clientX - rect.left - cx) / cx;
      const my = (e.clientY - rect.top - cy) / cy;

      if (board && !board.dataset.tilting) {
        board.style.translate = `${mx * 6}px ${my * 4}px`;
      }
      jobCards.forEach((card, i) => {
        const depth = 1 + i * 0.18;
        card.style.translate = `${mx * 10 * depth}px ${my * 6 * depth}px`;
      });
      floaters.forEach((f, i) => {
        const depth = 1 + i * 0.22;
        f.style.translate = `${mx * 14 * depth}px ${my * 9 * depth}px`;
      });
    });
    hero.addEventListener("mouseleave", () => {
      if (board) board.style.translate = "";
      jobCards.forEach(c => c.style.translate = "");
      floaters.forEach(f => f.style.translate = "");
    });
  }

  /* -----------------------------------------------------------------------
   * 6. Open roles reveal + hiring pulse
   * --------------------------------------------------------------------- */
  function initRolesReveal() {
    const cards = document.querySelectorAll(".role-card, .culture-card");
    if (!cards.length) return;
    if (isReduced) { cards.forEach(c => c.classList.add("in")); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en, idx) => {
        if (en.isIntersecting) {
          setTimeout(() => en.target.classList.add("in"), idx * 70);
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
    cards.forEach(c => obs.observe(c));
  }

  function initHiringPulse() {
    const live = document.querySelector(".board-header .live-dot");
    if (!live || isReduced) return;
    // subtle extra pulse already via CSS, just ensure visibility
    setInterval(() => {
      live.style.transform = "scale(1.15)";
      setTimeout(() => live.style.transform = "", 280);
    }, 2200);
  }

  /* Launch */
  new CareerNetwork("careerCanvas");
  new CareerPathProgress();
  new CareerStages();
  initTilt();
  initParallax();
  initRolesReveal();
  initHiringPulse();

  if (isReduced) {
    document.querySelectorAll(".gradient-orb").forEach(o => o.style.animation = "none");
    document.querySelectorAll(".floating-card").forEach(c => c.style.animation = "none");
  }
});

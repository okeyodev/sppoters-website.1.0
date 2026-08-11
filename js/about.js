/**
 * ==========================================================================
 * FILE: js/about.js
 * PURPOSE: About Page — People connected by purpose
 * The most emotionally compelling hero on the site. Sells trust.
 *
 * SYNC: Works with main.js (theme, hamburger, reveal, back-to-top)
 * COLORS: Blue #0A66FF dominant > Green #00C896 > Orange #FF6B1C
 *
 * ARCHITECTURE:
 *  1. AboutNetwork — canvas particles + connections + mouse
 *  2. TeamReveal — image fade + parallax + board tilt
 *  3. ExpertiseEngine — 5 floating labels activation
 *  4. PurposePulse — SVG blue thread traveling 8s loop
 *  5. FloatingMotion — mission/vision/values idle drift
 *  6. Reveal — below-fold sections
 *
 * STORYBOARD (8s loop):
 *  Scene 1 0-1.5s    Connection — nodes + lines fade in
 *  Scene 2 1.5-3s    Team reveal — image fades, parallax starts
 *  Scene 3 3-5s      Expertise — pills animate in
 *  Scene 4 5-6.5s    Purpose pulse — blue thread travels, cards glow
 *  Scene 5 6.5-8s    Premium idle — slow drift
 * ==========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.getElementById("aboutHero");
  const teamBoard = document.getElementById("teamBoard");
  const teamImage = document.getElementById("teamImage");
  const teamImgEl = teamImage ? teamImage.querySelector("img") : null;
  const heroContent = document.querySelector(".hero-content");
  const heroVisual = document.querySelector(".hero-visual");
  const networkMini = document.querySelector(".network-mini-overlay");
  const teamCaption = document.querySelector(".team-caption");
  const expertisePills = document.querySelectorAll(".expertise-pill");
  const floatingCards = document.querySelectorAll(".floating-card");
  const networkPath = document.querySelector(".network-path");
  const networkPulse = document.getElementById("networkPulse");

  /* -----------------------------------------------------------------------
   * 1. NETWORK ENGINE — People constellation
   * --------------------------------------------------------------------- */
  class AboutNetwork {
    constructor(id) {
      this.canvas = document.getElementById(id);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.particles = [];
      this.mouse = { x: -9999, y: -9999, r: 160 };
      this.cfg = {
        count: window.innerWidth < 768 ? 26 : 42,
        linkDist: 160,
        speed: 0.22,
      };
      this.init();
    }
    init() {
      this.resize();
      this.create();
      this.bind();
      if (!isReducedMotion) {
        this.animate();
      } else {
        this.drawStatic();
      }
      // Scene 1 — fade in
      setTimeout(() => {
        this.canvas.classList.add("is-visible");
        document.querySelector(".grid-overlay")?.classList.add("is-visible");
        if (networkPath) networkPath.classList.add("is-visible");
      }, 120);
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width || this.canvas.offsetWidth || window.innerWidth;
      const h = rect.height || this.canvas.offsetHeight || window.innerHeight;
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
        let color, glow;
        // Blue dominant 55% / Green 30% / Orange 15%
        if (r < 0.55) {
          color = "rgba(10,102,255,0.9)";
          glow = "blue";
        } else if (r < 0.85) {
          color = "rgba(0,200,150,0.75)";
          glow = "green";
        } else {
          color = "rgba(255,107,28,0.6)";
          glow = "orange";
        }
        this.particles.push({
          x: Math.random() * (this.w || 800),
          y: Math.random() * (this.h || 600),
          vx: (Math.random() - 0.5) * this.cfg.speed,
          vy: (Math.random() - 0.5) * this.cfg.speed,
          r: Math.random() * 1.4 + 0.9,
          color,
          glow,
          pulse: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.4 + 0.45,
          bright: 0, // for pulse effect
        });
      }
    }
    bind() {
      window.addEventListener("resize", () => this.resize());
      const container = hero || document;
      container.addEventListener("mousemove", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });
      container.addEventListener("mouseleave", () => {
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
        // mouse repulsion
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < this.mouse.r) {
          const f = ((this.mouse.r - d) / this.mouse.r) * 0.024;
          p.x += dx * f;
          p.y += dy * f;
        }
        // bright decay
        p.bright = Math.max(0, p.bright - 0.04);

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r + Math.sin(p.pulse) * 0.3 + p.bright * 0.8, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity + p.bright * 0.4;
        if (p.bright > 0.1) {
          this.ctx.shadowColor = p.color;
          this.ctx.shadowBlur = p.bright * 12;
        }
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
      this.ctx.globalAlpha = 1;

      // connections — Scene 1
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < this.cfg.linkDist) {
            const op = (1 - dist / this.cfg.linkDist) * (isDark ? 0.18 : 0.11) * (0.6 + (a.bright + b.bright) * 0.6);
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = `rgba(${lineBase},${op})`;
            this.ctx.lineWidth = 0.6 + (a.bright + b.bright) * 0.3;
            this.ctx.stroke();
          }
        }
      }
    };
    // Called by PurposePulse to brighten nodes near pulse
    pulseAt(x, y, radius = 80) {
      for (let p of this.particles) {
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < radius) {
          p.bright = Math.max(p.bright, 1 - d / radius);
        }
      }
    }
  }

  /* -----------------------------------------------------------------------
   * 2. TEAM REVEAL — Scene 2
   * --------------------------------------------------------------------- */
  function initTeamReveal() {
    // Hero content entrance
    setTimeout(() => {
      heroContent?.classList.add("is-visible");
    }, 200);
    setTimeout(() => {
      heroVisual?.classList.add("is-visible");
    }, 400);

    // Team image — Scene 2 1.5-3s
    setTimeout(() => {
      teamImage?.classList.add("is-visible");
      networkMini?.classList.add("is-visible");
      teamCaption?.classList.add("is-visible");
    }, 1500);

    // Floating cards — staggered after team
    floatingCards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add("is-visible");
      }, 2000 + i * 220);
    });

    // Parallax — max 6px as per brief
    if (!hero || isReducedMotion || window.innerWidth < 992) return;
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      if (teamBoard) {
        teamBoard.style.transform = `perspective(1200px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg) translate3d(${dx * 6}px, ${dy * 6}px, 0)`;
      }
      if (teamImgEl) {
        teamImgEl.style.transform = `scale(1.05) translate3d(${-dx * 8}px, ${-dy * 8}px, 0)`;
      }
    });
    hero.addEventListener("mouseleave", () => {
      if (teamBoard) teamBoard.style.transform = "perspective(1200px) rotateY(0) rotateX(0) translate3d(0,0,0)";
      if (teamImgEl) teamImgEl.style.transform = "scale(1) translate3d(0,0,0)";
    });
  }

  /* -----------------------------------------------------------------------
   * 3. EXPERTISE ENGINE — Scene 3 3-5s
   * --------------------------------------------------------------------- */
  class ExpertiseEngine {
    constructor() {
      this.pills = expertisePills;
      if (!this.pills.length) return;
      this.init();
    }
    init() {
      // Initial reveal 3-5s
      this.pills.forEach((pill, i) => {
        setTimeout(() => {
          pill.classList.add("is-visible");
        }, 3000 + i * 260);
      });

      // Loop keeps them visible, just subtle pulse in idle
      if (!isReducedMotion) {
        setInterval(() => {
          this.pills.forEach((pill) => {
            pill.classList.remove("is-visible");
          });
          setTimeout(() => {
            this.pills.forEach((pill, i) => {
              setTimeout(() => pill.classList.add("is-visible"), i * 120);
            });
          }, 400);
        }, 8000);
      }
    }
    glowAt(index) {
      const pill = this.pills[index];
      if (pill) {
        pill.classList.add("is-glowing");
        setTimeout(() => pill.classList.remove("is-glowing"), 1200);
      }
    }
    glowAll() {
      this.pills.forEach((pill, i) => {
        setTimeout(() => {
          pill.classList.add("is-glowing");
          setTimeout(() => pill.classList.remove("is-glowing"), 1000);
        }, i * 120);
      });
    }
  }

  /* -----------------------------------------------------------------------
   * 4. PURPOSE PULSE — Scene 4 5-6.5s
   * Blue thread travels, nodes brighten, cards illuminate
   * --------------------------------------------------------------------- */
  class PurposePulse {
    constructor(network, expertise) {
      this.network = network;
      this.expertise = expertise;
      this.pulse = networkPulse;
      this.path = networkPath;
      if (!this.pulse || !this.path) return;
      try {
        // Create a flowing path across the visual area
        // For simplicity, use a curated path that goes through board
        const w = 520, h = 520;
        const d = `M 40 80 C 140 60, 220 120, 280 80 S 420 40, 480 100 S 400 260, 460 340 S 300 420, 200 380 S 60 300, 40 240`;
        this.path.setAttribute("d", d);
        this.pulse.setAttribute("d", d);
        this.length = this.pulse.getTotalLength();
        this.pulse.style.strokeDasharray = `${this.length}`;
        this.pulse.style.strokeDashoffset = `${this.length}`;
      } catch {
        this.length = 800;
      }
      this.start = performance.now();
      this.animate();
    }
    animate = (now) => {
      requestAnimationFrame(this.animate);
      if (!this.pulse) return;
      const elapsed = (now - this.start) / 1000;
      const t = elapsed % 8; // 8s loop

      if (t >= 5 && t < 6.5) {
        // Scene 4 — purpose pulse traveling
        const prog = (t - 5) / 1.5; // 0 -> 1 over 1.5s
        const offset = this.length * (1 - prog);
        this.pulse.style.strokeDashoffset = offset;
        this.pulse.classList.add("is-animating");

        // Brighten cards progressively
        if (prog > 0.1) document.getElementById("cardMission")?.classList.add("is-pulsing");
        if (prog > 0.35) document.getElementById("cardVision")?.classList.add("is-pulsing");
        if (prog > 0.6) document.getElementById("cardValues")?.classList.add("is-pulsing");

        // Glow expertise pills as thread passes
        if (prog > 0.2 && prog < 0.25) this.expertise.glowAt(0);
        if (prog > 0.4 && prog < 0.45) this.expertise.glowAt(1);
        if (prog > 0.55 && prog < 0.60) this.expertise.glowAt(2);
        if (prog > 0.7 && prog < 0.75) this.expertise.glowAt(3);

        // Pulse network nodes near pulse point
        if (this.network && this.length) {
          try {
            const len = this.length * prog;
            const pt = this.pulse.getPointAtLength(len);
            // Convert SVG coords to canvas coords roughly
            const rect = this.network.canvas.getBoundingClientRect();
            const heroRect = hero.getBoundingClientRect();
            // approximate mapping
            const cx = rect.width * 0.55 + (pt.x - 260) * 0.6;
            const cy = rect.height * 0.5 + (pt.y - 260) * 0.6;
            this.network.pulseAt(cx, cy, 90);
          } catch {}
        }

      } else {
        // Idle — hide pulse
        if (t < 0.2) {
          this.pulse.style.strokeDashoffset = this.length;
          this.pulse.classList.remove("is-animating");
          document.querySelectorAll(".floating-card.is-pulsing").forEach((c) => c.classList.remove("is-pulsing"));
        }
        if (t >= 6.5 && t < 6.6) {
          // end of pulse — glow all expertise briefly
          this.expertise.glowAll();
        }
      }
    };
  }

  /* -----------------------------------------------------------------------
   * 5. FLOATING MOTION — Scene 5 6.5-8s idle
   * --------------------------------------------------------------------- */
  class FloatingMotion {
    constructor() {
      this.mission = document.getElementById("cardMission");
      this.vision = document.getElementById("cardVision");
      this.values = document.getElementById("cardValues");
      this.start = performance.now();
      if (!isReducedMotion) this.animate();
    }
    animate = (now) => {
      requestAnimationFrame(this.animate);
      const t = (now - this.start) / 1000;
      const loopT = t % 8;

      // Idle only after 6.5s, but subtle always for aliveness
      const idleFactor = loopT > 6.5 ? 1 : 0.35;

      if (this.mission && !this.mission.classList.contains("is-pulsing")) {
        const y = Math.sin(t * 0.9) * 4 * idleFactor;
        this.mission.style.transform = `translateY(${y}px)`;
      }
      if (this.vision && !this.vision.classList.contains("is-pulsing")) {
        const rot = Math.sin(t * 0.7 + 1) * 1 * idleFactor;
        const y = Math.sin(t * 0.8 + 0.5) * 3 * idleFactor;
        this.vision.style.transform = `translateY(${y}px) rotate(${rot}deg)`;
      }
      if (this.values && !this.values.classList.contains("is-pulsing")) {
        const scale = 1 + Math.sin(t * 0.6 + 2) * 0.01 * idleFactor;
        const y = Math.sin(t * 1 + 1.5) * 3 * idleFactor;
        this.values.style.transform = `translateY(${y}px) scale(${scale})`;
      }

      // Team board subtle float in idle
      if (loopT > 6.5 && teamBoard && !teamBoard.matches(":hover")) {
        const fy = Math.sin((loopT - 6.5) * 1.2) * 2.5;
        if (!teamBoard.style.transform.includes("rotateY")) {
          teamBoard.style.transform = `translateY(${fy}px)`;
        }
      }
    };
  }

  /* -----------------------------------------------------------------------
   * 6. Below-fold reveals
   * --------------------------------------------------------------------- */
  function initReveals() {
    const cards = document.querySelectorAll(".mv-card, .value-card, .about-section h2, .about-section p.lead");
    if (!cards.length) return;
    if (isReducedMotion) {
      cards.forEach((c) => c.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, i) => {
          if (en.isIntersecting) {
            setTimeout(() => en.target.classList.add("in", "reveal-in"), i * 80);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((c) => {
      c.classList.add("reveal");
      obs.observe(c);
    });
  }

  /* -----------------------------------------------------------------------
   * Launch
   * --------------------------------------------------------------------- */
  const network = new AboutNetwork("aboutNetworkCanvas");
  const expertise = new ExpertiseEngine();
  new PurposePulse(network, expertise);
  new FloatingMotion();
  initTeamReveal();
  initReveals();

  // Respect reduced motion
  if (isReducedMotion) {
    document.querySelectorAll(".gradient-orb").forEach((o) => (o.style.animation = "none"));
  }
});

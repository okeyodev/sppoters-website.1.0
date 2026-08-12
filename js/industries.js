/**
 * ==========================================================================
 * FILE: js/industries.js
 * PURPOSE: Industries Page - "One intelligence platform powering multiple industries"
 * Enterprise command center hero animation - 10s loop storyboard.
 *
 * SYNC: Works with main.js (theme toggle, hamburger, drawer, reveal, back-to-top)
 * COLORS: Blue #0A66FF dominant > Green #00C896 > Orange #FF6B1C > Purple #7C3AED
 *
 * ARCHITECTURE (5 systems):
 *  1. IndustryNetwork - canvas particles + connections + mouse repel (like other pages)
 *  2. IndustryActivation - sequential node glow FinTech->Retail (350ms stagger)
 *  3. DataFlow - SVG connection pulses center->nodes + dashboard updates
 *  4. CoreEngine - rotating rings + metric counters + sync state
 *  5. Parallax + Floating - cursor parallax (core 4px / nodes 8px / bg 14px) + idle float
 *  6. SectorsBridge - below-fold cards highlight when hero node active
 *
 * STORYBOARD 10s loop (per brief):
 *  Scene1 0-1s   : Network init - grid fade, core appears, lines draw
 *  Scene2 1-3s   : Industry activation - 8 nodes sequential
 *  Scene3 3-5.5s : Data flow - blue pulses, packets, dashboard updates
 *  Scene4 5.5-8s : Intelligence sync - all glow, charts animate, ring rotates faster
 *  Scene5 8-10s  : Executive idle - subtle float, soft pulse, drift, loop
 *
 * RESPONSIVE:
 *  1200px+ : 44/56 split - 8 nodes
 *  992px   : 48/52
 *  768px   : Stacked
 *  480px   : Simplified - 4 primary sectors (Finance, Healthcare, Gov, Logistics)
 *
 * COMMENTS: For collaboration - search INDUSTRY SECTION
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const isReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isMobileSimplified = window.innerWidth <= 480;

  /* ========================================================================
   * 1. INDUSTRY NETWORK ENGINE - Canvas particles (enterprise intelligence)
   * ======================================================================== */
  class IndustryNetwork {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.particles = [];
      this.mouse = { x: -9999, y: -9999, r: 160 };
      this.cfg = {
        count: window.innerWidth < 768 ? 28 : 46,
        linkDist: 148,
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

      // Scene 1 - Network initialization 0-1s: grid fade + canvas fade in
      setTimeout(() => {
        document.querySelector(".grid-overlay")?.classList.add("is-visible");
        this.canvas.classList.add("is-visible");
      }, 120);
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width || this.canvas.offsetWidth || 800;
      const h = rect.height || this.canvas.offsetHeight || 600;
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
        // Blue dominant 55% / Purple 15% / Green 18% / Orange 12%
        if (r < 0.55)
          color = "rgba(10,102,255,0.92)"; // blue
        else if (r < 0.7)
          color = "rgba(124,58,237,0.72)"; // purple
        else if (r < 0.88)
          color = "rgba(0,200,150,0.78)"; // green
        else color = "rgba(255,107,28,0.62)"; // orange

        this.particles.push({
          x: Math.random() * (this.w || 800),
          y: Math.random() * (this.h || 600),
          vx: (Math.random() - 0.5) * this.cfg.speed,
          vy: (Math.random() - 0.5) * this.cfg.speed,
          r: Math.random() * 1.4 + 0.9,
          color,
          pulse: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.38 + 0.42,
        });
      }
    }

    bind() {
      window.addEventListener("resize", () => this.resize());
      const hero = document.querySelector(".industries-hero");
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
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const lineBase = isDark ? "120,150,255" : "10,102,255";

      // Update + draw particles
      for (let p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;
        p.pulse += 0.012;

        // Mouse repel - executive focus interaction
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < this.mouse.r) {
          const f = ((this.mouse.r - d) / this.mouse.r) * 0.024;
          p.x += dx * f;
          p.y += dy * f;
        }

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r + Math.sin(p.pulse) * 0.28, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = p.opacity;
        this.ctx.fill();
      }
      this.ctx.globalAlpha = 1;

      // Connections - enterprise network lines
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i],
            b = this.particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < this.cfg.linkDist) {
            const op = (1 - dist / this.cfg.linkDist) * (isDark ? 0.2 : 0.12);
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

  /* ========================================================================
   * 2. INDUSTRY ACTIVATION - Sequential node glow (Scene 2: 1-3s)
   * Sectors: fintech, healthcare, government, logistics, education, energy, agriculture, retail
   * ======================================================================== */
  class IndustryActivation {
    constructor() {
      // Full 8 sectors for desktop, 4 primary for mobile 480px
      this.allSectors = [
        "fintech",
        "healthcare",
        "government",
        "logistics",
        "education",
        "energy",
        "agriculture",
        "retail",
      ];
      this.primarySectors = [
        "fintech",
        "healthcare",
        "government",
        "logistics",
      ];
      this.sectors = isMobileSimplified ? this.primarySectors : this.allSectors;

      this.nodes = this.sectors
        .map((s) => document.querySelector(`.industry-node.${s}`))
        .filter(Boolean);
      this.paths = document.querySelectorAll(".connection-path");
      this.badges = document.querySelectorAll(".network-badge");

      // Map sector to color for pulse
      this.colorMap = {
        fintech: "blue",
        healthcare: "green",
        government: "purple",
        logistics: "orange",
        education: "blue",
        energy: "orange",
        agriculture: "green",
        retail: "purple",
      };

      this.init();
    }

    init() {
      if (isReducedMotion) {
        // Instantly show all for reduced motion
        this.nodes.forEach((n) => {
          n.classList.add("is-visible", "active");
        });
        this.paths.forEach((p) => p.classList.add("is-visible"));
        this.badges.forEach((b) => b.classList.add("is-visible"));
        return;
      }

      // Scene 1: Connection lines draw 0.6-1s
      this.paths.forEach((path, i) => {
        setTimeout(() => path.classList.add("is-visible"), 600 + i * 60);
      });

      // Scene 2: Industry activation 1-3s sequential
      this.sectors.forEach((sector, index) => {
        setTimeout(
          () => {
            const node = document.querySelector(`.industry-node.${sector}`);
            if (node) {
              node.classList.add("is-visible");
              // Slight delay then active glow
              setTimeout(() => node.classList.add("active"), 180);
              // Bridge to below-fold sector card
              this.highlightSectorCard(sector);
            }
          },
          1000 + index * 350,
        ); // 350ms stagger per brief
      });

      // Badges appear after nodes
      this.badges.forEach((badge, i) => {
        setTimeout(() => badge.classList.add("is-visible"), 2400 + i * 220);
      });

      // Loop every 10s - re-trigger activation glow
      setInterval(() => {
        this.nodes.forEach((n) => n.classList.remove("active"));
        setTimeout(() => {
          this.sectors.forEach((sector, index) => {
            setTimeout(() => {
              const node = document.querySelector(`.industry-node.${sector}`);
              if (node) node.classList.add("active");
            }, index * 320);
          });
        }, 800);
      }, 10000);
    }

    highlightSectorCard(sector) {
      const card = document.querySelector(
        `.sector-card[data-sector="${sector}"]`,
      );
      if (!card || window.innerWidth < 768) return;
      card.classList.add("highlight");
      setTimeout(() => card.classList.remove("highlight"), 1600);
    }
  }

  /* ========================================================================
   * 3. DATA FLOW ENGINE - Blue pulses traveling center->nodes (Scene 3: 3-5.5s)
   * Animates SVG connection paths with traveling pulses
   * ======================================================================== */
  class DataFlowEngine {
    constructor() {
      this.svg = document.querySelector(".connection-svg");
      this.pulsePaths = document.querySelectorAll(".connection-pulse");
      this.coreBars = document.querySelectorAll(".core-bars div");
      this.coreMetric = document.querySelector(".core-metric strong");
      this.nodeMetrics = document.querySelectorAll(".node-metric");

      if (!this.svg || !this.pulsePaths.length) return;

      // Build paths dynamically if needed - connect center to each node
      this.buildConnections();

      if (!isReducedMotion) {
        this.startFlowLoop();
        this.animateCoreMetrics();
      }
    }

    buildConnections() {
      const network = document.querySelector(".industry-network");
      const core = document.querySelector(".central-core");
      if (!network || !core) return;

      // If pulse paths already have d attributes, keep them. Otherwise create from center to nodes.
      // We calculate approximate center to node lines for SVG
      const sectors = isMobileSimplified
        ? ["fintech", "healthcare", "government", "logistics"]
        : [
            "fintech",
            "healthcare",
            "government",
            "logistics",
            "education",
            "energy",
            "agriculture",
            "retail",
          ];

      // Ensure we have enough pulse paths
      sectors.forEach((sector, i) => {
        const node = document.querySelector(`.industry-node.${sector}`);
        const pulse = this.pulsePaths[i];
        if (!node || !pulse) return;

        // Get positions relative to network
        const netRect = network.getBoundingClientRect();
        const coreRect = core.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();

        const cx = coreRect.left + coreRect.width / 2 - netRect.left;
        const cy = coreRect.top + coreRect.height / 2 - netRect.top;
        const nx = nodeRect.left + nodeRect.width / 2 - netRect.left;
        const ny = nodeRect.top + nodeRect.height / 2 - netRect.top;

        // Slight curve for organic enterprise feel
        const mx = (cx + nx) / 2 + (Math.random() - 0.5) * 20;
        const my = (cy + ny) / 2 + (Math.random() - 0.5) * 20;

        const d = `M ${cx} ${cy} Q ${mx} ${my} ${nx} ${ny}`;
        pulse.setAttribute("d", d);

        // Also set base path
        const base = document.querySelectorAll(".connection-path")[i];
        if (base) base.setAttribute("d", d);

        // Assign color class
        const colorMap = {
          fintech: "blue",
          healthcare: "green",
          government: "purple",
          logistics: "orange",
          education: "blue",
          energy: "orange",
          agriculture: "green",
          retail: "purple",
        };
        pulse.classList.add(colorMap[sector] || "blue");
      });

      // Rebuild on resize (debounced)
      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => this.buildConnections(), 300);
      });
    }

    startFlowLoop() {
      const flow = () => {
        // Scene 3: Data flow 3-5.5s - pulses center->nodes
        this.pulsePaths.forEach((pulse, i) => {
          setTimeout(
            () => {
              pulse.classList.remove("is-animating");
              // Force reflow
              void pulse.offsetWidth;
              pulse.classList.add("is-animating");
              // Node sync flash when pulse arrives
              setTimeout(() => {
                const sector = pulse.dataset.sector;
                const node = sector
                  ? document.querySelector(`.industry-node.${sector}`)
                  : null;
                if (node) {
                  node.classList.add("is-syncing");
                  setTimeout(() => node.classList.remove("is-syncing"), 600);
                }
              }, 900);
            },
            3000 + i * 180,
          ); // Start at 3s, stagger
        });
      };

      // First run after Scene 2
      setTimeout(flow, 3200);
      // Loop every 10s - matches storyboard loop
      setInterval(flow, 10000);
    }

    animateCoreMetrics() {
      // Simulate live ops/sec counter updating during data flow
      if (!this.coreMetric) return;
      let base = 1240;
      setInterval(() => {
        // Small random fluctuation for live feel
        base += Math.floor(Math.random() * 40) - 18;
        if (base < 1100) base = 1100;
        if (base > 1450) base = 1450;
        this.coreMetric.textContent = `${(base / 1000).toFixed(1)}k`;

        // Animate bars
        this.coreBars.forEach((bar) => {
          const h = 6 + Math.random() * 14;
          bar.style.height = `${h}px`;
        });
      }, 1800);
    }
  }

  /* ========================================================================
   * 4. CORE ENGINE - Rotating rings + sync state (Scene 4: 5.5-8s)
   * Intelligence synchronization: all nodes glow together, charts animate
   * ======================================================================== */
  class CoreEngine {
    constructor() {
      this.core = document.querySelector(".central-core");
      this.ring = document.querySelector(".core-ring");
      this.innerRing = document.querySelector(".core-ring.inner");
      this.nodes = document.querySelectorAll(".industry-node");
      this.sectorCards = document.querySelectorAll(".sector-card");

      if (!this.core) return;

      this.start = performance.now();
      if (!isReducedMotion) this.animate();
      this.initSyncLoop();
    }

    animate = (now) => {
      requestAnimationFrame(this.animate);
      const elapsed = (now - this.start) / 1000;
      const t = elapsed % 10; // 10s loop per brief

      // Scene 4: Intelligence sync 5.5-8s - faster ring rotation + core glow
      if (t >= 5.5 && t < 8) {
        const speed = 0.8 + (t - 5.5) * 0.3; // Accelerate during sync
        if (this.ring)
          this.ring.style.transform = `rotate(${t * 18 * speed}deg)`;
        if (this.innerRing)
          this.innerRing.style.transform = `rotate(-${t * 26 * speed}deg)`;
      } else {
        // Normal slow rotation
        if (this.ring) this.ring.style.transform = `rotate(${t * 6}deg)`;
        if (this.innerRing)
          this.innerRing.style.transform = `rotate(-${t * 9}deg)`;
      }

      // Scene 5: Executive idle 8-10s - subtle float
      if (t >= 8) {
        const idleY = Math.sin((t - 8) * 1.1) * 2.2;
        const idleGlow = 20 + Math.sin((t - 8) * 1.4) * 4;
        if (this.core && !this.core.dataset.parallax) {
          this.core.style.transform = `translate(-50%, -50%) translateY(${idleY}px)`;
        }
        // Soft glow pulse
        const dashboard = this.core.querySelector(".core-dashboard");
        if (dashboard) {
          dashboard.style.boxShadow = `0 ${idleGlow}px 80px rgba(10,102,255,0.18), 0 0 0 1px rgba(10,102,255,0.12) inset`;
        }
      }
    };

    initSyncLoop() {
      // Every 10s, trigger full intelligence sync
      const sync = () => {
        // Scene 4 timing 5.5-8s
        setTimeout(() => {
          this.core.classList.add("is-syncing");
          this.nodes.forEach((node, i) => {
            setTimeout(() => {
              node.classList.add("is-syncing");
              node.classList.add("active");
            }, i * 60);
          });
          // Sector cards sync
          this.sectorCards.forEach((card, i) => {
            setTimeout(() => card.classList.add("highlight"), i * 80);
          });

          setTimeout(() => {
            this.core.classList.remove("is-syncing");
            this.nodes.forEach((n) => n.classList.remove("is-syncing"));
            this.sectorCards.forEach((c) => c.classList.remove("highlight"));
          }, 2400);
        }, 5500);
      };

      sync();
      setInterval(sync, 10000);
    }
  }

  /* ========================================================================
   * 5. PARALLAX - Cursor parallax (per brief)
   *  central core: 4px / industry nodes: 8px / background particles: 14px
   * ======================================================================== */
  function initParallax() {
    const hero = document.querySelector(".industries-hero");
    const core = document.querySelector(".central-core");
    const nodes = document.querySelectorAll(".industry-node");
    const badges = document.querySelectorAll(".network-badge");
    const bg = document.querySelector(".hero-background");
    const network = document.querySelector(".industry-network");

    if (!hero || isReducedMotion || window.innerWidth < 992) return;

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const mx = (e.clientX - rect.left - cx) / cx;
      const my = (e.clientY - rect.top - cy) / cy;

      // Background particles 14px
      if (bg) bg.style.transform = `translate3d(${mx * 14}px, ${my * 8}px, 0)`;

      // Central core 4px
      if (core) {
        core.dataset.parallax = "1";
        core.style.transform = `translate(calc(-50% + ${mx * 4}px), calc(-50% + ${my * 4}px))`;
      }

      // Industry nodes 8px with depth variation
      nodes.forEach((node, i) => {
        const depth = 1 + (i % 3) * 0.18;
        const isCentered =
          node.classList.contains("fintech") ||
          node.classList.contains("education");
        const isMiddle =
          node.classList.contains("government") ||
          node.classList.contains("agriculture");

        let baseTransform = "";
        if (isCentered) baseTransform = "translateX(-50%) ";
        else if (isMiddle) baseTransform = "translateY(-50%) ";

        node.style.transform = `${baseTransform}translate3d(${mx * 8 * depth}px, ${my * 6 * depth}px, 0)`;
        // Preserve active scale
        if (node.classList.contains("active")) {
          node.style.transform += " scale(1.02)";
        }
      });

      // Badges subtle
      badges.forEach((badge) => {
        badge.style.transform = `translate3d(${mx * 6}px, ${my * 4}px, 0)`;
        if (badge.classList.contains("top")) {
          badge.style.transform = `translateX(-50%) translate3d(${mx * 6}px, ${my * 4}px, 0)`;
        }
      });

      // Network board 6px
      if (network) {
        network.style.transform = `translate3d(${mx * 6}px, ${my * 4}px, 0)`;
      }
    });

    hero.addEventListener("mouseleave", () => {
      if (bg) bg.style.transform = "";
      if (core) {
        core.dataset.parallax = "";
        core.style.transform = "translate(-50%, -50%)";
      }
      nodes.forEach((node) => {
        node.style.transform = "";
        // Re-apply centered transforms via CSS classes
        if (
          node.classList.contains("fintech") ||
          node.classList.contains("education")
        ) {
          node.style.transform = "translateX(-50%)";
        }
        if (
          node.classList.contains("government") ||
          node.classList.contains("agriculture")
        ) {
          node.style.transform = "translateY(-50%)";
        }
      });
      badges.forEach((badge) => {
        badge.style.transform = "";
        if (badge.classList.contains("top")) {
          badge.style.transform = "translateX(-50%)";
        }
      });
      if (network) network.style.transform = "";
    });
  }

  /* ========================================================================
   * 6. TILT - Premium micro-interaction (desktop only)
   * ======================================================================== */
  function initTilt() {
    const network = document.querySelector(".industry-network");
    const hero = document.querySelector(".industries-hero");
    if (!network || !hero || window.innerWidth < 992 || isReducedMotion) return;

    hero.addEventListener("mousemove", (e) => {
      const r = network.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      network.style.transform = `perspective(1400px) rotateY(${dx * 4}deg) rotateX(${-dy * 2.5}deg)`;
    });

    hero.addEventListener("mouseleave", () => {
      network.style.transform = "perspective(1400px) rotateY(0) rotateX(0)";
      setTimeout(() => {
        network.style.transform = "";
      }, 400);
    });
  }

  /* ========================================================================
   * 7. SECTORS REVEAL - Below-fold industry cards
   * ======================================================================== */
  function initSectorsReveal() {
    const cards = document.querySelectorAll(".sector-card");
    if (!cards.length) return;

    if (isReducedMotion) {
      cards.forEach((c) => c.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, idx) => {
          if (en.isIntersecting) {
            setTimeout(() => en.target.classList.add("is-visible"), idx * 90);
            observer.unobserve(en.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" },
    );

    cards.forEach((c) => observer.observe(c));
  }

  /* ========================================================================
   * 8. FLOATING IDLE - Scene 5: Subtle drift 8-10s
   * ======================================================================== */
  function initFloatingIdle() {
    const nodes = document.querySelectorAll(".industry-node");
    const core = document.querySelector(".central-core");
    if (isReducedMotion) return;

    let start = performance.now();
    function animate(now) {
      requestAnimationFrame(animate);
      const t = (now - start) / 1000;
      const loopT = t % 10;

      // Only in idle phase 8-10s for premium calm
      if (loopT >= 8 && loopT < 10) {
        const progress = (loopT - 8) / 2; // 0->1 over 2s idle
        nodes.forEach((node, i) => {
          if (node.matches(":hover")) return;
          const offset = Math.sin(t * 0.8 + i) * 1.2 * progress;
          const rot = Math.sin(t * 0.5 + i * 0.7) * 0.3 * progress;
          if (!node.style.transform.includes("translate3d")) {
            node.style.translate = `0 ${offset}px`;
            node.style.rotate = `${rot}deg`;
          }
        });
      }
    }
    requestAnimationFrame(animate);
  }

  /* ========================================================================
   * LAUNCH ALL SYSTEMS
   * ======================================================================== */
  new IndustryNetwork("industryCanvas");
  new IndustryActivation();
  new DataFlowEngine();
  new CoreEngine();
  initParallax();
  initTilt();
  initSectorsReveal();
  initFloatingIdle();

  // Respect reduced motion - disable heavy animations
  if (isReducedMotion) {
    document
      .querySelectorAll(".gradient-orb")
      .forEach((o) => (o.style.animation = "none"));
    document
      .querySelectorAll(".core-ring")
      .forEach((r) => (r.style.animation = "none"));
  }

  // Button magnet - ensure it works on industries page (backup if main.js loads late)
  function initButtonMagnetFallback() {
    document.querySelectorAll(".btn-primary, .btn-secondary").forEach((btn) => {
      if (btn.dataset.magnetBound) return;
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
      });
      btn.dataset.magnetBound = "1";
    });
  }
  initButtonMagnetFallback();
});

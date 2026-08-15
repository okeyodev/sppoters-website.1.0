/* ERP SOLUTION - DRY Implementation matching web-dev.js architecture */
document.addEventListener("DOMContentLoaded", () => {
  class GridEngine {
    constructor(id) {
      this.canvas = document.getElementById(id);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.nodes = [];
      this.mouse = { x: -9999, y: -9999, r: 120 };
      this.cfg = {
        count: window.innerWidth < 768 ? 24 : 36,
        linkDist: 140,
        speed: 0.18,
      };
      this.init();
    }
    init() {
      this.resize();
      this.createNodes();
      this.bindEvents();
      this.animate();
      setTimeout(() => {
        document
          .querySelector(".erp-hero .grid-overlay")
          ?.classList.add("is-visible");
        this.canvas.classList.add("is-visible");
      }, 100);
    }
    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = rect.width;
      this.h = rect.height;
    }
    createNodes() {
      this.nodes = [];
      for (let i = 0; i < this.cfg.count; i++) {
        const r = Math.random();
        let color;
        if (r < 0.6) color = "rgba(10,102,255,0.85)";
        else if (r < 0.85) color = "rgba(0,200,150,0.7)";
        else color = "rgba(255,107,28,0.6)";
        this.nodes.push({
          x: Math.random() * (this.w || 800),
          y: Math.random() * (this.h || 600),
          vx: (Math.random() - 0.5) * this.cfg.speed,
          vy: (Math.random() - 0.5) * this.cfg.speed,
          r: Math.random() * 1.2 + 0.8,
          color: color,
          pulse: Math.random() * Math.PI * 2,
          opacity: 0.4 + Math.random() * 0.5,
        });
      }
    }
    bindEvents() {
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
      if (!this.ctx || !this.w) return;
      this.ctx.clearRect(0, 0, this.w, this.h);
      for (let n of this.nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > this.w) n.vx *= -1;
        if (n.y < 0 || n.y > this.h) n.vy *= -1;
        n.pulse += 0.01;
        const dx = n.x - this.mouse.x,
          dy = n.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < this.mouse.r) {
          const f = ((this.mouse.r - d) / this.mouse.r) * 0.018;
          n.x += dx * f;
          n.y += dy * f;
        }
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.r + Math.sin(n.pulse) * 0.3, 0, Math.PI * 2);
        this.ctx.fillStyle = n.color;
        this.ctx.globalAlpha = n.opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
      }
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = i + 1; j < this.nodes.length; j++) {
          const a = this.nodes[i],
            b = this.nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < this.cfg.linkDist) {
            const op = (1 - dist / this.cfg.linkDist) * 0.12;
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(b.x, b.y);
            this.ctx.strokeStyle = `rgba(10,102,255,${op})`;
            this.ctx.lineWidth = 0.6;
            this.ctx.stroke();
          }
        }
      }
    };
  }

  class BrowserAssembly {
    constructor() {
      this.browser = document.querySelector(".erp-hero .hero-visual");
      this.content = document.querySelector(".erp-hero .hero-content");
      this.sidebar = document.querySelectorAll(".erp-hero .sidebar-module");
      this.metrics = document.querySelectorAll(".erp-hero .metric-card");
      this.floating = document.querySelectorAll(".erp-hero .floating-card");
      this.init();
    }
    init() {
      setTimeout(() => {
        this.content?.classList.add("is-visible");
        this.browser?.classList.add("is-visible");
      }, 200);
      this.sidebar.forEach((m, i) => {
        setTimeout(() => m.classList.add("active"), 1200 + i * 150);
      });
      this.metrics.forEach((c, i) => {
        setTimeout(() => c.classList.add("is-visible"), 1400 + i * 200);
      });
      this.floating.forEach((c, i) => {
        setTimeout(() => c.classList.add("is-visible"), 1800 + i * 200);
      });
    }
  }

  class IntegrationEngine {
    constructor() {
      this.paths = document.querySelectorAll(".erp-hero .connection-pulse");
      this.svg = document.querySelector(".erp-hero .connection-svg");
      if (!this.svg) return;
      this.buildPaths();
      this.animatePulse();
      window.addEventListener("resize", () => this.buildPaths());
    }
    buildPaths() {
      this.paths.forEach((p) => {
        try {
          const len = p.getTotalLength();
          p.style.strokeDasharray = `${len}`;
          p.style.strokeDashoffset = `${len}`;
        } catch {}
      });
    }
    animatePulse() {
      const run = () => {
        this.paths.forEach((path, i) => {
          setTimeout(() => {
            path.classList.add("is-animating");
            path.style.animation = "none";
            path.offsetHeight;
            path.style.animation = "erp-dash-move 2.5s linear";
            setTimeout(() => {
              path.classList.remove("is-animating");
              path.style.animation = "";
            }, 2500);
          }, i * 400);
        });
      };
      setTimeout(run, 2500);
      setInterval(run, 3200);
    }
  }

  class ERPMetrics {
    constructor() {
      this.bars = document.querySelectorAll(".erp-hero .chart-bar");
      this.nodes = document.querySelectorAll(".erp-hero .workflow-node");
      this.values = document.querySelectorAll(".erp-hero .metric-value");
      this.init();
    }
    init() {
      setTimeout(() => this.animateBars(), 1800);
      setTimeout(() => this.pulseNodes(), 2200);
      setInterval(() => {
        this.animateBars();
        this.pulseNodes();
        this.updateMetrics();
      }, 2400);
    }
    animateBars() {
      this.bars.forEach((bar, i) => {
        const h = 20 + Math.random() * 70;
        bar.style.height = `${h}%`;
        if (Math.random() > 0.55) bar.classList.add("active");
        else bar.classList.remove("active");
        bar.style.transitionDelay = `${i * 60}ms`;
      });
    }
    pulseNodes() {
      this.nodes.forEach((node, i) => {
        setTimeout(() => {
          node.classList.add("active");
          setTimeout(() => node.classList.remove("active"), 800);
        }, i * 220);
      });
    }
    updateMetrics() {
      this.values.forEach((el) => {
        if (el.dataset.static) return;
        const current = parseInt(el.textContent.replace(/[^0-9]/g, "")) || 0;
        if (current > 0 && current < 10000) {
          const change = Math.floor(Math.random() * 80) - 20;
          el.textContent = `${(current + change).toLocaleString()}`;
        }
      });
    }
  }

  class FloatingMotion {
    constructor() {
      this.cards = {
        inventory: document.querySelector(".erp-hero .floating-card.inventory"),
        finance: document.querySelector(".erp-hero .floating-card.finance"),
        hr: document.querySelector(".erp-hero .floating-card.hr"),
      };
      this.browser = document.querySelector(".erp-hero .browser-window");
      this.start = performance.now();
      this.animate();
    }
    animate = (now) => {
      requestAnimationFrame(this.animate);
      const t = (now - this.start) / 1000;
      if (this.cards.inventory)
        this.cards.inventory.style.transform = `translateY(${Math.sin(t) * 6}px)`;
      if (this.cards.finance)
        this.cards.finance.style.transform = `translateY(${Math.sin(t + 1) * 8}px)`;
      if (this.cards.hr)
        this.cards.hr.style.transform = `translateY(${Math.sin(t + 2) * 5}px)`;
    };
  }

  function initParallax() {
    const hero = document.querySelector(".erp-hero");
    const browser = document.querySelector(".erp-hero .browser-window");
    const floating = document.querySelectorAll(".erp-hero .floating-card");
    const orbs = document.querySelectorAll(".erp-hero .gradient-orb");
    if (!hero || !browser) return;
    if (window.innerWidth < 992) return;
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      browser.style.transform = `translate3d(${dx * 6}px,${dy * 6}px,0)`;
      floating.forEach((c) => {
        c.style.transform = `translate3d(${dx * 12}px,${dy * 12}px,0)`;
      });
      orbs.forEach((o) => {
        o.style.transform = `translate3d(${dx * 18}px,${dy * 18}px,0)`;
      });
    });
    hero.addEventListener("mouseleave", () => {
      browser.style.transform = "translate3d(0,0,0)";
      floating.forEach((c) => {
        c.style.transform = "translate3d(0,0,0)";
      });
      orbs.forEach((o) => {
        o.style.transform = "translate3d(0,0,0)";
      });
    });
  }

  function initReveal() {
    const modules = document.querySelectorAll(".erp-module");
    const benefits = document.querySelectorAll(".erp-benefit");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, i) => {
          if (en.isIntersecting) {
            setTimeout(() => {
              en.target.classList.add("is-visible");
            }, i * 100);
            observer.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    modules.forEach((m) => observer.observe(m));
    benefits.forEach((b) => observer.observe(b));
  }

  // Init all
  new GridEngine("erpGridCanvas");
  new BrowserAssembly();
  new IntegrationEngine();
  new ERPMetrics();
  new FloatingMotion();
  initParallax();
  initReveal();

  // Reduced motion support
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document
      .querySelectorAll(".erp-hero .gradient-orb, .erp-hero .floating-card")
      .forEach((el) => {
        el.style.animation = "none";
      });
  }

  // ERP-specific interactions
  const moduleFilters = document.querySelectorAll(".sidebar-module");
  moduleFilters.forEach((mod) => {
    mod.addEventListener("click", () => {
      moduleFilters.forEach((m) => m.classList.remove("active"));
      mod.classList.add("active");
      if (window.showToast) {
        window.showToast(`Switched to ${mod.textContent.trim()} module`);
      }
    });
  });
});

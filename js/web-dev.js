/* WEB-DEVELOPMENT HERO - 8s loop per brief */
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
        document.querySelector(".grid-overlay")?.classList.add("is-visible");
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
      this.browser = document.querySelector(".hero-visual");
      this.content = document.querySelector(".hero-content");
      this.sidebar = document.querySelector(".sidebar");
      this.cards = document.querySelectorAll(".dashboard-card");
      this.floating = document.querySelectorAll(".floating-card");
      this.init();
    }
    init() {
      setTimeout(() => {
        this.content?.classList.add("is-visible");
        this.browser?.classList.add("is-visible");
      }, 200);
      setTimeout(() => {
        this.sidebar?.classList.add("is-visible");
      }, 1000);
      this.cards.forEach((c, i) => {
        setTimeout(
          () => {
            c.classList.add("is-visible");
          },
          1300 + i * 250,
        );
      });
      this.floating.forEach((c, i) => {
        setTimeout(
          () => {
            c.classList.add("is-visible");
          },
          1800 + i * 200,
        );
      });
    }
  }
  class SystemIntegration {
    constructor() {
      this.paths = document.querySelectorAll(".connection-pulse");
      this.svg = document.querySelector(".connection-svg");
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
            path.style.animation = "wd-dash-move 2.5s linear";
            setTimeout(() => {
              path.classList.remove("is-animating");
              path.style.animation = "";
            }, 2500);
          }, i * 400);
        });
      };
      setTimeout(run, 2500);
      setInterval(run, 3000);
    }
  }
  class AutomationEngine {
    constructor() {
      this.bars = document.querySelectorAll(".chart-bar");
      this.nodes = document.querySelectorAll(".workflow-node");
      this.metric = document.querySelector(".metric-value");
      this.init();
    }
    init() {
      setTimeout(() => this.animateBars(), 2000);
      setTimeout(() => this.pulseNodes(), 2500);
      setInterval(() => {
        this.animateBars();
        this.pulseNodes();
        this.updateMetric();
      }, 2000);
    }
    animateBars() {
      this.bars.forEach((bar, i) => {
        const h = 20 + Math.random() * 70;
        bar.style.height = `${h}%`;
        if (Math.random() > 0.5) bar.classList.add("active");
        else bar.classList.remove("active");
        bar.style.transitionDelay = `${i * 80}ms`;
      });
    }
    pulseNodes() {
      this.nodes.forEach((node, i) => {
        setTimeout(() => {
          node.classList.add("active");
          setTimeout(() => node.classList.remove("active"), 800);
        }, i * 200);
      });
    }
    updateMetric() {
      if (this.metric) {
        const cur =
          parseInt(this.metric.textContent.replace(/[^0-9]/g, "")) || 42389;
        const ch = Math.floor(Math.random() * 200) - 80;
        this.metric.textContent = `$${(cur + ch).toLocaleString()}`;
      }
    }
  }
  class FloatingMotion {
    constructor() {
      this.cards = {
        database: document.querySelector(".floating-card.database"),
        automation: document.querySelector(".floating-card.automation"),
        security: document.querySelector(".floating-card.security"),
      };
      this.browser = document.querySelector(".browser-window");
      this.start = performance.now();
      this.animate();
    }
    animate = (now) => {
      requestAnimationFrame(this.animate);
      const t = (now - this.start) / 1000;
      if (this.cards.database)
        this.cards.database.style.transform = `translateY(${Math.sin(t) * 6}px)`;
      if (this.cards.automation)
        this.cards.automation.style.transform = `translateY(${Math.sin(t + 1) * 8}px)`;
      if (this.cards.security)
        this.cards.security.style.transform = `translateY(${Math.sin(t + 2) * 5}px)`;
      const loopT = t % 8;
      if (loopT > 6.5 && this.browser) {
        const y = Math.sin((loopT - 6.5) * 1.2) * 2;
        this.browser.style.transform = `translateY(${y}px)`;
      }
    };
  }
  function initParallax() {
    const hero = document.querySelector(".web-hero");
    const browser = document.querySelector(".browser-window");
    const floating = document.querySelectorAll(".floating-card");
    const orbs = document.querySelectorAll(".gradient-orb");
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
    const steps = document.querySelectorAll(".wd-step");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, i) => {
          if (en.isIntersecting) {
            setTimeout(() => {
              en.target.classList.add("is-visible");
            }, i * 120);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    steps.forEach((s) => obs.observe(s));
  }
  new GridEngine("gridCanvas");
  new BrowserAssembly();
  new SystemIntegration();
  new AutomationEngine();
  new FloatingMotion();
  initParallax();
  initReveal();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".gradient-orb, .floating-card").forEach((el) => {
      el.style.animation = "none";
    });
  }
});

/**
 * ==========================================================================
 * FILE: js/app-development.js
 * PURPOSE: Premium product studio hero + interactive stack cards
 * FIX: Removed auto active loop that caused first card to increase/reduce
 * COLORS: Blue #0A66FF dominant > Green #00C896 > Orange #FF6B1C
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const isReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  class DeviceFloat {
    constructor() {
      this.front = document.querySelector(".phone-front");
      this.back = document.querySelector(".phone-back");
      this.cards = document.querySelectorAll(".floating-card");
      this.start = performance.now();
      this.mouseX = 0;
      this.mouseY = 0;
      this.bind();
      if (!isReducedMotion) this.animate();
      else this.setStatic();
    }
    bind() {
      const hero = document.querySelector(".app-hero");
      if (!hero) return;
      hero.addEventListener("mousemove", (e) => {
        const rect = hero.getBoundingClientRect();
        this.mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
        this.mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
      });
      hero.addEventListener("mouseleave", () => {
        this.mouseX = 0;
        this.mouseY = 0;
      });
    }
    setStatic() {
      if (this.front) this.front.style.opacity = "1";
      if (this.back) this.back.style.opacity = "1";
      document
        .querySelectorAll(".floating-card")
        .forEach((c) => c.classList.add("is-visible"));
    }
    animate = (now) => {
      requestAnimationFrame(this.animate);
      const t = (now - this.start) / 1000;
      const floatYFront = Math.sin(t * 0.8) * 8;
      const floatYBack = Math.sin(t * 0.7 + 1) * 10;
      const rotFront = Math.sin(t * 0.5) * 1.2 - 2;
      const rotBack = Math.sin(t * 0.45 + 0.8) * 1 + 4;
      const pxFront = this.mouseX * 12,
        pyFront = this.mouseY * 10;
      const pxBack = this.mouseX * 8,
        pyBack = this.mouseY * 6;
      if (this.front)
        this.front.style.transform = `translate3d(${pxFront}px, ${floatYFront + pyFront}px, 0) rotate(${rotFront}deg)`;
      if (this.back)
        this.back.style.transform = `translate3d(${pxBack}px, ${floatYBack + pyBack}px, 0) rotate(${rotBack}deg)`;
      this.cards.forEach((card, i) => {
        const cx = this.mouseX * 16 * (1 + i * 0.2);
        const cy = this.mouseY * 12 * (1 + i * 0.2) + Math.sin(t * 0.9 + i) * 4;
        card.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      });
    };
  }

  class ScreenCycle {
    constructor() {
      this.screen1 = document.querySelector(".screen-1 .screen-inner");
      if (!this.screen1) return;
      this.states = ["dashboard", "payments", "messaging", "analytics"];
      this.index = 0;
      this.templates = {
        dashboard: `<div class="mock-status"><span>9:41</span><span>●●●</span></div><div class="mock-header"><div class="mock-avatar-row"><div class="mock-avatar">A</div><div><div style="font-weight:700; font-size:14px;">Alex Morgan</div><div style="font-size:11px; color:var(--ad-muted);">Premium • iOS</div></div></div></div><div class="mock-card blue"><div style="font-size:11px; text-transform:uppercase; letter-spacing:0.08em; color:var(--ad-muted-2); font-weight:600;">Total Revenue</div><div style="font-size:22px; font-weight:800; margin-top:4px;">$42,389</div><div style="font-size:12px; color:#16A34A;">↑ 12.4% this week</div><div class="chart-bars"><div class="chart-bar" style="height:40%"></div><div class="chart-bar" style="height:72%"></div><div class="chart-bar green" style="height:55%"></div><div class="chart-bar" style="height:88%; background:linear-gradient(180deg,var(--ad-blue),var(--ad-green));"></div><div class="chart-bar green" style="height:62%"></div></div></div><div class="mock-card"><div style="font-size:12px; font-weight:600; margin-bottom:8px;">Recent Transactions</div><div class="transaction"><span>☕ Coffee Shop</span><span style="font-weight:600;">-$4.20</span></div><div class="transaction"><span>💳 Salary</span><span style="font-weight:600; color:var(--ad-green);">+$3,200</span></div><div class="transaction"><span>🛒 Groceries</span><span style="font-weight:600;">-$84.30</span></div></div>`,
        payments: `<div class="mock-status"><span>9:41</span><span>●●●</span></div><div style="padding:16px;"><div style="font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--ad-muted-2); font-weight:700;">Payments</div><h3 style="font-size:18px; font-weight:800; margin-top:6px;">Send money</h3></div><div class="payment-card animate-in" style="margin:0 16px;"><div style="font-size:11px; opacity:0.8;">VISA • 4242</div><div style="font-size:18px; font-weight:700; margin-top:8px;">$1,240.00</div><div style="font-size:11px; opacity:0.8; margin-top:4px;">Available balance</div></div><div class="mock-card orange" style="margin-top:16px;"><div style="font-size:12px; font-weight:600;">Quick Send</div><div style="display:flex; gap:8px; margin-top:10px;"><div style="width:32px; height:32px; border-radius:50%; background:var(--ad-blue-light); display:grid; place-items:center;">A</div><div style="width:32px; height:32px; border-radius:50%; background:var(--ad-green-light); display:grid; place-items:center;">B</div><div style="width:32px; height:32px; border-radius:50%; background:var(--ad-orange-light); display:grid; place-items:center;">C</div></div></div>`,
        messaging: `<div class="mock-status"><span>9:41</span><span>●●●</span></div><div style="padding:16px; border-bottom:1px solid var(--ad-border); display:flex; align-items:center; gap:10px;"><div style="width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,var(--ad-blue),var(--ad-green));"></div><div><div style="font-weight:600; font-size:13px;">Design Team</div><div style="font-size:11px; color:#16A34A;">● Online</div></div></div><div style="padding:16px; display:flex; flex-direction:column; gap:10px;"><div style="align-self:flex-start; background:var(--ad-surface-3); padding:10px 12px; border-radius:14px 14px 14px 4px; font-size:12px; max-width:78%;">Hey! The new build is ready 🚀</div><div style="align-self:flex-end; background:var(--ad-blue); color:white; padding:10px 12px; border-radius:14px 14px 4px 14px; font-size:12px; max-width:78%;">Awesome! Love the dashboard chart.</div><div style="align-self:flex-start; background:var(--ad-surface-3); padding:10px 12px; border-radius:14px 14px 14px 4px; font-size:12px; max-width:78%;">We shipped analytics — 12% faster</div></div>`,
        analytics: `<div class="mock-status"><span>9:41</span><span>●●●</span></div><div style="padding:16px;"><div style="font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--ad-muted-2); font-weight:700;">Analytics</div><h3 style="font-size:18px; font-weight:800; margin-top:6px;">App Performance</h3></div><div class="mock-card green"><div style="display:flex; justify-content:space-between;"><span style="font-size:12px; font-weight:600;">Daily Active Users</span><span style="font-size:11px; color:#16A34A;">↑ 8.2%</span></div><div style="font-size:24px; font-weight:800; margin-top:6px;">12.4k</div><div class="chart-bars" style="height:48px; margin-top:12px;"><div class="chart-bar green" style="height:30%"></div><div class="chart-bar green" style="height:50%"></div><div class="chart-bar green" style="height:40%"></div><div class="chart-bar" style="height:80%; background:var(--ad-green);"></div><div class="chart-bar green" style="height:65%"></div><div class="chart-bar green" style="height:90%; background:linear-gradient(180deg,var(--ad-green),var(--ad-blue));"></div></div></div><div class="mock-card"><div style="font-size:12px; font-weight:600;">Platform Split</div><div style="display:flex; gap:6px; margin-top:10px;"><div style="flex:1; height:6px; background:var(--ad-blue); border-radius:99px;"></div><div style="flex:0.6; height:6px; background:var(--ad-green); border-radius:99px;"></div><div style="flex:0.3; height:6px; background:var(--ad-orange); border-radius:99px;"></div></div><div style="display:flex; justify-content:space-between; font-size:10px; color:var(--ad-muted); margin-top:6px;"><span>iOS 52%</span><span>Android 32%</span><span>Web 16%</span></div></div>`,
      };
      this.cycle();
    }
    render(s) {
      if (this.screen1) this.screen1.innerHTML = this.templates[s];
    }
    cycle() {
      this.render(this.states[this.index]);
      setInterval(() => {
        this.index = (this.index + 1) % this.states.length;
        this.render(this.states[this.index]);
      }, 2000);
    }
  }

  class ConnectionPulse {
    constructor() {
      this.pulse = document.querySelector(".connection-pulse");
      this.pills = document.querySelectorAll(".platform-pill");
      if (!this.pulse) return;
      this.length = 240;
      this.pulse.style.strokeDasharray = this.length;
      this.start = performance.now();
      this.animate();
      this.cyclePlatforms();
    }
    animate = (now) => {
      requestAnimationFrame(this.animate);
      const t = ((now - this.start) / 2000) % 1;
      const offset = this.length * (1 - t);
      if (this.pulse) this.pulse.style.strokeDashoffset = offset;
    };
    cyclePlatforms() {
      let idx = 0;
      setInterval(() => {
        this.pills.forEach((p) => p.classList.remove("active"));
        if (this.pills[idx]) this.pills[idx].classList.add("active");
        idx = (idx + 1) % this.pills.length;
      }, 800);
    }
  }

  class AppParticles {
    constructor(id) {
      this.canvas = document.getElementById(id);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext("2d");
      this.particles = [];
      this.init();
    }
    init() {
      this.resize();
      this.create();
      window.addEventListener("resize", () => this.resize());
      if (!isReducedMotion) this.animate();
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
      const count = window.innerWidth < 768 ? 20 : 36;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: Math.random() * 1.6 + 0.6,
          color:
            i % 3 === 0
              ? "10,102,255"
              : i % 3 === 1
                ? "0,200,150"
                : "255,107,28",
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    }
    animate = () => {
      requestAnimationFrame(this.animate);
      this.ctx.clearRect(0, 0, this.w, this.h);
      for (let p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > this.w) p.vx *= -1;
        if (p.y < 0 || p.y > this.h) p.vy *= -1;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        this.ctx.fill();
      }
    };
  }

  // FIXED: No auto increase/reduce - only scroll reveal, no loop
  class StackCards {
    constructor() {
      this.cards = document.querySelectorAll(".stack-card");
      if (!this.cards.length) return;
      this.initReveal();
      this.cards.forEach((card) => {
        if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
        card.setAttribute("role", "article");
        // Manual click only - no auto active
        card.addEventListener("click", () => {
          this.cards.forEach((c) => c.classList.remove("active"));
          card.classList.add("active");
        });
      });
    }
    initReveal() {
      if (isReducedMotion) {
        this.cards.forEach((c) => c.classList.add("in"));
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
      );
      this.cards.forEach((card) => observer.observe(card));
    }
  }

  new DeviceFloat();
  new ScreenCycle();
  new ConnectionPulse();
  new AppParticles("particleCanvasApp");
  new AppParticles("particleCanvas");
  new StackCards();

  document.querySelectorAll(".floating-card").forEach((c, i) => {
    setTimeout(() => c.classList.add("is-visible"), 800 + i * 200);
  });

  if (isReducedMotion) {
    document
      .querySelectorAll(".gradient-orb")
      .forEach((o) => (o.style.animation = "none"));
  }
});

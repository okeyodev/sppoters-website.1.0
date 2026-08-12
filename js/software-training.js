/**
 * ==========================================================================
 * FILE: js/software-training.js
 * PURPOSE: Software Training Page — "The Future Skills Command Center"
 *          Living learning ecosystem where 5 tech nodes orbit Learning Lab
 *
 * SYNC: Works with main.js (theme toggle, hamburger, drawer, back-to-top)
 *       Respects light/dark theme via data-theme attribute
 *
 * COLORS: Blue #0A66FF dominant > Green #00C896 > Orange #FF6B1C
 *         Purple mapped to #7C3AED for AI node per spec
 *
 * STORYBOARD 10s loop (per master spec):
 *  0-1s     Digital Awakening — grid fades, glow appears, lab scales in
 *  1-2.5s   Technology Network — orbit paths draw, 5 nodes appear one-by-one
 *  2.5-3.8s Python Activation — code in lab, connection pulse
 *  3.8-5s    Data Science — dashboard, counter 72→94%, graph rise
 *  5-6.2s    AI / LLM — PROMPT → MODEL → RESPONSE flow
 *  6.2-7.4s  Cyber Security — AUTH/NETWORK/THREAT, SECURE status
 *  7.4-8.6s  Java — BUILD SUCCESS, TEST PASSED, DEPLOY READY + progress bar
 *  8.6-10s   Mastery — all nodes glow, SKILLS ACTIVATED checklist, ring expand
 *
 * ARCHITECTURE:
 *  1. TrainingNetwork — canvas particles + connections + mouse (like other pages)
 *  2. OrbitSystem — SVG orbit paths draw + connection lines pulse
 *  3. LearningLab — content switcher synced with active node (1.2s per spec)
 *  4. NodeActivation — 10s loop managing active states + lab + courses bridge
 *  5. CursorParallax — desktop only (bg 15px, orbit 8px, lab 4px per spec)
 *  6. CourseBridge — below-fold cards highlight when node active
 *  7. Lab tilt + reveal + form handling
 *
 * COMMENTS: Added for collaboration per request
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Mark JS enabled for CSS fallback handling — ensures right visual shows even if JS partially fails
  document.documentElement.classList.add("js-enabled");
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------------------
   * 0. BUTTON MAGNET EFFECT — SAME AS INDEX.HTML (main.js PART 4)
   *    Ensures header magnet animation exists on software page like home page
   *    Re-applied here to guarantee it works even if main.js loads after
   * --------------------------------------------------------------------- */
  function initButtonMagnet() {
    document.querySelectorAll(".btn-primary, .btn-secondary").forEach((btn) => {
      // Avoid double-binding
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
  }
  initButtonMagnet();

  /* -----------------------------------------------------------------------
   * 1. NETWORK ENGINE — canvas particles (same system as other premium pages)
   *    Blue dominant 55% / Green 30% / Orange 15%
   * --------------------------------------------------------------------- */
  class TrainingNetwork {
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
      // Scene 1: grid fades in after 120ms
      setTimeout(() => {
        document.querySelector(".grid-overlay")?.classList.add("is-visible");
        if (this.canvas) this.canvas.classList.add("is-visible");
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
          color,
          pulse: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.4 + 0.4,
        });
      }
    }
    bind() {
      window.addEventListener("resize", () => this.resize());
      const hero = document.querySelector(".training-hero");
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

      // Connections — blue dominant lines
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
   * 2. ORBIT SYSTEM — SVG paths for tech nodes orbiting Learning Lab
   *    Handles draw animation + connection pulse
   * --------------------------------------------------------------------- */
  class OrbitSystem {
    constructor() {
      this.svg = document.querySelector(".orbit-system");
      this.paths = document.querySelectorAll(".orbit-path");
      this.connections = document.querySelectorAll(".connection-line");
      if (!this.svg) return;
      this.init();
    }
    init() {
      // Prepare orbit paths for draw animation
      this.paths.forEach((path) => {
        try {
          const len = path.getTotalLength();
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
        } catch {}
      });

      // Prepare connection lines
      this.connections.forEach((line) => {
        try {
          const len = line.getTotalLength();
          line.style.strokeDasharray = len;
          line.style.strokeDashoffset = len;
        } catch {
          line.style.strokeDasharray = "120";
          line.style.strokeDashoffset = "120";
        }
      });

      // Scene 1-2: orbits become visible and draw
      setTimeout(() => {
        this.paths.forEach((p) => p.classList.add("is-visible"));
      }, 600);

      setTimeout(() => {
        this.paths.forEach((p, i) => {
          setTimeout(() => p.classList.add("draw"), i * 140);
        });
      }, 900);
    }
    pulseConnection(tech) {
      // Pulse the line from active node to lab center
      const line = document.querySelector(`.connection-line.${tech}`);
      if (!line) return;
      line.classList.remove("active");
      void line.offsetWidth; // trigger reflow
      line.classList.add("active");
      // Remove after animation
      setTimeout(() => line.classList.remove("active"), 1300);
    }
  }

  /* -----------------------------------------------------------------------
   * 3. LEARNING LAB — content switcher synced with active node
   *    Switch every 1.2s per spec, templates for each tech
   * --------------------------------------------------------------------- */
  class LearningLab {
    constructor() {
      this.lab = document.querySelector(".learning-lab");
      this.screen = document.querySelector(".lab-screen");
      this.status = document.querySelector(".lab-status");
      if (!this.lab || !this.screen) return;

      // Define templates per activation scene
      this.templates = {
        default: `
          <div class="lab-content active" data-state="default">
            <div style="text-align:center; padding: 12px 0;">
              <div style="font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--st-muted-2); font-weight:700; margin-bottom:12px;">Learning Lab • Ready</div>
              <div style="width:56px; height:56px; border-radius:16px; background:linear-gradient(135deg, var(--st-blue) 0%, var(--st-green) 100%); display:grid; place-items:center; margin:0 auto 14px; color:white; font-weight:800; font-size:22px;">S</div>
              <div style="font-size:15px; font-weight:700; color:var(--st-text);">Future Skills Lab</div>
              <div style="font-size:13px; color:var(--st-muted); margin-top:6px;">Select a technology to activate</div>
              <div class="progress-bar" style="margin-top:18px;"><div class="progress-fill" style="width:18%"></div></div>
            </div>
          </div>
        `,
        python: `
          <div class="lab-content active" data-state="python">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--st-blue);">Python • Active</span>
              <span style="font-size:10px; padding:3px 8px; border-radius:9999px; background:var(--st-blue-light); color:var(--st-blue); font-weight:700;">LIVE</span>
            </div>
            <div class="code-block">
              <div class="code-line"><span class="ln">1</span><span><span class="code-keyword">for</span> project <span class="code-keyword">in</span> projects:</span></div>
              <div class="code-line"><span class="ln">2</span><span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-func">build</span>(project)</span></div>
              <div class="code-line"><span class="ln">3</span><span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-func">deploy</span>(project)</span></div>
              <div class="code-line"><span class="ln">4</span><span></span></div>
              <div class="code-line"><span class="ln">5</span><span><span class="code-keyword">print</span>(<span class="code-string">"Skills activated ✓"</span>)</span></div>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px;">
              <div style="flex:1; background:var(--st-ghost); border:1px solid var(--st-border); border-radius:10px; padding:8px 10px;"><div style="font-size:10px; color:var(--st-muted-2); text-transform:uppercase; font-weight:700;">Projects</div><div style="font-size:14px; font-weight:700; margin-top:2px;">+127 built</div></div>
              <div style="flex:1; background:var(--st-blue-light); border-radius:10px; padding:8px 10px;"><div style="font-size:10px; color:var(--st-blue); text-transform:uppercase; font-weight:700;">Status</div><div style="font-size:12px; font-weight:700; color:var(--st-blue); margin-top:2px;">Running →</div></div>
            </div>
          </div>
        `,
        data: `
          <div class="lab-content active" data-state="data">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--st-green);">Data Science • Analyzing</span>
              <span style="font-size:11px; font-weight:700; color:var(--st-green);">↑ 94.2%</span>
            </div>
            <div class="metric-grid">
              <div class="metric-card"><div class="label">Accuracy</div><div class="value" id="accuracyCounter">72%</div><div class="delta">↑ 22.2% this week</div></div>
              <div class="metric-card"><div class="label">Datasets</div><div class="value">1.4k</div><div class="delta">+84 processed</div></div>
            </div>
            <div class="chart-bars" id="dataChart">
              <div class="chart-bar" style="height:24%"></div>
              <div class="chart-bar green" style="height:42%"></div>
              <div class="chart-bar" style="height:34%"></div>
              <div class="chart-bar green" style="height:68%"></div>
              <div class="chart-bar" style="height:52%"></div>
              <div class="chart-bar green" style="height:88%"></div>
            </div>
            <div style="font-size:11px; color:var(--st-muted-2); margin-top:8px; text-align:center;">Model performance over time</div>
          </div>
        `,
        ai: `
          <div class="lab-content active" data-state="ai">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <span style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#7C3AED;">AI / LLM • Inferring</span>
              <span style="font-size:10px; padding:3px 8px; border-radius:9999px; background:rgba(124,58,237,0.12); color:#7C3AED; font-weight:700;">NEURAL ACTIVE</span>
            </div>
            <div class="ai-flow">
              <div class="ai-step active" id="aiPrompt"><span style="width:28px; height:28px; border-radius:8px; background:var(--st-ghost); display:grid; place-items:center;">💬</span><div><div style="font-weight:700;">PROMPT</div><div style="font-size:11px; color:var(--st-muted-2);">"Build a learning model..."</div></div></div>
              <div class="ai-arrow">↓</div>
              <div class="ai-step" id="aiModel"><span style="width:28px; height:28px; border-radius:8px; background:rgba(124,58,237,0.12); color:#7C3AED; display:grid; place-items:center;">🧠</span><div><div style="font-weight:700;">MODEL</div><div style="font-size:11px; color:var(--st-muted-2);">Transformer • 175B params</div></div></div>
              <div class="ai-arrow">↓</div>
              <div class="ai-step" id="aiResponse"><span style="width:28px; height:28px; border-radius:8px; background:var(--st-green-light); color:var(--st-green); display:grid; place-items:center;">✓</span><div><div style="font-weight:700;">RESPONSE</div><div style="font-size:11px; color:var(--st-muted-2);">Generated in 0.42s • Ready</div></div></div>
            </div>
          </div>
        `,
        security: `
          <div class="lab-content active" data-state="security">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--st-orange);">Cyber Security • Monitoring</span>
              <span class="status secure">SECURE</span>
            </div>
            <div class="security-grid">
              <div class="security-row"><span>🔐 AUTHENTICATION</span><span class="status secure">VERIFIED</span></div>
              <div class="security-row"><span>🌐 NETWORK</span><span class="status secure">ENCRYPTED</span></div>
              <div class="security-row" id="threatRow"><span>🛡️ THREAT DETECTION</span><span class="status warning" id="threatStatus">SCANNING...</span></div>
              <div class="security-row"><span>📊 STATUS</span><span class="status secure">PROTECTED</span></div>
            </div>
            <div style="margin-top:12px; padding:10px; background:var(--st-ghost); border-radius:10px; border:1px solid var(--st-border); font-size:11px; color:var(--st-muted);">
              <span style="color:var(--st-green);">✓</span> No threats detected • Last scan 2s ago • Firewall active
            </div>
          </div>
        `,
        java: `
          <div class="lab-content active" data-state="java">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-size:11px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#EA580C;">Java • Building</span>
              <span style="font-size:10px; padding:3px 8px; border-radius:9999px; background:rgba(234,88,12,0.12); color:#EA580C; font-weight:700;">JDK 21</span>
            </div>
            <div class="build-log">
              <div class="build-step success"><span class="icon">✓</span><span>BUILD SUCCESS — compiled 42 files</span></div>
              <div class="build-step success"><span class="icon">✓</span><span>TEST PASSED — 128 tests • 0 failed</span></div>
              <div class="build-step success"><span class="icon">✓</span><span>DEPLOY READY — artifact built</span></div>
            </div>
            <div class="progress-bar"><div class="progress-fill" id="javaProgress" style="width:0%"></div></div>
            <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:10px; color:var(--st-muted-2);"><span>Build pipeline</span><span id="javaPercent">0%</span></div>
          </div>
        `,
        mastery: `
          <div class="lab-content active" data-state="mastery">
            <div style="text-align:center; margin-bottom:14px;">
              <div style="width:44px; height:44px; border-radius:12px; background:linear-gradient(135deg, var(--st-blue) 0%, var(--st-green) 100%); display:grid; place-items:center; margin:0 auto 10px; color:white; font-size:18px;">✦</div>
              <div style="font-size:14px; font-weight:800; letter-spacing:-0.02em;">SKILLS ACTIVATED</div>
              <div style="font-size:11px; color:var(--st-muted-2); margin-top:2px;">All systems operational</div>
            </div>
            <div class="mastery-check">
              <div class="mastery-item is-visible"><span class="check">✓</span><span>Python — automation & backend</span></div>
              <div class="mastery-item is-visible"><span class="check">✓</span><span>Data Science — analytics & insights</span></div>
              <div class="mastery-item is-visible"><span class="check">✓</span><span>AI / LLM — intelligent systems</span></div>
              <div class="mastery-item is-visible"><span class="check">✓</span><span>Cyber Security — protection</span></div>
              <div class="mastery-item is-visible"><span class="check">✓</span><span>Java — enterprise building</span></div>
            </div>
            <div style="margin-top:14px; padding:10px; border-radius:10px; background:var(--st-blue-light); text-align:center; font-size:12px; font-weight:600; color:var(--st-blue);">Ring expanding outward → loop restart</div>
          </div>
        `
      };
    }
    setContent(state) {
      if (!this.screen || !this.templates[state]) return;
      this.screen.innerHTML = this.templates[state];
      // Trigger secondary animations per state
      if (state === "data") this.animateDataCounter();
      if (state === "ai") this.animateAIflow();
      if (state === "security") this.animateSecurity();
      if (state === "java") this.animateJava();
      if (state === "mastery") this.animateMastery();
    }
    animateDataCounter() {
      const el = document.getElementById("accuracyCounter");
      const bars = document.querySelectorAll("#dataChart .chart-bar");
      if (!el) return;
      const values = [72, 81, 89, 94];
      let idx = 0;
      const interval = setInterval(() => {
        el.textContent = values[idx] + "%";
        if (bars[idx]) {
          bars[idx].classList.add("active");
          bars[idx].style.height = (30 + idx * 18) + "%";
        }
        idx++;
        if (idx >= values.length) clearInterval(interval);
      }, 280);
      // Animate all bars after
      setTimeout(() => {
        bars.forEach((b, i) => {
          setTimeout(() => {
            b.style.height = (20 + Math.random() * 70) + "%";
            b.classList.add("active");
          }, i * 80);
        });
      }, 1200);
    }
    animateAIflow() {
      const steps = ["aiPrompt", "aiModel", "aiResponse"];
      steps.forEach((id, i) => {
        setTimeout(() => {
          document.getElementById(id)?.classList.add("active");
        }, i * 400);
      });
    }
    animateSecurity() {
      const threatStatus = document.getElementById("threatStatus");
      const threatRow = document.getElementById("threatRow");
      if (!threatStatus) return;
      // Briefly show warning then resolve to secure (per spec)
      setTimeout(() => {
        threatStatus.textContent = "⚠ 1 SUSPICIOUS";
        threatStatus.className = "status warning";
        threatRow?.classList.add("warning-flash");
      }, 400);
      setTimeout(() => {
        threatStatus.textContent = "SECURE";
        threatStatus.className = "status secure";
        threatRow?.classList.remove("warning-flash");
      }, 1200);
    }
    animateJava() {
      const fill = document.getElementById("javaProgress");
      const percent = document.getElementById("javaPercent");
      if (!fill) return;
      let w = 0;
      const interval = setInterval(() => {
        w += Math.random() * 18 + 8;
        if (w >= 100) {
          w = 100;
          clearInterval(interval);
        }
        fill.style.width = w + "%";
        if (percent) percent.textContent = Math.round(w) + "%";
      }, 140);
    }
    animateMastery() {
      const items = document.querySelectorAll(".mastery-item");
      items.forEach((item, i) => {
        item.classList.remove("is-visible");
        setTimeout(() => item.classList.add("is-visible"), i * 120);
      });
      // Ring expand effect
      if (this.lab) {
        this.lab.style.boxShadow = "0 0 0 0 rgba(10,102,255,0.3), var(--st-lab-shadow)";
        setTimeout(() => {
          this.lab.style.boxShadow = "0 0 0 24px rgba(10,102,255,0), var(--st-lab-shadow)";
        }, 100);
      }
    }
  }

  /* -----------------------------------------------------------------------
   * 4. NODE ACTIVATION — 10s loop orchestrator
   *    Manages which tech is active and syncs lab + connections + courses
   * --------------------------------------------------------------------- */
  class NodeActivation {
    constructor(lab, orbit) {
      this.lab = lab;
      this.orbit = orbit;
      this.nodes = {
        python: document.querySelector(".node.python"),
        data: document.querySelector(".node.data"),
        ai: document.querySelector(".node.ai"),
        security: document.querySelector(".node.security"),
        java: document.querySelector(".node.java"),
      };
      this.courses = {
        python: document.querySelector(".course-card.python"),
        data: document.querySelector(".course-card.data"),
        ai: document.querySelector(".course-card.ai"),
        security: document.querySelector(".course-card.security"),
        java: document.querySelector(".course-card.java"),
      };
      this.labEl = document.querySelector(".learning-lab");
      this.order = ["python", "data", "ai", "security", "java"];
      this.timings = {
        awakening: 0,
        network: 1000,
        python: 2500,
        data: 3800,
        ai: 5000,
        security: 6200,
        java: 7400,
        mastery: 8600,
      };
      this.init();
    }
    init() {
      // Scene 1: Digital Awakening — lab scales in
      setTimeout(() => {
        this.labEl?.classList.add("is-visible");
      }, 300);

      // Scene 2: Technology Network — nodes appear one-by-one
      // Order: Python, Data Science, AI, Cyber Security, Java (per spec)
      const appearOrder = ["python", "data", "ai", "security", "java"];
      appearOrder.forEach((key, i) => {
        setTimeout(() => {
          this.nodes[key]?.classList.add("is-visible");
        }, this.timings.network + i * 260);
      });

      // Start loop
      this.loop();
      // Repeat every 10s
      setInterval(() => this.loop(), 10000);
    }
    clearActive() {
      Object.values(this.nodes).forEach((n) => n?.classList.remove("active"));
      Object.values(this.courses).forEach((c) => c?.classList.remove("active"));
      this.labEl?.classList.remove("mastery");
    }
    activate(key) {
      this.clearActive();
      this.nodes[key]?.classList.add("active");
      this.courses[key]?.classList.add("active");
      this.lab?.setContent(key);
      this.orbit?.pulseConnection(key);
    }
    loop() {
      // Schedule activations per storyboard
      setTimeout(() => this.activate("python"), this.timings.python);
      setTimeout(() => this.activate("data"), this.timings.data);
      setTimeout(() => this.activate("ai"), this.timings.ai);
      setTimeout(() => this.activate("security"), this.timings.security);
      setTimeout(() => this.activate("java"), this.timings.java);
      setTimeout(() => {
        this.clearActive();
        // Mastery state — all nodes glow
        Object.values(this.nodes).forEach((n) => n?.classList.add("active"));
        this.labEl?.classList.add("mastery");
        this.lab?.setContent("mastery");
        // Expand ring then reset
        setTimeout(() => this.clearActive(), 1400);
      }, this.timings.mastery);
    }
  }

  /* -----------------------------------------------------------------------
   * 5. CURSOR PARALLAX — desktop only per spec
   *    Background 15px, Orbit 8px, Learning Lab 4px
   * --------------------------------------------------------------------- */
  function initParallax() {
    const hero = document.querySelector(".training-hero");
    const bg = document.querySelector(".hero-background");
    const orbit = document.querySelector(".orbit-system");
    const visual = document.querySelector(".learning-visual");
    const lab = document.querySelector(".learning-lab");
    const nodes = document.querySelectorAll(".node");
    if (!hero || isReducedMotion || window.innerWidth < 992) return;

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const mx = (e.clientX - rect.left - cx) / cx;
      const my = (e.clientY - rect.top - cy) / cy;

      if (bg) bg.style.transform = `translate3d(${mx * 15}px, ${my * 10}px, 0)`;
      if (orbit) orbit.style.transform = `translate3d(${mx * 8}px, ${my * 6}px, 0)`;
      if (lab) lab.style.transform = `translate3d(${mx * 4}px, ${my * 4}px, 0) scale(1)`;
      nodes.forEach((node, i) => {
        const depth = 1 + i * 0.15;
        node.style.transform += ` translate3d(${mx * 6 * depth}px, ${my * 4 * depth}px, 0)`;
      });
    });

    hero.addEventListener("mouseleave", () => {
      if (bg) bg.style.transform = "";
      if (orbit) orbit.style.transform = "";
      if (lab) lab.style.transform = "";
      nodes.forEach((n) => {
        // Keep original scale but reset translate
        if (n.classList.contains("is-visible") && !n.classList.contains("active")) {
          n.style.transform = "";
          if (n.classList.contains("python")) n.style.transform = "translateX(-50%)";
        } else if (n.classList.contains("active") && n.classList.contains("python")) {
          n.style.transform = "translateX(-50%) scale(1.06) translateY(-2px)";
        } else {
          n.style.transform = "";
        }
      });
    });
  }

  /* -----------------------------------------------------------------------
   * 6. COURSE BRIDGE — scroll transition (nodes separate into course cards)
   *    Creates seamless visual bridge per spec
   * --------------------------------------------------------------------- */
  function initCourseBridge() {
    const cards = document.querySelectorAll(".course-card");
    if (!cards.length) return;

    // FIX: Cards should NEVER disappear — keep them visible always
    // Previous bug: setting opacity 0 then staggered reveal caused
    // cards to hide and only last to remain in some browsers.
    // Now: cards start visible (opacity 1) with slight Y offset,
    // observer just slides them up — no hide/show.
    if (isReducedMotion) {
      cards.forEach((c) => {
        c.style.opacity = "1";
        c.style.transform = "none";
        c.classList.add("in");
      });
      return;
    }

    // Set initial state — visible but slightly down
    cards.forEach((c, i) => {
      c.style.opacity = "1";
      c.style.transform = "translateY(18px)";
      c.style.transition = `opacity .5s var(--st-ease) ${i * 0.05}s, transform .6s var(--st-ease) ${i * 0.05}s`;
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            // Slide up into place — never hide
            en.target.style.opacity = "1";
            en.target.style.transform = "translateY(0)";
            en.target.classList.add("in");
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    cards.forEach((c) => obs.observe(c));
  }

  /* -----------------------------------------------------------------------
   * 7. Lab tilt — premium micro-interaction (desktop only)
   * --------------------------------------------------------------------- */
  function initLabTilt() {
    const lab = document.querySelector(".learning-lab");
    const hero = document.querySelector(".training-hero");
    if (!lab || !hero || window.innerWidth < 992 || isReducedMotion) return;

    hero.addEventListener("mousemove", (e) => {
      const r = lab.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      lab.dataset.tilting = "1";
      lab.style.transform = `perspective(1200px) rotateY(${dx * 5}deg) rotateX(${-dy * 3}deg) translateZ(0) scale(1)`;
    });

    hero.addEventListener("mouseleave", () => {
      lab.dataset.tilting = "";
      lab.style.transform = "perspective(1200px) rotateY(0) rotateX(0) scale(1)";
      setTimeout(() => {
        if (!lab.dataset.tilting) lab.style.transform = "";
      }, 400);
    });
  }

  /* Launch all systems */
  new TrainingNetwork("trainingGridCanvas");
  const orbit = new OrbitSystem();
  const lab = new LearningLab();
  new NodeActivation(lab, orbit);
  initParallax();
  initLabTilt();
  initCourseBridge();

  if (isReducedMotion) {
    document.querySelectorAll(".gradient-orb").forEach((o) => (o.style.animation = "none"));
  }
});

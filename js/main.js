/* ==========================================================================
   MAIN.JS - All interactivity for The Spotters Company
   Fully commented for collaboration.
   
   Structure:
   PART 1: Theme toggle (light/dark)
   PART 2: Hamburger + Drawer + Services Dropdown
   PART 3: Reveal on scroll
   PART 4: Button magnet effect
   PART 5: New hero - Particle network + thread
   PART 6: Toast helper
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------------
     PART 1: THEME TOGGLE - Light/Dark mode
     ------------------------------------------------------------------------ */
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const toggleThumb = document.getElementById("toggleThumb");
  const drawerThemeToggle = document.getElementById("drawerThemeToggle");

  function applyTheme(theme) {
    if (theme === "dark") {
      htmlEl.setAttribute("data-theme", "dark");
      if (toggleThumb) toggleThumb.textContent = "☀";
    } else {
      htmlEl.removeAttribute("data-theme");
      if (toggleThumb) toggleThumb.textContent = "☾";
    }
    localStorage.setItem("spotters-theme", theme);
    const drawerThumb = document.getElementById("drawerToggleThumb");
    if (drawerThumb) drawerThumb.textContent = theme === "dark" ? "☀" : "☾";
  }

  const savedTheme = localStorage.getItem("spotters-theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    applyTheme("dark");
  }

  function toggleTheme() {
    const isDark = htmlEl.getAttribute("data-theme") === "dark";
    applyTheme(isDark ? "light" : "dark");
  }

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  if (drawerThemeToggle)
    drawerThemeToggle.addEventListener("click", toggleTheme);

  /* ------------------------------------------------------------------------
     PART 2: HAMBURGER + DRAWER + SERVICES DROPDOWN
     ------------------------------------------------------------------------ */
  const hamburger = document.getElementById("hamburger");
  const drawer = document.getElementById("drawer");
  const backdrop = document.getElementById("backdrop");

  function openMenu() {
    if (!hamburger || !drawer || !backdrop) return;
    hamburger.classList.add("active");
    drawer.classList.add("active");
    backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
    hamburger.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeMenu() {
    if (!hamburger || !drawer || !backdrop) return;
    hamburger.classList.remove("active");
    drawer.classList.remove("active");
    backdrop.classList.remove("active");
    document.body.style.overflow = "";
    hamburger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
  }

  function toggleMenu() {
    const isOpen = drawer && drawer.classList.contains("active");
    if (isOpen) closeMenu();
    else openMenu();
  }

  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  if (backdrop) backdrop.addEventListener("click", closeMenu);

  if (drawer) {
    drawer.querySelectorAll("a").forEach((link) => {
      // Don't close if it's a dropdown trigger
      if (link.classList.contains("dropdown-trigger")) return;
      link.addEventListener("click", () => {
        if (drawer.classList.contains("active")) closeMenu();
      });
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("active")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (
      window.innerWidth > 980 &&
      drawer &&
      drawer.classList.contains("active")
    ) {
      closeMenu();
    }
  });

  /* --- Services Dropdown - Desktop + Mobile --- */
  // Desktop dropdown
  const servicesDropdown = document.getElementById("servicesDropdown");
  if (servicesDropdown) {
    const trigger = servicesDropdown.querySelector(".dropdown-trigger");
    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = servicesDropdown.classList.contains("open");
        servicesDropdown.classList.toggle("open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    }
  }

  // Mobile drawer dropdown
  const drawerServices = document.getElementById("drawerServices");
  if (drawerServices) {
    const trigger = drawerServices.querySelector(".dropdown-trigger");
    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = drawerServices.classList.contains("open");
        drawerServices.classList.toggle("open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    }
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (servicesDropdown && !servicesDropdown.contains(e.target)) {
      servicesDropdown.classList.remove("open");
      const trig = servicesDropdown.querySelector(".dropdown-trigger");
      if (trig) trig.setAttribute("aria-expanded", "false");
    }
  });

  /* ------------------------------------------------------------------------
     PART 3: REVEAL ON SCROLL
     ------------------------------------------------------------------------ */
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  reveals.forEach((el) => observer.observe(el));

  /* ------------------------------------------------------------------------
     PART 4: BUTTON MAGNET EFFECT
     ------------------------------------------------------------------------ */
  document.querySelectorAll(".btn-primary, .btn-secondary").forEach((btn) => {
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

  /* ------------------------------------------------------------------------
     PART 5: NEW HERO - Particle network + glowing thread
     BLUE dominant: 60% blue, 25% green, 15% orange
     ------------------------------------------------------------------------ */
  const COLORS = [
    "#0A66FF",
    "#0A66FF",
    "#0A66FF",
    "#0A66FF",
    "#00C896",
    "#00C896",
    "#FF6B1C",
  ];
  const ANCHORS = [
    { x: 0.22, y: 0.26 },
    { x: 0.78, y: 0.21 },
    { x: 0.34, y: 0.54 },
    { x: 0.7, y: 0.79 },
  ];

  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas ? canvas.getContext("2d", { alpha: true }) : null;
  const wrap = document.getElementById("visualWrap");
  const threadPath = document.getElementById("threadPath");
  const travelDot = document.getElementById("travelDot");
  const floatCards = [
    document.getElementById("card1"),
    document.getElementById("card2"),
    document.getElementById("card3"),
    document.getElementById("card4"),
  ].filter(Boolean);

  let particles = [],
    mouse = null,
    startTime = performance.now(),
    pathLength = 0;

  function initParticles() {
    particles = [];
    for (let i = 0; i < 140; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: 1.1 + Math.random() * 1.6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        anchor: Math.floor(Math.random() * 4),
        glow: 0,
      });
    }
  }

  function resizeCanvas() {
    if (!wrap || !canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.8);
    const w = wrap.clientWidth,
      h = wrap.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    try {
      pathLength = threadPath.getTotalLength();
    } catch {}
  }

  if (wrap && canvas && ctx) {
    initParticles();
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    if (window.ResizeObserver) new ResizeObserver(resizeCanvas).observe(wrap);

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });
    wrap.addEventListener("mouseleave", () => (mouse = null));

    function animate(now) {
      const raw = (now - startTime) / 1000;
      const t = raw % 8;
      const w = wrap.clientWidth,
        h = wrap.clientHeight;
      ctx.clearRect(0, 0, w, h);

      let attract = 0;
      if (t >= 2 && t < 4) attract = ((t - 2) / 2) * 0.018;
      else if (t >= 4 && t < 6.5) attract = 0.018 + ((t - 4) / 2.5) * 0.022;
      else if (t >= 6.5) attract = 0.04 * (1 - (t - 6.5) / 1.5);

      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const lineRGB = isDark ? "255,255,255" : "10,10,15";

      for (const p of particles) {
        const anchor = ANCHORS[p.anchor];
        const ax = anchor.x * w,
          ay = anchor.y * h;
        p.vx += (ax - p.x) * attract * 0.012;
        p.vy += (ay - p.y) * attract * 0.012;

        if (mouse) {
          const dx = p.x - mouse.x,
            dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180 && dist > 0.1) {
            const force = (1 - dist / 180) * 0.9;
            p.vx += (dx / dist) * force * 0.6;
            p.vy += (dy / dist) * force * 0.6;
            p.glow = Math.min(1, p.glow + 0.15);
          } else {
            p.glow = Math.max(0, p.glow - 0.04);
          }
        } else {
          p.glow = Math.max(0, p.glow - 0.04);
        }

        p.vx *= 0.997;
        p.vy *= 0.997;
        p.vx = Math.max(-0.9, Math.min(0.9, p.vx));
        p.vy = Math.max(-0.9, Math.min(0.9, p.vy));
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) {
          p.x = -10;
          p.vx *= -0.6;
        }
        if (p.x > w + 10) {
          p.x = w + 10;
          p.vx *= -0.6;
        }
        if (p.y < -10) {
          p.y = -10;
          p.vy *= -0.6;
        }
        if (p.y > h + 10) {
          p.y = h + 10;
          p.vy *= -0.6;
        }
      }

      ctx.lineWidth = 0.7;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130) {
            const opacity =
              (1 - dist / 130) * 0.14 * (0.6 + (a.glow + b.glow) * 0.5);
            if (opacity > 0.01) {
              ctx.strokeStyle = `rgba(${lineRGB},${opacity})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.75 + p.glow * 0.35;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.glow > 0.2 ? 8 : 0;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      const progress = (t - 2) / 6;
      if (pathLength && threadPath) {
        const offset =
          pathLength * (1 - Math.max(0, Math.min(1, progress * 1.2)));
        threadPath.style.strokeDashoffset = offset;
        if (t >= 2 && t <= 7.6 && travelDot) {
          try {
            const len = Math.max(
              0,
              Math.min(pathLength, pathLength * progress),
            );
            const pt = threadPath.getPointAtLength(len);
            travelDot.setAttribute("cx", pt.x);
            travelDot.setAttribute("cy", pt.y);
            travelDot.setAttribute("opacity", "1");
            travelDot.setAttribute("fill", isDark ? "white" : "#0A0A0F");
          } catch {}
        } else if (travelDot) {
          travelDot.setAttribute("opacity", "0");
        }
      }

      const showTimes = [2.8, 3.2, 3.6, 4.0];
      const hideTimes = [6.8, 7.0, 7.2, 7.6];
      floatCards.forEach((card, i) => {
        const shouldShow = t >= showTimes[i] && t < hideTimes[i];
        if (shouldShow) card.classList.add("show");
        else if (t < 2) card.classList.remove("show");
      });
      if (t < 0.1) floatCards.forEach((c) => c.classList.remove("show"));

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  /* ------------------------------------------------------------------------
     PART 6: BACK TO TOP - Shared across home + digital strategy
     Shows after 400px scroll, smooth scroll to top on click
     ------------------------------------------------------------------------ */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    // Show/hide on scroll
    const toggleBackToTop = () => {
      if (window.scrollY > 400) backToTop.classList.add("visible");
      else backToTop.classList.remove("visible");
    };
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop(); // initial check

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------------
     PART 7: TOAST HELPER
     ------------------------------------------------------------------------ */
  window.showToast = function (msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2600);
  };
});

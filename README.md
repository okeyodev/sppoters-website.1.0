# The Spotters Company - Website v0.23

> A modern, multi-page website showcasing digital services. Built with vanilla HTML, CSS, and JavaScript. Features light/dark theme toggle, mobile-first responsive design, and smooth scroll animations.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [File Organization](#file-organization)
- [Key Features](#key-features)
- [CSS System](#css-system)
- [JavaScript Architecture](#javascript-architecture)
- [How to Modify](#how-to-modify)
- [Deployment](#deployment)
- [Browser Support](#browser-support)

---

## 🏗️ Project Structure

```
sppoters-0.23/
├── index.html                      # Homepage
├── pages/                          # Interior pages
│   ├── about.html
│   ├── app-development.html
│   ├── careers.html
│   ├── digital-strategy.html
│   ├── industries.html
│   ├── internship.html
│   ├── software-training.html
│   ├── web-development.html
│   └── works.html
├── css/
│   ├── variables.css              # 🎯 SINGLE SOURCE OF TRUTH - All colors, fonts, spacing
│   ├── global.css                 # Shared header, footer, buttons, dropdowns, responsive
│   ├── home.css                   # Homepage hero and sections
│   ├── web-dev.css                # Web development page
│   └── [page-name].css            # Individual page styles
├── js/
│   ├── main.js                    # 🎯 CORE - Shared across all pages (theme, menu, animations)
│   ├── about.js
│   ├── app-development.js
│   ├── web-dev.js
│   └── [page-name].js             # Individual page scripts
└── images/                        # Images and assets
```

---

## 🚀 Quick Start

### View in Browser

1. Open any `.html` file in your browser
   - **Recommended**: Use VS Code Live Server extension
   - Or: Simple HTTP server: `python -m http.server 8000`

2. Browse to `http://localhost:8000/sppoters-0.23/index.html`

### Edit Files

1. Open in VS Code
2. Edit CSS in `css/` folder
3. Edit JS in `js/` folder
4. Reload browser to see changes

---

## 📁 File Organization

### CSS Architecture (DRY - Don't Repeat Yourself)

**variables.css** (The "Single Source of Truth")
```css
/* All design tokens defined here */
:root {
  --blue: #0A66FF;           /* Primary brand color */
  --green: #00C896;          /* Secondary */
  --orange: #FF6B1C;         /* Accent */
  --shadow-lg: 0 16px 48px rgba(...);
  --radius-md: 16px;
  --ease-smooth: cubic-bezier(...);
  /* ...and 50+ more tokens */
}

[data-theme="dark"] {
  /* Dark mode overrides - only for colors/opacity */
  --bg: #050816;
  --text: #E6E8EF;
  /* Colors stay the same, only backgrounds/text change */
}
```

**global.css** (Shared across all pages)
- Header and navigation
- Mobile drawer and hamburger menu
- Dropdown menus (Services, Software Development)
- Buttons (primary, secondary)
- Theme toggle styling
- Footer
- Responsive breakpoints: 980px (tablet), 768px (mobile), 480px (small phone)

**Page-specific CSS** (e.g., `home.css`, `web-dev.css`)
- Hero sections
- Section-specific styling
- Page layout
- Responsive rules at bottom of file for easy maintenance

### JavaScript Architecture

**main.js** (Loaded on EVERY page)
- Theme toggle: Switches light/dark mode, saves to localStorage
- Hamburger menu: Opens/closes mobile drawer
- Dropdown menus: Services dropdown, nested Software Development menu
  - Click to open/close
  - Only one dropdown open at a time
  - Click outside to close
- Scroll animations: Fade-in effects as user scrolls
- Button effects: Magnet cursor effect
- Particle animation: Homepage hero (performance-optimized)

**Page-specific JS** (e.g., `about.js`, `web-dev.js`)
- Runs AFTER main.js loads
- Page-specific animations, forms, canvas effects
- Example: `web-dev.js` handles the grid canvas animation

---

## ✨ Key Features

### 1. Light/Dark Theme Toggle
- Click theme button in header or drawer
- Automatically detects system preference (Windows Settings, Mac preferences)
- Saves preference to browser localStorage
- All CSS uses CSS custom properties for theme switching

### 2. Responsive Mobile Menu
- **Desktop (980px+)**: Horizontal nav menu
- **Tablet/Mobile (< 980px)**: Hamburger menu with slide-out drawer
- Services dropdown with nested Software Development menu
- Smooth animations and transitions

### 3. Dropdown Menus
- **Services** → Digital Strategy, Software Development (with sub-items), Training, Internship
- **Software Development** → App Development, Web Development
- Click same trigger to close
- Outside click closes all dropdowns
- Full keyboard accessibility (aria-expanded)

### 4. Scroll Animations
- Elements with `.reveal` class fade in as they enter viewport
- Smooth reveal with translateY effect
- Only runs once per element
- Used on headlines, cards, sections

### 5. Performance Optimized
- Canvas animations limited to critical sections
- Lazy-loaded heavy assets
- Efficient event delegation (single click handler vs. individual listeners)
- CSS animations (GPU-accelerated) vs. JS when possible

---

## 🎨 CSS System

### How to Rebrand the Entire Site

Edit `css/variables.css`:

```css
:root {
  /* Change these 3 colors to rebrand */
  --blue: #0A66FF;       /* Your primary color */
  --green: #00C896;      /* Your secondary color */
  --orange: #FF6B1C;     /* Your accent color */
  
  /* All other colors will shift automatically */
}
```

Every page will update automatically because all styles reference these variables.

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Blue | `#0A66FF` | Primary buttons, links, accents |
| Green | `#00C896` | Secondary accents, growth theme |
| Orange | `#FF6B1C` | Highlight accents, CTA emphasis |
| Dark Gray | `#374151` | Body text, secondary text |
| Light Gray | `#F6F7F9` | Backgrounds, subtle UI |

### Responsive Breakpoints

```css
/* Tablets and above - use full nav */
@media (min-width: 980px) { }

/* Tablets - use hamburger menu */
@media (min-width: 768px) and (max-width: 979px) { }

/* Mobile phones */
@media (max-width: 767px) { }

/* Small phones */
@media (max-width: 479px) { }
```

---

## 🔧 JavaScript Architecture

### Theme System

```javascript
// Automatically runs on page load:
// 1. Check localStorage for saved theme
// 2. If not saved, check system preference
// 3. Apply theme by setting data-theme="dark" on <html>
// 4. CSS uses :root vs [data-theme="dark"] selectors

applyTheme("dark");  // Sets data-theme="dark" + saves to localStorage
toggleTheme();       // Switches between light and dark
```

### Dropdown Menu Logic

```javascript
// All dropdowns (.nav-dropdown, .drawer-dropdown, .dropdown-group)
// are managed by a SINGLE document-level click handler

// When dropdown trigger (▾) is clicked:
// 1. Check if it's already open
// 2. If open → close it (remove .open class)
// 3. If closed → open it (add .open class)
// 4. Close any other open dropdowns

// When clicking outside any dropdown:
// 1. Close all open dropdowns
```

### Scroll Animation System

```javascript
// Elements with class="reveal" fade in as they enter viewport
// Uses IntersectionObserver (performant, native browser API)

// Step 1: Add class="reveal" to any element
// <h2 class="reveal">Title</h2>

// Step 2: CSS defines animation
.reveal { opacity: 0; transform: translateY(24px); }
.reveal.in { opacity: 1; transform: translateY(0); }

// Step 3: When element enters viewport, .in class is added
// Animation happens automatically via CSS transition
```

---

## 📝 How to Modify

### Add a New Page

1. Create `pages/new-page.html`
2. Copy structure from `pages/about.html`
3. Update header/footer (they're identical across pages)
4. Create `css/new-page.css` for page-specific styles
5. Create `js/new-page.js` for page-specific behavior

### Add a New Service to Dropdown Menu

Edit the **HTML** (same on every page):

```html
<!-- In pages/web-development.html, index.html, etc. -->
<div class="nav-dropdown">
  <button class="nav-link dropdown-trigger">Services ▾</button>
  <div class="dropdown-menu">
    <a href="pages/digital-strategy.html">Digital Strategy</a>
    <!-- ADD HERE -->
    <a href="pages/my-service.html">My New Service</a>
  </div>
</div>
```

The **JavaScript** and **CSS** handle dropdowns automatically - no changes needed.

### Change Colors

1. Open `css/variables.css`
2. Edit `--blue`, `--green`, `--orange` values
3. All pages update automatically
4. Dark mode variations update too

### Change Typography

1. Open `css/variables.css`
2. Edit `--font-body` and `--font-display`
3. Update Google Fonts link in HTML `<head>`

### Change Spacing/Shadows

1. Open `css/variables.css`
2. Edit `--radius-md`, `--shadow-lg`, etc.
3. All pages use these values, so site-wide update is automatic

---

## 📤 Deployment

### Option 1: Static Hosting (Recommended)
- Netlify: Drag & drop the folder
- Vercel: Connect GitHub repository
- GitHub Pages: Push to gh-pages branch
- AWS S3: Upload files to bucket

### Option 2: Web Server
- Upload files via FTP/SFTP to web hosting
- Ensure all file paths are relative (not absolute)
- Test all links work after upload

### Before Deploying
- Test all pages in multiple browsers
- Test theme toggle works
- Test mobile menu on actual phone
- Verify all links point to correct pages
- Optimize images for web

---

## 🌐 Browser Support

| Browser | Version | Tested |
|---------|---------|--------|
| Chrome | Latest | ✅ |
| Firefox | Latest | ✅ |
| Safari | Latest | ✅ |
| Edge | Latest | ✅ |
| Mobile Safari (iOS) | 14+ | ✅ |
| Chrome Mobile | Latest | ✅ |

### Features Used
- CSS Custom Properties (IE 11 not supported)
- Intersection Observer (for scroll animations)
- LocalStorage (for theme preference)
- Arrow functions (ES6)
- Fetch API (used in some pages)

---

## 📚 CSS File Reference

### variables.css
**Purpose**: Design tokens  
**Edit this to**: Rebrand, change colors, modify spacing/shadows  
**Imported by**: Every CSS file  
**Size**: ~4KB

### global.css
**Purpose**: Shared styles across all pages  
**Includes**:
- Header, footer, navigation
- Mobile drawer, hamburger menu
- Dropdown menus
- Buttons
- Theme toggle
- Responsive breakpoints

**Imported by**: Every page  
**Size**: ~12KB

### home.css
**Purpose**: Homepage only  
**Includes**:
- Hero section (particle animation)
- Marquee section
- Service cards
- CTA sections

**Imported by**: index.html only  
**Size**: ~6KB

### web-dev.css
**Purpose**: Web development landing page  
**Includes**:
- Hero with grid canvas animation
- Browser mockup styling
- Service overview
- Process timeline

**Imported by**: pages/web-development.html only  
**Size**: ~8KB

### Page-Specific CSS
- `about.css`, `app-development.css`, `careers.css`, etc.
- Each ~3-5KB
- Styles for specific page sections

---

## 🔗 File References

### Important Files to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| `css/variables.css` | All colors, fonts, spacing | Rebranding |
| `css/global.css` | Shared navigation, dropdowns | Header/footer changes, new breakpoints |
| `js/main.js` | Theme, menu, animations | Core behavior changes |
| `pages/index.html` | Homepage | Homepage content |
| `pages/*/html` | Other pages | Page content |
| `css/home.css` | Homepage styling | Homepage design |
| `js/web-dev.js` | Web dev page interactivity | Canvas animation, custom behavior |

---

## 🎯 Quick Tips

1. **All colors in one place**: `css/variables.css`
2. **Shared styles**: `css/global.css`
3. **Page-specific files**: Named `[page-name].css` and `[page-name].js`
4. **Mobile-first**: Start with mobile styles, then add desktop overrides
5. **Responsive**: Check breakpoints in `css/global.css`
6. **Accessibility**: Use semantic HTML, aria attributes already added
7. **Performance**: Minimize DOM manipulation, use event delegation (✅ already done)

---

## 📞 Support

For questions about:
- **Design tokens**: See `css/variables.css` comments
- **How theme toggle works**: See `js/main.js` PART 1
- **How dropdowns work**: See `js/main.js` PART 2
- **How scroll animations work**: See `js/main.js` PART 3
- **Page layout**: Check `pages/*.html`
- **Responsive design**: See end of `css/global.css` and `css/[page].css`

---

## 📝 Changelog

### v0.23
- ✅ DRY CSS refactor - all variables in one file
- ✅ Unified dropdown toggle logic - click same trigger to close
- ✅ Mobile menu font normalized
- ✅ Comprehensive code comments added
- ✅ GitHub-friendly README created
- ✅ Event delegation for dropdowns (better performance)

### Previous Versions
- v0.22: Internship program page added
- v0.21: Web development page redesigned
- v0.20: Initial release

---

**Last Updated**: August 15, 2026  
**Built with**: HTML5, CSS3, Vanilla JavaScript (ES6)  
**License**: Proprietary

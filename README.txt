The Spotters Company - Final Package
===============================

Structure:
- index.html (homepage)
- css/
  - variables.css (brand tokens - edit to rebrand)
  - global.css (header, footer, drawer, buttons - synced)
  - home.css
  - about.css
  - app-development.css
  - careers.css
  - digital-strategy.css
  - web-dev.css + web-animations.css + web-variables.css
  - internship.css (NEW - Internship Program page, vanilla)
- js/
  - main.js (theme, hamburger, drawer, back-to-top, toast - synced)
  - about.js
  - app-development.js
  - careers.js
  - digital-strategy.js
  - web-dev.js
  - internship.js (NEW - journey canvas + roadmap + milestones)
- pages/
  - about.html
  - app-development.html
  - careers.html
  - digital-strategy.html
  - web-development.html
  - software-training.html
  - industries.html
  - works.html
  - internship.html (NEW - vanilla rewrite of internship-program-fresh)

New files:
- internship.html: vanilla HTML, synced header/footer, 12-week journey hero, program overview 4 cards, apply form
- internship.css: uses only variables.css tokens, blue #0A66FF dominant > green > orange, responsive 992/768/480
- internship.js: canvas particles, SVG journey progress 8s loop, milestone activation, board tilt, floating cards, form toast

Fix applied:
- Mobile drawer Services submenu now neatly spaced: grid gap 6px, card style 12px padding, rounded, hover blue

All pages share same header/footer/theme logic via global.css + main.js

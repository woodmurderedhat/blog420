// Enhanced Interactions & Bonus Features
// Add this to enhance the gamification experience further

document.addEventListener("DOMContentLoaded", function () {
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth"

  // Highlight text selection with custom style
  document.addEventListener("mouseup", function () {
    const selection = window.getSelection().toString()
    if (selection.length > 50 && window.gamification) {
      // Award XP for highlighting substantial text (studying/taking notes)
      const key = "highlights_" + window.location.pathname
      const count = parseInt(localStorage.getItem(key) || "0")
      if (count < 5) {
        // Limit to prevent abuse
        localStorage.setItem(key, count + 1)
        window.gamification.addXP(3, "Text Highlighted!")
      }
    }
  })

  // Add reading mode toggle
  createReadingModeToggle()

  // Add scroll-to-top button with XP reward
  createScrollToTop()

  // Add keyboard shortcuts
  setupKeyboardShortcuts()

  // Add time-of-day greeting
  showGreeting()

  // Track active reading time more accurately
  trackActiveReading()
})

function createReadingModeToggle() {
  if (!document.querySelector(".post-content")) return

  const toggle = document.createElement("button")
  toggle.className = "reading-mode-toggle"
  toggle.innerHTML = "📖"
  toggle.title = "Toggle Focus Mode"
  toggle.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: var(--secondary-color);
    border: 3px solid var(--accent-color);
    color: var(--accent-color);
    width: 50px;
    height: 50px;
    border-radius: 0;
    cursor: pointer;
    font-size: 1.5rem;
    z-index: 1000;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);
    transition: all 0.2s;
  `

  let focusMode = false
  toggle.addEventListener("click", function () {
    focusMode = !focusMode
    document.body.classList.toggle("focus-mode", focusMode)
    toggle.innerHTML = focusMode ? "👁️" : "📖"

    if (focusMode && window.gamification) {
      window.gamification.addXP(5, "Focus Mode!")
    }
  })

  document.body.appendChild(toggle)

  // Add CSS for focus mode
  const style = document.createElement("style")
  style.textContent = `
    .focus-mode .site-header,
    .focus-mode .site-footer,
    .focus-mode .post-navigation,
    .focus-mode .level-display {
      opacity: 0.2;
      pointer-events: none;
      transition: opacity 0.3s;
    }
    
    .focus-mode .post-content {
      font-size: 1.4rem;
      max-width: 700px;
      margin: 0 auto;
    }
    
    .reading-mode-toggle:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.5);
    }
  `
  document.head.appendChild(style)
}

function createScrollToTop() {
  const button = document.createElement("button")
  button.className = "scroll-to-top"
  button.innerHTML = "⬆️"
  button.title = "Scroll to Top"
  button.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 20px;
    background: var(--secondary-color);
    border: 3px solid var(--accent-color);
    color: var(--accent-color);
    width: 50px;
    height: 50px;
    border-radius: 0;
    cursor: pointer;
    font-size: 1.5rem;
    z-index: 1000;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;
  `

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 500) {
      button.style.opacity = "1"
      button.style.pointerEvents = "auto"
    } else {
      button.style.opacity = "0"
      button.style.pointerEvents = "none"
    }
  })

  button.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (window.gamification) {
      window.gamification.addXP(2, "Quick Scroll!")
    }
  })

  button.addEventListener("mouseenter", function () {
    this.style.transform = "translate(-2px, -2px)"
    this.style.boxShadow = "6px 6px 0px rgba(0, 0, 0, 0.5)"
  })

  button.addEventListener("mouseleave", function () {
    this.style.transform = ""
    this.style.boxShadow = "4px 4px 0px rgba(0, 0, 0, 0.5)"
  })

  document.body.appendChild(button)
}

function setupKeyboardShortcuts() {
  const shortcuts = {
    s: () => window.gamification?.toggleStats(),
    r: () => document.querySelector(".reactions-buttons")?.scrollIntoView({ behavior: "smooth" }),
    h: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    b: () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
  }

  document.addEventListener("keydown", function (e) {
    // Only trigger if not typing in an input
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return

    const handler = shortcuts[e.key.toLowerCase()]
    if (handler) {
      e.preventDefault()
      handler()
    }
  })

  // Show keyboard shortcuts hint
  const hint = document.createElement("div")
  hint.className = "keyboard-hint"
  hint.innerHTML = `
    <div style="font-family: 'Press Start 2P', cursive; font-size: 0.5rem; color: var(--accent-color); margin-bottom: 10px;">
      Keyboard Shortcuts ⌨️
    </div>
    <div style="font-family: 'VT323', monospace; font-size: 1rem; line-height: 1.8;">
      <strong>S</strong> - Toggle Stats<br>
      <strong>R</strong> - Jump to Reactions<br>
      <strong>H</strong> - Home (top)<br>
      <strong>B</strong> - Bottom
    </div>
  `
  hint.style.cssText = `
    position: fixed;
    bottom: 140px;
    left: 20px;
    background: var(--secondary-color);
    border: 3px solid var(--accent-color);
    padding: 15px;
    z-index: 1000;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    max-width: 200px;
  `
  document.body.appendChild(hint)

  // Show hint on first visit or when pressing ?
  document.addEventListener("keydown", function (e) {
    if (e.key === "?") {
      hint.style.opacity = hint.style.opacity === "1" ? "0" : "1"
    }
  })
}

function showGreeting() {
  const hour = new Date().getHours()
  let greeting = ""
  let emoji = ""

  if (hour < 6) {
    greeting = "Burning the midnight oil?"
    emoji = "🌙"
  } else if (hour < 12) {
    greeting = "Good morning, reader!"
    emoji = "☀️"
  } else if (hour < 18) {
    greeting = "Good afternoon!"
    emoji = "🌤️"
  } else {
    greeting = "Good evening!"
    emoji = "🌆"
  }

  const greetingEl = document.createElement("div")
  greetingEl.className = "greeting-message"
  greetingEl.innerHTML = `${emoji} ${greeting}`
  greetingEl.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--secondary-color);
    border: 3px solid var(--accent-color);
    padding: 20px 30px;
    z-index: 10000;
    font-family: 'Press Start 2P', cursive;
    font-size: 0.8rem;
    color: var(--accent-color);
    box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 255, 65, 0.5);
    opacity: 0;
    transition: opacity 0.5s;
  `

  // Only show on post pages and if not seen in this session
  if (document.querySelector(".post-content") && !sessionStorage.getItem("greeted")) {
    document.body.appendChild(greetingEl)
    setTimeout(() => (greetingEl.style.opacity = "1"), 100)
    setTimeout(() => {
      greetingEl.style.opacity = "0"
      setTimeout(() => greetingEl.remove(), 500)
    }, 3000)
    sessionStorage.setItem("greeted", "true")
  }
}

function trackActiveReading() {
  let isActive = true
  let lastActivity = Date.now()

  // Track mouse movement and scrolling
  ;["mousemove", "scroll", "keydown"].forEach((event) => {
    document.addEventListener(event, () => {
      lastActivity = Date.now()
      isActive = true
    })
  })

  // Check every 10 seconds if user is still active
  setInterval(() => {
    if (Date.now() - lastActivity > 60000) {
      // 1 minute of inactivity
      isActive = false
    }

    // Award bonus XP for continuous active reading
    if (isActive && document.querySelector(".post-content") && window.gamification) {
      const activeTime = parseInt(sessionStorage.getItem("activeReadingTime") || "0")
      sessionStorage.setItem("activeReadingTime", activeTime + 10)

      // Award bonus every 5 minutes of active reading
      if (activeTime > 0 && activeTime % 300 === 0) {
        window.gamification.addXP(25, "Active Reading Bonus!")
      }
    }
  }, 10000)
}

// Add copy code button to code blocks
document.querySelectorAll("pre code").forEach((block) => {
  const button = document.createElement("button")
  button.className = "copy-code-btn"
  button.innerHTML = "📋"
  button.title = "Copy Code"
  button.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--primary-color);
    border: 2px solid var(--accent-color);
    color: var(--accent-color);
    padding: 5px 10px;
    cursor: pointer;
    font-size: 1rem;
    opacity: 0.7;
    transition: opacity 0.2s;
  `

  button.addEventListener("click", function () {
    navigator.clipboard.writeText(block.textContent)
    button.innerHTML = "✅"
    setTimeout(() => (button.innerHTML = "📋"), 2000)

    if (window.gamification) {
      window.gamification.addXP(5, "Code Copied!")
    }
  })

  const pre = block.parentElement
  pre.style.position = "relative"
  pre.appendChild(button)

  pre.addEventListener("mouseenter", () => (button.style.opacity = "1"))
  pre.addEventListener("mouseleave", () => (button.style.opacity = "0.7"))
})

// Share button for articles
if (document.querySelector(".post-header") && navigator.share) {
  const shareBtn = document.createElement("button")
  shareBtn.className = "share-btn"
  shareBtn.innerHTML = "🔗 Share"
  shareBtn.style.cssText = `
    font-family: 'Press Start 2P', cursive;
    background: var(--primary-color);
    border: 3px solid var(--accent-color);
    color: var(--accent-color);
    padding: 10px 20px;
    cursor: pointer;
    font-size: 0.6rem;
    margin-top: 10px;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.5);
    transition: all 0.2s;
  `

  shareBtn.addEventListener("click", async function () {
    try {
      await navigator.share({
        title: document.querySelector(".post-title").textContent,
        url: window.location.href,
      })
      if (window.gamification) {
        window.gamification.addXP(10, "Shared Article!")
      }
    } catch (err) {
      console.log("Share cancelled")
    }
  })

  shareBtn.addEventListener("mouseenter", function () {
    this.style.transform = "translate(-2px, -2px)"
    this.style.boxShadow = "6px 6px 0px rgba(0, 0, 0, 0.5)"
  })

  shareBtn.addEventListener("mouseleave", function () {
    this.style.transform = ""
    this.style.boxShadow = "4px 4px 0px rgba(0, 0, 0, 0.5)"
  })

  document.querySelector(".post-meta").appendChild(shareBtn)
}

// Console Easter Egg Art
console.log("%c╔═══════════════════════════════════════════╗", "color: #00ff41; font-weight: bold;")
console.log("%c║                                           ║", "color: #00ff41; font-weight: bold;")
console.log("%c║        🎮 GAMIFICATION ACTIVE! 🎮         ║", "color: #00ff41; font-weight: bold;")
console.log("%c║                                           ║", "color: #00ff41; font-weight: bold;")
console.log("%c╚═══════════════════════════════════════════╝", "color: #00ff41; font-weight: bold;")
console.log("%c\n✨ FEATURES LOADED:", "color: #ff006e; font-size: 14px; font-weight: bold;")
console.log("%c  ✓ XP & Leveling System", "color: #00ff41;")
console.log("%c  ✓ Achievement Tracking", "color: #00ff41;")
console.log("%c  ✓ Daily Streak Counter", "color: #00ff41;")
console.log("%c  ✓ Reading Progress Tracker", "color: #00ff41;")
console.log("%c  ✓ Interactive Reactions", "color: #00ff41;")
console.log("%c  ✓ Visual Effects & Animations", "color: #00ff41;")
console.log("%c  ✓ Easter Eggs", "color: #00ff41;")
console.log("%c\n🎯 QUICK TIPS:", "color: #ff006e; font-size: 14px; font-weight: bold;")
console.log('%c  → Press "S" to view your stats', "color: #00d4ff;")
console.log("%c  → Try the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A", "color: #00d4ff;")
console.log('%c  → Press "?" for keyboard shortcuts', "color: #00d4ff;")
console.log("%c  → Double-click the header for a surprise", "color: #00d4ff;")
console.log("%c\n📊 CURRENT STATS:", "color: #ff006e; font-size: 14px; font-weight: bold;")
if (window.gamification) {
  console.log("%c  Level: " + window.gamification.stats.level, "color: #ffff00;")
  console.log("%c  XP: " + window.gamification.stats.xp, "color: #ffff00;")
  console.log("%c  Articles Read: " + window.gamification.stats.articlesRead, "color: #ffff00;")
  console.log(
    "%c  Current Streak: " + window.gamification.stats.currentStreak + " days",
    "color: #ffff00;",
  )
}
console.log("%c\n🚀 Happy Reading! 📖\n\n", "color: #00ff41; font-size: 16px; font-weight: bold;")

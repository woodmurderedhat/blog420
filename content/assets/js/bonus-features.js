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

  // Add compact/dense toggles to switch layout density
  createCompactToggle()

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

function createCompactToggle() {
  const headerInner = document.querySelector(".site-header-inner")
  if (!headerInner) return

  const container = document.createElement("div")
  container.className = "compact-controls"
  container.style.cssText = `
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    gap: 8px;
    align-items: center;
    z-index: 2;
  `

  const compactBtn = document.createElement("button")
  compactBtn.className = "compact-toggle"
  compactBtn.title = "Toggle Compact Mode"
  compactBtn.innerHTML = "📐"
  compactBtn.setAttribute("aria-pressed", "false")

  const denseBtn = document.createElement("button")
  denseBtn.className = "dense-toggle"
  denseBtn.title = "Toggle Dense Utilities"
  denseBtn.innerHTML = "🧩"
  denseBtn.setAttribute("aria-pressed", "false")

  const settingsBtn = document.createElement("button")
  settingsBtn.className = "settings-button"
  settingsBtn.title = "Open Display Settings"
  settingsBtn.innerHTML = "⚙️"
  settingsBtn.setAttribute("aria-expanded", "false")

  container.appendChild(compactBtn)
  container.appendChild(denseBtn)
  container.appendChild(settingsBtn)
  headerInner.appendChild(container)

  // Mode indicator pill (shows current mode badges)
  const indicator = document.createElement("div")
  indicator.className = "mode-indicator"
  indicator.innerHTML = `<span class="badge compact-badge">Compact</span><span class="badge dense-badge">Dense</span><span class="badge focus-badge">Focus</span>`
  indicator.style.cssText = `display:flex; gap:6px; align-items:center; position:absolute; left:12px; top:14px; z-index:2;`
  headerInner.appendChild(indicator)

  function updateModeIndicator() {
    const compactOn = document.body.classList.contains("compact")
    const denseOn = document.body.classList.contains("dense")
    const focusOn = document.body.classList.contains("focus-mode")

    const cb = document.querySelector(".mode-indicator .compact-badge")
    const db = document.querySelector(".mode-indicator .dense-badge")
    const fb = document.querySelector(".mode-indicator .focus-badge")

    if (cb) cb.style.opacity = compactOn ? "1" : "0.28"
    if (db) db.style.opacity = denseOn ? "1" : "0.28"
    if (fb) fb.style.opacity = focusOn ? "1" : "0.28"

    // small aria attribute for screen readers
    indicator.setAttribute("data-state", `compact:${compactOn} dense:${denseOn} focus:${focusOn}`)
  }

  // expose globally for the settings panel to call
  window.updateModeIndicator = updateModeIndicator

  updateModeIndicator()

  // Settings button behavior (opens settings panel)
  settingsBtn.addEventListener("click", function () {
    // ensure panel exists
    createSettingsPanel()
    const panel = document.querySelector(".settings-panel")
    if (!panel) return
    const open = panel.classList.toggle("show")
    panel.setAttribute("aria-hidden", open ? "false" : "true")
    settingsBtn.setAttribute("aria-expanded", open)
    // update quick-toggle states in panel if present
    const compBtn = panel.querySelector(".settings-compact")
    const denseBtnInPanel = panel.querySelector(".settings-dense")
    if (compBtn) compBtn.setAttribute("aria-pressed", document.body.classList.contains("compact"))
    if (denseBtnInPanel)
      denseBtnInPanel.setAttribute("aria-pressed", document.body.classList.contains("dense"))
  })

  // Load saved state
  const compactSaved = localStorage.getItem("compactMode") === "true"
  const denseSaved = localStorage.getItem("denseMode") === "true"

  if (compactSaved) {
    document.body.classList.add("compact")
    compactBtn.setAttribute("aria-pressed", "true")
  }
  if (denseSaved) {
    document.body.classList.add("dense")
    denseBtn.setAttribute("aria-pressed", "true")
  }

  function updateButtonState(btn, enabled) {
    btn.style.opacity = enabled ? "1" : "0.7"
    btn.style.transform = enabled ? "translateY(-2px)" : "none"
  }

  updateButtonState(compactBtn, compactSaved)
  updateButtonState(denseBtn, denseSaved)

  compactBtn.addEventListener("click", function () {
    const enabled = document.body.classList.toggle("compact")
    localStorage.setItem("compactMode", enabled)
    compactBtn.setAttribute("aria-pressed", enabled)
    updateButtonState(compactBtn, enabled)
    if (enabled && window.gamification) window.gamification.addXP(3, "Compact Mode!")
  })

  denseBtn.addEventListener("click", function () {
    const enabled = document.body.classList.toggle("dense")
    localStorage.setItem("denseMode", enabled)
    denseBtn.setAttribute("aria-pressed", enabled)
    updateButtonState(denseBtn, enabled)
    if (enabled && window.gamification) window.gamification.addXP(2, "Dense Utilities!")
  })

  // Small styles for the buttons
  const styleEl = document.createElement("style")
  styleEl.textContent = `
    .compact-controls button { 
      background: var(--secondary-color); 
      border: 2px solid rgba(0,255,65,0.12);
      color: var(--accent-color); 
      width: 40px; height: 36px; font-size: 1rem; cursor: pointer;
      border-radius: 6px; box-shadow: 2px 2px 0 rgba(0,0,0,0.4); opacity: 0.85;
      transition: transform 0.12s var(--easing), opacity 0.12s var(--easing);
    }
    .compact-controls button[aria-pressed="true"] { transform: translateY(-2px); opacity: 1; }
    .compact-controls button:hover { transform: translateY(-2px); }

    @media (max-width: 600px) {
      .compact-controls { top: 8px; right: 8px; }
      .compact-controls button { width: 36px; height: 32px; }
    }
  `
  document.head.appendChild(styleEl)
}

function createSettingsPanel() {
  if (document.querySelector(".settings-panel")) return document.querySelector(".settings-panel")

  const panel = document.createElement("div")
  panel.className = "settings-panel"
  panel.setAttribute("role", "dialog")
  panel.setAttribute("aria-hidden", "true")
  panel.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div style="font-family:'Press Start 2P', cursive; font-size:0.95rem; color:var(--accent-color)">Display Settings</div>
      <button class="settings-close" aria-label="Close">✖</button>
    </div>
    <div class="row"><label>Compact</label><button class="switch-button settings-compact" aria-pressed="false">Off</button></div>
    <div class="row"><label>Dense</label><button class="switch-button settings-dense" aria-pressed="false">Off</button></div>
    <div class="row"><label>Focus Mode</label><button class="switch-button settings-focus" aria-pressed="false">Off</button></div>
    <div class="row"><label>Reduce Motion</label><button class="switch-button settings-motion" aria-pressed="false">Off</button></div>
  `

  document.body.appendChild(panel)

  // file import/export UI
  const ioRow = document.createElement("div")
  ioRow.style.cssText = "display:flex; gap:8px; margin-top:12px;"
  ioRow.innerHTML = `<input type="file" accept="application/json" class="settings-import" style="display:none"/><button class="switch-button settings-export">Export</button><button class="switch-button settings-import-btn">Import</button><button class="switch-button settings-apply-site">Apply to Site (download)</button>`
  panel.appendChild(ioRow)

  panel.querySelector(".settings-import-btn")?.addEventListener("click", function () {
    panel.querySelector(".settings-import")?.click()
  })

  panel.querySelector(".settings-import")?.addEventListener("change", function (e) {
    const f = this.files && this.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = function (ev) {
      try {
        const data = JSON.parse(ev.target.result)
        // apply simple known keys
        if ("compactMode" in data) {
          document.body.classList.toggle("compact", !!data.compactMode)
          localStorage.setItem("compactMode", !!data.compactMode)
        }
        if ("denseMode" in data) {
          document.body.classList.toggle("dense", !!data.denseMode)
          localStorage.setItem("denseMode", !!data.denseMode)
        }
        if ("focusMode" in data) {
          document.body.classList.toggle("focus-mode", !!data.focusMode)
        }
        if ("reduceMotion" in data) {
          localStorage.setItem("reduceMotion", !!data.reduceMotion)
          if (data.reduceMotion) document.body.classList.add("reduce-motion")
          else document.body.classList.remove("reduce-motion")
        }
        // sync UI
        const compBtn = panel.querySelector(".settings-compact")
        const denseBtn = panel.querySelector(".settings-dense")
        if (compBtn) {
          compBtn.setAttribute("aria-pressed", document.body.classList.contains("compact"))
          compBtn.textContent = document.body.classList.contains("compact") ? "On" : "Off"
        }
        if (denseBtn) {
          denseBtn.setAttribute("aria-pressed", document.body.classList.contains("dense"))
          denseBtn.textContent = document.body.classList.contains("dense") ? "On" : "Off"
        }
        if (window.updateModeIndicator) window.updateModeIndicator()
      } catch (err) {
        alert("Invalid JSON file")
      }
    }
    reader.readAsText(f)
  })

  panel.querySelector(".settings-export")?.addEventListener("click", function () {
    const prefs = {
      compactMode: document.body.classList.contains("compact"),
      denseMode: document.body.classList.contains("dense"),
      focusMode: document.body.classList.contains("focus-mode"),
      reduceMotion: !!localStorage.getItem("reduceMotion") === "true",
    }
    const blob = new Blob([JSON.stringify(prefs, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "my-preferences.json"
    a.click()
    URL.revokeObjectURL(url)
  })

  panel.querySelector(".settings-apply-site")?.addEventListener("click", function () {
    // we can't write to the server directly from static site. Provide download as a convenience for site admin.
    const prefs = {
      compactMode: document.body.classList.contains("compact"),
      denseMode: document.body.classList.contains("dense"),
      focusMode: document.body.classList.contains("focus-mode"),
      reduceMotion: !!localStorage.getItem("reduceMotion") === "true",
    }
    const blob = new Blob([JSON.stringify(prefs, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "site-preferences.json"
    a.click()
    URL.revokeObjectURL(url)
    alert(
      "A preferences JSON was downloaded. To apply site-wide, place it at /assets/config/site-preferences.json and rebuild the site.",
    )
  })

  // reflect saved state
  const compactSaved = localStorage.getItem("compactMode") === "true"
  const denseSaved = localStorage.getItem("denseMode") === "true"
  const focusSaved = document.body.classList.contains("focus-mode")
  const reduceSaved = localStorage.getItem("reduceMotion") === "true"

  const compBtn = panel.querySelector(".settings-compact")
  const denseBtn = panel.querySelector(".settings-dense")
  const focusBtn = panel.querySelector(".settings-focus")
  const motionBtn = panel.querySelector(".settings-motion")

  if (compBtn) {
    compBtn.setAttribute("aria-pressed", compactSaved)
    compBtn.textContent = compactSaved ? "On" : "Off"
  }
  if (denseBtn) {
    denseBtn.setAttribute("aria-pressed", denseSaved)
    denseBtn.textContent = denseSaved ? "On" : "Off"
  }
  if (focusBtn) {
    focusBtn.setAttribute("aria-pressed", focusSaved)
    focusBtn.textContent = focusSaved ? "On" : "Off"
  }
  if (motionBtn) {
    motionBtn.setAttribute("aria-pressed", reduceSaved)
    motionBtn.textContent = reduceSaved ? "On" : "Off"
  }

  panel.querySelector(".settings-close").addEventListener("click", function () {
    panel.classList.remove("show")
    panel.setAttribute("aria-hidden", "true")
    document.querySelector(".settings-button")?.setAttribute("aria-expanded", "false")
  })

  // Toggle handlers
  compBtn?.addEventListener("click", function (e) {
    const enabled = !(this.getAttribute("aria-pressed") === "true")
    localStorage.setItem("compactMode", enabled)
    document.body.classList.toggle("compact", enabled)
    this.setAttribute("aria-pressed", enabled)
    this.textContent = enabled ? "On" : "Off"
    document.querySelector(".compact-toggle")?.setAttribute("aria-pressed", enabled)
    if (window.updateModeIndicator) window.updateModeIndicator()
  })

  denseBtn?.addEventListener("click", function (e) {
    const enabled = !(this.getAttribute("aria-pressed") === "true")
    localStorage.setItem("denseMode", enabled)
    document.body.classList.toggle("dense", enabled)
    this.setAttribute("aria-pressed", enabled)
    this.textContent = enabled ? "On" : "Off"
    document.querySelector(".dense-toggle")?.setAttribute("aria-pressed", enabled)
    if (window.updateModeIndicator) window.updateModeIndicator()
  })

  focusBtn?.addEventListener("click", function (e) {
    const enabled = !(this.getAttribute("aria-pressed") === "true")
    document.body.classList.toggle("focus-mode", enabled)
    this.setAttribute("aria-pressed", enabled)
    this.textContent = enabled ? "On" : "Off"
    if (enabled && window.gamification) window.gamification.addXP(5, "Focus Mode (settings)")
    if (window.updateModeIndicator) window.updateModeIndicator()
  })

  motionBtn?.addEventListener("click", function (e) {
    const enabled = !(this.getAttribute("aria-pressed") === "true")
    localStorage.setItem("reduceMotion", enabled)
    this.setAttribute("aria-pressed", enabled)
    this.textContent = enabled ? "On" : "Off"
    if (enabled) {
      document.documentElement.style.setProperty("scroll-behavior", "auto")
      document.body.classList.add("reduce-motion")
    } else {
      document.documentElement.style.setProperty("scroll-behavior", "smooth")
      document.body.classList.remove("reduce-motion")
    }
  })

  // close on outside click
  function outsideClose(e) {
    if (!panel.contains(e.target) && !e.target.classList?.contains("settings-button")) {
      panel.classList.remove("show")
      panel.setAttribute("aria-hidden", "true")
      document.querySelector(".settings-button")?.setAttribute("aria-expanded", "false")
      document.removeEventListener("click", outsideClose)
    }
  }
  document.addEventListener("click", outsideClose)

  // close on escape
  function onEscape(e) {
    if (e.key === "Escape") {
      panel.classList.remove("show")
      panel.setAttribute("aria-hidden", "true")
      document.querySelector(".settings-button")?.setAttribute("aria-expanded", "false")
      document.removeEventListener("keydown", onEscape)
    }
  }
  document.addEventListener("keydown", onEscape)

  return panel
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
    m: () => document.querySelector(".compact-toggle")?.click(),
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
      <strong>B</strong> - Bottom<br>
      <strong>M</strong> - Toggle Compact Mode
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

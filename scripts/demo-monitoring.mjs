#!/usr/bin/env node
/**
 * Performance monitoring demonstration script
 * Shows how to use the performance monitoring utility
 */

// Simple performance monitor implementation for demo
const perfMonitor = {
  metrics: new Map(),

  start(name) {
    if (this.metrics.has(name)) {
      console.warn(`Metric "${name}" already started`)
      return
    }
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
    })
  },

  end(name) {
    const metric = this.metrics.get(name)
    if (!metric) {
      console.warn(`Metric "${name}" was not started`)
      return 0
    }

    const endTime = performance.now()
    metric.endTime = endTime
    metric.duration = endTime - metric.startTime

    if (typeof process !== "undefined" && process.memoryUsage) {
      const mem = process.memoryUsage()
      metric.memory = {
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
        external: Math.round(mem.external / 1024 / 1024),
      }
    }

    return metric.duration
  },

  report() {
    const metrics = Array.from(this.metrics.values()).filter((m) => m.duration !== undefined)

    const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0)

    const lines = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Performance Report",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ]

    for (const metric of metrics) {
      const percentage = Math.round((metric.duration / totalDuration) * 100)
      const barLength = Math.round(percentage / 5)
      const bar = "█".repeat(barLength) + "░".repeat(20 - barLength)
      const memory = metric.memory ? ` | ${metric.memory.heapUsed}MB / ${metric.memory.heapTotal}MB` : ""
      lines.push(
        `${metric.name.padEnd(25)} ${bar} ${percentage.toString().padStart(3)}% ${metric.duration.toFixed(2).padStart(8)}ms${memory}`,
      )
    }

    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    lines.push(`Total: ${totalDuration.toFixed(2)}ms`)
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    return lines.join("\n")
  },
}

// Simple error handler implementation for demo
const errorHandler = {
  errors: [],
  report() {
    const summary = {
      total: this.errors.length,
      errors: 0,
      warnings: 0,
      info: 0,
      debug: 0,
    }

    for (const error of this.errors) {
      summary[error.severity]++
    }

    const lines = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `Error Report (Total: ${summary.total})`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `  🔴 Errors:   ${summary.errors}`,
      `  🟡 Warnings: ${summary.warnings}`,
      `  🔵 Info:     ${summary.info}`,
      `  ⚪ Debug:    ${summary.debug}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ]
    return lines.join("\n")
  },
  getSummary() {
    const summary = {
      total: this.errors.length,
      errors: 0,
      warnings: 0,
      info: 0,
      debug: 0,
    }
    for (const error of this.errors) {
      summary[error.severity]++
    }
    return summary
  },
  info(msg, ctx) {
    this.errors.push({ message: msg, severity: "info", context: ctx })
    console.log(`[INFO] ${msg}`)
    if (ctx?.context) console.log(`       Context: ${ctx.context}`)
  },
  warn(msg, ctx) {
    this.errors.push({ message: msg, severity: "warning", context: ctx })
    console.log(`[WARN] ${msg}`)
    if (ctx?.file) console.log(`       File: ${ctx.file}`)
    if (ctx?.suggestion) console.log(`       💡 Suggestion: ${ctx.suggestion}`)
  },
  error(msg, ctx) {
    this.errors.push({ message: msg, severity: "error", context: ctx })
    console.log(`[ERROR] ${msg}`)
    if (ctx?.file) console.log(`        File: ${ctx.file}`)
    if (ctx?.context) console.log(`        Context: ${ctx.context}`)
    if (ctx?.suggestion) console.log(`        💡 Suggestion: ${ctx.suggestion}`)
  },
  debug(msg, ctx) {
    this.errors.push({ message: msg, severity: "debug", context: ctx })
    console.log(`[DEBUG] ${msg}`)
    if (ctx?.context) console.log(`        Context: ${ctx.context}`)
  },
}

// Simulate some operations with timing
function simulateWork(durationMs) {
  const end = Date.now() + durationMs
  while (Date.now() < end) {
    // Busy wait
  }
}

async function demonstrateMonitoring() {
  console.log("\n🎯 Performance Monitoring Demo\n")
  console.log("================================\n")

  // Simulate various operations
  const operations = [
    { name: "Parsing markdown files", duration: 500 },
    { name: "Type checking", duration: 300 },
    { name: "Building components", duration: 200 },
    { name: "Generating images", duration: 400 },
    { name: "Writing output files", duration: 100 },
  ]

  for (const op of operations) {
    perfMonitor.start(op.name)
    simulateWork(op.duration)
    const time = perfMonitor.end(op.name)
    console.log(`✓ ${op.name}: ${time.toFixed(2)}ms`)
  }

  console.log("\n" + perfMonitor.report())

  // Demonstrate error handling
  console.log("\n🔍 Error Handling Demo\n")
  console.log("================================\n")

  errorHandler.info("Build started", { context: "Full site rebuild" })

  errorHandler.warn("Large image detected", {
    file: "content/assets/images/logo.png",
    line: 1,
    suggestion: "Consider compressing or using WebP format",
  })

  errorHandler.error("Failed to generate OG image", {
    file: "quartz/plugins/emitters/ogImage.tsx",
    line: 85,
    context: "Memory limit exceeded",
    suggestion: "Reduce image quality or increase available memory",
  })

  errorHandler.debug("Cache hit for file", {
    file: "content/index.md",
    context: "No changes since last build",
  })

  console.log("\n" + errorHandler.report())

  const summary = errorHandler.getSummary()
  console.log("\nError Summary:")
  console.log(`  Total: ${summary.total}`)
  console.log(`  Errors: ${summary.errors}`)
  console.log(`  Warnings: ${summary.warnings}`)
  console.log(`  Info: ${summary.info}`)
  console.log(`  Debug: ${summary.debug}`)
}

demonstrateMonitoring().catch((err) => {
  console.error("Demo failed:", err)
  process.exit(1)
})

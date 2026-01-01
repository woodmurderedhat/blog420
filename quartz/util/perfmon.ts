/**
 * Performance monitoring utilities for build optimization
 */

interface PerformanceMetric {
  name: string
  startTime: number
  endTime?: number
  duration?: number
  memory?: {
    heapUsed: number
    heapTotal: number
    external: number
  }
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map()
  private enabled: boolean

  constructor(enabled: boolean = true) {
    this.enabled = enabled
  }

  /**
   * Start tracking a metric
   */
  start(name: string): void {
    if (!this.enabled) return

    if (this.metrics.has(name)) {
      console.warn(`Performance metric "${name}" already started`)
      return
    }

    this.metrics.set(name, {
      name,
      startTime: performance.now(),
    })
  }

  /**
   * End tracking a metric
   */
  end(name: string): number {
    if (!this.enabled) return 0

    const metric = this.metrics.get(name)
    if (!metric) {
      console.warn(`Performance metric "${name}" was not started`)
      return 0
    }

    const endTime = performance.now()
    metric.endTime = endTime
    metric.duration = endTime - metric.startTime

    // Capture memory usage if available
    if (typeof process !== "undefined" && process.memoryUsage) {
      const mem = process.memoryUsage()
      metric.memory = {
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024), // MB
        external: Math.round(mem.external / 1024 / 1024), // MB
      }
    }

    return metric.duration
  }

  /**
   * Mark a checkpoint without ending
   */
  mark(name: string): void {
    if (!this.enabled) return
    this.start(name)
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
  }

  /**
   * Get a specific metric
   */
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name)
  }

  /**
   * Get summary of all metrics
   */
  getSummary(): {
    totalDuration: number
    metrics: Array<{
      name: string
      duration: number
      percentage: number
      memory?: string
    }>
  } {
    const metrics = Array.from(this.metrics.values()).filter(
      (m): m is PerformanceMetric & { duration: number } => m.duration !== undefined,
    )

    const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0)

    return {
      totalDuration,
      metrics: metrics.map((m) => ({
        name: m.name,
        duration: m.duration,
        percentage: Math.round((m.duration / totalDuration) * 100),
        memory: m.memory ? `${m.memory.heapUsed}MB / ${m.memory.heapTotal}MB` : undefined,
      })),
    }
  }

  /**
   * Print a formatted report
   */
  report(): string {
    const summary = this.getSummary()
    const lines: string[] = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "Performance Report",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ]

    for (const metric of summary.metrics) {
      const barLength = Math.round(metric.percentage / 5)
      const bar = "█".repeat(barLength) + "░".repeat(20 - barLength)
      const memory = metric.memory ? ` | ${metric.memory}` : ""
      lines.push(
        `${metric.name.padEnd(25)} ${bar} ${metric.percentage.toString().padStart(3)}% ${metric.duration.toFixed(2).padStart(8)}ms${memory}`,
      )
    }

    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    lines.push(`Total: ${summary.totalDuration.toFixed(2)}ms`)
    lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    return lines.join("\n")
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear()
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }
}

export const perfMonitor = new PerformanceMonitor()
export { PerformanceMonitor }

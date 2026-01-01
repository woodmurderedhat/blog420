/**
 * Enhanced error handling and recovery utilities
 */

import { styleText } from "util"

type ErrorSeverity = "error" | "warning" | "info" | "debug"

interface ErrorContext {
  file?: string
  line?: number
  column?: number
  context?: string
  suggestion?: string
}

class ErrorHandler {
  private errors: Array<{
    message: string
    severity: ErrorSeverity
    context?: ErrorContext
    timestamp: Date
    stack?: string
  }> = []

  private maxErrors: number = 100
  private silent: boolean = false

  constructor(maxErrors: number = 100, silent: boolean = false) {
    this.maxErrors = maxErrors
    this.silent = silent
  }

  /**
   * Log an error with context
   */
  error(message: string, context?: ErrorContext, stack?: string): void {
    this.log("error", message, context, stack)
  }

  /**
   * Log a warning
   */
  warn(message: string, context?: ErrorContext): void {
    this.log("warning", message, context)
  }

  /**
   * Log info
   */
  info(message: string, context?: ErrorContext): void {
    this.log("info", message, context)
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: ErrorContext): void {
    this.log("debug", message, context)
  }

  /**
   * Internal log method
   */
  private log(
    severity: ErrorSeverity,
    message: string,
    context?: ErrorContext,
    stack?: string,
  ): void {
    const record = {
      message,
      severity,
      context,
      timestamp: new Date(),
      stack,
    }

    this.errors.push(record)

    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    if (!this.silent) {
      this.printLog(severity, message, context)
    }
  }

  /**
   * Print formatted log message
   */
  private printLog(severity: ErrorSeverity, message: string, context?: ErrorContext): void {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0]
    const severityLabel = severity.toUpperCase().padEnd(7)
    const color = this.getSeverityColor(severity)

    const prefix = `[${timestamp}] ${styleText(color, severityLabel)}`
    const lines = [prefix + ` ${message}`]

    if (context) {
      if (context.file) {
        lines.push(`  📁 File: ${context.file}`)
      }
      if (context.line) {
        lines.push(
          `  📍 Location: ${context.file}:${context.line}${context.column ? `:${context.column}` : ""}`,
        )
      }
      if (context.context) {
        lines.push(`  💬 Context: ${context.context}`)
      }
      if (context.suggestion) {
        lines.push(`  💡 Suggestion: ${context.suggestion}`)
      }
    }

    console.log(lines.join("\n"))
  }

  /**
   * Get color for severity level
   */
  private getSeverityColor(severity: ErrorSeverity): "red" | "yellow" | "blue" | "gray" {
    switch (severity) {
      case "error":
        return "red"
      case "warning":
        return "yellow"
      case "info":
        return "blue"
      case "debug":
        return "gray"
    }
  }

  /**
   * Check if there are any errors
   */
  hasErrors(): boolean {
    return this.errors.some((e) => e.severity === "error")
  }

  /**
   * Get all errors
   */
  getErrors(): typeof this.errors {
    return [...this.errors]
  }

  /**
   * Get error summary
   */
  getSummary(): {
    total: number
    errors: number
    warnings: number
    info: number
    debug: number
  } {
    const summary = {
      total: this.errors.length,
      errors: 0,
      warnings: 0,
      info: 0,
      debug: 0,
    }

    for (const error of this.errors) {
      summary[error.severity as keyof typeof summary]++
    }

    return summary
  }

  /**
   * Print error report
   */
  report(): string {
    const summary = this.getSummary()
    const lines: string[] = [
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `Error Report (Total: ${summary.total})`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `  🔴 Errors:   ${summary.errors}`,
      `  🟡 Warnings: ${summary.warnings}`,
      `  🔵 Info:     ${summary.info}`,
      `  ⚪ Debug:    ${summary.debug}`,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ]

    return lines.join("\n")
  }

  /**
   * Clear all errors
   */
  clear(): void {
    this.errors = []
  }

  /**
   * Set silent mode
   */
  setSilent(silent: boolean): void {
    this.silent = silent
  }
}

export const errorHandler = new ErrorHandler()
export { ErrorHandler }

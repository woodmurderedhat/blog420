#!/usr/bin/env node
import { readFileSync } from "fs"
import { join } from "path"
import { styleText } from "util"

const checks = [
  {
    name: "package.json exists",
    check: () => {
      try {
        readFileSync(join(process.cwd(), "package.json"), "utf-8")
        return true
      } catch {
        return false
      }
    },
    critical: true,
  },
  {
    name: "tsconfig.json exists",
    check: () => {
      try {
        readFileSync(join(process.cwd(), "tsconfig.json"), "utf-8")
        return true
      } catch {
        return false
      }
    },
    critical: true,
  },
  {
    name: "quartz.config.ts exists",
    check: () => {
      try {
        readFileSync(join(process.cwd(), "quartz.config.ts"), "utf-8")
        return true
      } catch {
        return false
      }
    },
    critical: true,
  },
  {
    name: "quartz.layout.ts exists",
    check: () => {
      try {
        readFileSync(join(process.cwd(), "quartz.layout.ts"), "utf-8")
        return true
      } catch {
        return false
      }
    },
    critical: true,
  },
  {
    name: "Dockerfile is optimized",
    check: () => {
      try {
        const content = readFileSync(join(process.cwd(), "Dockerfile"), "utf-8")
        return content.includes("AS builder")
      } catch {
        return false
      }
    },
    critical: false,
  },
  {
    name: ".dockerignore exists",
    check: () => {
      try {
        readFileSync(join(process.cwd(), ".dockerignore"), "utf-8")
        return true
      } catch {
        return false
      }
    },
    critical: false,
  },
  {
    name: "package-lock.json exists",
    check: () => {
      try {
        readFileSync(join(process.cwd(), "package-lock.json"), "utf-8")
        return true
      } catch {
        return false
      }
    },
    critical: true,
  },
]

async function runValidation() {
  console.log("\n" + styleText("blue", "🔍 Build Configuration Validation"))
  console.log("━".repeat(50))

  let passed = 0
  let failed = 0
  let criticalFailed = false

  for (const check of checks) {
    const result = await check.check()
    const status = result ? styleText("green", "✓") : styleText("red", "✗")
    const critical = check.critical ? styleText("red", " [CRITICAL]") : ""

    console.log(`${status} ${check.name}${critical}`)

    if (result) {
      passed++
    } else {
      failed++
      if (check.critical) {
        criticalFailed = true
      }
    }
  }

  console.log("━".repeat(50))
  console.log(
    `Results: ${styleText("green", `${passed} passed`)}, ${styleText("red", `${failed} failed`)}\n`,
  )

  if (criticalFailed) {
    console.error(styleText("red", "❌ Critical checks failed. Build cannot proceed."))
    process.exit(1)
  } else if (failed > 0) {
    console.warn(
      styleText("yellow", "⚠️  Some optional checks failed. Build may work but with limitations."),
    )
  } else {
    console.log(styleText("green", "✅ All checks passed! Ready to build."))
  }
}

runValidation().catch((err) => {
  console.error(styleText("red", "Error during validation:"), err.message)
  process.exit(1)
})

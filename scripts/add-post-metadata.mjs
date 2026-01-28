#!/usr/bin/env node
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import prompts from "@clack/prompts"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const POSTS_DIR = path.resolve(process.cwd(), "content", "posts")

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}

async function listMarkdownFiles() {
  const files = await fs.readdir(POSTS_DIR)
  return files.filter((f) => f.endsWith(".md"))
}

async function hasFrontMatter(content) {
  return content.startsWith("---")
}

async function run() {
  try {
    const arg = process.argv[2]
    let file

    if (arg) {
      file = path.resolve(arg)
      if (!file.startsWith(POSTS_DIR)) {
        file = path.resolve(process.cwd(), arg)
      }
    } else {
      const files = await listMarkdownFiles()
      const choice = await prompts.select({
        message: "Pick a post to add metadata to",
        options: files.map((f) => ({ value: f, label: f })),
      })
      file = path.join(POSTS_DIR, choice)
    }

    const basename = path.basename(file)

    const raw = await fs.readFile(file, "utf8")
    if (await hasFrontMatter(raw)) {
      const should = await prompts.confirm({
        message: "This file already has front matter. Overwrite?",
      })
      if (!should) {
        console.log("No changes made.")
        process.exit(0)
      }
    }

    // Parse date and slug from filename like 2026-01-29-slug.md
    const match = basename.match(/(\d{4}-\d{2}-\d{2})-(.+)\.md$/)
    const defaultDate = match ? match[1] : new Date().toISOString().split("T")[0]
    const defaultSlug = match ? match[2] : basename.replace(/\.md$/, "")
    const defaultTitle = slugToTitle(defaultSlug)

    const title = await prompts.text({ message: "Title", initialValue: defaultTitle })
    const date = await prompts.text({ message: "Date (YYYY-MM-DD)", initialValue: defaultDate })
    const author = await prompts.text({ message: "Author", initialValue: "" })
    const tagsInput = await prompts.text({ message: "Tags (comma-separated)", initialValue: "" })
    const excerpt = await prompts.text({ message: "Excerpt / summary", initialValue: "" })

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const frontMatterLines = ["---", `title: "${title.replace(/"/g, '\\"')}"`, `date: ${date}`]

    if (author) frontMatterLines.push(`author: ${author}`)
    if (tagsArray.length) frontMatterLines.push(`tags: [${tagsArray.join(", ")}]`)
    if (excerpt) frontMatterLines.push(`excerpt: "${excerpt.replace(/"/g, '\\"')}"`)
    frontMatterLines.push("---\n")

    const newContent = frontMatterLines.join("\n") + raw.replace(/^---[\s\S]*?---\s*/, "")

    await fs.writeFile(file, newContent, "utf8")

    console.log(`✅ Updated ${file}`)
  } catch (err) {
    console.error("Error:", err)
    process.exit(1)
  }
}

run()

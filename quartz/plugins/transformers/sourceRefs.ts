import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
import { Text, Link } from "mdast"

export const SourceRefs: QuartzTransformerPlugin = () => {
  return {
    name: "SourceRefs",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            const sources = file.data.frontmatter?.sources
            if (!sources || sources.length === 0) return

            visit(tree, "text", (node: Text, index, parent) => {
              if (!parent || index === null) return

              const text = node.value
              // Match [1], [2], etc. not already in links
              const regex = /\[(\d+)\]/g
              let match
              const parts = []
              let lastIndex = 0

              while ((match = regex.exec(text)) !== null) {
                const num = parseInt(match[1])
                
                // Add text before the match
                if (match.index > lastIndex) {
                  parts.push({
                    type: "text",
                    value: text.slice(lastIndex, match.index),
                  })
                }

                // Add the citation link
                if (num > 0 && num <= sources.length) {
                  parts.push({
                    type: "link",
                    url: `#source-${num}`,
                    data: {
                      hProperties: {
                        className: ["source-ref"],
                      },
                    },
                    children: [
                      {
                        type: "text",
                        value: `[${num}]`,
                      },
                    ],
                  })
                } else {
                  // Keep as text if number is out of range
                  parts.push({
                    type: "text",
                    value: match[0],
                  })
                }

                lastIndex = regex.lastIndex
              }

              // Add remaining text
              if (lastIndex < text.length) {
                parts.push({
                  type: "text",
                  value: text.slice(lastIndex),
                })
              }

              // Replace the node if we found citations
              if (parts.length > 0) {
                parent.children.splice(index, 1, ...parts)
              }
            })
          }
        },
      ]
    },
  }
}

import { QuartzTransformerPlugin } from "../types"
import { Root, PhrasingContent, Text } from "mdast"
import { visit, SKIP } from "unist-util-visit"

export const SourceRefs: QuartzTransformerPlugin = () => {
  return {
    name: "SourceRefs",
    markdownPlugins() {
      return [
        () => {
          return (tree: Root, file) => {
            const sources = file.data.frontmatter?.sources
            if (!sources || !Array.isArray(sources) || sources.length === 0) return

            visit(tree, "text", (node: Text, index, parent) => {
              if (!parent || index === undefined || index === null) return

              const text = node.value
              // Match [1], [2], etc. not already in links
              const regex = /\[(\d+)\]/g
              let match
              const parts: PhrasingContent[] = []
              let lastIndex = 0

              while ((match = regex.exec(text)) !== null) {
                const num = parseInt(match[1])
                
                // Add text before the match
                if (match.index > lastIndex) {
                  parts.push({
                    type: "text",
                    value: text.slice(lastIndex, match.index),
                  } as Text)
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
                      } as Text,
                    ],
                  })
                } else {
                  // Keep as text if number is out of range
                  parts.push({
                    type: "text",
                    value: match[0],
                  } as Text)
                }

                lastIndex = regex.lastIndex
              }

              // Add remaining text
              if (lastIndex < text.length) {
                parts.push({
                  type: "text",
                  value: text.slice(lastIndex),
                } as Text)
              }

              // Replace the node if we found citations
              if (parts.length > 0) {
                parent.children.splice(index, 1, ...parts)
                // Return SKIP to avoid revisiting the newly inserted nodes
                return [SKIP, index]
              }
            })
          }
        },
      ]
    },
  }
}

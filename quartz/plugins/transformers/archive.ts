import { QuartzTransformerPlugin } from "../types"

export interface ArchiveOptions {
  thresholdMonths?: number
  archivePropertyName?: string
  persistFrontmatter?: boolean
}

const defaultOptions: ArchiveOptions = {
  thresholdMonths: 1,
  archivePropertyName: "archived",
  persistFrontmatter: false,
}

export const ArchiveMarker: QuartzTransformerPlugin<Partial<ArchiveOptions>> = (userOpts) => {
  const opts: ArchiveOptions = { ...defaultOptions, ...userOpts }
  return {
    name: "ArchiveMarker",
    markdownPlugins() {
      return [
        () => async (_tree, file) => {
          const date =
            file.data.dates?.published ?? file.data.dates?.modified ?? file.data.dates?.created
          if (!date) return
          const now = new Date()
          const months =
            (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())
          const isArchived = months >= (opts.thresholdMonths ?? 1)
          // set in-memory flags only
          ;(file.data as any)[opts.archivePropertyName || "archived"] = isArchived
          if (isArchived) {
            ;(file.data as any)["archivedAt"] = new Date().toISOString()
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    archived?: boolean
    archivedAt?: string
  }
}

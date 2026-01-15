import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const ArchiveLink: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  if (!cfg.archives?.showInNav) return null
  const path = cfg.archives?.basePath ?? "/archives/"
  return (
    <div class="archive-link">
      <a class="internal" href={path}>
        {"Archives"}
      </a>
    </div>
  )
}

ArchiveLink.css = `
.archive-link a { font-weight: 600; }
`

export default (() => ArchiveLink) satisfies QuartzComponentConstructor

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const SourceList: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const sources = fileData.frontmatter?.sources
  if (sources && sources.length > 0) {
    return (
      <div class={classNames(displayClass, "sources")}>
        <p><strong>Sources</strong></p>
        <ol>
          {sources.map((source: string, index: number) => (
            <li id={`source-${index + 1}`}>
              <span dangerouslySetInnerHTML={{ __html: source }} />
            </li>
          ))}
        </ol>
      </div>
    )
  } else {
    return null
  }
}

SourceList.css = `
.sources {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--lightgray);
  font-size: 0.9rem;
  color: var(--gray);
}

.sources strong {
  color: var(--darkgray);
  display: block;
  margin-bottom: 0.5rem;
}

.sources ol {
  margin: 0;
  padding-left: 1.5rem;
}

.sources li {
  margin-bottom: 0.5rem;
}

.sources a {
  color: var(--secondary);
}

a.source-ref {
  color: var(--secondary);
  text-decoration: none;
  font-weight: 500;
  vertical-align: super;
  font-size: 0.8em;
  margin-left: 0.1em;
}

a.source-ref:hover {
  text-decoration: underline;
}
`

export default (() => SourceList) satisfies QuartzComponentConstructor

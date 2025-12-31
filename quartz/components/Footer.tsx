import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const defaultLinks: Record<string, string> = {
      GitHub: "https://github.com/woodmurderedhat/",
      Discord: "https://discord.gg/fvD5C56vsA",
    }
    const links = { ...defaultLinks, ...(opts?.links ?? {}) }
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          Built for <a href="https://420360.xyz/">420360.xyz</a> · © {year}
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor

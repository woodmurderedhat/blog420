import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "420360 Blog",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "blog.420360.xyz",
    ignorePatterns: ["private", "templates", ".obsidian", "README.md"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#f7f4ff",
          lightgray: "#e3d7ff",
          gray: "#6b7cff",
          darkgray: "#2a2f45",
          dark: "#0f1428",
          secondary: "#ff3fd8",
          tertiary: "#1ccad8",
          highlight: "rgba(255, 63, 216, 0.12)",
          textHighlight: "#1ccad866",
        },
        darkMode: {
          light: "#0b1021",
          lightgray: "#18223a",
          gray: "#34d8ff",
          darkgray: "#c8e7ff",
          dark: "#f4f6ff",
          secondary: "#ff3fd8",
          tertiary: "#24f0c7",
          highlight: "rgba(255, 63, 216, 0.16)",
          textHighlight: "#24f0c755",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({
        enableInHtmlEmbed: true,
      }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({
        markdownLinkResolution: "shortest",
        openLinksInNewTab: false,
      }),
      Plugin.Description(),
      Plugin.Latex({
        renderEngine: "katex",
      }),
      Plugin.SourceRefs(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      Plugin.CustomOgImages(),
    ],
  },
}

export default config

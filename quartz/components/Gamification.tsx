import { QuartzComponent, QuartzComponentConstructor } from "./types"

export default (() => {
  const Gamification: QuartzComponent = () => {
    return (
      <>
        <script src="/assets/js/gamification.js" defer></script>
        <script src="/assets/js/bonus-features.js" defer></script>
      </>
    )
  }
  return Gamification
}) satisfies QuartzComponentConstructor

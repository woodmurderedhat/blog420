// @ts-nocheck
import { VFile } from "vfile"
import { ArchiveMarker } from "./archive"

if (typeof test === "function") {
  test("marks files older than thresholdMonths as archived", async () => {
    const plugin = ArchiveMarker({ thresholdMonths: 1 })
    const [factory] = plugin.markdownPlugins({} as any)
    const fn = factory()

    const file = new VFile("")
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

    // provide all date fields as some transformers expect them
    file.data = {
      dates: {
        created: twoMonthsAgo,
        modified: twoMonthsAgo,
        published: twoMonthsAgo,
      },
    }

    // invoke plugin
    await fn(null, file)

    expect((file.data as any).archived).toBe(true)
    expect(typeof (file.data as any).archivedAt).toBe("string")
  })

  test("does not mark recent files as archived", async () => {
    const plugin = ArchiveMarker({ thresholdMonths: 1 })
    const [factory] = plugin.markdownPlugins({} as any)
    const fn = factory()

    const file = new VFile("")
    const recent = new Date()
    recent.setDate(recent.getDate() - 5)

    file.data = {
      dates: {
        created: recent,
        modified: recent,
        published: recent,
      },
    }

    // invoke plugin
    await fn(null, file)

    expect((file.data as any).archived).toBe(false)
    expect((file.data as any).archivedAt).toBeUndefined()
  })
}


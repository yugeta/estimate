import fs from "node:fs/promises"
import path from "node:path"
import { createServer } from "node:http"
import { chromium } from "playwright"

const HOST = "127.0.0.1"
const PORT = 4173
const repoRoot = process.cwd()
const publicRoot = path.join(repoRoot, "public")
const outputRoot = path.join(publicRoot, "template/images")
const viewportPatterns = [
  { key: "pc", width: 1000, height: 1400 },
  { key: "tablet", width: 768, height: 1200 },
  { key: "smartphone", width: 320, height: 900 }
]

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
}

const startServer = () => {
  const server = createServer(async (req, res) => {
    try {
      const requestPath = (req.url || "/").split("?")[0]
      let relativePath = decodeURIComponent(requestPath)

      if (relativePath.endsWith("/")) {
        relativePath += "index.html"
      }

      const normalizedPath = path.normalize(relativePath).replace(/^\/+/, "")
      const filePath = path.join(publicRoot, normalizedPath)

      if (!filePath.startsWith(publicRoot)) {
        res.writeHead(403)
        res.end("Forbidden")
        return
      }

      const stat = await fs.stat(filePath)
      if (stat.isDirectory()) {
        res.writeHead(301, { Location: `${requestPath.replace(/\/$/, "")}/` })
        res.end()
        return
      }

      const ext = path.extname(filePath).toLowerCase()
      const mime = mimeTypes[ext] || "application/octet-stream"
      const data = await fs.readFile(filePath)

      res.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": mime
      })
      res.end(data)
    } catch (error) {
      res.writeHead(404)
      res.end("Not Found")
    }
  })

  return new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(PORT, HOST, () => {
      resolve(server)
    })
  })
}

const loadChangedFiles = async (listFilePath) => {
  const content = await fs.readFile(listFilePath, "utf8")
  return content
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => line.startsWith("public/templates/") && line.endsWith("/index.html"))
}

const templateNameFromPath = (templatePath) => {
  const segments = templatePath.split("/")
  return segments[2] || "template"
}

const main = async () => {
  const listFilePath = process.argv[2]
  if (!listFilePath) {
    throw new Error("Changed files list path is required.")
  }

  const changedFiles = await loadChangedFiles(listFilePath)
  if (!changedFiles.length) {
    console.log("No changed template HTML files found.")
    return
  }

  await fs.mkdir(outputRoot, { recursive: true })
  const server = await startServer()
  const browser = await chromium.launch({ headless: true })

  try {
    for (const templatePath of changedFiles) {
      const templateName = templateNameFromPath(templatePath)
      const url = `http://${HOST}:${PORT}/templates/${templateName}/index.html`
      const templateOutputDir = path.join(outputRoot, templateName)
      await fs.mkdir(templateOutputDir, { recursive: true })

      for (const pattern of viewportPatterns) {
        const outputPath = path.join(templateOutputDir, `${pattern.key}.png`)
        const page = await browser.newPage({
          viewport: { width: pattern.width, height: pattern.height }
        })

        await page.goto(url, { waitUntil: "networkidle" })
        await page.waitForTimeout(500)
        await page.screenshot({ fullPage: true, path: outputPath })
        await page.close()

        console.log(
          `Rendered [${pattern.key} ${pattern.width}px]: ${templatePath} -> ${path.relative(repoRoot, outputPath)}`
        )
      }
    }
  } finally {
    await browser.close()
    await new Promise(resolve => server.close(resolve))
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
class TemplateView {
  constructor(options = {}) {
    this.selector = options.selector || "#designs .carousel .card a"
    this.imageRoot = options.imageRoot || "template_images"
    this.breakPoints = {
      smartphone: 480,
      tablet: 1024
    }
    this.devicePatterns = [
      { key: "pc", label: "PC" },
      { key: "tb", label: "Tablet" },
      { key: "sp", label: "Smartphone" }
    ]
    this.deviceIcons = {
      pc: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="1.5"></rect><path d="M9 20h6"></path><path d="M12 16v4"></path></svg>`,
      tb: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="1.8"></rect><circle cx="12" cy="18" r=".8"></circle></svg>`,
      sp: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="2" width="8" height="20" rx="1.6"></rect><circle cx="12" cy="18.5" r=".7"></circle></svg>`
    }

    this.buildModal()
    this.bindCards()
    this.bindGlobalEvents()
  }

  buildModal() {
    this.root = document.createElement("div")
    this.root.className = "template-view"
    this.root.setAttribute("data-status", "closed")
    this.root.innerHTML = `
      <div class="template-view-overlay" data-role="close"></div>
      <div class="template-view-dialog" role="dialog" aria-modal="true" aria-label="Template viewer">
        <a class="template-view-open-link" target="_blank" rel="noopener" aria-label="テンプレートを別タブで開く">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6"></path><path d="M10 14L20 4"></path><path d="M20 13v7H4V4h7"></path></svg>
        </a>
        <button type="button" class="template-view-close" data-role="close" aria-label="閉じる">×</button>
        <div class="template-view-header">
          <div class="template-view-tabs" role="tablist"></div>
        </div>
        <div class="template-view-body">
          <img class="template-view-image" alt="Template preview" />
        </div>
      </div>
    `

    document.body.appendChild(this.root)

    this.tabsElm = this.root.querySelector(".template-view-tabs")
    this.imageElm = this.root.querySelector(".template-view-image")
    this.openLinkElm = this.root.querySelector(".template-view-open-link")
    this.bodyElm = this.root.querySelector(".template-view-body")

    this.tooltipElm = document.createElement("div")
    this.tooltipElm.className = "template-view-tooltip"
    this.tooltipElm.setAttribute("data-status", "hidden")
    document.body.appendChild(this.tooltipElm)
  }

  bindCards() {
    this.cards = [...document.querySelectorAll(this.selector)]
    if (!this.cards.length) {
      return
    }

    this.cards.forEach(card => {
      const templateName = this.getTemplateNameFromHref(card.getAttribute("href"))
      if (!templateName) {
        return
      }

      card.setAttribute("data-template-name", templateName)
      card.setAttribute("data-src-href", card.getAttribute("href") || "")

      card.addEventListener("click", event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return
        }

        event.preventDefault()
        this.open(card)
      })
    })
  }

  bindGlobalEvents() {
    this.root.addEventListener("click", event => {
      const closeTarget = event.target.closest('[data-role="close"]')
      if (closeTarget) {
        this.close()
      }
    })

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && this.root.getAttribute("data-status") === "open") {
        this.close()
      }
    })

    window.addEventListener("resize", () => {
      this.hideTooltip()

      if (this.root.getAttribute("data-status") !== "open") {
        return
      }

      this.renderTabs()
      this.updatePreview()
    })
  }

  getTemplateNameFromHref(href) {
    if (!href) {
      return ""
    }

    const matched = href.match(/templates\/([^/]+)\/?/)
    return matched ? matched[1] : ""
  }

  getVisibleDeviceKeys() {
    const width = window.innerWidth

    if (width <= this.breakPoints.smartphone) {
      return ["sp"]
    }

    if (width <= this.breakPoints.tablet) {
      return ["tb", "sp"]
    }

    return ["pc", "tb", "sp"]
  }

  getDefaultDeviceKey() {
    const visible = this.getVisibleDeviceKeys()
    return visible[0]
  }

  renderTabs() {
    const visible = this.getVisibleDeviceKeys()

    if (!visible.includes(this.currentDeviceKey)) {
      this.currentDeviceKey = this.getDefaultDeviceKey()
    }

    this.tabsElm.innerHTML = ""

    this.devicePatterns.forEach(pattern => {
      if (!visible.includes(pattern.key)) {
        return
      }

      const button = document.createElement("button")
      button.type = "button"
      button.className = "template-view-tab"
      button.setAttribute("data-device", pattern.key)
      button.setAttribute("aria-label", pattern.label)
      button.innerHTML = `${this.deviceIcons[pattern.key] || ""}<span class="template-view-tab-label">${pattern.label}</span>`

      if (pattern.key === this.currentDeviceKey) {
        button.setAttribute("data-current", "true")
      }

      button.addEventListener("click", () => {
        this.currentDeviceKey = pattern.key
        this.renderTabs()
        this.updatePreview()
      })

      button.addEventListener("mouseenter", () => {
        this.showTooltip(button, pattern.label)
      })

      button.addEventListener("mouseleave", () => {
        this.hideTooltip()
      })

      button.addEventListener("focus", () => {
        this.showTooltip(button, pattern.label)
      })

      button.addEventListener("blur", () => {
        this.hideTooltip()
      })

      this.tabsElm.appendChild(button)
    })
  }

  showTooltip(button, label) {
    if (!this.tooltipElm) {
      return
    }

    this.tooltipElm.textContent = label
    this.tooltipElm.setAttribute("data-status", "show")

    const buttonRect = button.getBoundingClientRect()
    const tipRect = this.tooltipElm.getBoundingClientRect()
    const gap = 10
    const margin = 8

    let left = buttonRect.left + (buttonRect.width / 2) - (tipRect.width / 2)
    let top = buttonRect.top - tipRect.height - gap

    if (left < margin) {
      left = margin
    }

    const maxLeft = window.innerWidth - tipRect.width - margin
    if (left > maxLeft) {
      left = maxLeft
    }

    if (top < margin) {
      top = buttonRect.bottom + gap
    }

    this.tooltipElm.style.left = `${left}px`
    this.tooltipElm.style.top = `${top}px`
  }

  hideTooltip() {
    if (!this.tooltipElm) {
      return
    }

    this.tooltipElm.setAttribute("data-status", "hidden")
  }

  updatePreview() {
    if (!this.currentTemplateName || !this.currentDeviceKey) {
      return
    }

    this.root.setAttribute("data-device", this.currentDeviceKey)

    const imagePath = `${this.imageRoot}/${this.currentTemplateName}_${this.currentDeviceKey}.jpg`
    this.imageElm.setAttribute("src", imagePath)
  }

  open(card) {
    this.currentTemplateName = card.getAttribute("data-template-name") || ""
    this.currentSourceHref = card.getAttribute("data-src-href") || card.getAttribute("href") || ""

    if (!this.currentTemplateName) {
      return
    }

    this.currentDeviceKey = this.getDefaultDeviceKey()

    this.openLinkElm.setAttribute("href", this.currentSourceHref)

    this.renderTabs()
    this.updatePreview()

    if (this.bodyElm) {
      this.bodyElm.scrollTop = 0
    }

    this.root.setAttribute("data-status", "open")
    document.body.setAttribute("data-template-view", "open")

    if (this.bodyElm) {
      requestAnimationFrame(() => {
        this.bodyElm.scrollTop = 0
      })
    }
  }

  close() {
    this.hideTooltip()
    this.root.setAttribute("data-status", "closed")
    this.root.removeAttribute("data-device")
    document.body.removeAttribute("data-template-view")
  }
}

export { TemplateView }

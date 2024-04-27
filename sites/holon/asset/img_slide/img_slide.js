

export class ImgSlide{
  constructor(){
    this.slide = 5000
    this.move  = 50
    this.wipe  = 1000
    this.shift = this.slide - this.wipe * 2
    this.attr_wrap = ".image-wrap"

    this.set_css()
    this.set_css_property()
    this.sort_reverse()
    this.set_slides()
    setTimeout(this.set_wipe.bind(this) , this.shift)
  }

  // css読み込み処理
  set_css(){
    if(document.querySelector("link.appear")){return}
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.className = "appear"
    link.href = import.meta.url.replace("img_slide.js", "img_slide.css")
    document.head.appendChild(link)
  }

  // 初期設定（css連動用のプロパティ変数定義）
  set_css_property = function(){
    const roots = document.querySelectorAll(this.attr_wrap)
    for(const root of roots){
      root.style.setProperty("--slide", `${this.slide}ms`, "")
      root.style.setProperty("--move" , `${this.move}px`, "")
      root.style.setProperty("--wipe" , `${this.wipe}ms`, "")
    }
  }

  // DOMの順番を逆にする（DOM最終が先頭で表示されるため）
  sort_reverse = function(){
    const roots = document.querySelectorAll(this.attr_wrap)
    for(const root of roots){
      const imgs = root.querySelectorAll(`:scope > img`)
      for(const img of imgs){
        root.insertBefore(img, root.firstElementChild)
      }
    }
  }

  // 表示されている画像(last-child)の移動開始処理
  set_slides = function(){
    const roots = document.querySelectorAll(this.attr_wrap)
    for(const root of roots){
      const img = root.querySelector(`:scope > img:last-child`)
      this.set_slide_animate(img)
    }
  }

  // 画像のゆっくり移動開始
  set_slide_animate = function(img){
    const move = -this.move
    img.animate([
      {"transform"  : `translateX(${move}px)`},
      {"transform"  : `translateX(0)`},
    ],{
      duration: this.slide
    })
  }

  // ワイプ開始
  set_wipe = function(){
    const roots = document.querySelectorAll(this.attr_wrap)
    for(const root of roots){
      const img = root.querySelector(`:scope > img:last-child`)
      img.setAttribute("data-wipe" , true)
      const img2 = root.querySelector(`:scope > img:nth-last-child(2)`)
      this.set_slide_animate(img2)
    }
    setTimeout(this.sort_change.bind(this) , this.wipe)
  }

  // 最終を先頭にもってくる
  sort_change = function(){
    const roots = document.querySelectorAll(this.attr_wrap)
    for(const root of roots){
      const img = root.querySelector(`:scope > img:last-child`)
      root.insertBefore(img, root.firstElementChild)
      img.removeAttribute("data-wipe")
      img.removeAttribute("data-slide")
    }
    setTimeout(this.set_wipe.bind(this) , this.shift)
  }
}
/**
 * Waving
 * # Summary
 * - 文字をウェーブアニメさせるライブラリ
 * # Howto
 * import { Wabing } from "anim/waving.js"
 * new Waving({
 *   elm   : %target-element,
 *   delay : 500,
 *   size  : "5px",
 * })
 */

export class Waving{
  className = "waving-item"

  constructor(options){
    this.options = options || {}
    if(!options["elm"]){return}
    // default values
    this.options.delay = this.options.delay || 0.3
    this.options.duration = this.options.duration || "1s"
    this.options.distance  = this.options.distance  || "10px"

    this.set_css()
    if(options["elm"].length){
      for(const elm of options["elm"]){
        this.set_attribute(elm)
        this.setting(elm)
      }
    }
    else{
      this.set_attribute(options["elm"])
      this.setting(options["elm"])
    }
  }

  set_css(){
    if(document.querySelector("link.waving")){return}
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.className = "waving"
    link.href = import.meta.url.replace("waving.js","waving.css")
    document.head.appendChild(link)
  }

  set_attribute(elm){
    elm.style.setProperty("--size-move-distance", this.options.distance , "")
    elm.style.setProperty("--anim-duration", this.options.duration , "")
  }

  setting(elm){
    if(!elm || !elm.innerHTML){return}
    let new_elm = document.createElement("div")
    let num = 0
    while(elm.innerHTML){
      let delay_num = (num * this.options.delay)
      switch(elm.firstChild.nodeType){
        // element
        case 1:
          elm.style.setProperty("animation-delay" , delay_num +"ms")
          new_elm.appendChild(elm.firstChild)
          num++
          break
        // text
        case 3:
          let word = elm.firstChild.textContent.slice(0,1)
          elm.firstChild.textContent = elm.firstChild.textContent.slice(1)
          // 改行コード
          if(word === "\n"){
            let new_text = document.createTextNode(word)
            new_elm.appendChild(new_text)
          }
          // 文字列
          else{
            let span = document.createElement("span")
            span.className = this.className
            span.style.setProperty("animation-delay" , delay_num +"ms")
            span.textContent = word
            new_elm.appendChild(span)
            num++
          }
          if(elm.firstChild.textContent === ""){
            elm.removeChild(elm.firstChild)
          }
          break;
      }
    }
    elm.innerHTML = new_elm.innerHTML
  }
}

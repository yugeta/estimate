/**
 * Appear
 * # Summary
 * - エレメントをイベントに応じて表示（非表示）させるアニメーション処理
 * # Howto
 * import { Wabing } from "anim/appear.js"
 * new Appear({
 *   elm   : %target-element, [elements(配列）も化]
 *   delay : 500,
 *   size  : "5px",
 * })
 */

export class Appear{
  className = "appear-item"

  constructor(options){
    this.options = options || {}
    if(!options["elm"]){return}
    // this.options.delay = this.options.delay || 0.3
    // this.options.duration = this.options.duration || "1s"
    // this.options.distance  = this.options.distance  || "10px"

    this.set_css()

    if(options["elm"].length){
      for(const elm of options["elm"]){
        // this.set_attribute(elm)
        this.setting(elm)
      }
    }
    else{
      // this.set_attribute(options["elm"])
      this.setting(options["elm"])
    }

    this.set_event()
  }

  get elms(){
    return document.querySelectorAll(`.${this.className}`)
  }

  set_css(){
    if(document.querySelector("link.appear")){return}
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.className = "appear"
    link.href = import.meta.url.replace("appear.js", "appear.css")
    document.head.appendChild(link)
  }

  

  // set_attribute(elm){
  //   elm.style.setProperty("--size-move-distance", this.options.distance , "")
  //   elm.style.setProperty("--anim-duration", this.options.duration , "")
  // }

  setting(elm){
    if(!elm){return}
    elm.classList.add(this.className)
  }

  set_event(){
    window.addEventListener('scroll' , this.event_scroll.bind(this))
    // this.event_scroll()
  }

  event_scroll(){
    for(const elm of this.elms){
      if(this.check_scroll_in(elm)){
        // console.log("-----true")
        elm.setAttribute("data-appear" , true)
      }
      else if(elm.hasAttribute("data-appear")){
        elm.removeAttribute("data-appear")
      }
    }
  }

  check_scroll_in(elm){
    const rect = elm.getBoundingClientRect()

    // console.log(rect.top, document.scrollingElement.scrollTop, rect.height, window.innerHeight, )
    // console.log(rect.top - window.innerHeight - rect.height ,"<", document.scrollingElement.scrollTop)


    return rect.top - window.innerHeight < 0 ? true: false
    // return rect.top - window.innerHeight + (rect.height / 2) < 0 ? true: false

    // // 画面上部（下部）からハズレた場合にトリガーフラグを外す
    // if(rect.top + elm.offsetHeight < 0
    // || rect.top > window.innerHeight){
    //   if(elm.hasAttribute(this.class_flg)
    //   && elm.getAttribute(this.attribute_repeat) === 'infinite'){
    //     elm.removeAttribute(this.class_flg)
    //   }
    //   return
    // }
    
    // // 画面内に入っている場合にトリガーフラグをセット
    // if(!elm.hasAttribute(this.class_flg)){
    //   elm.setAttribute(this.class_flg , true)
    // }
  }

}

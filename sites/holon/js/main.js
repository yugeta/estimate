import { ImgSlide } from "../asset/img_slide/img_slide.js"
import { Telop }    from "../asset/telop/telop.js"

class Main{
  constructor(){
    new ImgSlide()
    new Telop({
      speed : 20000
    })
  }
}

switch(document.readyState){
  case "complete":
  case "interactive":
    new Main()
  break

  default:
    window.addEventListener("DOMContentLoaded" , (()=>new Main()))
}
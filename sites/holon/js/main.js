import { ImgSlide } from "../asset/img_slide/img_slide.js"

class Main{
  constructor(){
    new ImgSlide()
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
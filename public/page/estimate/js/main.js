import { Scroll } from "./scroll.js"
import { Form }   from "./form.js"

class Main{

  constructor(){
    new Scroll()
    new Form()
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
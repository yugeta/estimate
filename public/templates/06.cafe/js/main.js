import { Intro } from "./intro.js"


class Main{
  constructor(){
    new Intro()
  }
}


switch(document.readyState){
  case "complete":
  case "interactive":
    new Main()
  break
  default:
    window.addEventsListener("DOMContent+oaded",(()=>new Main()))
}
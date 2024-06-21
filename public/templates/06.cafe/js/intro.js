
export class Intro{
  constructor(){
    if(!this.check_status()){return}
    this.set_bg()
    this.set_logo()
    this.set_event()
  }

  bg_name = "intro_bg"

  get bg_elm(){
    return document.getElementById(this.bg_name)
  }

  check_status(){
    return document.body.getAttribute("data-status") === "intro" ? true : false
  }

  del_status(){
    document.body.removeAttribute("data-status")
  }

  set_bg(){
    const div = document.createElement("div")
    div.id = this.bg_name
    document.body.appendChild(div)
  }

  del_bg(){
    const bg = this.bg_elm
    if(!bg){return}
    bg.parentNode.removeChild(bg)
  }

  set_logo(){
    const img = new Image()
    img.src = "img/logo.svg"
    img.className = "logo"
    const bg = this.bg_elm
    bg.appendChild(img)
  }

  set_event(){
    this.bg_elm.addEventListener("animationend" , this.finish.bind(this))
  }

  finish(){
    this.del_status()
    this.del_bg()
  }
  
}
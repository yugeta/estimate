import { Asset }     from '../../../asset/js/asset.js'
import { Menu }      from '../../../asset/js/menu.js'
import { SvgImport } from '../../../asset/js/svg_import.js'
import { Waving }    from "../../../asset/anim/waving.js"


class Main{
  constructor(){
    new Menu()
    new Asset({
      callback : this.loaded.bind(this)
    })
  }

  get html(){
    return document.querySelector('html')
  }

  get loading(){
    return document.querySelector('.loading')
  }

  loaded(){
    const status = this.html.getAttribute('data-status')
    if(status === 'loading'){
      this.html.removeAttribute('data-status')
    }
    if(this.loading){
      this.loading.style.setProperty('display','none','')
    }
    // new SvgImport()
    // new Waving({
    //   elm : document.querySelectorAll("header .waving a"),
    //   delay : 100,
    //   distance  : "-5px",
    //   duration : "2.0s",
    // })
  }
}


switch(document.readyState){
  case 'complete':
  case 'interactive':
    new Main()
  break

  default:
    window.addEventListener('DOMContentLoaded' , (()=>new Main()))
  break
}
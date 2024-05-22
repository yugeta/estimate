import { SvgImport } from './svg_import.js'

export class Asset{
  constructor(options){
    this.options = options || {}
    Asset.set_status_loading()
    this.module_count = 0
    this.init()
    this.html_load()
  }

  finish(){
    this.scroll_hash()
    if(!this.options.callback){return}
    this.options.callback()
  }

  static get header(){
    return document.querySelector('headeer')
  }

  static get main(){
    return document.querySelector('main')
  }

  static get footer(){
    return document.querySelector('footer')
  }
  // static get aside_menu(){
  //   return document.querySelector('aside')
  // }
  // static get top_menu(){
  //   return document.querySelector('main .banner .num-1 ul')
  // }

  static get default_page_name(){
    return 'index'
  }

  static get queries(){
    const query = location.search.replace(/^\?/,'')
    return Object.fromEntries(new Map(query.split('&').map(e => [e.split('=')[0],e.split('=').slice(1).join('=')]))) || {}
  }
  static get page_name(){
    const queries = Asset.queries
    return queries.p || Asset.default_page_name
  }
  static get file_name(){
    const queries = Asset.queries
    return queries.f || Asset.default_page_name
  }
  static convert_html(html){
    html = html.replace(/\{\{page_name\}\}/g, Asset.page_name)
    html = html.replace(/\{\{file_name\}\}/g, Asset.file_name)
    return html
  }

  static get elm_loading(){
    return document.querySelector('.loading')
  }

  init(){
    document.body.setAttribute('data-page-name' , Asset.page_name)
  }

  // async html_load(){
  //   const path = `page/${Asset.page_name}/${Asset.file_name}.html`
  //   const response = await fetch(path)
  //   // console.log(response,response.body);
  //   const text = await response.text();
  //   const html = Asset.convert_html(text)
  //   const main = this.get_main(html)
  //   this.check_load_modules(main)
  //   Asset.main.parentNode.replaceChild(main, Asset.main)
  //   // this.menu_load()
  //   if(Asset.page_name === 'index'){
  //     // Asset.top_menu.innerHTML = Asset.aside_menu.querySelector(':scope > ul').innerHTML
  //     // Asset.aside_menu.style.display = 'none'
  //   }

  //   this.set_scripts(Asset.main)
  //   // new SvgImport()

  //   this.module_loaded(e)
  //   // console.log(html);
  // }


  html_load(){
    if(!Asset.page_name){return}
    this.module_loading()
    const xhr = new XMLHttpRequest()
    xhr.withCredentials = true
    xhr.open('get' , `page/${Asset.page_name}/${Asset.file_name}.html` , true)
    xhr.setRequestHeader('Content-Type', 'text/html')
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.onload = this.html_loaded.bind(this)
    // xhr.onreadystatechange = (e => {
    //   if(xhr.readyState !== XMLHttpRequest.DONE){return}
    //   const status = xhr.status;
    //   if (status === 0 || (status >= 200 && status < 400)) {
    //     this.html_loaded(e)
    //   }
    //   else {
    //     this.options.file = 'assets/html/404.html'
    //     new Asset(this.options)
    //   }
    // }).bind(this)
    xhr.send()
  }

  html_loaded(e){
// console.log(e.target.responseText)
    const html = Asset.convert_html(e.target.response)
    const main = this.get_main(html)
    this.check_load_modules(main)
    Asset.main.parentNode.replaceChild(main, Asset.main)
    // this.menu_load()
    if(Asset.page_name === 'index'){
      // Asset.top_menu.innerHTML = Asset.aside_menu.querySelector(':scope > ul').innerHTML
      // Asset.aside_menu.style.display = 'none'
    }

    this.set_scripts(Asset.main)
    // new SvgImport()

    this.module_loaded(e)
  }

  // menu_load(){
  //   const xhr = new XMLHttpRequest()
  //   xhr.open('get' , `asset/menu.json` , true)
  //   xhr.setRequestHeader('Content-Type', 'text/json');
  //   xhr.onload = this.menu_loaded.bind(this)
  //   xhr.send()
  // }
  // menu_loaded(e){
  //   const datas = JSON.parse(e.target.response)
  //   const links = []
  //   for(const data of datas){
  //     links.push(`<li><a href='${data.href}'>${data.value}</a></li>`)
  //   }
  //   const html = links.join('\n')
  //   switch(Asset.page_name){
  //     case 'index':
  //       Asset.top_menu.innerHTML = html
  //       Asset.aside_menu.innerHTML = ''
  //       break
  //     default:
  //       Asset.aside_menu.innerHTML = `<ul>${html}</ul>`
  //       break
  //   }
  //   // this.set_scripts()
  //   // this.html_load()
  //   this.set_scripts(Asset.main)
  //   new SvgImport()

  //   this.module_loaded(e)
  // }

  

  get_main(html){
    const main = document.createElement('main')
    main.innerHTML = html
    return main
  }
  check_load_modules(main){
    const links = main.querySelectorAll('link')
    for(const link of links){
      this.module_loading()
      link.addEventListener('load' , this.module_loaded.bind(this))
    }

    // const scripts = main.querySelectorAll('script')
    // for(const script of scripts){
    //   if(!script.src){continue}
    //   this.module_loading()
    //   script.addEventListener('load' , this.module_loaded.bind(this))
    // }
  }
  set_scripts(elm){
    const scripts = Array.from(elm.querySelectorAll('script'))
    this.set_script(scripts)
  }
  set_script(scripts){
    if(!scripts || !scripts.length){return}
    const target_script = scripts.shift()
    if(target_script.closest("svg")){
      this.set_script(scripts)
    }
    else if(target_script.getAttribute('src')){
      this.set_script_src(target_script , scripts)
    }
    else{
      this.set_script_inner(target_script , scripts)
    }
  }
  set_script_src(before_script , scripts){
    const new_script = document.createElement('script')
    new_script.onload = (scripts => {
      this.set_script(scripts)
    }).bind(this , scripts)
    this.copy_attributes(before_script , new_script)
    new_script.setAttribute('data-set',1)
    before_script.parentNode.insertBefore(new_script , before_script)
    before_script.parentNode.removeChild(before_script)
  }
  set_script_inner(before_script , scripts){
    const script_value = before_script.textContent
    try{
      Function('(' + script_value + ')')();
      this.set_script(scripts)
    }
    catch(err){
      console.warn(err)
    }
  }
  copy_attributes(before_elm , after_elm){
    if(!before_elm || !after_elm){return}
    const attributes = before_elm.attributes
    if(!attributes || !attributes.length){return}
    for(const attr of attributes){
      after_elm.setAttribute(attr.nodeName , attr.nodeValue)
    }
  }

  
  module_loading(){
    this.module_count++
  }
  module_loaded(e){
    this.module_count--
    this.check_modules()
  }
  check_modules(){
    if(this.module_count <= 0){
      // setTimeout(Asset.set_status_loaded , 500)
      // Asset.set_status_loaded()
      this.finish()
    }
  }
  static set_status_loading(){
    document.querySelector('html').setAttribute('data-status' , 'loading')
  }
  static set_status_loaded(){
    document.querySelector('html').setAttribute('data-status' , 'loaded')
  }
  scroll_hash(){
    if(!location.hash){return}
    location.href = location.href
  }
}
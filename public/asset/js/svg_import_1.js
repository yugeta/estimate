/**
 * SVG読み込み処理
 * 
 * # attributeは、保持される。
 * - ただし、svg内部にかかれているattributeが優先される。
 * 
 * # styleを保持する
 * <svg data-style-flg='1'></svg>
 */

export class SvgImport{
  constructor(options){
    this.options = options || {}
    this.init()
  }

  static get targets(){
    return document.querySelectorAll('svg[src]')
    // return document.querySelectorAll('img[data-src] , svg[src]')
  }

  static get mime(){
    return 'image/svg+xml'
  }
  
  init(){
    for(const target of SvgImport.targets){
      const src = target.getAttribute('src')
      const ext = SvgImport.get_ext(src)
      if(!ext || ext.toLowerCase() !== 'svg'){continue}
      switch(target.nodeName){
        case 'svg':
          SvgImport.load_svg(target , src)
          target.removeAttribute('src')
          break
        // case 'img':
        //   SvgImport.load_img(target , src)
        //   break
      }
    }
  }

  static load_svg(elm , src , callback){
    SvgImport.datas = SvgImport.datas || []
    // if(typeof SvgImport.datas[src] !== 'undefined'){
    //   if(callback){
    //     callback(SvgImport.datas[src])
    //   }
    //   else{
    //     SvgImport.loaded_svg(elm , {
    //       target:{response:SvgImport.datas[src]}
    //     })
    //   }
    //   return 
    // }

    const xhr = new XMLHttpRequest()
    xhr.open('get' , src , true)
    xhr.setRequestHeader('Content-Type', SvgImport.mime);
    xhr.onload = (e => {
      SvgImport.datas[src] = e.target.response
      if(callback){
        callback(e.target.response)
      }
      else{
        SvgImport.loaded_svg(elm, e)
      }
    }).bind(this)
    // xhr.onreadystatechange = ((elm , e) => {
    //   if(xhr.readyState !== XMLHttpRequest.DONE){return}
    //   const status = xhr.status;
    //   if (status === 0 || (status >= 200 && status < 400)) {
    //     SvgImport.datas[src] = e.target.response
    //     if(callback){
    //       callback(e.target.response)
    //     }
    //     else{
    //       SvgImport.loaded_svg(elm , e)
    //     }
    //   // }
    //   // else {
    //   //   SvgImport.loaded_svg(elm , e)
    //   }
    // }).bind(this , elm)

    xhr.send()
  }
  static loaded_svg(elm , res){//console.log(elm, res)
    // console.log(res.target.response)
    if(!res || !res.target.response){return}
    const parser = new DOMParser()
    let svg = parser.parseFromString(res.target.response, SvgImport.mime).querySelector('svg')
    SvgImport.copy_attributes(elm , svg)
    svg = SvgImport.remove_style(svg)
    elm.parentNode.insertBefore(svg , elm)
    console.log(svg)
    // elm.parentNode.removeChild(elm)
    // console.log(elm.src)
  }

  // static load_img(elm , src){

  // }

  static get_ext(file){
    if(!file){return}
    const sp = file.split("#")[0].split('?')[0].split('.')
    return sp[sp.length-1]
  }

  static create_svg(){
    return document.createElementNS('http://www.w3.org/2000/svg' , 'svg')
  }

  static remove_style(svg){
    const style_tag_flg = svg.getAttribute('data-style-flg')
    if(style_tag_flg){return svg}
    var styles = svg.getElementsByTagName("style");
    for(var i=styles.length-1; i>=0; i--){
      styles[i].parentNode.removeChild(styles[i]);
    }
    return svg
  }

  static copy_attributes(target , new_svg){
    if(!target || !new_svg){return}
    const attributes = target.attributes
    if(!attributes || !attributes.length){return}
    for(const attr of attributes){
      new_svg.setAttribute(attr.nodeName , attr.nodeValue)
    }
  }

  static get_svg(elm , src , callback){
    const svg = SvgImport.load_svg(elm , src , callback)
  }

}
/**
 * # Title
 * - １要素を横無限スクロールさせるスニペット
 * 
 * # Summary
 * - 文字を無限スクロール
 * - 写真などのを無限スクロール
 * 
 * # Howto
 * - <div class="telop-scroll">~</div>で単一要素を囲う
 * - 自動で、内部要素（単一要素）が画面幅に合わせて複製される。
 * - スクロールスピード : new Telop({speed: 5000}) //５秒(msで指定)
 */

export class Telop{
  name = "telop"
  speed = 5000

  constructor(options){
    this.options = options
    if(options.speed){
      this.speed = options.speed
    }
    this.set_css()
    window.addEventListener("resize" , this.set_copy.bind(this))
    this.set_copy()
  }

  // css読み込み処理
  set_css(){
    if(document.querySelector(`link.set-flg-${this.name}`)){return}
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.className = `set-flg-${this.name}`
    link.href = import.meta.url.replace(`${this.name}.js`, `${this.name}.css`)
    document.head.appendChild(link)
  }

  // telop-scrollクラスを全て抽出
  set_copy = function(){
    const elms = document.querySelectorAll(`.telop-scroll`)
    for(const elm of elms){
      elm.style.setProperty("--telop-time" , `${this.speed}ms`)
      this.copy(elm)
    }
  }

  // telop-scrollの内部をスクロールサイズに合わせて複製
  // - root要素の２倍以上になるように、内部要素（単一要素）をコピーする（既にコピーされていて多い場合は削除する）
  copy = function(root){
    const root_width = root.offsetWidth
    const elm        = root.firstElementChild
    const elm_width  = elm.offsetWidth
    const elm_count  = root.children.length
    let need_count = Math.ceil((root_width * 2) / elm_width)
    need_count = need_count > 2 ? need_count : 2
    if(elm_count < need_count){
      for(let i=0; i<need_count - elm_count; i++){
        const node = root.firstElementChild.cloneNode(true)
        root.appendChild(node)
      }
    }
    else if(elm_count > need_count){
      for(let i=0; i< elm_count - need_count; i++){
        root.removeChild(root.lastElementChild)
      }
    }
  }
}
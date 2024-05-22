

export class WordSplit{
  className = "word-split"

  constructor(options){
    if(options.elm){
      this.set_split(options.elm)
    }
    else if(options.elms){
      for(const elm of options.elms){
        this.set_split(elm)
      }
    }
  }

  set_split(elm){
    if(!elm || !elm.innerHTML){return}
    let new_elm = document.createElement("div")
    let num = 0
    while(elm.innerHTML){
      // let delay_num = (num * this.options.delay)
      switch(elm.firstChild.nodeType){
        // element
        case 1:
          // elm.style.setProperty("animation-delay" , delay_num +"ms")
          new_elm.appendChild(elm.firstChild)
          num++
          break
        // text
        case 3:
          let word = elm.firstChild.textContent.slice(0,1)
          elm.firstChild.textContent = elm.firstChild.textContent.slice(1)
          // 改行コード
          if(word === "\n"){
            let new_text = document.createTextNode(word)
            new_elm.appendChild(new_text)
          }
          // 文字列
          else{
            let span = document.createElement("span")
            span.className = this.className
            // span.style.setProperty("animation-delay" , delay_num +"ms")
            span.textContent = word
            new_elm.appendChild(span)
            num++
          }
          if(elm.firstChild.textContent === ""){
            elm.removeChild(elm.firstChild)
          }
          break;
      }
    }
    elm.innerHTML = new_elm.innerHTML
  }
}

/**
 * お問い合わせフォームをGoogleFormに送信できるようにするライブラリ
 * 【事前準備】
 * 1. GoogleFormで新規フォームの作成（各種設定）
 * 2. names = {...} に name値変換用設定を記載する。
 * 3. formタグ : name値は"contact"
 * 4. 送信ボタン : name値はbutton[name="post"]
 * 5. google_formの値をセット（GoogleFormプレビューのURL）
 */

class Main{
  options = {
    id     : "complete",
    name   : "complete",
    target : "complete",
    // GoogleFormプレビューのURL
    google_form : "https://docs.google.com/forms/d/e/1FAIpQLSfsMov4fodsZFqm4NAtCykpQtH3TIlYp-c1iX07d5aqNpX7Sg/viewform",
    thanks_url : "?p=contact&f=thanks",
  }

  // HTMLに記載されたname値をGoogleFormのname値に変換する
  names = {
    name     : "entry.1037129717",
    mail     : "entry.272200301",
    category : "entry.1181715958",
    content  : "entry.1701032672",
    ip       : "entry.1429721769",
    ua       : "entry.721204",
    memo     : "entry.1181165427",
  }
  
  constructor(){
    this.init()
  }

  get form(){
    return document.forms.contact
  }

  get form_ip(){
    return this.form.querySelector(`input[data-name="ip"]`)
  }
  get form_ua(){
    return this.form.querySelector(`input[data-name="ua"]`)
  }

  get form_btn(){
    return this.form.post
  }

  get form_actiion(){
    return this.options.google_form.replace(/\/viewform$/ , "/formResponse")
  }

  init(){
    window.submitted = false
    this.set_name()
    this.set_ua()
    this.set_form()
    this.set_iframe()
    this.set_submit()
    this.set_button()
    this.set_validation()
  }

  // name値をgoogleFormに合わせる（事前設定の必要あり）
  set_name(){
    for(const item of this.form){
      const prev_name = item.getAttribute("name")
      const next_name = this.names[prev_name]
      if(!next_name){continue}
      item.setAttribute("data-name" , prev_name)
      item.setAttribute("name"      , next_name)
    }
  }

  // UserAgentの保持
  set_ua(){
    this.form_ua.value = navigator.userAgent
  }

  // form設定
  set_form(){
    this.form.action = this.form_actiion
    this.form.target = this.options.target
  }

  // iframeの初期設定
  set_iframe(){
    const iframe = document.createElement("iframe")
    iframe.id     = this.options.id
    iframe.name   = this.options.name
    iframe.onload = this.iframe_onload.bind(this)
    iframe.setAttribute("hidden" , true)
    document.body.appendChild(iframe)
  }

  // iframeの読み込み後処理（初回読み込み、送信後）
  iframe_onload(){
    // console.log("iframe-set: submit:",submitted)
    if(submitted){
      // this.result()
      this.redirect()
    }
  }

  // // 送信完了後の処理
  // result(){
  //   // const elm_result = this.elm_result
  //   // elm_result.setAttribute("data-view" , true)
  //   // const rect = elm_result.getBoundingClientRect()
  //   // document.scrollingElement.scrollTop = rect.top
  // }

  // データ送信時の処理
  set_submit(){
    this.form.addEventListener("submit", (e => {
      window.submitted = true
      this.blackout()
    }))
  }

  // 送信ボタンを押した時の処理
  set_button(){
    // 送信ボタンのイベントセット
    this.form_btn.addEventListener("click", (e => {
      // this.calc()
      // const elm_mode = document.forms.estimate.mode
      // const elm_btn  = document.querySelector(`button.send`)
      // if(elm_mode && elm_mode.value === "debug"){
      //   this.result()
      // }
      // else{
        this.form_btn.type = "submit"
      // }
    }).bind(this))
  }

  // 各種入力文字チェックの初期設定
  set_validation(){
    // // どんなページが希望？
    // const select = document.querySelector(`[name="entry.1249913976"]`)
    // select.addEventListener("change" , (e => {
    //   this.clear()
    //   if(!this.selectors[e.target.value]){return}
    //   for(const selector of this.selectors[e.target.value]){
    //     const elm = document.querySelector(selector)
    //     if(!elm){continue}
    //     elm.checked = true
    //   }
    // }))

    // // ランディングページ
    // const lp = document.querySelector(`[name="entry.1736547568"][data-num="4"]`)
    // lp.addEventListener("click" , (e => {
    //   document.querySelector(`[name="entry.1402687745"][data-num="1"]`).checked = true
    // }))
  }

  redirect(){
    if(this.options.thanks_url){
      location.href = this.options.thanks_url
    }
    else{
      const query = location.search.replace(/^\?/,'')
      const queries = Object.fromEntries(new Map(query.split('&').map(e => [e.split('=')[0],e.split('=').slice(1).join('=')]))) || {}
      location.href = `?p=${queries.p}&f=thanks`
    }
  }

  blackout(){
    const div = document.createElement("div")
    div.style.setProperty("position", "fixed" , "")
    div.style.setProperty("top", "0" , "")
    div.style.setProperty("left", "0" , "")
    div.style.setProperty("width", "100vw" , "")
    div.style.setProperty("height", "100vh" , "")
    div.style.setProperty("background-color", "rgba(0,0,0,0.8)" , "")
    div.style.setProperty("z-index", "10000" , "")
    document.body.appendChild(div)
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


export class Form{
  options = {
    id   : "complete",
    name : "complete",
  }

  selectors = {
    "とにかく安く作りたい":[
      `[name="entry.1736547568"][data-num="1"]`,
      `[name="entry.1402687745"][data-num="1"]`,
      `[name="entry.1869565113"][data-num="1"]`,
      `[name="entry.56227603"][data-num="1"]`,
      `[name="entry.1665971148"][data-num="1"]`,
      `[name="entry.1267091108"][data-num="1"]`,
      `[name="entry.612331426"][data-num="1"]`,
      `[name="entry.330041923[]"][data-num="1"]`,
    ],
    "デザインにこだわりたい":[
      `[name="entry.1869565113"][data-num="3"]`,
      `[name="entry.56227603"][data-num="3"]`,
      `[name="entry.330041923[]"][data-num="5"]`,
      `[name="entry.330041923[]"][data-num="1"]`,
    ],
    "特殊なホームページを作りたい":[
      `[name="entry.56227603"][data-num="1"]`,
      `[name="entry.1665971148"][data-num="1"]`,
      `[name="entry.1267091108"][data-num="2"]`,
      `[name="entry.330041923[]"][data-num="5"]`,
      `[name="entry.330041923[]"][data-num="1"]`,
    ],
    "よくわからないので相談したい":[
      `[name="entry.1402687745"][data-num="2"]`,
      `[name="entry.1869565113"][data-num="1"]`,
      `[name="entry.56227603"][data-num="2"]`,
      `[name="entry.1665971148"][data-num="2"]`,
      `[name="entry.330041923[]"][data-num="1"]`,
      `[name="entry.330041923[]"][data-num="5"]`,
      `[name="entry.1267091108"][data-num="2"]`,
      `[name="entry.612331426"][data-num="2"]`,
    ],
  }

  mynt_api = 'https://sample.myntinc.com/api.php'

  constructor(){
    window.submitted = false
    this.set_ip()
    this.set_ua()
    this.set_iframe()
    this.set_submit()
    this.click_event()
  }

  get elm_iframe(){
    return document.createElement("iframe")
  }

  get elm_form(){
    return document.forms.estimate
  }

  get form_ip(){
    return document.querySelector(".ip")
  }

  get form_ua(){
    return document.querySelector(".ua")
  }

  get elm_result(){
    return document.querySelector(`.result`)
  }

  set_iframe(){
    const iframe = this.elm_iframe
    iframe.id   = this.options.id
    iframe.name = this.options.name
    iframe.setAttribute("hidden" , true)
    iframe.onload = this.iframe_onload.bind(this)
    document.body.appendChild(iframe)
  }

  set_submit(){
    this.elm_form.addEventListener("submit", (e => {
      window.submitted = true
    }))
  }

  // submitted
  iframe_onload = function(){
    console.log("iframe-set: submit:",submitted)
    if(submitted){
      // alert('送信しました。')
      this.result()
    }
  }

  set_ip = function(){
    const query = {
      type : 'ip',
    }
    const xhr = new XMLHttpRequest()
    xhr.open('POST' , this.mynt_api , true)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.onload = this.ip_loaded.bind(this)
    const query_string = Object.entries(query).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&')
    xhr.send(query_string)
  }

  ip_loaded = function(e){
    const res = JSON.parse(e.target.response)
    if(!res || res.status !== "success"){return}
    this.form_ip.value = res.datas.ip
  }

  set_ua = function(){
    this.form_ua.value = navigator.userAgent
  }


  click_event = function(){
    // 送信ボタン
    document.querySelector(`button.send`).addEventListener("click", (e => {
      this.calc()
      const elm_mode = document.forms.estimate.mode
      const elm_btn  = document.querySelector(`button.send`)
      if(elm_mode && elm_mode.value === "debug"){
        this.result()
      }
      else{
        elm_btn.type = "submit"
      }
    }).bind(this))
  
    // どんなページが希望？
    const select = document.querySelector(`[name="entry.1249913976"]`)
    select.addEventListener("change" , (e => {
      this.clear()
      if(!this.selectors[e.target.value]){return}
      for(const selector of this.selectors[e.target.value]){
        const elm = document.querySelector(selector)
        if(!elm){continue}
        elm.checked = true
      }
    }))

    // ランディングページ
    const lp = document.querySelector(`[name="entry.1736547568"][data-num="4"]`)
    lp.addEventListener("click" , (e => {
      document.querySelector(`[name="entry.1402687745"][data-num="1"]`).checked = true
    }))
  }

  clear = function(){
    for(const elm of this.elm_form){
      if(!elm.hasAttribute("data-num")){continue}
      switch(elm.type){
        case "text":
          elm.value = ""
        break
        case "radio":
        case "checkbox":
          elm.checked = false
        break
      }
    }
  }

  calc = function(){
    let price = 0
    let running = 0
    for(const elm of document.forms.estimate){
      if(elm.type !== "radio" && elm.type !== "checkbox"){continue}
      if(elm.checked !== true){continue}
      if(elm.hasAttribute("data-price")){
        price += Number(elm.getAttribute("data-price"))
      }
      if(elm.hasAttribute("data-running")){
        running += Number(elm.getAttribute("data-running"))
      }
    }
  
    // price
    document.querySelector(`[name="entry.282535527"]`).value   = (price*10000).toLocaleString()
    document.querySelector(`[name="entry.249821144"]`).value   = (running*10000).toLocaleString()
    // running
    document.querySelector(`[name="price"]`).value = (price*10000).toLocaleString()
    document.querySelector(`[name="running"]`).value = (running*10000).toLocaleString()
  }

  result = function(){
    const elm_result = this.elm_result
    elm_result.setAttribute("data-view" , true)
    const rect = elm_result.getBoundingClientRect()
    document.scrollingElement.scrollTop = rect.top
  }

}
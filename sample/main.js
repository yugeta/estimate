const options  = {
  id   : "complete",
  name : "complete",
}


function Main(options){
  this.options = options
  this.init()
}

Main.prototype.init = function(){
  window.submitted = false
  this.set_ip()
  this.set_ua()
  this.set_iframe()
  this.set_submit()
  this.click_event()
}

Main.prototype.set_iframe = function(){
  const iframe = document.createElement("iframe")
  iframe.id   = this.options.id
  iframe.name = this.options.name
  iframe.setAttribute("hidden" , true)
  iframe.onload = this.iframe_onload.bind(this)
  document.body.appendChild(iframe)
}

Main.prototype.set_submit = function(){
  document.forms.estimate.addEventListener("submit", (e => {
    window.submitted = true
  }))
}

// submitted
Main.prototype.iframe_onload = function(){
  console.log("iframe-set: submit:",submitted)
  if(submitted){
    // alert('送信しました。')
    this.result()
  }
}

Main.prototype.set_ip = function(){
  const query = {
    type : 'ip',
  }
  const xhr = new XMLHttpRequest()
  xhr.open('POST' , 'https://sample.myntinc.com/api.php' , true)
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  xhr.onload = this.ip_loaded.bind(this)
  const query_string = Object.entries(query).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&')
  xhr.send(query_string)
}

Main.prototype.ip_loaded = function(e){
  const res = JSON.parse(e.target.response)
  if(!res || res.status !== "success"){return}
  document.querySelector(".ip").value = res.datas.ip
}


Main.prototype.set_ua = function(){
  document.querySelector(".ua").value = navigator.userAgent
}

Main.prototype.click_event = function(){
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
    switch(e.target.value){
      case "とにかく安く作りたい":
        document.querySelector(`[name="entry.1736547568"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.1402687745"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.1869565113"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.56227603"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.1665971148"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.1267091108"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.612331426"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.330041923[]"][data-num="1"]`).checked = true
      break

      case "デザインにこだわりたい":
        document.querySelector(`[name="entry.1869565113"][data-num="3"]`).checked = true
        document.querySelector(`[name="entry.56227603"][data-num="3"]`).checked = true
        document.querySelector(`[name="entry.330041923[]"][data-num="5"]`).checked = true
        document.querySelector(`[name="entry.330041923[]"][data-num="1"]`).checked = true
      break
      
      case "特殊なホームページを作りたい":
        document.querySelector(`[name="entry.56227603"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.1665971148"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.1267091108"][data-num="2"]`).checked = true
        document.querySelector(`[name="entry.330041923[]"][data-num="5"]`).checked = true
        document.querySelector(`[name="entry.330041923[]"][data-num="1"]`).checked = true
      break

      case "よくわからないので相談したい":
        document.querySelector(`[name="entry.1402687745"][data-num="2"]`).checked = true
        document.querySelector(`[name="entry.1869565113"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.56227603"][data-num="2"]`).checked = true
        document.querySelector(`[name="entry.1665971148"][data-num="2"]`).checked = true
        document.querySelector(`[name="entry.330041923[]"][data-num="1"]`).checked = true
        document.querySelector(`[name="entry.330041923[]"][data-num="5"]`).checked = true
        document.querySelector(`[name="entry.1267091108"][data-num="2"]`).checked = true
        document.querySelector(`[name="entry.612331426"][data-num="2"]`).checked = true
      break
    }
  }))

  // ランディングページ
  const lp = document.querySelector(`[name="entry.1736547568"][data-num="4"]`)
  lp.addEventListener("click" , (e => {
    document.querySelector(`[name="entry.1402687745"][data-num="1"]`).checked = true
  }))
}

Main.prototype.clear = function(){
  for(const elm of document.forms.estimate){
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

Main.prototype.calc = function(){
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
  // alert(`お見積り内容\n初期: ${price}万円 : 運用: ${running}万円/月`)

  // price
  document.querySelector(`[name="entry.282535527"]`).value   = (price*10000).toLocaleString()
  document.querySelector(`[name="entry.249821144"]`).value   = (running*10000).toLocaleString()
  // running
  document.querySelector(`[name="price"]`).value = (price*10000).toLocaleString()
  document.querySelector(`[name="running"]`).value = (running*10000).toLocaleString()
}

Main.prototype.result = function(){
  const elm_result = document.querySelector(`.result`)
  elm_result.setAttribute("data-view" , true)
  const rect = elm_result.getBoundingClientRect()
  document.scrollingElement.scrollTop = rect.top
}


switch(document.readyState){
  case "complete":
  case "interactive":
    new Main(options)
  break
  default:
    window.addEventListener("DOMContentLoaded" , (()=>new Main(options)))
}
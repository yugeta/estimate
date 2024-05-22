/**
 * 言語切替処理
 */

export class Lang{
  constructor(){
    this.init()
    this.set_event()
  }
  static get elm_html(){
    return document.querySelector('html')
  }
  static get elm_lang_toggle(){
    return document.getElementById('lang_toggle')
  }
  static get lang(){
    return Lang.elm_lang_toggle.checked === true ? "en" : "ja"
  }
  static get cache_key(){
    return "momoseken-lang"
  }

  init(){
    const cache_lang = Lang.get_cache() || Lang.lang
    Lang.elm_html.setAttribute('lang' , cache_lang)
    Lang.set_radio(cache_lang)
  }

  set_event(){
    Lang.elm_lang_toggle.addEventListener('click' , this.change_lang.bind(this))
  }

  change_lang(e){
    const lang =Lang.lang
    Lang.elm_html.setAttribute('lang' , lang)
    Lang.set_cache(lang)
  }

  static set_cache(lang){
    window.localStorage.setItem(Lang.cache_key , lang)
  }
  static get_cache(){
    return window.localStorage.getItem(Lang.cache_key)
  }
  static set_radio(lang){
    if(lang === 'ja'){
      this.elm_lang_toggle.checked = false
    }
    else{
      this.elm_lang_toggle.checked = true
    }
  }
}

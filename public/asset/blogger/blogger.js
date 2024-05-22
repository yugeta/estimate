/**
 * Bloggerの記事一覧を取得するAPIからデータを取得するライブラリ
 */

export class Blogger{
  static datas = null

  constructor(options){
    this.options = options
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject  = reject
      this.load()
    })
  }

  get default_api_url(){
    return import.meta.url.replace("blogger.js" , "blogger.php")
  }

  load(){
    const query = {
      mode : "blogger",
      api  : this.options.api || this.default_api_url,
      feed : this.options.feed,
    }
    const xhr = new XMLHttpRequest()
    xhr.withCredentials = true
    xhr.open('POST' , this.options.api , true)
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    xhr.onload = this.loaded.bind(this)
    const query_string = Object.entries(query).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&')
    xhr.send(query_string)
  }

  loaded(e){
    const res = JSON.parse(e.target.response)
    // console.log(res)
    if(res && res.status === "success"){
      Blogger.datas = res.datas
    }
    this.finish()
  }

  finish(){
    this.resolve(Blogger.datas)
  }
}



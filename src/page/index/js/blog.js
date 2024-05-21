import { Blogger } from "../../../asset/blogger/blogger.js"
import { Files }   from "../../../asset/js/files.js"
import { Convert } from "../../../asset/js/convert.js"

export class Blog{
  constructor(datas){console.log(datas)
    // if(!datas || !datas.feed.entry || !datas.entry.length){return}
    this.view(datas.feed)
  }

  get root(){
    return document.querySelector(`#blog .lists`)
  } 

  view(feeds){
    for(let i=0; i<feeds.entry.length; i++){
      const entry = feeds.entry[i]
      const time = entry.published["$t"].match(/^([0-9]{4}\-[0-9]{2}\-[0-9]{2})T([0-9]{2}:[0-9]{2}:[0-9]{2}).(.*?)$/)
      const data = {
        link     : entry.link.find(e => e.rel === "alternate").href,
        eyecatch : entry["media$thumbnail"].url.replace('/s72-c/' , '/w320-h320-p-k-no-nu/'),
        title    : entry.title["$t"],
        text     : entry.content.$t.replace(/(<([^>]+)>)/gi, ''),
        category : entry.category.map(e => `<p class="category">${e.term}<p>`).join(""),
        date     : `${time[1]} ${time[2]}`,
      }
      const html = new Convert(Files.datas.card).double_bracket(data)
      this.root.insertAdjacentHTML("beforeend", html)
    }
  }
}
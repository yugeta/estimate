import { Blog }    from "./blog.js"
import { Files }   from "../../../asset/js/files.js"
import { Blogger } from "../../../asset/blogger/blogger.js"
import { TemplateView } from "../../../asset/template_view/main.js"

class Main{
  constructor(){
    this.templateView()
    this.files()
  }

  templateView(){
    new TemplateView({
      selector : "#designs .carousel .card a",
      imageRoot : "template_images"
    })
  }

  files(){
    new Files({
      files : {
        card: "page/blog/files/card.html"
      }
    }).promise.then(()=>{
      this.blog()
    })
  }

  blog(){
    new Blogger({
      api  : "asset/blogger/main.php",
      feed : "https://mynt-estimate.blogspot.com/feeds/posts/default?alt=json&fetchImages=true&max-results=12", // https://mynt-estimate.blogspot.com/
    }).promise.then(datas => {
      new Blog(datas)
    })
  }
}

switch(document.readyState){
  case "complete":
  case "interactive":
    new Main()
  break
  default:
    window.addEventListener("DOMContentLoaded", (()=>new Main()))
}

import { Files } from "../../../asset/js/files.js"

export class Blog{
  constructor(){
    new Files({
      files : {
        card    : `page/blog/files/card.html`,
      }
    }).promise.then((e)=>{
      console.log()
      this.load()
    })
  }

  get html_card(){
    return Files.datas.card
  }

  load(){

  }
}

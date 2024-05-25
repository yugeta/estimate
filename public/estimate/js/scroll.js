

export class Scroll{
  constructor(){
    this.smooth_scroll()
  }

  // ページ全体ではない、内部要素のスクロールをなめらかにする処理
  smooth_scroll(){
    const d = document
    d.querySelectorAll('a[href^="#"]').forEach(e => {
      e.addEventListener('click', function (e) {
        e.preventDefault()
        d.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  }
}
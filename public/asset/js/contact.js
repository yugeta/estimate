
(()=>{
  window.submitted = false
  document.querySelector(`.button button`).addEventListener('click' , click_button)

  function click_button(){
    if(fail_require()){
      error('未入力の項目があります。')
    }
    else if(diff_mail()){
      error('メールアドレスが間違っています。')
    }
    else{
      submit()
    }
  }
  function fail_require(){
    const name_1 = document.querySelector(`input[data-name='name_1']`)
    const name_2 = document.querySelector(`input[data-name='name_2']`)
    const mail_1 = document.querySelector(`input[data-name='mail_1']`)
    const memo   = document.querySelector(`textarea[data-name='memo']`)
    return !name_1.value || !name_2.value || !mail_1.value || !memo.value ? true : false
  }
  function diff_mail(){
    const mail_1 = document.querySelector(`input[data-name='mail_1']`)
    const mail_2 = document.querySelector(`input[data-name='mail_2']`)
    return mail_1.value !== mail_2.value ? true : false
  }
  function error(message){
    document.querySelector('.error').textContent = message
    document.scrollingElement.scrollTop = 0
  }
  function submit(){
    document.forms.contact.submit()
  }
})()




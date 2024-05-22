
export class Files{
	static datas = {}

	constructor(options){
		this.options = options || {}
		this.promise = new Promise((resolve,reject) => {
			this.resolve = resolve
      this.reject  = reject
			if(!options.files){
				this.finish()
				return
			}
			this.files = options.files
			this.load()
		})
	}

	load(){
		if(!this.files || !Object.keys(this.files).length){
			this.finish()
			return
		}
		const key  = Object.keys(this.files)[0]
		this.path = this.files[key]
		delete this.files[key]
		const query = {}
    const xhr = new XMLHttpRequest()
    xhr.open('get' , this.path , true)
    xhr.setRequestHeader("Content-Type", "text/html");
    xhr.onload = this.loaded.bind(this, key)
    xhr.send(Object.entries(query).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&'))

	}

	loaded(key, e){
		Files.datas[key] = e.target.response
		this.load()
	}

	finish(){
		this.resolve(Files.datas)
		if(this.options.callback){
			this.options.callback(Files.datas)
		}
	}

}
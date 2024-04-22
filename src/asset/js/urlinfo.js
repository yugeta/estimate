export class Urlinfo{
  constructor(){}
  get url(){
    return this.protocol +'://'+ this.host + this.path
  }
  // 全部
  get href(){
    return location.href
  }
  // ハッシュ
  get hash(){
    return location.hash
  }
  // クエリ文字列
  get query(){
    return location.search.replace(/^\?/,'')
  }
  // クエリを連想配列で取得
  get queries(){
    return Object.fromEntries(new Map(this.query.split('&').map(e => [e.split('=')[0],e.split('=').slice(1).join('=')]))) || {}
  }
  // ドメイン
  get host(){
    return location.hostname
  }
  // ポート
  get port(){
    return location.port
  }
  // プロトコル
  get protocol(){
    return location.protocol.replace(/\:$/,'')
  }
  // 階層 + ファイル名
  get path(){
    return location.pathname
  }
  // プロトコル + ホスト + ポート
  get origin(){
    return location.origin
  }
  // ファイル名
  get filename(){
    return this.path.split('/').pop()
  }
  // 階層
  get dir(){
    return this.path.split('/').slice(0,-1).join('/')
  }

}
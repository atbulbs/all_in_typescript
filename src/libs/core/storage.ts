/*
info 的数据结构
{
	routeName:{     // 模块的储存空间
		src:'',		// js地址
		initClassName:null,  // 初始化类
		initFn: null,		//初始化函数
		instance:null,		//初始化类的 实例
		entryData:{},		// 初始化 模块时 数据
		media:{

		}
	},
	globalInfo:{     //全局储存空间
		bookId: 1,  // number  书的id
		token: '',   // string
		parentId: '',    //string
		wechatId: '',    //string
		wxName: '',    //string
		bgmStatus: '',   // string
		bgmSrc: '',     //string
		studentId: '',   //string
		lessonName: '',   //
		channelId: '',   //
		business:'',   //
		qcToken:'',    //
		unionId" '',	// 微信 union_id
		uid: '',
		product: '',
		open_id: '',
		audio: HTMLAudioElement,  // dom 对象
		preRoute:'', //上一个模块
	},
	routeMap:{

	},
	currentRoute:'', //string   当前 激活的模块
}
*/
interface IStatusConstructor {
  new (data: object): IStatus
}
interface IStatus {
  $set(nameSpase: string, value: any): void
  $get(nameSpase: string): any
}

class Storage implements IStatus {
  globalInfo: {
    bookName?: string
  }
  currentRoute: string
  preRoute: string
  recordRoute: Array<string> = []
  bookMap: {}
  constructor() {
    this.globalInfo = {}
    this.currentRoute = 'main'
    this.preRoute = ''
  }

  $set(name: string, value: any) {
    if (name === 'currentRoute') {
      this.preRoute = this.currentRoute
      this.setItem('preRoute', this.currentRoute, 'g')
      this.recordRoute.push(this.preRoute)
      this.currentRoute = value
      return
    }
    if (name === 'bookMap') {
      const bookId = this.getItem('bookId', 'g')
      const bookName = value[bookId]
      this.setItem('bookName', bookName, 'g')
    }
    this[name] = value
  }

  $get(name: string) {
    return this[name]
  }

  setItem(name: string, value: any, nameSpase: string) {
    if (nameSpase === 'g' || nameSpase === 'global') {
      this.globalInfo[name] = value
      if (name === 'bookId') {
        const bookMap = this.bookMap || {}
        this.globalInfo.bookName = bookMap[value]
      }
      return
    }
    this[nameSpase] = this[nameSpase] || {}
    this[nameSpase][name] = value
  }

  getItem(name: string, nameSpase: string): any {
    if (nameSpase === 'g' || nameSpase === 'global') {
      return this.globalInfo[name]
    }
    if (this[nameSpase]) {
      return this[nameSpase][name]
    }
    return
  }
}

export { Storage }
// export default new Storage()

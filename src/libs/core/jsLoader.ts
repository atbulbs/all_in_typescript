/**
 * @description js文件异步加载方法
 *
 * @since 2020.02.03
 */
class JsLoader {
  private static baseUrl: string = ''

  private static createJs() {
    const scriptTag: HTMLScriptElement = document.createElement('script')
    scriptTag.type = 'text/javascript'
    const timestamp = +new Date()
    scriptTag.id = 'timestamp'

    return {
      scriptTag,
      timestamp
    }
  }

  /**
   * @description     以函数形式返回结果
   * @param src       文件路径
   */
  public static ajaxLoadJs(src: string): void {
    const xhr = new XMLHttpRequest()
    xhr.open('get', src)
    xhr.onreadystatechange = function(ev) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 304) {
          const data = JSON.parse(xhr.response)
        }
      }
    }
    xhr.send()
  }

  /**
   * @description     以插入script标签的形式返回结果
   * @param src       文件路径
   */
  public static tagLoadJs(src: string): Promise<any> {
    let { scriptTag, timestamp } = JsLoader.createJs()
    return new Promise((res, rej) => {
      scriptTag.onload = res
      scriptTag.onerror = function() {
        setTimeout(() => {
          document.head.removeChild(scriptTag)
          let s2 = JsLoader.createJs()
          s2.scriptTag.onload = res
          s2.scriptTag.onerror = rej
          s2.scriptTag.src = JsLoader.baseUrl + src + '?' + timestamp
          document.head.appendChild(s2.scriptTag)
        }, 1000)
      }
      scriptTag.src = JsLoader.baseUrl + src + '?' + timestamp
      document.head.appendChild(scriptTag)
    })
  }
}

export { JsLoader }

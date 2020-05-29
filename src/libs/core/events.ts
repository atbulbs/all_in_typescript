interface IEvent {
  event: object
  on(type: string, fn: Function, once?: boolean): void
  fire(type: string, data: Array<any>): boolean
}
/**
 * @description 事件触发及监听
 *
 * @since 2019.05.31
 */
class Events implements IEvent {
  event: {}

  constructor() {
    this.event = {}
  }

  public fire(type: string, ...agr: Array<any>) {
    if (!this.event[type] || this.event[type].length === 0) {
      return false
    }
    for (let i = 0; i < this.event[type].length; i++) {
      this.event[type][i].fn.apply(this, agr)
      if (this.event[type][i].once) {
        this.event[type].splice(i--, 1)
      }
    }
    return false
  }

  /**
   * @description         监听
   *
   * @param type          事件名
   * @param fn            触发时执行的方法
   * @param once          仅监听一次
   */
  public on(type: string, fn: Function, once: boolean = false) {
    if (!this.event[type]) {
      this.event[type] = []
    }
    this.event[type].push({ fn: fn, once: once })
  }

  /**
   * @description         仅监听一次
   *
   * @param type          事件名
   * @param fn            触发时执行的方法
   */
  public once(type: string, fn: Function) {
    this.on(type, fn, true)
  }

  /**
   * @description         销毁监听
   *
   * @param type          事件名
   * @param fn            触发时执行的方法
   */
  public off(type: string, fn: Function) {
    for (let i = 0; i < this.event[type].length; i++) {
      if (this.event[type][i].fn === fn) {
        this.event[type].splice(i--, 1)
      }
    }
  }
}

export { Events }

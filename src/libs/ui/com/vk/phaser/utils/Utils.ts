/**
 * Utils.ts
 *
 *
 *     creat on:   2019/05/27 19:33:11
 *
 * 工具函数类
 */
export default class Utils {
  /**
   * 获取格式化日期字符串
   * @param $time     时间戳      默认为null，表示当前时间
   * @param $gap      数值间插入的间隔符号
   */
  public static GetDateText($time: number = null, $gap: string = '-'): string {
    let a_: number[] = Utils.GetDateArr($time)
    let s_: string = Utils.FomateTime(a_, $gap)
    return s_
  }

  /**
   * 获取格式化时间字符串
   * @param $millisecond      是否包含毫秒信息
   * @param $time             时间戳                  默认为null，表示当前时间
   * @param $gap              数值间插入的间隔符号
   */
  public static GetTimeText(
    $millisecond: boolean = false,
    $time: number = null,
    $gap: string = ':'
  ): string {
    let a_: number[] = Utils.GetTimeArr($millisecond, $time)
    let s_: string = Utils.FomateTime(a_, $gap)
    return s_
  }

  /**
   * 获取格式化时间字符串
   * @param $time             毫秒单位时间
   * @param $hour             是否包含时信息
   * @param $millisecond      是否包含毫秒信息
   * @param $gap              数值间插入的间隔符号
   */
  public static GetTimeTextForMs(
    $time: number,
    $hour: boolean = false,
    $millisecond: boolean = false,
    $gap: string = ':'
  ): string {
    let a_: number[] = Utils.GetTimeArrForMs($time, $hour, $millisecond)
    let s_: string = Utils.FomateTime(a_, $gap)
    return s_
  }

  /**
   * 获取一个描述日期的数组，格式为：[年，月，日]
   *
   * @param $time     时间戳      默认为null，表示当前时间
   *
   * @return number型日期数组
   */
  public static GetDateArr($time: number = null): number[] {
    let d: Date = new Date()
    if ($time != null) {
      d.setTime($time)
    }
    let a: number[] = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
    return a
  }

  /**
   * 获取一个描述时间的数组，格式为：[时，分，秒（，毫秒）]
   * @param $millisecond      是否包含毫秒信息
   * @param $time             时间戳               默认为null，表示当前时间
   *
   * @return number型时间数组
   */
  public static GetTimeArr($millisecond: boolean = false, $time: number = null): number[] {
    let d_: Date = new Date()
    if ($time != null) {
      d_.setTime($time)
    }
    let a_: number[] = [d_.getHours(), d_.getMinutes(), d_.getSeconds()]
    if ($millisecond) {
      a_.push(d_.getMilliseconds())
    }
    return a_
  }

  /**
   * 获取一个描述时间的数组，格式为：[时，分，秒（，毫秒）]
   * @param $time             毫秒单位时间
   * @param $hour             是否包含时信息
   * @param $millisecond      是否包含毫秒信息
   *
   * @return number型时间数组
   */
  public static GetTimeArrForMs(
    $time: number,
    $hour: boolean = false,
    $millisecond: boolean = false
  ): number[] {
    let millisecondTime = Math.floor($time)
    let secondTime = 0 // 秒
    let minuteTime = 0 // 分
    let hourTime = 0 // 小时

    if (millisecondTime > 1000) {
      secondTime = Math.floor(millisecondTime / 1000)
      millisecondTime = Math.floor(millisecondTime % 1000)
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = Math.floor(secondTime / 60)
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = Math.floor(secondTime % 60)
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = Math.floor(minuteTime / 60)
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = Math.floor(minuteTime % 60)
        }
      }
    }

    const a_: number[] = []
    if ($hour) a_.push(Math.floor(hourTime))
    a_.push(Math.floor(minuteTime))
    a_.push(Math.floor(secondTime))
    if ($millisecond) a_.push(Math.floor(millisecondTime))

    return a_
  }

  /**
   * 将一组数字整理成时间日期格式的文本
   * @param $a        数字数组
   * @param $gap      数值间插入的间隔符号
   *
   * @return  格式化文本字符串
   */
  public static FomateTime($a: number[], $gap: string): string {
    let a_ = $a
    let arr_ = []
    for (let i: number = 0; i < a_.length; i++) {
      let j = a_[i]
      arr_[i] = j < 10 ? '0' + j : '' + j
    }
    let s_ = arr_.join($gap)
    return s_
  }

  // 转换数字为vw单位
  public static px2vw(num): string {
    return ((num.toFixed(5) / 375) * 100).toFixed(5) + 'vw'
  }

  // 深拷贝
  public static deepCopy(obj: any): any {
    const result: any = Array.isArray(obj) ? [] : {}
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          result[key] = this.deepCopy(obj[key]) //递归复制
        } else {
          result[key] = obj[key]
        }
      }
    }
    return result
  }

  /**
   * 神策打点逻辑
   */
  public static saTrack($event: string, $options: Object): void {
    if (!window['sa']) return
    window['sa'].track($event, $options)
  }
}

export default class Debug {
  public static useDebug: boolean = true

  public static trace($str): void {
    if (!Debug.useDebug) {
      return
    }

    let d: Date = new Date()
    let a: number[] = [d.getFullYear(), d.getMonth() + 1, d.getDate()]
    let s1 = fomate(a, '-')
    a = [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()]
    let s2 = fomate(a, ':')
    let s = s1 + '  ' + s2
    console.log(s, '======>', $str)

    function fomate($a: number[], $gap: string): string {
      let a = $a
      let arr = []
      for (let i: number = 0; i < a.length; i++) {
        let j = a[i]
        arr[i] = j < 10 ? '0' + j : '' + j
      }
      let s = arr.join($gap)
      return s
    }
  }
}

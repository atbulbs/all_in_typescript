/**
 * @description App 环境下常用工具函数
 *
 * @since 2020.02.03
 */

/**
 * @description     调用native方法
 * @param $src      方法名
 *
 * Example:
 * ```
 *      Hybrid.dispatchForPad('vkappbridge://audio/cancel')
 * ```
 */
function dispatchForPad($src: string): void {
  let _iframe = document.createElement('iframe')
  _iframe.setAttribute('src', $src)
  _iframe.setAttribute('style', 'display:none;')
  document.body.appendChild(_iframe)
  _iframe.parentNode.removeChild(_iframe)
  // _iframe = null
}
/**
 * @description     判断是否是iPad
 */
function isOnIpad(): boolean {
  return !!navigator.userAgent.toLowerCase().match(/ipad/i)
}
/**
 * @description     判断是否是android Pad webview
 */
function isOnAndroidPad(): boolean {
  if (navigator.userAgent.toLowerCase().match(/apad/i)) return true
  else return false
}
/**
 * @description     判断是否是PC APP
 */
function isOnDragonClient(): boolean {
  return !!navigator.userAgent.toLowerCase().match(/pc/i)
}
/**
 * @description     判断当前环境
 */
function deviceType(): string {
  if (isOnDragonClient()) {
    // PCAPP
    return 'PCAPP'
  } else if (isOnIpad()) {
    // IPAD
    return 'IPAD'
  } else if (isOnAndroidPad()) {
    // ANDROID
    return 'ANDROID'
  } else {
    // WEB
    return 'WEB'
  }
}
/**
 * @description     判断浏览器所在的操作系统 用于判断
 */
function detectOS(): string {
  let sUserAgent = navigator.userAgent
  let isWin = navigator.platform === 'Win32' || navigator.platform === 'Windows'
  let isMac =
    navigator.platform === 'Mac68K' ||
    navigator.platform === 'MacPPC' ||
    navigator.platform === 'Macintosh' ||
    navigator.platform === 'MacIntel'
  if (isMac) return 'Mac'
  let isUnix = navigator.platform === 'X11' && !isWin && !isMac
  if (isUnix) return 'Unix'
  let isLinux = String(navigator.platform).indexOf('Linux') > -1
  if (isLinux) return 'Linux'
  if (isWin) {
    let isWin2003 =
      sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1
    if (isWin2003) return 'Win7'
    let isWin10 = sUserAgent.indexOf('Windows NT 10') > -1 || sUserAgent.indexOf('Windows 10') > -1
    if (isWin10) return 'Win10'
  }
  return 'other'
}
/**
 * @description     获取设备型号信息
 */
function getDeviceModel(): string {
  let _model
  const userAgentArr = window.navigator.userAgent.split(' ')
  for (let i = 0; i < userAgentArr.length; i++) {
    if (/devicemodel/.test(userAgentArr[i])) {
      _model = userAgentArr[i].split('/')[1]
      break
    }
  }
  return _model
}
/**
 * @description     获取操作系统版本信息
 */
function getOSVersion(): string {
  let _version
  const userAgentArr = window.navigator.userAgent.split(' ')
  for (let i = 0; i < userAgentArr.length; i++) {
    if (/osversion/.test(userAgentArr[i])) {
      _version = userAgentArr[i].split('/')[1]
      break
    }
  }
  return _version
}
/**
 * @description     获取app版本信息
 *
 * @return 字符串格式版本信息，(ex. 3.1.2
 */
function getAppVersion(): string {
  const _device = deviceType()
  const _ua = navigator.userAgent.toLowerCase()
  let versionRegex
  if (_device === 'IPAD') {
    versionRegex = /study-app\/\d+(\.\d+)*/g
  } else if (_device === 'ANDROID') {
    versionRegex = /study-apad\/\d+(\.\d+)*/g
  }
  if (versionRegex) {
    let appArr = _ua.match(versionRegex)
    if (!!appArr && appArr.length > 0) {
      const _f = _ua.match(versionRegex)[0].split('/')
      if (!!_f && _f.length > 1) {
        return _f[1]
      }
    }
  }
  return ''
}
/**
 * @description         用于版本号比较
 * @param $curVer       当前版本
 * @param $verString    目标版本
 *
 * @return 大于等于为true，小于为false
 *
 * Example:
 * ```
 *      Hybrid.compareVersion(‘2.3.0’, '2.13.0')
 * ```
 */
function compareVersion($curVer: string, $verString: string): boolean {
  let arr1 = $curVer.split('.')
  let arr2 = $verString.split('.')
  // 将两个版本号拆成数字
  let minL = Math.min(arr1.length, arr2.length)
  let pos = 0 // 当前比较位
  let diff = 0 // 当前为位比较是否相等
  // 逐个比较如果当前位相等则继续比较下一位
  while (pos < minL) {
    diff = parseInt(arr1[pos]) - parseInt(arr2[pos])
    if (diff !== 0) {
      break
    }
    pos++
  }
  return diff >= 0
}

export {
  dispatchForPad,
  detectOS,
  deviceType,
  getDeviceModel,
  getOSVersion,
  getAppVersion,
  compareVersion
}

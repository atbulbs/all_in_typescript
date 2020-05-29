// webview的宽高
const WINDOW_WIDTH: number = window.innerWidth
const WINDOW_HEIGHT: number = window.innerHeight
const WINDOW_RATIO: number = WINDOW_WIDTH / WINDOW_HEIGHT
// 开发时模拟为iphone6/7/8的尺寸
let DEV_WIDTH: number = 375
let DEV_HEIGHT: number = 603
// 开发时的宽度比
const DEV_WIDTH_RATIO: number = window.innerWidth / DEV_WIDTH
const DEV_RATIO = DEV_WIDTH / DEV_HEIGHT
// 图片应该缩放的比例
let DEVICE_DESIGN_RATIO = 1
// 文本默认设置
const TEXT = {
  FONT_SIZE: 20,
  FONT_FAMILY: 'Arial Rounded MT Bold',
  FONT_COLOR: '#000',
  FONT_POSITION: 'left',
  WORD_WRAP_MODE: 'word',
  WORD_WRAP_WIDTH: 375
}

export default {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  DEV_WIDTH,
  DEV_HEIGHT,
  DEV_RATIO,
  DEV_WIDTH_RATIO,
  WINDOW_RATIO,
  DEVICE_DESIGN_RATIO,
  TEXT
}

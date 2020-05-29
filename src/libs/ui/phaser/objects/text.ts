/**
 * @description 文本对象
 * @author
 * @since   2019.03.27
 */
import Info from '../interface/textInfo'
import CONSTS from '../shared/consts'
import UTILS from '../shared/utils'

require('../../com/vk/phaser/plugins/rextagtext.3.17.0.min.js')
const rextagtext = window['rextagtext']

export default class Text extends rextagtext {
  private rewriteX: number = 0
  private rewriteY: number = 0

  public getRewriteX(): number {
    return this.rewriteX
  }

  public getRewriteY(): number {
    return this.rewriteY
  }

  constructor(
    scene: Phaser.Scene,
    container: Phaser.Scene | Phaser.GameObjects.Container,
    info: Info
  ) {
    super(scene, 0, 0, '', Text.setParams(info))
    // 放进去
    UTILS.intoContainer(this, container)
    // 设置内容
    const content = typeof info.content === 'string' ? [info.content] : info.content
    this['setText'](content)
    // 设置原点
    const originX = info.originX !== undefined ? info.originX : this['originX']
    const originY = info.originY !== undefined ? info.originY : this['originY']
    this['setOrigin'](originX, originY)
    // Text 对象缩放之后会出现不清晰的情况，因此需要还原缩放比例，通过调整fontSize达到适配效果
    this['setScale'](1 / UTILS.getDeviceDesignRatio())
    // 设置大小
    UTILS.setSize(this, container, info.w, info.h)
    // 设置矫正值
    this.rewriteX = this['displayWidth'] * this['originX']
    this.rewriteY = this['displayHeight'] * this['originY']
    // 定位
    UTILS.setPosition(this, info)
  }

  // 设置初始化参数
  static setParams(info: Info): any {
    const params = UTILS.deepCopy(info)

    params.fontSize =
      (!!info.fontSize ? info.fontSize : CONSTS.TEXT.FONT_SIZE) * UTILS.getDeviceDesignRatio() +
      'px'
    ;(params.fontFamily = !!info.fontFamily ? info.fontFamily : CONSTS.TEXT.FONT_FAMILY),
      (params.color = !!info.color ? info.color : CONSTS.TEXT.FONT_COLOR),
      (params.wrap = {
        mode: !!info.wordWrapMode ? info.wordWrapMode : CONSTS.TEXT.WORD_WRAP_MODE,
        width:
          (!!info.wordWrapWidth ? info.wordWrapWidth : CONSTS.TEXT.WORD_WRAP_WIDTH) *
          UTILS.getDeviceDesignRatio()
      })
    params.padding = this.setPadding(info.padding)
    params.tags = Object.assign(
      {
        highlight: {
          color: 'red'
        },
        point: {
          color: '#FF6422',
          fontStyle: 'bold'
        }
      },
      !!info.tags ? this.setTags(info.tags) : {}
    )

    return params
  }

  // 格式化padding参数
  static setPadding(params: number | {}): any {
    if (!!params) {
      if (typeof params === 'number') {
        const value = params * UTILS.getDeviceDesignRatio()
        return { x: value, y: value }
      } else if (typeof params === 'object') {
        const obj = UTILS.deepCopy(params)
        if (!!obj.x) {
          obj.x = obj.x * UTILS.getDeviceDesignRatio()
        }
        if (!!obj.y) {
          obj.y = obj.y * UTILS.getDeviceDesignRatio()
        }
        return obj
      }
    } else {
      return { x: 0, y: 0 }
    }
  }

  // 格式化tag参数
  static setTags(tags: any): any {
    if (!!tags) {
      const obj = UTILS.deepCopy(tags)

      for (let item in obj) {
        if (!!obj[item].fontSize) {
          obj[item].fontSize = obj[item].fontSize * UTILS.getDeviceDesignRatio() + 'px'
        }
      }

      return obj
    } else {
      return tags
    }
  }
}

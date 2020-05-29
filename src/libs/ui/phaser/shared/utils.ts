import CONSTS from './consts'
import PositionInfo from '../interface/iPositionInfo'

export default class UTILS {
  // 添加该对象到指定容器
  static intoContainer(object: any, container: Phaser.Scene | Phaser.GameObjects.Container): void {
    // 添加到场景
    if (container instanceof Phaser.Scene) {
      container.add.existing(object)
      // 添加到容器
    } else if (container instanceof Phaser.GameObjects.Container) {
      container.add(object)
    }
  }

  // 游戏对象定位
  static setPosition(object: any, params: PositionInfo): void {
    const { x: _x, y: _y } = this.computePosition(object, params)
    // 赋值
    object.setPosition(_x, _y)
  }

  // 设置大小
  static setSize(
    object: any,
    container: Phaser.Scene | Phaser.GameObjects.Container,
    width?: number | string,
    height?: number | string,
    fit: string = 'auto'
  ): void {
    const { width: _width, height: _height } = this.computeSize(container, width, height, fit)

    // 值不可用或为0的话则终止
    if (!_width || !_height) return

    // 赋值
    object.setSize(_width, _height)
    object.setDisplaySize(_width, _height)
  }

  /*
   * 计算尺寸
   * auto: 默认值。保持原有尺寸比例
   * fill: 填充。替换内容拉伸填满整个content box, 不保证保持原有的比例
   * cover: 覆盖。保持原有尺寸比例。保证替换内容尺寸一定大于容器尺寸，宽度和高度至少有一个和容器一致。因此，此参数可能会让替换内容（如图片）部分区域不可见。
   * contain: 包含。保持原有尺寸比例。保证替换内容尺寸一定可以在容器里面放得下。因此，此参数可能会在容器内留下空白。
   */
  static computeSize(
    container: Phaser.Scene | Phaser.GameObjects.Container,
    width?: number | string,
    height?: number | string,
    fit: string = 'auto'
  ): any {
    // 场景或容器的高宽
    let containerWidth = 0
    let containerHeight = 0
    // 设计稿和屏幕之间的比例
    let ratio = 1

    // 添加到场景
    if (container instanceof Phaser.Scene) {
      containerWidth = container.sys.canvas.width / container.game.config.resolution
      containerHeight = container.sys.canvas.height / container.game.config.resolution
      // 添加到容器
    } else if (container instanceof Phaser.GameObjects.Container) {
      containerWidth = container.width
      containerHeight = container.height
    }

    let _width: number = 0
    let _height: number = 0

    // 如果传值为100%的话，则视为继承父级
    if (typeof width === 'string') {
      if (width === '100%') {
        _width = containerWidth
      } else {
        _width = parseInt(width)
      }
    } else if (typeof width === 'number') {
      _width = width
    }

    if (typeof height === 'string') {
      if (height === '100%') {
        _height = containerHeight
      } else {
        _height = parseInt(height)
      }
    } else if (typeof height === 'number') {
      _height = height
    }

    // 值不可用或为0的话则为0
    _width = !!_width ? _width : 0
    _height = !!_height ? _height : 0

    // 如果传值为负值的话，则视为在继承父级之后减去相应值
    _width = _width >= 0 ? _width : containerWidth + _width
    _height = _height >= 0 ? _height : containerHeight + _height

    switch (fit) {
      case 'auto':
        break

      case 'fill':
        _width = containerWidth
        _height = containerHeight
        break

      case 'cover':
        // 获取设计稿宽和屏幕宽之间的比例
        ratio = containerWidth / _width
        // 如果设计稿高和屏幕高之间的比例大于 ratio 的话，取新值
        ratio = ratio < containerHeight / _height ? containerHeight / _height : ratio
        _width = _width * ratio
        _height = _height * ratio
        break

      case 'contain':
        // 获取设计稿宽和屏幕宽之间的比例
        ratio = containerWidth / _width
        // 如果设计稿高和屏幕高之间的比例大于 ratio 的话，取新值
        ratio = ratio > containerHeight / _height ? containerHeight / _height : ratio
        _width = _width * ratio
        _height = _height * ratio
        break
    }

    return {
      width: _width,
      height: _height
    }
  }

  // 计算坐标
  static computePosition(object: any, params: PositionInfo): any {
    let x = 0,
      y = 0,
      width = 0,
      height = 0

    switch (params.position) {
      case 'center':
        // 添加到容器
        if (!!object.parentContainer) {
          width = object.parentContainer.width
          height = object.parentContainer.height

          // 添加到场景
        } else {
          width = object.scene.sys.canvas.width / object.scene.game.config.resolution
          height = object.scene.sys.canvas.height / object.scene.game.config.resolution
        }

        x = width / 2 - object.displayWidth / 2
        y = height / 2 - object.displayHeight / 2

        break
    }

    if (!!params && params.x !== undefined) x = params.x
    if (!!params && params.y !== undefined) y = params.y

    return {
      x: x + object.getRewriteX(),
      y: y + object.getRewriteY()
    }
  }

  // 深拷贝
  static deepCopy(obj: any): any {
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

  static setDesignSize(width, height): void {
    CONSTS.DEV_WIDTH = width
    CONSTS.DEV_HEIGHT = height
  }

  static setDeviceDesignRatio(): void {
    if (CONSTS.WINDOW_RATIO < CONSTS.DEV_RATIO) {
      if (innerWidth !== CONSTS.DEV_WIDTH) {
        CONSTS.DEVICE_DESIGN_RATIO = innerWidth / CONSTS.DEV_WIDTH
      }
    } else {
      if (innerHeight !== CONSTS.DEV_HEIGHT) {
        CONSTS.DEVICE_DESIGN_RATIO = innerHeight / CONSTS.DEV_HEIGHT
      }
    }
  }

  static getDeviceDesignRatio(): number {
    return CONSTS.DEVICE_DESIGN_RATIO
  }
}

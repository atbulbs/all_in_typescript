import Rectangle = Phaser.Geom.Rectangle
import SimpleCameraPlugin from '../camera/SimpleCameraPlugin'
import Image = Phaser.GameObjects.Image
import Graphics = Phaser.GameObjects.Graphics
import UIUtils from '../utils/UIUtils'
import ResScene from './ResScene'

/**
 * SceneBase.ts
 *
 *
 *     creat on:   2019/04/29 18:06:52
 *
 *  支持适配整体缩放功能的基础Scene，单摄像机场景。
 *  加入这个场景中的GameObject，将被mainCamera缩放到设计宽高并整体按照现有适配方案居中显示。
 *
 *  注意：继承或直接使用此Scene必须手动调用 initCamera 方法，传入设计宽高和Game尺寸，否则不会进行自动适配.一定要先调用此方法再设置backgroundImage和backgroundColor
 *
 * @see SimpleCameraPlugin
 *
 */
export default class SceneBase extends ResScene {
  /**
   * 摄像机控制器
   */
  public camera: SimpleCameraPlugin

  /**背景Image */
  protected _backGroundImage: Image
  /**背景Image透明度 */
  protected _backGroundImageAlpha: number = 1
  /**背景色Graphics */
  protected _backGroundColor: Graphics

  public constructor($config) {
    super($config)
  }

  /**
   * 初始化布局，调整摄像机
   * @param $windowWidth      游戏整体宽度
   * @param $windowHeight     游戏整体高度
   * @param $layoutAir        含有设计宽高的矩形
   *
   * @see     Phaser.Geom.Rectangle
   */
  public initCamera($windowWidth: integer, $windowHeight: integer, $layoutAir: Rectangle): void {
    this.camera = new SimpleCameraPlugin(this.cameras.main, $windowWidth, $windowHeight, $layoutAir)
  }

  public create(): void {
    this.creatChildren()
    this.addEvents()
  }

  public update(): void {}

  protected creatChildren(): void {}

  protected addEvents(): void {}

  /**
   * 设置背景图片
   * @param $texture  背景纹理    空字符串和null表示不需要背景图片
   */
  public setBackgroundImage($texture: string): void {
    if (this._backGroundImage) {
      this._backGroundImage.destroy()
      this._backGroundImage = null
    }

    if (!$texture) {
      return
    }
    let img_: Image = this.addImg(0, 0, $texture)
    img_.alpha = this._backGroundImageAlpha
    let i: integer = this._backGroundColor ? 1 : 0
    this.children.moveTo(img_, i)

    let rectW_: Rectangle = this.getWindowRect()
    let rectO_: Rectangle = UIUtils.CalcOutArea(
      img_.width,
      img_.height,
      rectW_.width,
      rectW_.height
    )
    rectO_.centerX = rectW_.centerX
    rectO_.centerY = rectW_.centerY
    UIUtils.Fit2Rect(img_, rectO_)
    this._backGroundImage = img_

    if (!this._backGroundColor) {
      this.setBackGroundColor(0x000000, 0)
    }
    img_.setMask(this._backGroundColor.createGeometryMask())
  }

  /**
   * 设置背景图片透明度
   * @param $alpha 透明度     0-1
   */
  public setBackgroundImageAlpha($alpha: number): void {
    this._backGroundImageAlpha = $alpha
    if (this._backGroundImage) {
      this._backGroundImage.alpha = $alpha
    }
  }

  /**
   * 获取背景图片透明度
   *
   * @return 透明度值
   */
  public getBackgroundImageAlpha(): number {
    return this._backGroundImageAlpha
  }

  /**
   * 设置背颜色景色（纯色）
   * @param $color    24位RGB颜色值
   * @param $alpha    透明度          0-1 ， 默认值 1
   */
  public setBackGroundColor($color: integer, $alpha: number = 1): void {
    let graphics_: Graphics = this._backGroundColor
    let rect_: Rectangle = this.getWindowRect()
    if (!graphics_) {
      graphics_ = UIUtils.CreatRect(this, rect_, $color, $alpha)
      this.children.moveTo(graphics_, 0)
      this._backGroundColor = graphics_
    } else {
      graphics_.clear()
      rect_.setPosition(0, 0)
      UIUtils.FillRect(graphics_, rect_, $color, $alpha)
    }
  }

  /**
   * 获取表示全屏范围的矩形,如已经初始化Camera则为该CameraPluin的实际拍摄区域，如未设置则返回window宽高
   *
   * @return 表示全屏范围的矩形
   */
  public getWindowRect(): Rectangle {
    let rect_: Rectangle
    if (this.camera) {
      rect_ = this.camera.getCameraRect()
    } else {
      new Rectangle(0, 0, window.innerWidth, window.innerHeight)
    }
    return rect_
  }

  public sceneEnter(
    $duration: number = 500,
    $direction: string = 'left',
    fn: Function = () => {}
  ): void {
    // 视口宽
    const _windowWidth = document.documentElement.clientWidth * window.devicePixelRatio
    // 视口高
    const _windowHeight = document.documentElement.clientHeight * window.devicePixelRatio
    // 根据方向决定初始位置
    if ($direction === 'left') {
      this.cameras.main.x = _windowWidth
    } else if ($direction === 'right') {
      this.cameras.main.x = -_windowWidth
    } else if ($direction === 'down') {
      this.cameras.main.y = -_windowHeight
    } else if ($direction === 'up') {
      this.cameras.main.y = _windowHeight
    }
    // 动效
    this.tweens.add({
      targets: this.cameras.main,
      x: 0,
      y: 0,
      duration: $duration,
      onCompleteScope: this,
      onComplete: () => {
        fn()
      }
    })
  }

  public sceneLeave(
    $duration: number = 500,
    $direction: string = 'right',
    fn: Function = () => {}
  ): void {
    // 视口宽
    const _windowWidth = document.documentElement.clientWidth * window.devicePixelRatio
    // 视口高
    const _windowHeight = document.documentElement.clientHeight * window.devicePixelRatio
    // 根据方向决定最终位置
    let _x = 0
    let _y = 0
    if ($direction === 'left') {
      _x = -_windowWidth
    } else if ($direction === 'right') {
      _x = _windowWidth
    } else if ($direction === 'down') {
      _y = _windowHeight
    } else if ($direction === 'up') {
      _y = -_windowHeight
    }
    // 动效
    this.tweens.add({
      targets: this.cameras.main,
      x: _x,
      y: _y,
      duration: $duration,
      onCompleteScope: this,
      onComplete: () => {
        fn()
      }
    })
  }
}

import UIComponent from '../../phaser/components/UIComponent'
import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import SceneBase from '../../phaser/scene/SceneBase'
import UIUtils from '../../phaser/utils/UIUtils'

// 接口
interface IProgressBarInfo {
  radius: number
  duration: number
  bgColor?: number
  barLeftColor?: number
  barRightColor?: number
}
/**
 * MediaProgressBar.ts
 *
 *
 *     creat on:   2019/06/19
 *
 * @see UIComponent
 *
 *
 * Example:
 * ```
 *      public create():void{
 *          const rect_:Rectangle = new Rectangle(20 , 300 , 200 , 20);
 *          const bar = new ProgressBar(this , rect_);
 *          bar.setStyle(0x00ff00 , 0xaaaaaa);
 *          bar.setValue(30 , 100);
 *          bar.on(EventTypes.Change , function($val:number):void{
 *              console.log("当前进度为：" + $val + "/" + bar.getTotal());
 *          } , this);
 *      }
 * ```
 */
export default class MediaProgressBar extends UIComponent {
  private currentScene: SceneBase

  private _bgColor: number = 0xe5e5e5
  private _barLeftColor: number = 0xff6522
  private _barRightColor: number = 0xff9d47
  private _radius: number
  private _duration: number

  private _rect: Rectangle

  /**
   * 构造函数
   * @param $scene        要添加的场景
   * @param $rect         所在的区域（大小和位置）
   * @param $parent       父容器
   */
  public constructor(
    $scene: SceneBase,
    $rect: Rectangle,
    $info: IProgressBarInfo,
    $parent: Container = null
  ) {
    super($scene, $rect, $parent)

    // variables
    this.currentScene = $scene
    this._bgColor = !!$info.bgColor && $info.bgColor
    this._barLeftColor = !!$info.barLeftColor && $info.barLeftColor
    this._barRightColor = !!$info.barRightColor && $info.barRightColor
    this._radius = $info.radius
    this._duration = $info.duration
    this._rect = $rect

    this._init()
  }

  private _init(): void {
    // 背景
    const bg = this.currentScene.make.graphics({})
    bg.fillStyle(this._bgColor)
    bg.fillRoundedRect(0, 0, this._rect.width, this._rect.height, this._radius)
    this.add(bg)

    // 计时器尾部
    const endBox = UIUtils.CreatContainer(
      this.currentScene,
      new Rectangle(this._rect.height / 2, this._rect.height / 2, 0, 0),
      this
    )
    const end = this.currentScene.make.graphics({}).fillStyle(this._barRightColor)
    end.fillCircle(0, 0, this._rect.height / 2)
    endBox.add(end)

    // 计时器头部
    const start = this.currentScene.make.graphics({}).fillStyle(this._barLeftColor)
    start.fillCircle(this._rect.height / 2, this._rect.height / 2, this._rect.height / 2)
    this.add(start)

    // 计时器中部
    const bodyBox = UIUtils.CreatContainer(
      this.currentScene,
      new Rectangle(this._rect.height / 2, 0, 0, 0),
      this
    )
    const body = this.currentScene.make.graphics({})
    body.fillGradientStyle(
      this._barLeftColor,
      this._barRightColor,
      this._barLeftColor,
      this._barRightColor,
      this._radius
    )
    body.fillRect(0, 0, this._rect.width - this._rect.height, this._rect.height)
    body.scaleX = 0
    bodyBox.add(body)

    let timerBodyAnimas: Phaser.Tweens.Tween = null
    let timerEndAnimas: Phaser.Tweens.Tween = null

    this.on('start', () => {
      // 中部动效
      if (!!timerBodyAnimas) {
        if (timerBodyAnimas.isPaused()) {
          timerBodyAnimas.resume()
        } else {
          timerBodyAnimas.restart()
        }
      } else {
        timerBodyAnimas = this.currentScene.tweens.add({
          targets: body,
          scaleX: 1,
          duration: this._duration
        })
      }

      // 尾部动效
      if (!!timerEndAnimas) {
        if (timerEndAnimas.isPaused()) {
          timerEndAnimas.resume()
        } else {
          timerEndAnimas.restart()
        }
      } else {
        timerEndAnimas = this.currentScene.tweens.add({
          targets: endBox,
          x: this._rect.width - this._rect.height / 2,
          duration: this._duration
        })
      }
    })

    this.on('pause', () => {
      !!timerBodyAnimas && timerBodyAnimas.pause()
      !!timerEndAnimas && timerEndAnimas.pause()
    })

    this.on('stop', () => {
      this.emit('start')
      timerBodyAnimas.restart()
      timerEndAnimas.restart()
      !!timerBodyAnimas && timerBodyAnimas.stop()
      !!timerEndAnimas && timerEndAnimas.stop()
    })
  }
}

import Image = Phaser.GameObjects.Image
import Text = Phaser.GameObjects.Text
import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import Tween = Phaser.Tweens.Tween
import { Scene } from 'phaser'
import UIUtils from '../utils/UIUtils'
import { PhaserEvents } from '../enum/PhaserEvents'
import SoundManager from '../utils/SoundUtils'
import UIComponent from './UIComponent'

/**
 * Button.ts
 *
 *
 *     creat on:   2019/05/29 10:57:24
 *
 * 按钮
 *
 * 注意：不要调用Button的setInteractive()方法
 *
 * Event: PhaserEvents.pointerdown
 * Event: PhaserEvents.pointerup
 *
 * Example:
 * ```
 *       public create():void{
 *
 *          let rect_:Rectangle = new Rectangle(50 , 100 , 40 , 40);
 *          let b:Button = new Button(this , rect_ , "btn" , "Label");
 *
 *          b.on(PhaserEvents.pointerdown , function():void{
 *              console.log("onDown")
 *          } , this);
 *          b.on(PhaserEvents.pointerup , function():void{
 *               console.log("onUp");
 *          } , this);
 *      }
 * ```
 */
export default class Button extends UIComponent {
  /**
   * 按钮文本
   */
  public text: Text

  protected _bg: Image
  protected _core: Container
  protected _tween: Tween

  /**
   * 是否操作正在进行中，
   * 操作过程包括 : 按下-->缩放效果—->抬起—->缩放效果
   *  */
  protected _processing: boolean = false

  /**
   * soundKey
   * 触碰音效 ，默认为空字符串，无按下音效
   * */
  public soundEffect: string = ''

  /**
   * 按下时的缩放值，默认为 1.2
   */
  public sacleEffect: number = 1.2

  /**
   * 是否使用按下时缩放效果
   * 默认值为true
   */
  public useSacleEffect: boolean = true

  /**
   * 点击时间间隔限制，以毫秒为单位。
   * 简易抗暴力点击，从TouchDown后倒计时此时间，该时段内按钮只有点击效果但不外抛事件。
   * 默认值为0，表示不做限制
   */
  public cdTime: integer = 0

  private _cding: boolean = false
  // 点击提示动效
  private _tipsTweens: Tween
  // 点击提示倒计时
  private _tipsTimer: any
  // 是否正在显示
  private _isDisplay: boolean = true

  /**
   * 构造函数
   * @param $scene            场景
   * @param $rect             渲染区域，包括位置和坐标的矩形
   * @param $texture          背景纹理
   * @param $label            文本
   * @param $textStyle        文本样式，可以由UIUtils.CreatTextStyle生成
   * @param $parent           父容器
   *
   * @see UIUtils.CreatTextStyle
   * @see Phaser.Geom.Rectangle
   */
  public constructor(
    $scene: Scene,
    $rect: Rectangle,
    $texture: string | Object,
    $label: string = '',
    $textStyle: Object = null,
    $parent: Container = null
  ) {
    super($scene, $rect, $parent)

    let rect_ = new Rectangle(0, 0, $rect.width, $rect.height)
    rect_.setPosition(rect_.centerX, rect_.centerY)
    let container_ = $scene.add.container(rect_.x, rect_.y) //UIUtils.CreatContainer($scene , rect_ , this);
    this.add(container_)
    this._core = container_

    rect_.setPosition(-rect_.width / 2, -rect_.height / 2)
    let img_ = UIUtils.CreatImage_center($scene, $texture, rect_, container_)
    this._bg = img_

    if (!$textStyle) {
      $textStyle = UIUtils.CreatTextStyle(20, 'left', '#ffffff')
    }
    this.text = UIUtils.CreatText($scene, $label, 0, 0, $textStyle, container_)
    this.measure()

    img_.setInteractive()
    img_.on(PhaserEvents.pointerdown, this.onDown, this)

    this._monitor()
  }

  private _monitor(): void {
    // 监听场景更新
    this._scene.events.on('update', this._update, this)
    this.on('destroy', this._destroy, this)
  }

  private _update(): void {
    if (!this._tipsTweens) return
    if (this.alpha === 0 && this._isDisplay) {
      this._isDisplay = false
      this._tipsTweens.stop()
    } else if (this.alpha === 1 && !this._isDisplay) {
      this._isDisplay = true
      this._tipsTweens.restart()
    }
  }

  private _destroy(): void {
    this._removeTips()
  }

  // 移除点击提示
  private _removeTips(): void {
    this._scene.events.off('update', this._update, '', false)
    this._tipsTimer && clearTimeout(this._tipsTimer)
  }

  //布局计算
  protected measure(): void {
    const txt_ = this.text
    if (!txt_.text) {
      return
    }
    txt_.x = -txt_.width / 2
    txt_.y = -txt_.height / 2
  }

  //I/O事件处理 + 动画
  protected onDown(): void {
    if (this._processing || !this.enable || this._cding) {
      return
    }

    this._removeTips()

    let tween_ = this._tween
    if (tween_ && tween_.isPlaying) {
      tween_.stop()
    }

    this._processing = true
    let input_ = this._scene.input
    input_.on(PhaserEvents.pointerup, this.onUp, this)
    input_.on(PhaserEvents.pointerout, this.onUp, this)
    if (this.useSacleEffect) {
      this._tween = this._scene.tweens.add({
        targets: this._core,
        scaleX: this.sacleEffect,
        scaleY: this.sacleEffect,
        ease: 'Sine.easeInOut',
        duration: 50,
        onCompleteScope: this,
        onComplete() {
          if (this.soundEffect) {
            SoundManager.PlayOnce(this._scene, this.soundEffect)
          }
        }
      })
    } else if (this.soundEffect) {
      SoundManager.PlayOnce(this._scene, this.soundEffect)
    }

    if (this.cdTime > 0) {
      this._cding = true
      setTimeout(() => {
        this._cding = false
      }, this.cdTime)
    }
    this.emit(PhaserEvents.pointerdown)
  }

  protected onUp(e): void {
    let input_ = this._scene.input
    input_.off(PhaserEvents.pointerup, this.onUp, this, false)
    input_.off(PhaserEvents.pointerout, this.onUp, this, false)

    let tween_ = this._tween
    if (tween_ && tween_.isPlaying) {
      tween_.stop()
    }
    if (this.useSacleEffect) {
      this._tween = this._scene.tweens.add({
        targets: this._core,
        scaleX: 1,
        scaleY: 1,
        ease: 'Sine.easeInOut',
        duration: 100,
        onStartScope: this,
        onCompleteScope: this,
        onComplete() {
          this._processing = false
        }
      })
    } else {
      this._core.setScale(1, 1)
      this._processing = false
    }

    // 防止滑动误操作
    const offsetX = (window as any).Math.abs(e.upX - e.downX)
    const offestY = (window as any).Math.abs(e.upY - e.downY)
    if (offsetX > 20 || offestY > 20) {
      return
    }
    this.emit(PhaserEvents.pointerup)
  }

  //interface:
  /**
   * 设置按钮文字
   * @param $s    文字
   */
  public setLabel($s: string): void {
    this.text.text = $s
    this.measure()
  }

  /**
   * 获取按钮文字
   */
  public getLabel(): string {
    return this.text.text
  }

  /**
   * 设置文本样式
   * @param $size         字号大小
   * @param $color        字体颜色
   * @param $family       文本字体
   */
  public setTextStyle($size: integer, $color: string, $family = 'Arial Rounded MT Bold'): void {
    let txt_ = this.text
    txt_.setColor($color)
    txt_.setFontSize($size)
    txt_.setFontFamily($family)
    this.measure()
  }

  /**
   * 设置点击提示
   *
   * @param $time         提示倒计时时长（ms单位）
   */
  public showTips($time: number = 0): void {
    this._tipsTimer = setTimeout(
      () => {
        this._tipsTweens = this._scene.tweens.add({
          targets: this._core,
          scaleX: this.sacleEffect,
          scaleY: this.sacleEffect,
          ease: 'Sine.easeInOut',
          duration: 300,
          yoyo: true,
          repeat: 2
        })
      },
      $time,
      this
    )
  }
}

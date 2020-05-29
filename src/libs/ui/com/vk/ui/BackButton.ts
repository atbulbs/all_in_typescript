import Image = Phaser.GameObjects.Image
import Text = Phaser.GameObjects.Text
import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import Tween = Phaser.Tweens.Tween
import { Scene } from 'phaser'
import {
  Button,
  UIComponent,
  PropupManager,
  EventTypes,
  UIUtils,
  PhaserEvents
} from '../phaser/VPClass'

/**
 * BackButton.ts
 *
 *
 *     creat on:   2019/06/12 18:33:51
 *
 * 返回按钮，点击此按钮自动弹出挽留提示框，用户确认离开后，将派发 EventTypes.Exit 事件
 * 提示框布局只在适配规则下可用
 *
 * @see Button
 *
 * Event： EventTypes.Back
 * Event： EventTypes.Cancel
 *
 * Example:
 * ```
 *      let r:Rectangle = new Rectangle(20 , 20 , 60 , 60);
 *      let b:BackButton = new BackButton(this , r , "back");
 *      b.stetPropStyle("titleTexture" , "btnTexture" , "btnTexture" , "现在离开就" , "不能接续学习了哦~" ,"残忍离开" , "继续学习");
 * ```
 */
export default class BackButton extends Button {
  private _alert: ExitAlert

  private _bgTxture: string
  private _bgColor: integer
  private _exitTxture: string
  private _cancelTexture: string
  private _txt1: string
  private _txt2: string
  private _exitLabel: string
  private _cancelLabel: string

  protected onUp(e): void {
    super.onUp(e)
    if (!this._alert) {
      if (!this._exitTxture) {
        // throw 'PropStyle未设置！'
        this.emit(EventTypes.Back)
        return
      }
      let alert_ = new ExitAlert(
        this._scene,
        this._exitTxture,
        this._cancelTexture,
        this._bgTxture,
        this._bgColor,
        this._txt1,
        this._txt2,
        this._exitLabel,
        this._cancelLabel
      )
      this._scene.sys.displayList.remove(alert_)
      alert_.on(EventTypes.Back, this.onAlert_bcak, this)
      alert_.on(EventTypes.Cancel, this.onAlert_cancel, this)
      this._alert = alert_
    }
    PropupManager.AddPropup(this._alert, this._scene)
  }

  private onAlert_bcak(): void {
    PropupManager.RemovePropup(this._alert, this._scene)
    this.emit(EventTypes.Back)
  }
  private onAlert_cancel(): void {
    PropupManager.RemovePropup(this._alert, this._scene)
    this.emit(EventTypes.Cancel)
  }

  public destroy($fromScene: any): void {
    if (this._alert && this._scene.children.getIndex(this._alert) == -1) {
      this._alert.destroy()
      this._alert = null
    }
    super.destroy($fromScene)
  }

  //interface
  public stetPropStyle(
    $bgTxture: string,
    $bgColor: integer,
    $exitTxture: string,
    $cancelTexture: string,
    $txt1: string = '现在退出就',
    $txt2: string = '不能继续学习了',
    $exitLabel: string = '残忍离开',
    $cancelLabel: string = '继续练习'
  ): void {
    this._bgTxture = $bgTxture
    this._bgColor = $bgColor
    this._exitTxture = $exitTxture
    this._cancelTexture = $cancelTexture
    this._txt1 = $txt1
    this._txt2 = $txt2
    this._exitLabel = $exitLabel
    this._cancelLabel = $cancelLabel
  }
}

class ExitAlert extends UIComponent {
  public constructor(
    $scene: Scene,
    $exitTxture: string,
    $cancelTexture: string,
    $bgTxture: string = '',
    $bgColor: integer = 0xffffff,
    $txt1: string = '现在退出就',
    $txt2: string = '不能继续学习了',
    $exitLabel: string = '残忍离开',
    $cancelLabel: string = '继续练习'
  ) {
    super($scene, new Rectangle(0, 0, 295, 168))

    const rect_ = new Rectangle(0, 0, this.width, this.height)
    if ($bgTxture) {
      UIUtils.CreatImage(this._scene, $bgTxture, rect_, this)
    } else {
      UIUtils.CreatRect(this._scene, rect_, $bgColor, 1, 20, this)
    }

    let style_ = UIUtils.CreatTextStyle(18, 'left', '#4a4a4a')
    let txt_ = UIUtils.CreatText($scene, $txt1, 0, 37, style_, this)
    txt_.x = (this.width - txt_.width) / 2
    if ($txt2) {
      txt_ = UIUtils.CreatText($scene, $txt2, 0, 62, style_, this)
      txt_.x = (this.width - txt_.width) / 2
    } else {
      txt_.y = 50
    }

    rect_.setTo(20, 117, 120, 36)
    let btn_ = new Button($scene, rect_, $exitTxture, $exitLabel, style_, this)
    btn_.name = EventTypes.Back
    btn_.on(PhaserEvents.pointerup, this.onBack, this)
    btn_.useSacleEffect = false

    style_ = UIUtils.CreatTextStyle(18, 'left', '#ffffff')
    rect_.setTo(155, 117, 120, 36)
    btn_ = new Button($scene, rect_, $cancelTexture, $cancelLabel, style_, this)
    btn_.name = EventTypes.Cancel
    btn_.on(PhaserEvents.pointerup, this.onCancel, this)
    btn_.useSacleEffect = false
  }

  private onBack() {
    this.emit(EventTypes.Back)
  }
  private onCancel() {
    this.emit(EventTypes.Cancel)
  }
}

import EventEmitter = Phaser.Events.EventEmitter
import Scene = Phaser.Scene
import GameObject = Phaser.GameObjects.GameObject
import Point = Phaser.Geom.Point
import { PhaserEvents } from '../enum/PhaserEvents'
import { EventTypes } from '../enum/EventTypes'

/**
 * DragHelper.ts
 *
 *
 *     creat on:   2019/05/10 14:17:53
 *
 * 拖拽助手
 * 当按下目标GamaeObject（需支持Interactive）时，将开始拖动。并随着触点的Move和Up抛出响应事件
 *
 * Event: EventTypes.DragStart
 * Event: EventTypes.DragMove
 * Event: EventTypes.DragStop
 */
export default class DragHelper extends EventEmitter {
  /**拖动目标*/
  public target: GameObject
  private _scene: Scene
  private _lastPos: Point = new Point()

  /**
   * 构造函数
   * @param $s 当前场景
   */
  public constructor($s: Scene) {
    super()
    this._scene = $s
  }

  /**
   * 设置拖动目标
   *
   * @param $o    拖动目标，需要支持Interactive
   */
  public setTarget($o: GameObject): void {
    if (this.target == $o) {
      return
    }
    if (this.target) {
      this.target.off(PhaserEvents.pointerdown, this.onDown, this, false)
    }
    this.target = $o
    if (this.target) {
      if (!this.target.input) {
        this.target.setInteractive()
      }
      this.target.on(PhaserEvents.pointerdown, this.onDown, this)
    }
  }

  protected onDown(): void {
    this.startDrag()
  }

  /**
   * 开始拖动，一般由PhaserEvents.pointerdown事件触发，也可手动调用开始拖动。
   *
   * Event:       EventTypes.DragStart
   */
  public startDrag(): void {
    let input_ = this._scene.input
    let pointer_ = input_.activePointer
    this._lastPos.setTo(pointer_.worldX, pointer_.worldY)
    input_.on(PhaserEvents.pointerup, this.onUp, this)
    input_.on(PhaserEvents.pointermove, this.onMove, this)
    this.emit(EventTypes.DragStart, this)
  }

  /**
   * 拖动过程
   *
   * Event:       EventTypes.DragMove
   */
  protected onMove(): void {
    let pos_: Point = this._lastPos
    // 使用激活的点击
    const now_ = this._scene.input.activePointer
    let dx_ = now_.worldX - pos_.x
    let dy_ = now_.worldY - pos_.y
    pos_.setTo(now_.worldX, now_.worldY)
    this.emit(EventTypes.DragMove, this, dx_, dy_)
  }

  /**
   * 触点抬起，拖动结束
   *
   * Event:       EventTypes.DragStop
   */
  protected onUp(): void {
    this._scene.input.off(PhaserEvents.pointerup, this.onUp, this, false)
    this._scene.input.off(PhaserEvents.pointermove, this.onMove, this, false)
    this.onMove()
    this.emit(EventTypes.DragStop, this)
  }
}

import Graphics = Phaser.GameObjects.Graphics
import Circle = Phaser.Geom.Circle
import Container = Phaser.GameObjects.Container
import Math = Phaser.Math
import { Scene } from 'phaser'
import { EventTypes } from '../VPClass'

/**
 * Arc.ts
 *
 *
 *     creat on:   2019/06/15 15:14:28
 *
 * 弧形绘图，以弧度制为单位，0弧度位于圆形顶端，以顺时针方向进行绘制
 * 支持动画绘制，动画过程为50ms绘制一个步长，步长可通过setp属性积进行设置.动画结束时将派发事件：EventTypes.Complete
 *
 * @see Phaser.GameObjects.Graphics
 * @see EventTypes.Complete
 */
export default class Arc extends Graphics {
  /**所在场景 */
  protected _scene: Scene

  private _color: integer = 0xff00ff
  private _lineWidth: number = 4

  private _playing: boolean = false
  private _playKey: any

  /**当前弧度 */
  private _radian: number
  /**目标弧度 */
  private _endRadian: number

  /**半径 */
  public radius: number = 0
  /**
   * 步长，在播放动画的时候，每50ms向前绘制的弧度值
   */
  public step: number = 0.1

  /**
   * 构造函数
   * @param $scene        目标场景
   * @param $circle       绘制区域，描述圆形和半径信息
   * @param $parent       父容器
   */
  public constructor($scene: Scene, $circle: Circle, $parent: Container = null) {
    super($scene)

    this.x = $circle.x
    this.y = $circle.y
    this.radius = $circle.radius

    if ($parent) {
      $parent.add(this)
    } else {
      $scene.sys.displayList.add(this)
    }
  }

  /**
   * 设置样式
   * @param $color            十六进制颜色值
   * @param $lineWidth        线的粗细
   */
  public setStyle($color: integer, $lineWidth: number): void {
    this._color = $color
    this._lineWidth = $lineWidth
  }

  /**
   * 绘制弧线
   * @param $radius   要绘制到的目标弧度               取值范围0-PI*2
   */
  public draw($radius: number): void {
    let start_ = -Math.PI2 / 4
    if ($radius > Math.PI2 || $radius < -Math.PI2) {
      $radius = $radius % Math.PI2
    }
    $radius += $radius < 0 ? Math.PI2 : 0
    $radius += start_
    this.clear()
    this.lineStyle(this._lineWidth, this._color)
    this.beginPath()
    this.arc(0, 0, this.radius, start_, $radius, false)
    this.strokePath()
  }

  /**
   * 动画绘制，动画过程为50ms绘制一个步长，步长可通过setp属性积进行设置.动画结束时将派发事件：EventTypes.Complete
   *
   * @param $radius 要绘制的目标弧度
   *
   * @see EventTypes.Complete
   */
  public play($radius: number): void {
    if (this._playing) {
      return
    }
    if ($radius > Math.PI2 || $radius < -Math.PI2) {
      $radius = $radius % Math.PI2
    }
    this._radian = 0
    this._endRadian = $radius
    this._playing = true
    this._playKey = setInterval(this.onStep, 50, this)
  }

  /**
   * 停止动画绘制
   */
  public stop() {
    this._playing = false
    clearInterval(this._playKey)
  }

  private onStep($this: Arc): void {
    let radian_ = $this._radian + $this.step
    if (radian_ >= $this._endRadian) {
      radian_ = $this._endRadian
      $this.draw(radian_)
      clearInterval($this._playKey)
      $this.emit(EventTypes.Complete)
      return
    }
    $this._radian = radian_
    $this.draw(radian_)
  }
}

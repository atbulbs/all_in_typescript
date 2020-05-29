import UIComponent from './UIComponent'
import Rectangle = Phaser.Geom.Rectangle
import Graphics = Phaser.GameObjects.Graphics
import Container = Phaser.GameObjects.Container
import { Scene } from 'phaser'
import UIUtils from '../utils/UIUtils'
import { PhaserEvents } from '../enum/PhaserEvents'
import { EventTypes } from '../enum/EventTypes'
/**
 * ProgressBar.ts
 *
 *
 *     creat on:   2019/06/03 15:39:52
 *
 * 进度条控件,当enable为true时，可以拖动。
 * 当拖动改变进度时，会抛出事件：EventTypes.Change
 *
 * @see UIComponent
 * @see EventTypes
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
export default class ProgressBar extends UIComponent {
  /**
   * 是否启用实时拖动。设置为true则当用户拖动进度条时会连续广播 change 事件。设置为false时则只会在用户按下和抬起时派发change事件。默认为false
   */
  public liveDragging: boolean = false

  private _bgColor: integer = 0x888888
  private _barColor: integer = 0x666666
  private _radius: number = 0

  /**总进度*/
  protected _totial: number = 1
  /**当前进度 */
  protected _value: number = 0

  /**背景 */
  protected _bg: Graphics
  /**前景 */
  protected _bar: Graphics

  /**
   * 构造函数
   * @param $scene        要添加的场景
   * @param $rect         所在的区域（大小和位置）
   * @param $parent       父容器
   */
  public constructor($scene: Scene, $rect: Rectangle, $parent: Container = null) {
    super($scene, $rect, $parent)

    const rect_ = Rectangle.Clone($rect)
    rect_.setPosition(0, 0)
    this._bg = UIUtils.CreatRect($scene, rect_, this._bgColor, 1, 0, this)
    this._bar = UIUtils.CreatRect($scene, rect_, this._barColor, 1, 0, this)
    this.draw()
    this._bg.setInteractive(rect_, Rectangle.Contains)
    this._bg.on(PhaserEvents.pointerdown, this.onDown, this)

    /*
        let angle_:integer = $rect.height / 2;
        $scene.add.arc(angle_ , angle_ , angle_ , 0 , 180)
        let graphics_ = UIUtils.CreatRect($scene , rect_ , 0x009cff , 1 , angle_ , this);
        // this._h = rect_.width = rect_.height*2;
        // this._graphics_bar = graphics_;

        setInterval(()=>{
            graphics_.clear();
            if(rect_.width<=0){
                return
            }
            rect_.width--;

            if(rect_.width>rect_.height){
                UIUtils.FillRect(graphics_ , rect_ , 0x009cff , 1 , angle_);
            }else{
                const rect2_ = Rectangle.Clone(rect_);
                rect2_.width = rect_.height;
                UIUtils.FillRect(graphics_ , rect2_ , 0x009cff , 1 , angle_);
            }
        } , 100)*/
  }

  //事件响应
  private onDown(): void {
    if (!this.enable) {
      return
    }
    this.drawByTouch()
    const input_ = this._scene.input
    input_.on(PhaserEvents.pointermove, this.onMove, this)
    input_.on(PhaserEvents.pointerup, this.onUp, this)
  }

  private onMove(): void {
    this.drawByTouch(this.liveDragging)
  }

  private onUp(): void {
    this.drawByTouch()
    const input_ = this._scene.input
    input_.off(PhaserEvents.pointermove, this.onMove, this, false)
    input_.off(PhaserEvents.pointerup, this.onUp, this, false)
  }

  //绘制进度条
  private draw(): void {
    let rect_: Rectangle = new Rectangle(0, 0, 0, this.height)
    rect_.width = this.width * (this._value / this._totial)
    this._bar.clear()
    UIUtils.FillRect(this._bar, rect_, this._barColor, 1, this._radius)
  }

  private drawByTouch($emit: boolean = true): void {
    const rect_ = new Rectangle(0, 0, 0, this.height)
    const pointer_ = this.scene.input.pointer1
    rect_.width = pointer_.worldX - this.x
    rect_.width = Math.max(0, rect_.width)
    rect_.width = Math.min(this.width, rect_.width)
    this._bar.clear()
    UIUtils.FillRect(this._bar, rect_, this._barColor)
    this._value = (rect_.width / this.width) * this._totial
    if ($emit) {
      this.emit(EventTypes.Change, this._value)
    }
  }

  //interface
  /**
   * 设置值
   * @param $value        当前值          0-total,超出此范围将被舍入到此范围内
   * @param $total        总数            >0为有效值，<=0时，入参无效,默认为0
   *
   */
  public setValue($value: number, $total: number = 0): void {
    if ($total > 0) {
      this._totial = $total
    }
    $value = Math.max(0, $value)
    $value = Math.min(this._totial, $value)
    this._value = $value
    this.draw()
  }

  /**
   * 设置样式
   * @param $color        bar的颜色
   * @param $bgColor      背景色
   * @param $radius       圆角弧度
   */
  public setStyle($color: integer, $bgColor: integer, $radius?: number): void {
    if ($radius) {
      this._radius = $radius
    }

    if ($bgColor != this._bgColor) {
      this._bgColor = $bgColor
      const rect_ = new Rectangle(0, 0, this.width, this.height)
      this._bg.clear()
      UIUtils.FillRect(this._bg, rect_, this._bgColor, 1, this._radius)
    }

    if ($color != this._barColor) {
      this._barColor = $color
      this.draw()
    }
  }

  /**
   * 获取当前的进度值
   * @retuan 当前进度值
   */
  public getValue(): number {
    return this._value
  }

  /**
   * 获取总进度
   * @return 总进度值
   */
  public getTotal(): number {
    return this._totial
  }

  /**
   * 设置是否显示背景
   * @param $value    是否显示背景
   */
  public showBackground($value: boolean): void {
    this._bg.alpha = $value ? 1 : 0.01
  }
}

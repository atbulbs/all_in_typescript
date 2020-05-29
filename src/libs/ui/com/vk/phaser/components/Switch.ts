import Image = Phaser.GameObjects.Image
import Text = Phaser.GameObjects.Text
import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import { Scene } from 'phaser'
import UIComponent from './UIComponent'
import UIUtils from '../utils/UIUtils'
import { PhaserEvents } from '../enum/PhaserEvents'
import { EventTypes } from '../enum/EventTypes'

/**
 * Switch.ts
 *
 *
 *     creat on:   2019/05/29 17:26:24
 *
 * 开关组件，点击切换图片并抛出Change事件
 *
 * Event: EventTypes.Change
 *
 * Example：
 * ```
 *      public create():void{
 *          let r:Rectangle = new Rectangle(50 , 100 , 40 , 40);
 *          //"check0" , "check1"  是纹理key
 *          let s:Switch = new Switch(this , r , "check0" , "check1");
 *
 *          s.on(EventTypes.Change , function($selected:boolean):void{
 *              //TODO...
 *          } , this);
 *      }
 * ```
 *
 */
export default class Switch extends UIComponent {
  protected _img_unSelected: Image
  protected _img_selected: Image

  /**
   * 构造函数
   * @param $scene                场景
   * @param $rect                 组件所在区域
   * @param $texture              未选中的纹理
   * @param $selectedTexture      选中的纹理
   * @param $parent               父容器
   *
   * @see Phaser.Geom.Rectangle
   */
  public constructor(
    $scene: Scene,
    $rect: Rectangle,
    $texture: string,
    $selectedTexture: string,
    $parent: Container = null
  ) {
    super($scene, $rect, $parent)
    let r = Rectangle.Clone($rect)
    r.setPosition(0, 0)

    this._img_unSelected = UIUtils.CreatImage($scene, $texture, r, this)
    this._img_selected = UIUtils.CreatImage($scene, $selectedTexture, r, this)
    this.setSelected(false)
    this._img_selected.setInteractive()
    this._img_unSelected.setInteractive()
    this._img_unSelected.on(PhaserEvents.pointerdown, this.onDown, this)
    this._img_selected.on(PhaserEvents.pointerdown, this.onDown, this)
  }

  private onDown(): void {
    let b = !this.getSelected()
    this.setSelected(b)
    this.emit(EventTypes.Change, b)
  }

  /**
   * 设置选中状态，但不会引发Change事件
   * @param $val 选中状态
   */
  public setSelected($val: boolean): void {
    this._img_selected.visible = $val
    this._img_unSelected.visible = !$val
  }

  /**
   * 获取选中状态
   * 默认为非转钟状态，用户Touch操作或setSelected方法调用会改变此返回结果。
   * @return 选中状态，默认为false
   */
  public getSelected(): boolean {
    return this._img_selected.visible
  }
}

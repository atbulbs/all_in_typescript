import Rectangle = Phaser.Geom.Rectangle
import Graphics = Phaser.GameObjects.Graphics
import { Scene, GameObjects } from 'phaser'
import SceneBase from '../scene/SceneBase'
import UIUtils from '../utils/UIUtils'
import UIComponent from '../components/UIComponent'
/**
 * PropupManager.ts
 *
 *
 *     creat on:   2019/05/30 15:53:14
 *
 * 弹出框管理器 , 在Scene的所有之上，黑色半透明背景和弹出框。
 * 在弹出过程中，被弹出的GameObject的 depth 属性将被设置为80。并在被removePopue之后恢复原 depth值。
 *
 * 如已有弹出窗口则隐藏掉前面的显示新内容
 *
 *
 * Example：
 * ```
 *      public create () :void {
 *          let r:Rectangle = new Rectangle(0 , 0 ,  240 , 120);
 *          let c = new UIComponent(this , r);
 *          r.setPosition(0 , 0);
 *          let g = UIUtils.CreatRect(this , r , 0xffffff , 1 , 8 , c);
 *
 *          //增加弹出内容
 *          PropupManager.AddPropup(c , this);
 *
 *          g.setInteractive(r , Rectangle.Contains);
 *          g.on(PhaserEvents.pointerdown , function():void{
 *              //隐藏弹出内容
 *              PropupManager.RemovePropup(c, this);
 *          } , this);
 *      }
 * ```
 */
export default class PropupManager {
  public static ProupDepth: number = 80

  private static _currectGameObjectDepth: number
  private static _currectGameObject: UIComponent
  private static _currectScene: Scene
  private static _bg: Graphics = null

  /**
   * 弹出Pupup
   * @param $child    要弹出的UIComponent      需要预设宽高以便进行居中计算，否则将置于屏幕中心.即：如需中心对齐，将width和heigth设为0即可。
   * @param $scene    所在Scene
   */
  public static AddPropup($child: UIComponent, $scene: Scene): void {
    PropupManager.RemoveCurrect()
    PropupManager._currectScene = $scene
    PropupManager._currectGameObject = $child
    PropupManager._currectGameObjectDepth = $child.depth

    let depth_: number = PropupManager.ProupDepth
    let rect_: Rectangle
    //黑色背景
    if ($scene instanceof SceneBase) {
      let s: SceneBase = $scene as SceneBase
      rect_ = s.getWindowRect()
    } else {
      rect_ = new Rectangle(0, 0, window.innerWidth, window.innerHeight)
    }
    let graphics_: Graphics = UIUtils.CreatRect($scene, rect_, 0x000000, 0.7)
    let rectGraphics_: Rectangle = new Rectangle(0, 0, rect_.width, rect_.height)
    graphics_.setInteractive(rectGraphics_, Rectangle.Contains)
    graphics_.depth = depth_ - 0.1
    PropupManager._bg = graphics_

    //弹出主体
    $child.depth = depth_
    if ($scene.children.getIndex($child) == -1) {
      $scene.children.add($child)
    }
    if ($child.width == 0 && $child.height == 0) {
      $child.setPosition(rect_.centerX, rect_.centerY)
    } else {
      let rect_child_ = new Rectangle(0, 0, $child.width, $child.height)
      rect_child_.centerX = rect_.centerX
      rect_child_.centerY = rect_.centerY
      $child.setPosition(rect_child_.x, rect_child_.y)
    }
  }

  /**
   * 移除Propup对象
   * @param $child    要移除的UIComponent
   * @param $scene    所在Scene
   */
  public static RemovePropup($child: UIComponent, $scene: Scene): void {
    if ($child != PropupManager._currectGameObject) {
      return
    }
    let s = PropupManager._currectScene
    let c = PropupManager._currectGameObject
    let g = PropupManager._bg
    g.destroy()
    c.depth = PropupManager._currectGameObjectDepth
    s.children.remove(c)

    PropupManager._bg = null
    PropupManager._currectScene = null
    PropupManager._currectGameObject = null
  }

  /**
   * 移除当前Propup对象
   */
  public static RemoveCurrect(): void {
    if (!PropupManager._currectGameObject) {
      return
    }
    PropupManager.RemovePropup(PropupManager._currectGameObject, PropupManager._currectScene)
  }
}

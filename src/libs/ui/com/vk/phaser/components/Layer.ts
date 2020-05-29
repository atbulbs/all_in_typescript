import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import { Scene } from 'phaser'
import UIComponent from './UIComponent'
import UIUtils from '../utils/UIUtils'

/**
 * Layer.ts
 *
 *
 *     creat on:   2019/06/04 17:35:28
 *
 * 可设置中心的嵌套容器，可设置缩放旋转中心(orign)
 * 内层容器将以向此组件传入的中心，作为缩放、旋转、扭曲的中心位置
 * 注意：传入的$layerOriginX、$layerOriginY是相对于宽高比例（与法线类似）。
 *
 * Example:
 * ```
 *       public create():void{
 *          const rect_:Rectangle = new Rectangle(150 , 350 , 100 , 100);
 *          const layer_:Layer = new Layer(this , rect_ , 0.5 , 0.5);
 *          const container_ = layer_.getLayer();
 *          rect_.setTo(0 , 0 , 100 , 100);
 *          const img_ = UIUtils.CreatImage(this , "dude" , rect_ , container_);
 *          setInterval(function():void{
 *              layer_.scaleX +=0.02
 *              layer_.scaleY +=0.02
 *          }, 100);
 *      }
 * ```
 */
export default class Layer extends UIComponent {
  private _rewriteX: number = 0
  private _rewriteY: number = 0
  private _layer: Container

  /**
   * 构造函数
   * @param $scene            场景
   * @param $layerRect        layer所在的区域（大小和位置）      内层Layer将被渲染至此区域
   * @param $layerOriginX     水平中心                        一般取值范围：0-1，0表示缩放/旋转/扭曲的中心在最左,1表示在最右。超出此范围，偏移量将继续增大或往负方向发展。
   * @param $layerOriginY     垂直中心                        一般取值范围：0-1，0表示缩放/旋转/扭曲的中心在顶端,1表示在底端。超出此范围，偏移量将继续增大或往负方向发展。
   * @param $parent           父容器                          如此值不为null，则当前UIComponent将被添加至此Container中
   *
   * @see Phaser.Geom.Rectangle
   */
  public constructor(
    $scene: Scene,
    $layerRect: Rectangle,
    $layerOriginX: number = 0.5,
    $layerOriginY: number = 0.5,
    $parent: Container = null
  ) {
    super($scene, $layerRect, $parent)
    this.width = this.height = 0

    const offestX = $layerOriginX * $layerRect.width
    const offestY = $layerOriginY * $layerRect.height
    this.x += offestX
    this.y += offestY
    this._rewriteX = offestX
    this._rewriteY = offestY

    let rect_ = new Rectangle(-offestX, -offestY, $layerRect.width, $layerRect.height)
    this._layer = UIUtils.CreatContainer($scene, rect_, this)
  }

  /**
   * 获取中心点的X坐标
   * @return      中心点的X坐标       相当于Phaser.GameObjects.Image的displayOriginX属性
   */
  public getRewriteX(): number {
    return this._rewriteX
  }

  /**
   * 获取中心点的Y坐标
   * @return      中心点的Y坐标       相当于Phaser.GameObjects.Image的displayOriginY属性
   */
  public getRewriteY(): number {
    return this._rewriteY
  }

  /**
   * 获取内层容器
   * @return 内层容器
   *
   * @see Phaser.GameObjects.Container
   */
  public getLayer(): Container {
    return this._layer
  }
}

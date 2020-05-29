import MultipleCameraPluginBase from './MultipleCameraPluginBase'

import Camera = Phaser.Cameras.Scene2D.Camera
import Rectangle = Phaser.Geom.Rectangle
import UIUtils from '../utils/UIUtils'

/**
 * InnerCameraPlugin.ts
 *
 *
 *     creat on:   2019/04/30 11:02:55
 *
 * 内侧操作区摄像机，对操作区域进行等比缩放并边缘留白
 *
 */
export default class InnerCameraPlugin extends MultipleCameraPluginBase {
  public constructor(
    $c: Camera,
    $windowWidth: integer,
    $windowHeight: integer,
    $layoutAir: Rectangle
  ) {
    super($c, $windowWidth, $windowHeight, $layoutAir)
  }

  /**
   * 扩展父类的抽象方法，完成相机的偏移缩放等功能。
   * 计算布局, 设置相机。
   *
   * @param $windowWidth      画布宽度
   * @param $windowHeight     画布高度
   */
  public measure($windowWidth: integer, $windowHeight: integer): void {
    //数据支撑
    let rd_: Rectangle = this._rect_layout
    let rw_: Rectangle = new Rectangle(0, 0, $windowWidth, $windowHeight)
    let ri_: Rectangle = UIUtils.CalcInnerArea(rd_.width, rd_.height, rw_.width, rw_.height)

    //计算中间结果
    const sx_: number = ri_.width / rd_.width
    const sy_: number = ri_.height / rd_.height
    const s_: number = Math.max(sx_, sy_)

    //摄像机缩放和偏移
    let c_: Camera = this.camera
    c_.setOrigin(0, 0)
    c_.zoom = s_
    c_.scrollX = ri_.x == 0 ? 0 : Math.round(-ri_.x / s_)
    c_.scrollY = ri_.y == 0 ? 0 : Math.round(-ri_.y / s_)

    //可见区域计算
    this._rect_camera = new Rectangle(
      c_.scrollX,
      c_.scrollY,
      rd_.width - c_.scrollX * 2,
      rd_.height - c_.scrollY * 2
    )
  }
}

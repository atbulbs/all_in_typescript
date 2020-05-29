import Rectangle = Phaser.Geom.Rectangle
import Camera = Phaser.Cameras.Scene2D.Camera
import UIUtils from '../utils/UIUtils'
import CameraPluginBase from './CameraPluginBase'

/**
 * SimpleCameraPlugin.ts
 *
 *
 *     creat on:   2019/05/14 15:19:42
 *
 * 单摄像机控制器，与InnerCameraPlugin布局规则相同。场景中只有一个主摄像机，操作更加简便，不必引入CameraPluginManager，也不必给每个GameObject选择摄像机。
 */
export default class SimpleCameraPlugin extends CameraPluginBase {
  /**
   * 构造函数
   * @param $camera           主这相机（必须是场景唯一摄像机）
   * @param $windowWidth      Canvas宽度
   * @param $windowHeight     Canvas高度
   * @param $layoutAir        标注有设计宽高的矩形
   *
   * @see Phaser.Geom.Rectangle
   */
  public constructor(
    $camera: Camera,
    $windowWidth: integer,
    $windowHeight: integer,
    $layoutAir: Rectangle
  ) {
    super($camera, $windowWidth, $windowHeight, $layoutAir)
  }

  /**
   * 设置相机，完成相机的偏移缩放等功能。
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

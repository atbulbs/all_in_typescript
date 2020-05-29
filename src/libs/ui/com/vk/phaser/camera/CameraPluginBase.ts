import Rectangle = Phaser.Geom.Rectangle
import Point = Phaser.Geom.Point
import GameObject = Phaser.GameObjects.GameObject
import Camera = Phaser.Cameras.Scene2D.Camera
import EventEmitter = Phaser.Events.EventEmitter
import Debug from '../utils/Debug'
import { AlignType } from '../enum/AlignType'
import { EventTypes } from '../enum/EventTypes'

/**
 * CameraPluginBase.ts
 *
 *
 *     creat on:   2019/06/11 18:10:06
 *
 * CamePlugin基础类
 */
export default abstract class CameraPluginBase extends EventEmitter {
  /**
   * 实际布局区域。
   * 此区域为被允许的布局的常规区域，其内坐标与设计稿对应
   * */
  protected _rect_layout: Rectangle
  /**
   * 摄像机拍摄区域。
   * 在此区域内的GameObject可见,超出此范围的内容不可见
   */
  protected _rect_camera: Rectangle

  /**是否正在移动 */
  private _scrolling: boolean = false

  public camera: Camera

  /**
   * 构造函数
   * @param $camera           主这相机
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
    super()
    this.camera = $camera
    this._rect_layout = $layoutAir
    this.measure($windowWidth, $windowHeight)
  }

  /**
   * 抽象方法，子类扩展此方法已完成相机的偏移缩放等功能。
   * 计算布局, 设置相机。
   *
   * @param $windowWidth      画布宽度
   * @param $windowHeight     画布高度
   */
  public abstract measure($windowWidth: integer, $windowHeight: integer): void

  /**
   * 获取此摄像机的布局区域
   *
   * @return 描述此区域的矩形
   */
  public getLayoutRect(): Rectangle {
    let rect_: Rectangle = Rectangle.Clone(this._rect_layout)
    return rect_
  }

  /**
   * 获取此摄像机的实际拍摄区域
   *
   * @return 描述此区域的矩形
   */
  public getCameraRect(): Rectangle {
    let r: Rectangle = Rectangle.Clone(this._rect_camera)
    return r
  }

  /**
   * 缩放值
   *
   * @return 缩放值
   */
  public getScale(): number {
    return this.camera.zoom
  }

  /**
   * 摄像机区域转正常区域（二者在视觉上重合）
   * @param $rect 被摄像机的缩放和偏移后的视觉区域
   *
   * @return  未被被摄像机的缩放和偏移的视觉区域
   */
  public cameraRect2Window($rect: Rectangle): Rectangle {
    const rect_ = Rectangle.Clone($rect)
    const scale_: number = this.getScale()
    let point_ = new Point($rect.centerX, $rect.centerY)
    point_ = this.cameraPoint2Window(point_)
    rect_.width *= scale_
    rect_.height *= scale_
    rect_.centerX = point_.x
    rect_.centerY = point_.y
    return rect_
  }

  /**
   * 正常区域转摄像机区域转（二者在视觉上重合）
   * @param $rect 未被被摄像机的缩放和偏移的视觉区域
   *
   * @return  被摄像机的缩放和偏移后的视觉区域
   */
  public windowRect2Camera($rect: Rectangle): Rectangle {
    const rect_ = Rectangle.Clone($rect)
    const scale_: number = this.getScale()
    let point_ = new Point($rect.centerX, $rect.centerY)
    point_ = this.windowPoint2Camera(point_)
    rect_.width /= scale_
    rect_.height /= scale_
    rect_.centerX = point_.x
    rect_.centerY = point_.y
    return rect_
  }

  /**
   * 正常坐标转摄像机坐标（二者在视觉上重合）
   * @param $rect 未被被摄像机的缩放和偏移的坐标
   *
   * @return  被摄像机的缩放和偏移后的坐标
   */
  public windowPoint2Camera($pos: Point): Point {
    const point_ = new Point()
    let rect_cam_ = this.getCameraRect()
    const scale_: number = this.getScale()
    let dx_ = ($pos.x - window.innerWidth / 2) / scale_
    let dy_ = ($pos.y - window.innerHeight / 2) / scale_
    point_.x = rect_cam_.centerX + dx_
    point_.y = rect_cam_.centerY + dy_
    return point_
  }

  /**
   * 摄像机坐标转正常坐标（二者在视觉上重合）
   * @param $rect 被摄像机的缩放和偏移后的坐标
   *
   * @return  未被被摄像机的缩放和偏移的坐标
   */
  public cameraPoint2Window($pos: Point): Point {
    const point_ = new Point()
    const scale_: number = this.getScale()
    let rect_cam_ = this.getCameraRect()

    let dx_ = ($pos.x - rect_cam_.centerX) * scale_
    let dy_ = ($pos.y - rect_cam_.centerY) * scale_
    point_.x = window.innerWidth / 2 + dx_
    point_.y = window.innerHeight / 2 + dy_
    return point_
  }

  //移入移出效果
  /**
   * 滑入场景
   * @param $direction    滑入方向    枚举值为
   * @param $duration     滑动时间    单位为ms
   * @param $ease         缓动函数    枚举同Phaser.Tween.TweenDataConfig.ease
   *
   * @see Phaser.Tweens.Tween
   * @see VP.EventTypes
   *
   * 引发事件：
   *    VP.EventTypes.ScrollInStart
   *    VP.EventTypes.ScrollInOut
   */
  public scrollIn($direction: string, $duration: integer = 1000, $ease: string = null): void {
    if (this._scrolling) {
      return
    }
    const config_ = {
      targets: this.camera,
      duration: $duration,
      onCompleteScope: this,
      onCompleteParams: [EventTypes.ScrollInEnd],
      onComplete: this.onScroll
    }
    if ($ease) {
      config_['ease'] = $ease
    }
    const rect_ = this._rect_camera
    switch ($direction) {
      case AlignType.Left:
        this.camera.scrollX = rect_.x + rect_.width
        config_['scrollX'] = rect_.x
        break
      case AlignType.Right:
        this.camera.scrollX = rect_.x - rect_.width
        config_['scrollX'] = rect_.x
        break
      case AlignType.Top:
        this.camera.scrollY = rect_.y + rect_.height
        config_['scrollY'] = rect_.y
        break
      case AlignType.Bottom:
        this.camera.scrollY = rect_.y - rect_.height
        config_['scrollY'] = rect_.y
        break
    }
    this.camera.scene.tweens.add(config_)
    this.emit(EventTypes.ScrollInStart)
  }

  /**
   * 滑处场景
   * @param $direction    滑处方向    枚举值为
   * @param $duration     滑动时间    单位为ms
   * @param $ease         缓动函数    枚举同Phaser.Tween.TweenDataConfig.ease
   *
   * @see Phaser.Tweens.Tween
   * @see VP.EventTypes
   *
   * 引发事件：
   *    VP.EventTypes.ScrollInStart
   *    VP.EventTypes.ScrollInOut
   */
  public scrollOut($direction: string, $duration: integer = 1000, $ease: string = null): void {
    if (this._scrolling) {
      return
    }
    this._scrolling = true
    const config_ = {
      targets: this.camera,
      duration: $duration,
      onCompleteScope: this,
      onCompleteParams: [EventTypes.ScrollOutEnd],
      onComplete: this.onScroll
    }
    if ($ease) {
      config_['ease'] = $ease
    }
    const rect_ = this._rect_camera
    switch ($direction) {
      case AlignType.Left:
        config_['scrollX'] = rect_.x + rect_.width
        break
      case AlignType.Right:
        config_['scrollX'] = rect_.x - rect_.width
        break
      case AlignType.Top:
        config_['scrollY'] = rect_.y + rect_.height
        break
      case AlignType.Bottom:
        config_['scrollY'] = rect_.y - rect_.height
        break
    }
    this.camera.scene.tweens.add(config_)
    this.emit(EventTypes.ScrollOutStart)
  }

  private onScroll($tween: any, $targets: any, $type: string): void {
    this._scrolling = false
    this.emit($type)
  }
}

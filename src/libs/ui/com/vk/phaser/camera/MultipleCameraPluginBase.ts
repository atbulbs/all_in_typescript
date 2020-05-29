import Rectangle = Phaser.Geom.Rectangle
import GameObject = Phaser.GameObjects.GameObject
import Camera = Phaser.Cameras.Scene2D.Camera
import EventEmitter = Phaser.Events.EventEmitter
import { EventTypes } from '../enum/EventTypes'
import CameraPluginBase from './CameraPluginBase'

/**
 * MultipleCameraPluginBase.ts
 *
 *
 *     creat on:   2019/04/28 19:25:00
 *
 * 多摄像机控制器基础抽象类
 */
export default abstract class MultipleCameraPluginBase extends CameraPluginBase {
  protected _children: any = []

  /**
   * 构造函数
   * @param $camera           摄像机
   * @param $windowWidth      画布宽度
   * @param $windowHeight     画布高度
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
    this.refuse()
  }

  /**
   * 添加GameObject
   * @param $c        GameObject  要添加的子显示对象
   * @param $emit     是否外抛事件
   *
   * event   添加成功时派发事件: EventTypes.AddChild
   *
   * @see com.zw.const.EventTypes.AddChild
   */
  public addChild($c: GameObject, $emit: boolean = true): boolean {
    if (!$c || this.hasChild($c)) {
      return false
    }
    this._children.push($c)
    this.refuse()
    if ($emit) {
      this.emit(EventTypes.AddChild, this)
    }
    return true
  }

  /**
   * 添加GameObject
   *
   * @param $c    GameObject,要添加的子显示对象
   *
   * @return boolean  是否成功添加
   *
   * Event:   添加成功时派发事件: EventTypes.AddChild
   */
  public addChildren($c): boolean {
    let b: boolean = false
    for (let i = 0; i < $c.length; i++) {
      let a = this.addChild($c[i], false)
      if (a) {
        b = true
      }
    }
    if (b) {
      this.refuse()
      this.emit(EventTypes.AddChild, this)
    }
    return b
  }

  /**
   * 删除GameObject
   *
   * @param $c        GameObject[],要删除的子显示对象数组
   * @param $emit     是否外抛事件
   *
   * @return boolean  是否删除成功
   *
   * Event:   添加成功时派发事件: EventTypes.RemoveChild
   */
  public renmoveChild($c: GameObject, $emit: boolean = true): boolean {
    let i_ = this._children.indexOf($c)
    if (!$c || i_ < 0) {
      return false
    }
    this._children.splice(i_, 1)
    this.refuse()
    if ($emit) {
      this.emit(EventTypes.RemoveChild, $c)
    }
    return true
  }

  /**
   * 删除GameObject
   *
   * @param $c    GameObject[],要删除的子显示对象数组
   *
   * @return boolean  是否删除成功
   *
   * Event:   添加成功时派发事件: EventTypes.RemoveChild
   */
  public removeChildren($c: GameObject[]): boolean {
    let b: boolean = false
    for (let i = 0; i < $c.length; i++) {
      let a = this.renmoveChild($c[i], false)
      if (a) {
        b = true
      }
    }
    if (b) {
      this.refuse()
      this.emit(EventTypes.RemoveChild)
    }
    return b
  }

  /**
   * 删除所有GameObject
   * */
  public removeAll(): void {
    if (this._children.length) {
      this._children.splice(0)
      this.refuse()
      this.emit(EventTypes.RemoveChild)
    }
  }

  /**
   * 判断是否含有某个GameObject
   *
   * @param $child GameObject     要判断的游戏对象
   *
   * @return  此摄像机渲染序列是否包此GameObject
   */
  public hasChild($child: GameObject): boolean {
    const bool_ = this._children.indexOf($child) > -1
    return bool_
  }

  /**
   * 获取此摄像机渲染的对象列表
   */
  public children(): GameObject[] {
    return this._children
  }

  /**
   * 对当前场景下所有游戏对象进行检查
   * 将非此摄像机渲染队内的游戏对象标记排除当前摄像机
   * 检查渲染队列中的游戏对象是否正在被渲染，如果没有，则取消其渲染排除中对此摄像机的标记。
   */
  public refuse(): void {
    if (!this.camera || !this.camera.scene) {
      return
    }

    let a_ = this.camera.scene.children.getChildren()
    let arr_ = []
    for (let i = 0; i < a_.length; i++) {
      if (!this.hasChild(a_[i])) {
        arr_.push(a_[i])
      } else {
        this.unIgnore(a_[i])
      }
    }
    this.camera.ignore(arr_)
  }

  /**
   * 销毁
   */
  public destroy(): void {
    this.removeAll()
    this.removeAllListeners()
    this.camera = null
  }

  private unIgnore($entry: any): void {
    let id_ = this.camera.id
    if ($entry.isParent) {
      let a = $entry.getChildren()
      for (let i = 0; i < a.length; i++) {
        this.unIgnore(a[i])
      }
    } else {
      let i_ = id_ & $entry.cameraFilter
      if (i_ > 0) {
        $entry.cameraFilter -= id_
      }
    }
  }
}

import MultipleCameraPluginBase from './MultipleCameraPluginBase'
import { EventTypes } from '../enum/EventTypes'

/**
 * CameraPluginManager.ts
 *
 *
 *     creat on:   2019/04/29 18:40:38
 *
 * CameraPlugin管理器，每个Scene一个
 */
export default class CameraPluginManager {
  private _arr = []

  private onCamera($camera: MultipleCameraPluginBase): void {
    for (let i = 0; i < this._arr.length; i++) {
      let camera_: MultipleCameraPluginBase = this._arr[i]
      if (camera_ != $camera) {
        camera_.refuse()
      }
    }
  }

  /**
   * 添加某CameraPlugin
   * @param $camera 要添加的CameraPlugin
   */
  public add($camera: MultipleCameraPluginBase): void {
    if (!$camera || this.hasCamera($camera)) {
      return
    }
    this._arr.push($camera)
    let that: CameraPluginManager = this
    $camera.on(EventTypes.AddChild, function($cam: MultipleCameraPluginBase) {
      that.onCamera.call(that, $cam)
    })
  }

  /**
   * 移除一个CameraPlugin
   * @param $cam  要被移除的CameraPlugin
   */
  public remove($cam: MultipleCameraPluginBase): void {
    if (!$cam) {
      return
    }
    let i_ = this._arr.indexOf($cam)
    if (i_ < 0) {
      return
    }
    $cam.off(EventTypes.AddChild, this.onCamera, this, false)
    this._arr.splice(i_, 1)
  }

  /**
   * 销毁
   */
  public destroy(): void {
    while (this._arr.length) {
      let cam_: MultipleCameraPluginBase = this._arr.shift()
      cam_.destroy()
    }
  }

  /**
   * 判断是否含有某个CameraPlugin
   * @param $cam    要检测的CamePlugin
   */
  public hasCamera($cam: MultipleCameraPluginBase): boolean {
    const bool_ = this._arr.indexOf($cam) > -1
    return bool_
  }
}

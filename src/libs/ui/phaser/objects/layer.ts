/**
 * @description 浮层对象
 * @author
 * @since   2019.03.22
 */

import UTILS from '../shared/utils'
import Container from './container'
import Info from '../interface/iPositionInfo'

export default class Layer extends Phaser.GameObjects.Container {
  protected currentScene: Phaser.Scene
  private info: Info
  private customOriginX: number = 0.5
  private customOriginY: number = 0.5
  private rewriteX: number = 0
  private rewriteY: number = 0
  private layer: Container

  public getRewriteX(): number {
    return this.rewriteX
  }

  public getRewriteY(): number {
    return this.rewriteY
  }

  public getLayer(): Container {
    return this.layer
  }

  constructor(
    scene: Phaser.Scene,
    container: Phaser.Scene | Phaser.GameObjects.Container,
    info: Info
  ) {
    super(scene, 0, 0, [])

    // variables
    this.currentScene = scene
    this.info = info
    // 放进去
    UTILS.intoContainer(this, container)
    // 设置原点
    if (info.originX !== undefined) this.customOriginX = info.originX
    if (info.originY !== undefined) this.customOriginY = info.originY
    // 设置矫正值
    if (info.w !== undefined) this.rewriteX = info.w * this.customOriginX
    if (info.h !== undefined) this.rewriteY = info.h * this.customOriginY
    // 定位
    UTILS.setPosition(this, info)

    this.initLayer()
  }

  // 初始化浮层
  private initLayer(): void {
    // 设置初始化参数
    const layerInfo: Info = UTILS.deepCopy(this.info)
    layerInfo.position = 'auto'
    if (this.rewriteX !== undefined) layerInfo.x = -this.rewriteX
    if (this.rewriteY !== undefined) layerInfo.y = -this.rewriteY

    // 初始化
    this.layer = new Container(this.currentScene, this, layerInfo)
  }
}

/**
 * @description 图片对象
 * @author
 * @since   2019.03.08
 */

import ImgInfo from '../interface/imgInfo'
import UTILS from '../shared/utils'

export default class Sprite extends Phaser.GameObjects.Sprite {
  private rewriteX: number = 0
  private rewriteY: number = 0

  public getRewriteX(): number {
    return this.rewriteX
  }

  public getRewriteY(): number {
    return this.rewriteY
  }

  constructor(
    scene: Phaser.Scene,
    container: Phaser.Scene | Phaser.GameObjects.Container,
    info: ImgInfo
  ) {
    super(scene, 0, 0, info.name, info.frame)
    // 放进去
    UTILS.intoContainer(this, scene)
    UTILS.intoContainer(this, container)
    // 设置原点
    const originX = info.originX !== undefined ? info.originX : this.originX
    const originY = info.originY !== undefined ? info.originY : this.originY
    this.setOrigin(originX, originY)
    // 设置大小
    UTILS.setSize(this, container, info.w, info.h, info.fit)
    // 设置矫正值
    this.rewriteX = this.width * this.originX
    this.rewriteY = this.height * this.originY
    // 定位
    UTILS.setPosition(this, info)
  }
}

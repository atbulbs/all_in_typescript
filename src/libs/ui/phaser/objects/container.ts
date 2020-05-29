/**
 * @description 容器对象
 * @author
 * @since   2019.03.08
 */
import Info from '../interface/iPositionInfo'
import UTILS from '../shared/utils'

export default class Container extends Phaser.GameObjects.Container {
  protected currentScene: Phaser.Scene
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
    info: Info,
    children?: Array<any>
  ) {
    super(scene, 0, 0, children)
    // variables
    this.currentScene = scene
    // 放进去
    UTILS.intoContainer(this, container)
    // 设置大小
    UTILS.setSize(this, container, info.w, info.h)
    // 定位
    UTILS.setPosition(this, info)
  }

  // 测试模式，用于确认容器尺寸及坐标
  public testMode(color: number = 0xff0000): void {
    const graphic = this.currentScene.add.graphics({})
    graphic.fillRoundedRect(0, 0, this.width, this.height, 0)
    graphic.fillStyle(color, 1)
    this.add(graphic)
  }
}

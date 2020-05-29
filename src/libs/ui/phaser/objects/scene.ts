/**
 * @description 基础场景
 * @author
 * @since   2019.03.13
 */

import 'phaser'
import CONSTS from '../shared/consts'
import UTILS from '../shared/utils'

export default class Scene extends Phaser.Scene {
  // 最上层基础容器
  protected container: Phaser.GameObjects.Container
  protected ratio: number = 1
  private displayWidth: number = 375
  private displayHeight: number = 603

  constructor(config: any, displayWidth?: number, displayHeight?: number) {
    super(config)

    if (displayWidth !== undefined) this.displayWidth = displayWidth
    if (displayHeight !== undefined) this.displayHeight = displayHeight
  }

  // 初始化容器
  protected initContainer() {
    // 设置"设备/设计稿比例"
    UTILS.setDesignSize(this.displayWidth, this.displayHeight)
    UTILS.setDeviceDesignRatio()

    // 保存当前场景的缩放比例
    this.ratio = UTILS.getDeviceDesignRatio()

    // 初始化最上层基础容器
    this.container = this.add.container(0, 0, [])

    // 设置最上层基础容器尺寸
    this.container.setSize(this.displayWidth, this.displayHeight)
    this.container.setDisplaySize(this.displayWidth, this.displayHeight)

    // 缩放最上层基础容器
    this.container.setScale(CONSTS.DEVICE_DESIGN_RATIO)

    // 定位最上层基础容器
    const width = this.sys.canvas.width / this.game.config.resolution
    const height = this.sys.canvas.height / this.game.config.resolution
    this.container.x = width / 2 - this.container.displayWidth / 2
    this.container.y = height / 2 - this.container.displayHeight / 2
  }
}

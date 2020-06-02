/**
 * @description 模态框组件, 全屏浮层
 */

import BaseScene from '../scenes/base_scene'

export default class Modal extends Phaser.GameObjects.Container {

  background: Phaser.GameObjects.Rectangle

  constructor (scene: BaseScene) {
    super(scene, 0, 0)
    scene.add.existing(this)
    const { left, top, width, height } = scene.background
    // const backgroundGraphics = scene.add.graphics()
    // backgroundGraphics.fillStyle(0x000000, .7)
    // backgroundGraphics.fillRect(left, top, width, height)

    this.background = scene.add.rectangle(left, top, width, height, 0x000000, .7)
    this.background.setInteractive()
    this.background.on('pointerdown', () => {
      console.warn('ppp')
      // this.hide()
    })
  }

  show () {
    this.background.setAlpha(.7)
  }

  hide () {
    this.background.setAlpha(0)
  }

}
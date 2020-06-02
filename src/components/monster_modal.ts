/**
 * @description 怪兽模态框
 */

import Modal from './modal'

export default class MonsterModal extends Phaser.GameObjects.Container {

  modal: Modal
  handleHide: Function

  constructor (scene) {
    super(scene)
    this.modal = new Modal(scene)
    scene.add.existing(this)

    console.warn('scene.background', scene.background)

    if (!scene.anims.exists('monsterShowSpriteAnimas1')) {
      const frames = scene.anims.generateFrameNames("monsterShowSpriteAnimas1", { start: 0, end: 51, zeroPad: 2, prefix:'show_page1_', suffix:'.png' })
      scene.anims.create({ key: "monsterShowSpriteAnimas1", frames: frames, frameRate: 24 })
    }
    // 小怪兽帧动画 - 显示2
    if (!scene.anims.exists('monsterShowSpriteAnimas2')) {
      const frames = scene.anims.generateFrameNames("monsterShowSpriteAnimas2", { start: 0, end: 25, zeroPad: 2, prefix:'show_page2_', suffix:'.png' })
      scene.anims.create({ key: "monsterShowSpriteAnimas2", frames: frames, frameRate: 24, repeat: -1 })
    }

    const _monster = scene.add.sprite(375 / 2, 667 - 200, 'monsterShowSpriteAnimas1', 'show_page1_00.png')
    _monster.setScale(1.3).setDepth(3)
    _monster.anims.play("monsterShowSpriteAnimas1")

    this.add(_monster)

    const _timer = setTimeout(() => {
      _monster.setPosition(375 / 2, 667 - 100)
      _monster.anims.play("monsterShowSpriteAnimas2")
    }, 2000)

    _monster.setInteractive({
      useHandCursor: true
    })

    _monster.on('pointerup', () => {
      this.modal.hide()
      clearTimeout(_timer)
      const _y = document.documentElement.clientHeight
      scene.tweens.add({
        targets: _monster,
        y: _y,
        alpha: 0,
        duration: 600
      })
      this.handleHide()
    }, this)
  }

  onHide (handleHide) {
    this.handleHide = handleHide
  }



}
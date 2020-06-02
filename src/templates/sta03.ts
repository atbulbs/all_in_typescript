/**
 * @description sta03模板 图片四选一
 * @type
 *  1. 文案 + 音频
 *  2. 音频
 *
 *  选项数量2-4, 只有一个正确选项, 其他为干扰项
 *
 * 细节:
 * 选项数量2, 3时布局
 * 选项排序随机
 *
 * 选择错误, 提示错误, 标出正确选项, 同时出现下一步按钮
 * 选择正确, 提示正确, 自动进入下一步
 */

import BaseTemplate from './base_template'
import AudioPlayer from '../components/audio_player'
import { FONT_FAMILY } from '../shared/constants'

export default class Sta03 extends Phaser.GameObjects.Container implements BaseTemplate {
  handleSubmit: Function = () => {}
  audioPlayer: AudioPlayer
  config
  parent
  position
  rootContainer
  interactiveElements: Array<any> = []
  isAlive: boolean = true

  constructor (scene: Phaser.Scene, parent: Phaser.GameObjects.Container, config) {
    super(scene, 0, 0)
    this.scene.add.existing(this)
    this.config = config
    this.parent = parent
    this.parent.add(this)
    this.config = {
      text: 'shine',
      sound: 'mock_shine',
      selections: [
        {
          image: 'mock_book',
          key: 'book',
        },
        {
          image: 'mock_car',
          key: 'car',
        },
        {
          image: 'mock_shine',
          key: 'shine',
        },
        {
          image: 'mock_letters',
          key: 'letters',
        },
      ]
    }
    this.position = [
      {
        x: 40.5,
        y: 215,
      },
      {
        x: 180,
        y: 215,
      },
      {
        x: 40.5,
        y: 355,
      },
      {
        x: 180,
        y: 355,
      },
    ]
    this.build()
    this.on('destroy', () => {
      this.handleDestroy()
    })
  }

  build () {
    if (this.config.text) {
      const text = this.scene.add.text(345 / 2, 83.5 + 42 / 2, this.config.text, {
        color: '0x353535',
        fontSize: 30,
        fontFamily: FONT_FAMILY,

      }).setOrigin(.5)
      this.add(text)
    }
    this.audioPlayer = new AudioPlayer(this.scene, this, 345 / 2, 135.5 + 55 / 2, this.config.sound)
    this.config.selections.forEach((item, index) => {
      const x = this.position[index].x
      const y = this.position[index].y
      const img = this.scene.add.image(x + 125 / 2, y + 125 / 2, item.image)
      img.setDisplaySize(123, 123)
      img.setOrigin(0.5, 0.5)
      this.add(img)
      const graphics = this.scene.add.graphics()
      graphics.lineStyle(4, 0xE5E2D3)
      const line = graphics.strokeRoundedRect(x, y, 125, 125, 8)
      this.add(line)
      img.setInteractive()
      this.interactiveElements.push(img)
      img.on('pointerdown', () => {
        this.handleSelect(item, x, y)
      })
    })
  }

  playAudio () {
    this.audioPlayer.play()
  }

  handleSelect (item, x, y) {
    if (item.key === this.config.text) {
      const graphics = this.scene.add.graphics()
      graphics.lineStyle(4, 0x2cbe6e)
      const line = graphics.strokeRoundedRect(x, y, 125, 125, 8)
      this.add(line)
      this.handleSubmit({
        isRight: true,
      })
    } else {
      const graphics = this.scene.add.graphics()
      graphics.lineStyle(4, 0xF56327)
      const line = graphics.strokeRoundedRect(x, y, 125, 125, 8)
      this.add(line)
      this.handleSubmit({
        isRight: false,
      })
      this.tip()
      setTimeout(() => {
        if (this.isAlive) {
          this.reset()
        }
      }, 2000)
    }
  }

  // 提醒
  tip () {
    this.config.selections.forEach((item, index) => {
      const x = this.position[index].x
      const y = this.position[index].y
      if (item.key === this.config.text) {
        const graphics = this.scene.add.graphics()
        graphics.lineStyle(4, 0x2cbe6e)
        const line = graphics.strokeRoundedRect(x, y, 125, 125, 8)
        this.add(line)
      }
    })
  }

  // 重置
  reset () {
    this.config.selections.forEach((item, index) => {
      const x = this.position[index].x
      const y = this.position[index].y
      const graphics = this.scene.add.graphics()
      graphics.lineStyle(4, 0xE5E2D3)
      const line = graphics.strokeRoundedRect(x, y, 125, 125, 8)
      this.add(line)
    })
  }

  // 提交
  onSubmit (handleSubmit) {
    this.handleSubmit = handleSubmit
  }

  // 销毁
  handleDestroy () {
    console.warn('销毁')
    this.isAlive = false
  }

}
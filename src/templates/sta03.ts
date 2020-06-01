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

export default class Sta03 implements BaseTemplate {
  cb
  data
  scene: Phaser.Scene
  parent

  constructor (scene, parent, data) {
    this.scene = scene
    this.data = data
    this.parent = parent

    this.data = {
      text: 'shine',
      sound: 'mock_shine',
      selections: [
        {
          image: 'mock_book',
          key: 'book',
        },
        {
          image: 'mock_car',
          key: 'mock_car',
        },
        {
          image: 'mock_shine',
          key: 'mock_shine',
        },
        {
          image: 'mock_letters',
          key: 'mock_letters',
        },
      ]
    }

    this.build()
  }

  build () {
    const text = this.scene.add.text(345 / 2, 83.5 + 42 / 2, this.data.text, {
      color: '0x353535',
      fontSize: '30px',
    }).setOrigin(.5)
    this.parent.add(text)
    new AudioPlayer(this.scene, this.parent, 345 / 2, 135.5 + 55 / 2, this.data.sound)
    const position = [
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
    this.data.selections.forEach((item, index) => {

    })
  }

  check () {


  }

  onSubmit (cb) {
    this.cb = cb
  }
}
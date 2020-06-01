/**
 * @description 基础场景
 */

// import { VP } from '../../../../workspace/vk-micro-sdk-game/src/vk-micro-sdk-game'
import { VP } from '../libs/ui/index'
import BaseScene from './base_scene'

export default class ReadScene extends BaseScene {

  constructor () {
    super('ReadScene')
  }

  create () {
    this.fitScreen()
    const { top, left, width, height } = this.background
    this.add.rectangle(top, left, width, height, 0x6666ff)
    this.add.text(375 / 2, 667 / 2 + 30, 'ReadScene', {
      color: '0xff0000',
      fontSize: '18px'
    }).setOrigin(.5)

    const nextBtn = this.add.image(375 / 2, 500, 'nextImage')
    nextBtn.setOrigin(.5, .5)
    nextBtn.setDisplaySize(375 / 4, 375 / 4)

    const clickSound = this.sound.add('clickSound')

    nextBtn.setInteractive()
    nextBtn.on('pointerdown', () => {
      clickSound.play()
      this.navigator.push('WriteScene')
    })


  }

}
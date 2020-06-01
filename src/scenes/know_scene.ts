/**
 * @description 认场景
 */

// import { VP } from '../../../../workspace/vk-micro-sdk-game/src/vk-micro-sdk-game'
import { VP } from '../libs/ui/index'
import BaseScene from './base_scene'
import Sta01 from '../templates/sta01'
import Sta03 from '../templates/sta03'

export default class KnowScene extends BaseScene {

  constructor () {
    super('KnowScene')
  }

  create () {
    this.fitScreen()


    const backgroundGraphics = this.add.graphics()
    const { left, top, width, height } = this.background
    backgroundGraphics.fillStyle(0x86E7BC, 1)
    backgroundGraphics.fillRect(left, top, width, height)

    const graphics = this.add.graphics()
    graphics.fillStyle(0xFFFCEC, 1)
    const contentBackground = graphics.fillRoundedRect(0, 0, 345, 505, 10)
    const contentContainer = this.add.container(15, 93.5)
    contentContainer.add(contentBackground)


    // const contentBackground = this.add.rectangle(0, 0, 100, 100, 0xff0000)
    // // contentBackground.setOrigin(.5)
    // contentContainer.add(contentBackground)

    // this.add.rectangle(top, left, width, height, 0x9966ff)



    // this.add.text(375 / 2, 667 / 2 + 30, 'KnowScene', {
    //   color: '0xff0000',
    //   fontSize: '18px'
    // }).setOrigin(.5)

    // const nextBtn = this.add.image(375 / 2, 500, 'nextImage')
    // nextBtn.setOrigin(.5, .5)
    // nextBtn.setDisplaySize(375 / 4, 375 / 4)

    // const clickSound = this.sound.add('clickSound')

    // nextBtn.setInteractive()
    // nextBtn.on('pointerdown', () => {
    //   clickSound.play()
    //   this.navigator.push('ReadScene')
    // })



    const sta01 = new Sta01(this, contentContainer, {})
    const sta03 = new Sta03(this, contentContainer, {})


  }

}
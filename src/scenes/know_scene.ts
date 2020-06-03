/**
 * @description 认场景
 */

// import { VP } from '../../../../workspace/vk-micro-sdk-game/src/vk-micro-sdk-game'
import { VP } from '../libs/ui/index'
import BaseScene from './base_scene'
import MonsterModal from '../components/monster_modal'
import Sta01 from '../templates/sta01'
import Sta03 from '../templates/sta03'
import Wtd01 from '../templates/wtd01'

import Particles from '../components/particles'

export default class KnowScene extends BaseScene {

  private _sectionList: Array<any> = []

  templateConainer

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
    this.templateConainer = this.add.container(15, 93.5)
    this.templateConainer.add(contentBackground)


    // const contentBackground = this.add.rectangle(0, 0, 100, 100, 0xff0000)
    // // contentBackground.setOrigin(.5)
    // templateConainer.add(contentBackground)

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


    // 文字四选一模板
    // const sta01 = new Sta01(this, this.templateConainer, {})
    // sta01.onSubmit(res => {
    //   this.handleSubmit(res)
    //   if (res.isCorrect) {
    //     // sta01.destroy()
    //   }
    // })


    // 图片四选一模板
    // const sta03 = new Sta03(this, this.templateConainer, {})
    // sta03.onSubmit(res => {
    //   this.handleSubmit(res)
    //   if (res.isCorrect) {
    //     sta03.destroy()
    //   }
    // })
    // const particles = new Particles(this)
    // new MonsterModal(this).onHide(() => {
    //   // sta03.playAudio()
    //   particles.show()
    // })

    // 填空题
    const wtd01 = new Wtd01(this, this.templateConainer, {})
    wtd01.onSubmit(res => {
      this.handleSubmit(res)
      if (res.isCorrect) {
        // wtd01.destroy()
      }
    })



  }

  // 处理模板的提交
  handleSubmit (res) {
    console.warn('res', res)
  }

}
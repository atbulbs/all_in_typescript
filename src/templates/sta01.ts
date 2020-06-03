/**
 * @description sta01模板 文字四选一
 * @type
 *  1. 图片 + 音频
 *  2. 图片
 *  3. 图片 + 文案
 *  4. 文案
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

import Container = Phaser.GameObjects.Container
import Image = Phaser.GameObjects.Image
import Text = Phaser.GameObjects.Text
import Base from './base_template'
import { FONT_FAMILY } from '../shared/constants'
const rextagtext = window['rextagtext']
// https://codepen.io/rexrainbow/pen/KRaOpb?__cf_chl_jschl_tk__=311690ef46ccfb98fd2c43d90cfb28dcb11f384b-1591084369-0-AZWdQsJrHFpsG3J0IGixoGU_NeTUX_YFor1NIGMmTqAePI_jzbK2QQ2wlLzdlFF21ynG8KeVVBfC1mSKBYFIafnP7fgDbrWsZD3IYdfnC6wDPJC9hnm-PEAVXtrFS_atchP6vcT_9e3V8aslS34nXz9SGno0m5mWkeOfhXpkZdpuiN0u_uqFliqzbcEk9LCTA6VzqGoCLsu4dwMGdfR8hDndsnRz0U7cnyLcJSo1gHjnrqc1FDbWFt9VrP_-9ze1TUGN1kHA-fIO5j_LUCXiATZYnei5cCGALUikja_MxVXzNo2lD8t8wceooR2gg8uMTdgvOmIdVHgbZGoHYPPQTG7niZVCGcvmaYvvn6qTgRKW
// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tagtext/

export default class Sta01 extends Container implements Base {
  handleSubmit
  parent
  config
  answerIndex
  answerText
  blankText
  isAlive: boolean = true
  timer


  constructor (scene, parent, config) {
    super(scene, 0, 0)
    this.scene.add.existing(this)
    config = {
      text: 'When I was young I\'d listen to the radio, Waiting for my <class="highlight">     </class> songs, When they played I\'d sing along, it made me smile.',
      sound: 'shine',
      answerKey: 'a',
      selections: [
        {
          text: 'favorite',
          key: 'a'
        },
        {
          text: 'like',
          key: 'b'
        },
        {
          text: 'love',
          key: 'c'
        },
        {
          text: 'happy',
          key: 'd'
        },
      ]
    }
    this.answerText = 'When I was young I\'d listen to the radio, Waiting for my <class="highlight">favorite</class> songs, When they played I\'d sing along, it made me smile.'
    this.config = config
    this.parent = parent
    this.parent.add(this)
    this.build()
    this.on('destroy', () => {
      this.handleDestroy()
    })
  }

  build () {
    this.blankText = new rextagtext(
      this.scene,
      30,
      89,
      this.config.text,
      {
        fontSize: 19,
        align: 'left',
        fontFamily: FONT_FAMILY,
        color: '#393222',
        lineSpacing: (53 - 38) / 2,
        wrap: {
          mode: 'word', // 0|'none'|1|'word'|2|'char'|'character'
          width: 569 / 2
        },
        tags: {
          highlight: {
            color: '#F86D10',
            underline: {
              color: '#393222',
              thinkness: 2,
              offset: 2
            }
          }
        }
      }
    )
    this.add(this.blankText)
    const positionY = [243, 304, 365, 426]
    const x = 25
    const width = 295
    const height = 49
    const radius = 49 / 2
    this.config.selections.forEach((item, index) => {
      if (item.key === this.config.answerKey) {
        this.answerIndex = index
      }
      const y = positionY[index]

      const itemContainer = this.scene.add.container(x, y)
      itemContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains)
      itemContainer.setName('itemContainer' + index)
      this.add(itemContainer)

      // 默认背景
      const defaultGraphics = this.scene.add.graphics()
      defaultGraphics.fillStyle(0xFDF2AD, 1)
      const defaultBackground = defaultGraphics.fillRoundedRect(0, 0, width, height, radius)
      defaultBackground.setName('defaultBackground')
      itemContainer.add(defaultBackground)
      // 错误背景
      const wrongGraphics = this.scene.add.graphics()
      wrongGraphics.fillStyle(0xF86D10, 1)
      const wrongBackground = wrongGraphics.fillRoundedRect(0, 0, width, height, radius)
      wrongBackground.setAlpha(0)
      wrongBackground.setName('wrongBackground')
      itemContainer.add(wrongBackground)

      // 正确背景
      const correctGraphics = this.scene.add.graphics()
      correctGraphics.fillStyle(0x2CBE6E, 1)
      const correctBackground = correctGraphics.fillRoundedRect(0, 0, width, height, radius)
      correctBackground.setAlpha(0)
      correctBackground.setName('correctBackground')
      itemContainer.add(correctBackground)

      const content = this.scene.add.text(width / 2, 49 / 2, item.text, {
        color: '0x353535',
        fontSize: 17,
        fontFamily: FONT_FAMILY,
      })
      content.setOrigin(.5, .5)
      content.setName('content')
      itemContainer.add(content)

      const star1 = this.scene.add.image(width - 10, -3, 'correct_star')
      star1.setOrigin(.5)
      star1.setDisplaySize(17 / 2, 17 / 2)
      star1.setAlpha(0)
      star1.setName('star1')
      itemContainer.add(star1)
      const star2 = this.scene.add.image(width, 0, 'correct_star')
      star2.setOrigin(.5)
      star2.setDisplaySize(29 / 2, 29 / 2)
      star2.setAlpha(0)
      star2.setName('star2')
      itemContainer.add(star2)
      const star3 = this.scene.add.image(width, height, 'correct_star')
      star3.setOrigin(.5)
      star3.setDisplaySize(17 / 2, 17 / 2)
      star3.setAlpha(0)
      star3.setName('star3')
      itemContainer.add(star3)

      itemContainer.on('pointerdown', () => {
        if (this.isAlive) {
          itemContainer.once('pointerup', () => {
            this.isAlive = false
            if (index === this.answerIndex) {
              this.handleCorrect()
            } else {
              this.handleWrong(index)
            }
            console.warn('index', index)
          })
        }
      })
    })
  }

  handleWrong (index) {
    const itemContainer: Container = this.getByName('itemContainer' + this.answerIndex) as Container
    const correctBackground: Container = itemContainer.getByName('correctBackground') as Container
    correctBackground.setAlpha(1)
    const content: Text = itemContainer.getByName('content') as Text
    console.warn('content', content)
    content.setStyle({
      color: 'white',
      fontSize: 25,
    })
    const wrongItemContainer: Container = this.getByName('itemContainer' + index) as Container
    const wrongBackground: Container = wrongItemContainer.getByName('wrongBackground') as Container
    wrongBackground.setAlpha(1)
    const wrongContent: Text = wrongItemContainer.getByName('content') as Text
    wrongContent.setStyle({
      color: 'white',
    })
    this.handleSubmit({
      isCorrect: false
    })
    this.timer = setTimeout(() => {
      this.isAlive = true
      wrongBackground.setAlpha(0)
      correctBackground.setAlpha(0)
      wrongContent.setStyle({
        color: '0x353535',
      })
      content.setStyle({
        color: '0x353535',
        fontSize: 17,
      })
    }, 2000)
  }

  handleCorrect () {
    const itemContainer: Container = this.getByName('itemContainer' + this.answerIndex) as Container
    const correctBackground: Container = itemContainer.getByName('correctBackground') as Container
    correctBackground.setAlpha(1)
    const star1: Image = itemContainer.getByName('star1') as Image
    star1.setAlpha(1)
    const star2: Image = itemContainer.getByName('star2') as Image
    star2.setAlpha(1)
    const star3: Image = itemContainer.getByName('star3') as Image
    star3.setAlpha(1)
    const content: Text = itemContainer.getByName('content') as Text
    console.warn('content', content)
    content.setStyle({
      color: 'white',
      fontSize: 25,
    })
    this.blankText.setText(this.answerText)
    this.handleSubmit({
      isCorrect: true
    })
  }

  reset () {

  }

  onSubmit (handleSubmit) {
    this.handleSubmit = handleSubmit
  }

  handleDestroy () {
    this.isAlive = false
    window.clearTimeout(this.timer)
  }

}
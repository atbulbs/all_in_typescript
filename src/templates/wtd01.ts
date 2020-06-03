/**
 * @description wtd01 填空
 *
 * 题干：
 * 包含音频、图片、文案
 * 文案字数限制：待定
 * 如果有音频
 * 显示音频播放按钮
 * 音频会自动播放一次
 * 点击音频播放按钮可以切换音频的播放/暂停
 * 每次播放音频都是整个音频重新播放
 *
 * 题目：
 * 单词中缺失部分字母，每个空格对应一个字母或字母组合（1~4个字符）
 * 不论实际缺少了几个字母，每个空格的长度，都以本题字符长度最大的空格为准
 * 如果题目中包含space（例如 ice cream）：对space显示做空位处理
 *
 * 选项：
 * 文案内容，字数限制：1~4个字符
 * 选项数量1~8个，选项和空格一一对应，没有干扰项
 *
 * 作答区域出现和题目空格数量对应的选项，选项顺序打乱
 * 题目里处于选中状态的空格为当前要作答的空格：
 * 默认从第一个空格处于选中状态，选择一个选项后，选项进入选中的空格，选中状态默认推移到下一个没有选项的空格，以此类推
 * 用户也可以点击空格，将此空格手动置位选中状态；如果此空格中已经有选项，选项会被取消
 * 全部空格填完后，可以点击【确定】按钮
 * 如果答题正确，给出答题正确的提示，之后自动进入下一步流程
 * 如果答题错误，给出正确答案，并出现【下一步】按钮，点击进入下一步流程
 * 有未填选项的空格时，【确定】按钮置灰，不可点击
 * 如果选项内容相同，可以选择任何一个作为正确选项
 *
 * 细节:
 */

import Container = Phaser.GameObjects.Container
import Image = Phaser.GameObjects.Image
import Text = Phaser.GameObjects.Text
import Base from './base_template'
import { FONT_FAMILY } from '../shared/constants'
import AudioPlayer from '../components/audio_player'
const rextagtext = window['rextagtext']

export default class Wtd01 extends Container implements Base {
  handleSubmit: Function = () => {}
  audioPlayer: AudioPlayer
  config
  parent
  position
  rootContainer
  interactiveElements: Array<any> = []
  isAlive: boolean = true
  blankText
  textEnCache
  backSpace

  constructor (scene: Phaser.Scene, parent: Phaser.GameObjects.Container, config: Object) {
    super(scene)
    this.scene.add.existing(this)
    this.config = config
    this.parent = parent
    this.parent.add(this)
    this.config = {
      sound: 'shine',
      textCn: '阳光',
      textEn: 'sh<class="highlight">     </class>in<class="highlight">     </class>e',
      answer: ['a', 'bb', 'ccc', 'dddd'],
      selections: [
        {
          text: 'a',
          key: 'a',
        },
        {
          text: 'bb',
          key: 'bb',
        },
        {
          text: 'ccc',
          key: 'ccc',
        },
        {
          text: 'dddd',
          key: 'dddd',
        },
        {
          text: 'ccc',
          key: 'ccc',
        },
        {
          text: 'dddd',
          key: 'dddd',
        },
      ]
    }
    this.textEnCache = this.config.textEn
    this.build()
    this.on('destroy', () => {
      this.handleDestroy()
    })
  }

  // 构建UI
  build (): void {
    // 图片
    const image = this.scene.add.image(110.5, 83.5, 'shine')
    image.setDisplaySize(124.3, 124.3)
    image.setOrigin(0, 0)
    this.add(image)
    // 喇叭
    if (this.config.sound) {
      this.audioPlayer = new AudioPlayer(this.scene, this, (410 + 55) / 2, (306 + 55) / 2, this.config.sound)
    }
    // 中文
    const textCn = this.scene.add.text(345 / 2, 213 + 25, this.config.textCn, {
      color: '0x353535',
      fontSize: 25,
      fontFamily: 'PingFangSC-Regular,PingFang SC',
    }).setOrigin(.5)
    this.add(textCn)
    // 填空英文文本
    this.blankText = new rextagtext(
      this.scene,
      345 / 2,
      278,
      this.config.textEn,
      {
        fontSize: 19,
        align: 'center',
        fontFamily: FONT_FAMILY,
        color: '#393222',
        lineSpacing: (53 - 38) / 2,
        wrap: {
          mode: 'word', // 0|'none'|1|'word'|2|'char'|'character'
          width: 569 / 2
        },
        tags: {
          highlight: {
            color: '#353535',
            underline: {
              color: '#979797',
              thinkness: 1,
              offset: 2
            }
          }
        }
      }
    )
    this.blankText.setOrigin(.5)
    this.add(this.blankText)
    // 回删按钮
    const backSpace = this.scene.add.image(313.5, 278, 'backspace')
    this.backSpace = backSpace
    backSpace.setDisplaySize(29.5, 19)
    backSpace.setOrigin(.5)
    backSpace.setAlpha(0)
    backSpace.setInteractive()
    backSpace.on('pointerdown', () => {
      backSpace.once('pointerup', () => {
        this.textEnCache = this.config.textEn
        this.blankText.setText(this.textEnCache)
        backSpace.setAlpha(0)
      })
    })
    this.add(backSpace)
    // 选项块容器
    const blocksContainer = this.scene.add.container(0, 378)
    this.add(blocksContainer)
    // 选项最多字符数量
    let maxLen = 1
    this.config.answer.forEach(item => {
      maxLen = Math.max(maxLen, item.length)
    })
    const widthArr = [46, 56, 66, 87]
    const width = widthArr[maxLen - 1]
    const marginRight = 8
    const marginBottom = 10
    const height = 46
    const radius = 4
    let x = 0
    let y = 0
    let blockWidth = 0

    this.config.selections.forEach((item, index) => {
      if (index > 0) {
        x += width + marginRight
      }
      // 换行
      if (x >= widthArr[widthArr.length - 1] * 3 + marginRight * 2) {
        x = 0
        y = height + marginBottom
        blocksContainer.y = 324.5
      }
      blockWidth = Math.max(blockWidth, x + width)
      // 背景
      const graphics = this.scene.add.graphics()
      graphics.fillStyle(0xffffff, 1)
      // 边框
      const background = graphics.fillRoundedRect(0, 0, width, height, radius)
      graphics.lineStyle(2, 0xd9d9d9, 1)
      const line = graphics.strokeRoundedRect(0, 0, width, height, radius)
      // 文字
      const content = this.scene.add.text(width / 2, height / 2, item.text, {
        color: '0x353535',
        fontSize: 30,
        fontFamily: 'PingFangSC-Semibold,PingFang SC',
      }).setOrigin(.5)
      // 每个选项的容器
      const blockItemContainer = this.scene.add.container(x, y)
      blockItemContainer.add(background)
      blockItemContainer.add(line)
      blockItemContainer.add(content)
      blockItemContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, width, height), Phaser.Geom.Rectangle.Contains)
      blockItemContainer.on('pointerdown', () => {
        blockItemContainer.once('pointerup', () => {
          this.backSpace.setAlpha(1)
          console.warn('index', index)
          this.textEnCache = this.textEnCache.replace(/\>(\s+)\</, $1 => {
            return '>' + item.text + '<'
          })
          this.blankText.setText(this.textEnCache)
        })
      })
      blocksContainer.add(blockItemContainer)
    })
    // 选项块容器居中
    blocksContainer.x = (345 - blockWidth) / 2




  }

  // 监听提交
  onSubmit (handleSubmit: Function = (res: Object) => {}): void {
    this.handleSubmit = handleSubmit
  }

  // 处理销毁, 移除事件监听
  handleDestroy () {
    console.warn('销毁')
    this.isAlive = false
  }

}
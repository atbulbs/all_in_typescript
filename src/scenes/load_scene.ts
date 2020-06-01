/**
 * @description 加载场景
 */
import BaseScene from './base_scene'

// import { VP } from '../../../../workspace/vk-micro-sdk-game/src/vk-micro-sdk-game'
import { VP } from '../libs/ui/index'
import imagesConfig from '../shared/images_config'
import audiosConfig from '../shared/audios_config'

const deployConfig = require('../../deploy.config')
console.warn('deployConfig', deployConfig)
const publicPath = deployConfig.cdn.publicPath


export default class LoadScene extends BaseScene {

  // 适配缩放比例
  protected zoom: number
  protected backgroundRectX: number = 0
  protected backgroundRectY: number = 0
  protected designWidth: number = 375
  protected designHeight: number = 667
  protected designRatio = 375 / 667
  protected viewRatio = window.innerWidth / window.innerHeight
  protected contentRect: Phaser.Geom.Rectangle
  // protected backgroundRect: Phaser.Geom.Rectangle

  constructor () {
    super('LoadScene')
  }

  create () {
    this.fitScreen()
    this.loadAssets()
  }

  // 构建UI
  build () {


    // const frames = this.anims.generateFrameNames("monsterFailSpriteAnimas", { start: 0, end: 15, zeroPad: 1, prefix:'fail', suffix:'.png' })
    // this.anims.create({ key: "monsterFailSpriteAnimas", frames: frames, frameRate: 14, repeat: -1 })
    // const sprite = this.add.sprite(200, 200, 'monsterDefaultSpriteAnimas')
    // sprite.anims.play("monsterFailSpriteAnimas")

    // const spine = (this.add as any).spine(200, 500, 'monster_spine', 'fail', true)
    // spine.setScale(0.3)
    // const spineContainer = this.add.container(0, 0)
    // spineContainer.add(spine)

    const nextBtn = this.add.image(375 / 2, 500, 'nextImage')
    nextBtn.setOrigin(.5, .5)
    nextBtn.setDisplaySize(375 / 4, 375 / 4)

    const clickSound = this.sound.add('clickSound')

    nextBtn.setInteractive()
    nextBtn.on('pointerdown', () => {
      clickSound.play()
      this.navigator.push('KnowScene')
    })
  }

  transitionIn () {

  }

  // 加载资源
  loadAssets () {
    const {top, left, width, height} = this.background
    this.add.rectangle(top, left, width, height, 0x6666ff)
    this.load.crossOrigin = 'anonymous'
    const pathPrefix = publicPath + 'static/'

    for (const key in imagesConfig) {
      this.load.image(key, imagesConfig[key])
    }
    for (const key in audiosConfig) {
      this.load.audio(key, audiosConfig[key])
    }

    this.load.multiatlas('monsterFailSpriteAnimas', pathPrefix + 'monster_sprite.json')
    this.load.multiatlas('soundPlayAnimas', pathPrefix + 'sound_sprite.json')

    ;(this.load as any).spine('monster_spine', pathPrefix + "monster_spine.json",  pathPrefix + "monster_spine.atlas")

    // const imageUrl = 'https://global.canon/en/environment/bird-branch/img/top-key-tobi-sp.jpg'
    // this.load.image('logo', imageUrl)
    this.load.start()



    const progressText = this.add.text(375 / 2, 667 / 2 + 30, '0%', {
      color: '0xff0000',
      fontSize: '18px'
    }).setOrigin(.5)

    const _r = new Phaser.Geom.Rectangle((375 - 200) / 2, 667 / 2, 200, 16)
    const progressBar = new VP.ProgressBar(this , _r)
    progressBar.setStyle(0xFF6B56 , 0x2E3606, 8)
    progressBar.setValue(0, 1)

    this.load.on('progress', e => {
      const percentage = ((window as any).Math.floor(e * 100)) + '%'
      progressText.setText(percentage)
      const width = e > 0.1 ? e : 0.1
      progressBar.setValue(width, 1)
    })

    this.load.on('complete', () => {
      progressText.setText('100%')
      progressBar.setValue(1, 1)
      console.warn('complete')
      console.warn('this', this)
      this.build()
      this.navigator.push('KnowScene')
    })
  }

}
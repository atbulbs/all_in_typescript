/**
 * @description 加载场景
 */
import BaseScene from './base_scene'

// import { VP } from '../../../../workspace/vk-micro-sdk-game/src/vk-micro-sdk-game'
import { VP } from '../libs/ui/index'
import imagesConfig from '../shared/images_config'
import audiosConfig from '../shared/audios_config'

import { FONT_FAMILY } from '../shared/constants'

const deployConfig = require('../../deploy.config')
console.warn('deployConfig', deployConfig)
const publicPath = deployConfig.cdn.publicPath
const pathPrefix = publicPath + 'static/'


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
  loadingSprite: Phaser.GameObjects.Sprite
  // protected backgroundRect: Phaser.Geom.Rectangle

  constructor () {
    super('LoadScene')
  }

  preload () {
    this.load.multiatlas('loadingAnimas', pathPrefix + 'loading_sprite.json')
  }

  create () {

    this.fitScreen()
    const { top, left, width, height } = this.background
    const graphics = this.add.graphics()
    graphics.fillStyle(0xB4D61D, 1)
    graphics.fillRect(left, top, width, height)

    const loadingSprite = this.add.sprite(375 / 2, 175 + 100, 'loadingAnimas', 'loading_00000.png')
    this.loadingSprite = loadingSprite
    loadingSprite.setSize(215, 215).setDisplaySize(215, 215)
    const loadingFrames = this.anims.generateFrameNames("loadingAnimas", { start: 0, end: 12, zeroPad: 2, prefix:'loading_000', suffix:'.png' })
    this.anims.create({ key: "loadingAnimas", frames: loadingFrames, frameRate: 30, repeat: -1 })
    loadingSprite.anims.play("loadingAnimas")

    // const rootContainer = this.add.container(0, 0)
    // rootContainer.add(loadingSprite)

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

    // const nextBtn = this.add.image(375 / 2, 500, 'nextImage')
    // nextBtn.setOrigin(.5, .5)
    // nextBtn.setDisplaySize(375 / 4, 375 / 4)

    // const clickSound = this.sound.add('clickSound')

    // nextBtn.setInteractive()
    // nextBtn.on('pointerdown', () => {
    //   clickSound.play()
    //   this.navigator.push('KnowScene')
    // })
  }

  transitionIn () {

  }

  // 加载资源
  loadAssets () {

    this.load.crossOrigin = 'anonymous'


    for (const key in imagesConfig) {
      this.load.image(key, imagesConfig[key])
    }
    for (const key in audiosConfig) {
      this.load.audio(key, audiosConfig[key])
    }

    var url;

    // url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextagtextplugin.min.js';
    // this.load.plugin('rextagtextplugin', url, true);

    this.load.multiatlas('monsterFailSpriteAnimas', pathPrefix + 'monster_sprite.json')
    this.load.multiatlas('monsterShowSpriteAnimas1', pathPrefix + 'monster_show1_sprite_new.json')
    this.load.multiatlas('monsterShowSpriteAnimas2', pathPrefix + 'monster_show2_sprite.json')

    this.load.multiatlas('soundPlayAnimas', pathPrefix + 'sound_sprite.json')

    ;(this.load as any).spine('monster_spine', pathPrefix + "monster_spine.json",  pathPrefix + "monster_spine.atlas")

    // const imageUrl = 'https://global.canon/en/environment/bird-branch/img/top-key-tobi-sp.jpg'
    // this.load.image('logo', imageUrl)
    this.load.start()

    const progressText = this.add.text(375 / 2, 667 / 2 + 35 + 100, '0%', {
      color: 'white',
      fontSize: 20,
      fontFamily: FONT_FAMILY
    }).setOrigin(.5)

    let progressBar
    this.load.on('progress', e => {
      const percentage = ((window as any).Math.floor(e * 100)) + '%'
      progressText.setText(percentage)
      const width = e > 0.1 ? e : 0.1
      if (e > .1) {
        if (!progressBar) {
          const _r = new Phaser.Geom.Rectangle((375 - 200) / 2, 667 / 2 + 100, 200, 16)
          progressBar = new VP.ProgressBar(this , _r)
          progressBar.setStyle(0xFFDD00 , 0x2E3606, 8)
          progressBar.setValue(0, 1)
        }
        progressBar.setValue(width, 1)
      }
    })

    this.load.on('complete', () => {
      progressText.setText('100%')
      progressBar.setValue(1, 1)
      console.warn('complete')
      console.warn('this', this)
      this.build()
      this.loadingSprite.anims.pause()
      this.navigator.push('KnowScene')
    })
  }

}
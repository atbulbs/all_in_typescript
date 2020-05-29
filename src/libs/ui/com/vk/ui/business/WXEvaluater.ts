// import VKEvaluater from 'evaluater-vkm-wx-public'
import SceneBase from '../../phaser/scene/SceneBase'
import BaseEvaluater from './BaseEvaluater'
import SoundManager from '../../phaser/utils/SoundUtils'
import Arc from '../../phaser/graphics/Arc'
import IEvaluaterInfo from '../interface/IEvaluater'

/**
 * Evaluater.ts
 *
 *
 *     creat on:   2019/06/22
 *
 * 语音评测
 *
 * 注意：该 SDK 会校验域名，因此本地环境和 PRE 环境需要设置代理才能使用。
 *
 *
 * Example:
 * ```
 *       public create(): void {
 *          const soundBg = VP.UIUtils.CreatImage(this, "soundBg", new Phaser.Geom.Rectangle(43, 518, 44, 44))
 *          const soundIcon = new VP.Button(this, new Phaser.Geom.Rectangle(54, 530, 22, 20), "soundIcon")
 *          const recordStart = new VP.Button(this, rect, "recordStart")
 *          const recordStop = new VP.Button(this, rect, "recordStop")
 *          const voicePlay = new VP.Button(this, rect, "voicePlay")
 *          const voicePause = new VP.Button(this, rect, "voicePause")
 *          const evaluater = new VU.Evaluater(this, new Phaser.Geom.Rectangle(0, 0, 375, 603), {
 *              type: 'wx',
 *              appId: window["SLP_STORAGE"].getValue("env", "g").DEV ? '7914d69c51684289ad9c881f423576e0' : 'ab5dd6e334a640cb9b010e245725124a',
 *              userId: 'PumkinEnglish',
 *              selfWX: window["wx"],
 *              debug: false,
 *              env: window["SLP_STORAGE"].getValue("env", "g").DEV ? 'test': 'prod',
 *              standardSoundBackGround: soundBg,
 *              standardSoundIcon: soundIcon,
 *              recordStartBtn: recordStart,
 *              recordStopBtn: recordStop,
 *              voicePlayBtn: voicePlay,
 *              voiceStopBtn: voicePause,
 *              onResult: this.testEvaluaterCallback
 *          })
 *          evaluater.setRecordText("Mac had a map")
 *          evaluater.setStandardSound("standardSound")
 *          evaluater.setEvalMode(1)
 *          evaluater.setRecordStart(()=>{ this.isPlaying = true })
 *          evaluater.setRecordEnd(()=>{ this.isPlaying = false })
 *      }
 * ```
 */
export default class WXEvaluater extends BaseEvaluater {
  /**
   * 构造函数
   * @param $scene            场景
   * @param $rect             渲染区域，包括位置和坐标的矩形
   * @param $info             语音评测相关信息
   * @param $parent           父容器
   *
   * @see Phaser.Geom.Rectangle
   */
  public constructor(
    $scene: SceneBase,
    $rect: Phaser.Geom.Rectangle,
    $info: IEvaluaterInfo,
    $parent: Phaser.GameObjects.Container = null
  ) {
    super($scene, $rect, $info, $parent)
    this._init()
  }

  protected _init(): void {
    super._init()
  }

  protected monitor() {
    super.monitor()
    //销毁评测
    this.on('destroy', () => {
      !window['SLP_STORAGE'].getItem('env', 'g').LOCAL && this._evaluater.close()
    })
  }

  // 初始化语音评测
  protected initVKEvaluater(): void {
    const self = this
    // this._evaluater = new VKEvaluater({
    //   type: self.info.type,
    //   appId: self.info.appId,
    //   userId: self.info.userId,
    //   selfWX: self.info.selfWX,
    //   debug: self.info.debug,
    //   env: self.info.env,
    //   onState: $state => {
    //     self.onResultCall($state)
    //   },
    //   onError: $err => {
    //     self.onErrorCall($err)
    //   },
    //   onSave: msgObj => {
    //     // console.warn('onSave', msgObj)
    //   }
    // }).core
  }

  // 初始化播放原因按钮
  protected initStandardSoundBtn(): void {
    const btnBg = this.info.standardSoundBackGround
    btnBg.setPosition(btnBg.x + btnBg.displayWidth / 2, btnBg.y + btnBg.displayHeight / 2)
    btnBg.setOrigin(0.5)
    this.add(btnBg)
    const btn = this.info.standardSoundIcon
    this.add(btn)

    let soundAnimas = null
    let sound: Phaser.Sound.BaseSound = null

    this.on('standardSoundStop', () => {
      this.currentPlay = null
      !!soundAnimas && soundAnimas.pause()
      btn.setAlpha(1)
    })

    const _scale = btnBg.scaleX
    btn.on('pointerdown', () => {
      this.currentScene.tweens.add({
        targets: btnBg,
        scaleX: _scale * 1.2,
        scaleY: _scale * 1.2,
        ease: 'Sine.easeInOut',
        duration: 50,
        yoyo: true
      })
    })

    btn.on('pointerup', () => {
      if (!this.standardSound) return
      if (!!sound && sound.isPlaying) {
        this.emit('standardSoundStop')
        !!sound && sound.stop()
        return
      }
      if (!this.canPlay()) return

      this.currentPlay = 'standard'
      sound = SoundManager.PlayOnce(this._scene, this.standardSound.key)
      sound.on('complete', () => {
        this.emit('standardSoundStop')
      })
      // 动效
      if (!soundAnimas) {
        soundAnimas = this.currentScene.tweens.add({
          targets: btn,
          alpha: 0.4,
          delay: 200,
          duration: 400,
          yoyo: true,
          repeat: -1
        })
      } else {
        soundAnimas.resume()
      }
    })
  }

  // 创建用户录音播放按钮
  protected createVoicePlayBtn(): Phaser.GameObjects.Container {
    return this.info.voicePlayBtn.setAlpha(0)
  }

  // 创建用户录音暂停按钮
  protected createVoicePauseBtn(): Phaser.GameObjects.Container {
    return this.info.voiceStopBtn.setAlpha(0)
  }

  // 设置录音进度条样式
  protected setArcTimerStyle($arc: Arc): void {
    $arc.setStyle(0xfff497, 4)
    $arc.step = 0.005
  }

  protected handlePlayVoice() {
    if (this.voiceSound) {
      this.playVoice()
    } else {
      this._evaluater.playVoice(this._evaluater.getLocalId())
    }
  }

  protected handleStopVoice() {
    if (this.voiceSound) return
    this._evaluater.stopVoice(this._evaluater.getLocalId())
  }

  // 播放用户录音
  private playVoice(): void {
    const sound = SoundManager.PlayOnce(this.currentScene, this.voiceSound)
    this.on('voiceStop', () => {
      !!sound && sound.stop()
    })
  }
}

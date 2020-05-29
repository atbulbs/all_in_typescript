import CORELIB from '../../../../../core'
// import VKEvaluater from 'evaluater-vkm'
import SoundManager from '../../phaser/utils/SoundUtils'
import BaseEvaluater from './BaseEvaluater'
import Utils from '../../phaser/utils/Utils'
import SceneBase from '../../phaser/scene/SceneBase'
import Arc from '../../phaser/graphics/Arc'
import Audio from '../../phaser/components/Audio'
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
 *              appId: window["SLP_STORAGE"].getValue("env", "g").DEV ? '7914d69c51684289ad9c881f423576e0' : 'ab5dd6e334a640cb9b010e245725124a',
 *              userId: 'PumkinEnglish',
 *              debug: false,
 *              env: window["SLP_STORAGE"].getValue("env", "g").DEV ? 'test': 'prod',
 *              standardSoundBackGround: soundBg,
 *              standardSoundIcon: soundIcon,
 *              recordStartBtn: recordStart,
 *              recordStopBtn: recordStop,
 *              voicePlayBtn: voicePlay,
 *              voiceStopBtn: voicePause,
 *              onResult: this.testEvaluaterCallback
 *              onError: this.testEvaluaterCallback
 *          })
 *          evaluater.setRecordText("Mac had a map")
 *          evaluater.setStandardSound("standardSound")
 *          evaluater.setEvalMode(1)
 *          evaluater.setRecordStart(()=>{ this.isPlaying = true })
 *          evaluater.setRecordEnd(()=>{ this.isPlaying = false })
 *      }
 * ```
 */
export default class H5Evaluater extends BaseEvaluater {
  private useNativePlay: boolean = false // 是否使用原生播放方式
  private voicePlayer: Audio

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
    this.checkClient()
    super._init()
  }

  protected monitor() {
    super.monitor()
    //销毁评测
    this.on('destroy', () => {
      this._evaluater && this._evaluater.close()
    })
  }

  private checkClient(): void {
    // 环境
    const _client = CORELIB.Hybrid.deviceType()
    // app版本
    const _version = CORELIB.Hybrid.getAppVersion()
    // 判断当前app版本是否支持原生播放功能
    if (_client === 'IPAD') {
      this.useNativePlay = CORELIB.Hybrid.compareVersion(_version, '2.13.0')
    } else if (_client === 'ANDROID') {
      this.useNativePlay = CORELIB.Hybrid.compareVersion(_version, '1.0.0')
    }
    // 设置监听
    if (this.useNativePlay) {
      // window['VKAppBridge'] = {}
      window['VKAppBridge']['receiveFromNative'] = res => {
        let data = JSON.parse(res)
        if (data.module === 'audio' && data.method === 'updateAudioStatus') {
          if (data.data) {
            switch (data.data.status) {
              case 5:
                this.emit('standardSoundStop')
                break
              case 6:
                // 技术打点 - 原生音频播放失败
                Utils.saTrack('page_trigger_ ', {
                  event_id: 'game_sdk_native_audioplay_error',
                  event_content: 'GameSDK语音评测 - 原生音频播放失败',
                  str1: this.voiceSound,
                  str2: this._evaluater.getMagicNumber()
                })
                break
            }
          }
        }
      }
    }
  }

  // 设置SDK模式
  private setSdkType(): string {
    // 验证设备类型
    let _type = 'h5'
    const _client = CORELIB.Hybrid.deviceType()
    if (_client === 'IPAD' || _client === 'ANDROID') {
      _type = 'native'
    }
    return _type
  }

  // 初始化语音评测
  protected initVKEvaluater(): void {
    const self = this
    // 初始化
    // this._evaluater = new VKEvaluater({
    //   sdkType: this.setSdkType(),
    //   env: self.info.env,
    //   appId: self.info.appId,
    //   userId: self.info.userId,
    //   debug: self.info.debug,
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

    // 播放按钮
    const btn = this.info.standardSoundIcon
    this.add(btn)

    // 播放中效果
    const playAnimas = this.info.standardSoundAnimas
    playAnimas.setAlpha(0)
    this.add(playAnimas)

    // 发音
    let sound: Phaser.Sound.BaseSound = null

    this.on('standardSoundStop', () => {
      this.currentPlay = null
      // 原生播放
      if (this.useNativePlay) {
        this.nativeStopSound()
        // Phaser播放
      } else {
        !!sound && sound.stop()
      }
      playAnimas.setAlpha(0)
      btn.setAlpha(1)
    })

    btn.on('pointerup', () => {
      if (!this.standardSound) return
      if (!this.canPlay()) return
      //
      this.currentPlay = 'standard'
      //
      btn.setAlpha(0)
      playAnimas.setAlpha(1)
      // 原生播放
      if (this.useNativePlay) {
        this.nativePlaySound(this.standardSound.url)
        // Phaser播放
      } else {
        sound = SoundManager.PlayOnce(this._scene, this.standardSound.key)
        sound.on(
          'complete',
          () => {
            this.emit('standardSoundStop')
          },
          this
        )
      }
    })

    playAnimas.setInteractive().on('pointerdown', () => {
      if (!this.standardSound) return
      this.emit('standardSoundStop')
    })
  }

  // 创建用户录音播放按钮
  protected createVoicePlayBtn(): Phaser.GameObjects.Container {
    return this.info.voicePlayBtn.setAlpha(0.4)
  }

  // 创建用户录音暂停按钮
  protected createVoicePauseBtn(): Phaser.GameObjects.Container {
    return this.info.voiceStopBtn.setAlpha(0)
  }

  // 播放用户录音动效
  protected voicePlayAnimas($btn: Phaser.GameObjects.Sprite): void {
    !!$btn && $btn.anims && $btn.anims.play('soundPlayAnimas')
  }

  // 设置录音进度条样式
  protected setArcTimerStyle($arc: Arc): void {
    $arc.setStyle(0xff696a, 4)
    // 设置时长 - 单词19s 句子39s
    let _time = 10
    if (this.evalMode === 0) {
      _time = 16
    } else {
      _time = 36
    }
    $arc.step = 0.005 * (60 / _time)
  }

  protected handlePlayVoice() {
    // 原生播放
    if (this.useNativePlay) {
      this.nativePlaySound(this.voiceSound)
      // H5 播放
    } else {
      if (!this.voicePlayer) {
        this.voicePlayer = new Audio()
      }
      this.voicePlayer.play(this.voiceSound)
    }
  }

  protected handleStopVoice() {
    // 原生播放
    if (this.useNativePlay) {
      this.nativeStopSound()
      // H5 播放
    } else {
      if (this.voicePlayer) {
        this.voicePlayer.stop()
      }
    }
  }

  protected showFeedBack(result: any): void {
    this.setVoiceSound(result.data.audioUrl)
    super.showFeedBack(result)
  }

  // 原生音频播放
  private nativePlaySound($src: string): void {
    if (!$src) return
    const _url = encodeURIComponent($src)
    // autoPlay的值文档里定义为0或1，但安卓只支持布尔值，因此改为true，ios整形和boolean型都能可
    CORELIB.Hybrid.dispatchForPad(`vkappbridge://audio/setUrl?url=${_url}&autoPlay=true`)
  }

  // 原生音频终止
  private nativeStopSound(): void {
    CORELIB.Hybrid.dispatchForPad('vkappbridge://audio/cancel')
  }
}

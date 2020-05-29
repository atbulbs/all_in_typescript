import Utils from '../../phaser/utils/Utils'
import UIUtils from '../../phaser/utils/UIUtils'
import SceneBase from '../../phaser/scene/SceneBase'
import UIComponent from '../../phaser/components/UIComponent'
import Arc from '../../phaser/graphics/Arc'
import Waiting from './Waiting'
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
 */
export default class BaseEvaluater extends UIComponent {
  protected currentScene: SceneBase
  protected info: IEvaluaterInfo
  protected _evaluater: any // 语音评测引擎
  protected recordRange: number
  protected currentPlay: string = null
  protected recordText: string = ''
  protected standardSound: any
  protected voiceSound: string
  protected evalMode: number = 0
  protected evalStatus: number = 0 // 语音评测当前状态
  protected waitingBox: Waiting
  protected isWaitResult: boolean = false
  protected isRecorded: boolean = false
  protected recordStart: Function = () => {}
  protected recordEnd: Function = () => {}

  /**
   * 设置评测文本
   */
  public setRecordText(text: string): void {
    this.recordText = text
  }
  /**
   * 设置评测原音
   */
  public setStandardSound(sound: any): void {
    this.standardSound = sound
  }
  /**
   * 设置评测用户录音
   */
  public setVoiceSound(sound: string): void {
    this.voiceSound = sound
    this.isRecorded = false
  }
  /**
   * 设置评测类型
   */
  public setEvalMode(mode: number): void {
    this.evalMode = mode
  }
  /**
   * 设置开始播放函数
   */
  public setRecordStart(fn: Function): void {
    this.recordStart = fn
  }
  /**
   * 设置结束播放函数
   */
  public setRecordEnd(fn: Function): void {
    this.recordEnd = fn
  }
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
    super($scene, $rect, $parent)

    // variables
    this.currentScene = $scene
    this.info = $info
    console.log('202005201638')
  }

  protected _init(): void {
    this.currentPlay = 'wait'
    // 初始化语音评测
    this.initVKEvaluater()
    this.initStandardSoundBtn()
    this.initRecordBtn()
    this.initVoiceBtn()
    this.initWaiting()
    this.monitor()
  }

  protected monitor() {
    //销毁评测
    this.on('destroy', () => {
      this.emit('standardSoundStop')
      this.emit('voiceStop')
      // 如果处于录音中，则马上终止
      if (this.evalStatus === 4) {
        this.handleStopRecord()
      }
      this._evaluater = null
    })
  }

  // 初始化播放原因按钮
  protected initStandardSoundBtn(): void {
    // 占位：子类实现
  }

  private initRecordBtn(): void {
    // 录音动效
    const recordingTips = UIUtils.CreatContainer(
      this.currentScene,
      new Phaser.Geom.Rectangle(
        this.info.recordStartBtn.x + this.info.recordStartBtn.width / 2,
        this.info.recordStartBtn.y + this.info.recordStartBtn.height / 2,
        0,
        0
      ),
      this
    )
    const graphics = this.currentScene.add.graphics({})
    graphics.fillStyle(0x000000, 0.08)
    graphics.fillCircle(0, 0, this.info.recordStartBtn.width / 2)
    recordingTips.add(graphics)
    recordingTips.setScale(0.8)

    // 录音按钮
    const startBtn = this.info.recordStartBtn
    // 默认不可交互，需要等待sdk准备就绪
    if (this.evalStatus < 3) {
      startBtn.setAlpha(0.4)
      startBtn.disableInteractive()
    }
    this.add(startBtn)

    // 停止录音按钮
    const stopBtn = this.info.recordStopBtn.setAlpha(0)
    this.add(stopBtn)

    // 录音倒计时
    const arc = new Arc(
      this.currentScene,
      new Phaser.Geom.Circle(
        this.info.recordStartBtn.x + this.info.recordStartBtn.width / 2,
        this.info.recordStartBtn.y + this.info.recordStartBtn.height / 2,
        (this.info.recordStartBtn.width - 7) / 2
      ),
      this
    )

    arc.on('complete', () => {
      // 60秒之后恢复录音状态
      stopBtn.emit('pointerup')
    })

    this.setArcTimerStyle(arc)

    // 录音定时器
    let recordTimer = null
    //
    let recordStartTime = null
    //
    let recordStopTime = null
    // 录音动画
    let recordAnimas = null

    startBtn.on('pointerup', () => {
      if (!this.canPlay()) return
      this.currentPlay = 'record'
      this.isRecorded = true
      // 通知父容器已开始播放
      this.recordStart()
      startBtn.setAlpha(0)
      stopBtn.setAlpha(1)
      // 开始倒计时
      arc.play(Phaser.Math.PI2)
      setTimeout(() => {
        arc.setAlpha(1)
      }, 100)
      // 录音开始
      recordStartTime = new Date().getTime()
      // 重置录音时长
      this.recordRange = 0
      this.handleStartRecord()
      // 播放录音动画
      if (!recordAnimas) {
        recordAnimas = this.currentScene.tweens.add({
          targets: recordingTips,
          scaleX: 1.3,
          scaleY: 1.3,
          duration: 500,
          yoyo: true,
          repeat: -1
        })
      } else {
        recordAnimas.resume()
      }
    })

    stopBtn.on('pointerup', () => {
      clearTimeout(recordTimer)
      this.currentPlay = null
      // 通知父容器已结束播放
      this.recordEnd()
      startBtn.setAlpha(1)
      stopBtn.setAlpha(0)
      // 停止倒计时
      arc.stop()
      arc.setAlpha(0)
      // 隐藏效果
      recordingTips.setScale(0.8)
      !!recordAnimas && recordAnimas.pause()
      // 尚未获取结果
      this.isWaitResult = true
      // 显示等待提醒
      this.waitingBox.show()
      // 录音结束
      const timer = setInterval(() => {
        recordStopTime = new Date().getTime()
        // 记录录音时长
        if (!this.recordRange) {
          this.recordRange = recordStopTime - recordStartTime
        }
        // 录音时间低于2秒钟可能会报错
        if (recordStopTime - recordStartTime < 2000) return
        clearInterval(timer)
        this.handleStopRecord()
      }, 100)
    })

    // 显示
    this.on(
      'showRecordBtn',
      () => {
        startBtn.setAlpha(1)
        startBtn.setInteractive()
      },
      this
    )
  }

  private initVoiceBtn(): void {
    const startBtn = this.createVoicePlayBtn()
    this.add(startBtn)
    const stopBtn = this.createVoicePauseBtn()
    this.add(stopBtn)

    // 计时器
    let timer = null

    this.on('showVoiceBtn', () => {
      startBtn.setAlpha(1)
    })

    this.on('hiddenVoiceBtn', () => {
      startBtn.setAlpha(0)
      stopBtn.setAlpha(0)
    })

    this.on('voiceStop', () => {
      // 销毁定时器
      clearInterval(timer)
      this.currentPlay = null
      startBtn.setAlpha(1)
      stopBtn.setAlpha(0)
      this.handleStopVoice()
    })

    startBtn.on('pointerup', () => {
      if (!this.canPlay()) return
      if (this.isRecorded) return
      if (startBtn.alpha !== 1) return
      this.currentPlay = 'voice'
      startBtn.setAlpha(0)
      stopBtn.setAlpha(1)
      // 播放用户录音
      this.handlePlayVoice()
      // 若干时间之后恢复播放状态
      timer = setTimeout(() => {
        clearInterval(timer)
        this.emit('voiceStop')
      }, this.recordRange)
    })

    stopBtn.on(
      'pointerup',
      () => {
        this.emit('voiceStop')
      },
      this
    )
  }

  // 创建用户录音播放按钮
  protected createVoicePlayBtn() {
    // 占位：子类实现
    return null
  }

  // 创建用户录音暂停按钮
  protected createVoicePauseBtn() {
    // 占位：子类实现
    return null
  }

  // 设置录音进度条样式
  protected setArcTimerStyle($arc: Arc): void {
    // 占位：子类实现
  }

  protected showFeedBack(result: any): void {
    this.showVoiceBtn()
    this.info.onResult.bind(this.currentScene)(result.data)
  }

  protected canPlay(): boolean {
    if (!this.currentPlay) {
      return true
    } else if (this.currentPlay === 'standard') {
      this.emit('standardSoundStop')
      return true
    } else if (this.currentPlay === 'voice') {
      this.emit('voiceStop')
      return true
    } else if (this.currentPlay === 'record') {
      return false
    } else {
      return false
    }
  }

  // 占位：子类实现 - 初始化语音评测
  protected initVKEvaluater(): void {}

  protected onResultCall($res): void {
    switch ($res.code * 1) {
      case 1:
        console.log('1未就绪')
        this.evalStatus = 1
        this.currentPlay = 'wait'
        break
      case 2:
        console.log('2链接中')
        this.evalStatus = 2
        this.currentPlay = 'wait'
        break
      case 3:
        console.log('3已就绪')
        this.evalStatus = 3
        this.currentPlay = null
        this.emit('showRecordBtn')
        break
      case 4:
        console.log('4录音中')
        this.evalStatus = 4
        break
      case 5:
        console.log('5测评结果获取中')
        this.evalStatus = 5
        break
      case 6:
        console.log('6已获得测评结果')
        this.evalStatus = 6
        if (!this.isWaitResult) return
        // 已获得结果
        this.isWaitResult = false
        // 移除等待提醒
        this.waitingBox.hidden()
        this.showFeedBack($res)
        // 技术打点 - 录音成功
        Utils.saTrack('page_trigger_ ', {
          event_id: 'game_sdk_h5_evaluater_success',
          event_content: 'GameSDK语音评测 - 录音成功',
          num1: $res.code,
          num2: $res.data.overall,
          str2: this._evaluater.getMagicNumber()
        })
        break
      case 7:
        console.log('7服务已关闭')
        this.evalStatus = 7
        break
      case 8:
        console.log('8录音被打断')
        this.evalStatus = 8
        this.info.onError.bind(this.currentScene)($res)
        // 技术打点 - 录音被打断
        Utils.saTrack('page_trigger_ ', {
          event_id: 'game_sdk_h5_evaluater_break',
          event_content: 'GameSDK语音评测 - 录音被打断',
          num1: $res.code,
          str2: this._evaluater.getMagicNumber()
        })
        break
    }
  }

  protected onErrorCall($error): void {
    console.error('$error', this._evaluater.getMagicNumber(), $error)
    // 技术打点 - 异常
    Utils.saTrack('page_trigger_ ', {
      event_id: 'game_sdk_h5_evaluater_error',
      event_content: 'GameSDK语音评测 - 异常',
      num1: $error.code,
      str1: $error.message,
      str2: this._evaluater.getMagicNumber()
    })
    // 已获得结果
    this.isWaitResult = false
    // 移除等待提醒
    this.waitingBox.hidden()
    this.info.onError.bind(this.currentScene)($error)
  }

  private handleStartRecord() {
    const params = {
      refText: this.recordText.replace(/<(\/)?class(='highlight')?>/g, '').replace(/\\n/g, ''),
      textMode: 0,
      evalMode: this.evalMode,
      rank: 100,
      receiveTimeout: 20000
    }
    console.warn('params', params)
    this._evaluater.start(params, this)
  }

  private handleStopRecord() {
    this._evaluater.stop()
  }

  // 占位：子类实现
  protected handlePlayVoice() {}

  // 占位：子类实现
  protected handleStopVoice() {}
  /**
   * 显示播放录音按钮
   */
  public showVoiceBtn(): void {
    this.emit('showVoiceBtn')
  }
  /**
   * 隐藏播放录音按钮
   */
  public hiddenVoiceBtn(): void {
    this.emit('hiddenVoiceBtn')
  }
  /**
   * 初始化等待提示
   */
  private initWaiting(): void {
    const _r = new Phaser.Geom.Rectangle(this.width / 2, this.height / 2, 0, 0)
    this.waitingBox = new Waiting(this.currentScene, _r, this)
  }
  /**
   * 停止评测
   */
  public stop(): void {
    this.emit('standardSoundStop')
    this.emit('voiceStop')
  }
}

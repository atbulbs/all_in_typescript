import Utils from '../../phaser/utils/Utils'
import UIUtils from '../../phaser/utils/UIUtils'
import SceneBase from '../../phaser/scene/SceneBase'
import UIComponent from '../../phaser/components/UIComponent'
import MediaProgressBar from './MediaProgressBar'
import Button from '../../phaser/components/Button'

// 接口
interface IAudioPlayerInfo {
  title: string
  sound: HTMLAudioElement
  poster: string
  playBtn: Phaser.GameObjects.Image
  pauseBtn: Phaser.GameObjects.Image
}

export default class AudioPlayer extends UIComponent {
  private currentScene: SceneBase
  private info: IAudioPlayerInfo
  private sound: HTMLAudioElement
  private playBtn: Phaser.GameObjects.Image
  private pauseBtn: Phaser.GameObjects.Image
  private progressBar: MediaProgressBar
  private currentTime: Phaser.GameObjects.Text
  private isPlaying: boolean = false

  public constructor(
    $scene: SceneBase,
    $rect: Phaser.Geom.Rectangle,
    info: IAudioPlayerInfo,
    $parent: Phaser.GameObjects.Container = null
  ) {
    super($scene, $rect, $parent)

    // variables
    this.currentScene = $scene
    this.info = info

    this._init()
    this.monitor()
  }

  private _init(): void {
    this.initBackGround()
    this.initSound()
    this.initPoster()
    this.initTitle()
    this.initWaiting()
  }

  private monitor(): void {
    this.on(
      'destroy',
      () => {
        this.sound = null
      },
      this
    )

    this.on('reset', () => {
      this.emit('hiddenWaiting')
      this.isPlaying = false
      this.playBtn.setAlpha(1)
      this.pauseBtn.setAlpha(0)
      this.currentTime.setText('00:00')
      !!this.progressBar && this.progressBar.emit('restart')
      setTimeout(() => {
        !!this.progressBar && this.progressBar.emit('pause')
      }, 100)
    })

    // 监听播放进度
    this.sound.addEventListener(
      'timeupdate',
      () => {
        if (!this.sound) return
        this.currentTime.setText(Utils.GetTimeTextForMs(this.sound.currentTime * 1000))
      },
      false
    )
    // 监听是否已结束
    this.sound.addEventListener(
      'ended',
      () => {
        if (!this.sound) return
        this.isPlaying = false
        this.playBtn.setAlpha(1)
        this.pauseBtn.setAlpha(0)
        this.currentTime.setText('00:00')
        !!this.progressBar && this.progressBar.emit('stop')
        this.emit('stop')
      },
      false
    )
    // 当音频/视频在已因缓冲而暂停或停止后已就绪时
    this.sound.addEventListener(
      'playing',
      () => {
        if (!this.sound) return
        this.emit('hiddenWaiting')
      },
      false
    )
    // 当视频由于需要缓冲下一帧而停止
    this.sound.addEventListener(
      'waiting',
      () => {
        if (!this.sound) return
        this.emit('showWaiting')
      },
      false
    )

    /* 错误类 */

    // 当浏览器尝试获取媒体数据，但数据不可用时
    this.sound.addEventListener(
      'stalled',
      () => {
        if (!this.sound) return
        console.warn('stalled')
      },
      false
    )
    // 当音频/视频的加载已放弃时
    this.sound.addEventListener(
      'abort',
      () => {
        if (!this.sound) return
        console.warn('abort')
      },
      false
    )
    // 当在音频/视频加载期间发生错误时
    this.sound.addEventListener(
      'error',
      () => {
        if (!this.sound) return
        console.warn('error')
      },
      false
    )
  }

  private initBackGround(): void {
    const graphic1 = this.currentScene.add.graphics({})
    graphic1.fillStyle(0xffffff, 1)
    graphic1.fillRoundedRect(0, 0, 267, 68, { tl: 20, tr: 0, bl: 20, br: 0 })
    this.add(graphic1)
  }

  private initPoster(): void {
    const _rect = new Phaser.Geom.Rectangle(267, 0, 68, 68)
    const poster = UIUtils.CreatImage(this.currentScene, this.info.poster, _rect, this)
    poster.setInteractive().on(
      'pointerup',
      () => {
        if (this.isPlaying) {
          this.isPlaying = false

          this.sound.pause()
          !!this.progressBar && this.progressBar.emit('pause')

          this.playBtn.setAlpha(1)
          this.pauseBtn.setAlpha(0)
        } else {
          this.isPlaying = true

          this.emit('play')

          this.sound.play()
          !!this.progressBar && this.progressBar.emit('start')

          this.playBtn.setAlpha(0)
          this.pauseBtn.setAlpha(1)
        }
      },
      this
    )

    this.pauseBtn = this.info.pauseBtn
    this.pauseBtn.setAlpha(0)
    this.add(this.pauseBtn)

    this.playBtn = this.info.playBtn
    this.add(this.playBtn)
  }

  private initTitle(): void {
    const textStyle = UIUtils.CreatTextStyle(16, 'left', '#4A4A4A')
    UIUtils.CreatText(this.currentScene, this.info.title, 19, 10, textStyle, this)
  }

  private initSound(): void {
    // 文本样式
    const textStyle = UIUtils.CreatTextStyle(12, 'left', '#4A4A4A')

    this.sound = this.info.sound

    // 轮训获得时长
    const timer = setInterval(() => {
      if (!this.sound.duration) return
      clearInterval(timer)
      // 总时长
      UIUtils.CreatText(
        this.currentScene,
        Utils.GetTimeTextForMs(this.sound.duration * 1000),
        215,
        46,
        textStyle,
        this
      )
      // 进度条
      this.initProgressBar(this.sound.duration * 1000)
    }, 100)
    // 当前时间
    this.currentTime = UIUtils.CreatText(this.currentScene, '00:00', 19, 46, textStyle, this)
  }

  private initProgressBar(duration: number): void {
    this.progressBar = new MediaProgressBar(
      this.currentScene,
      new Phaser.Geom.Rectangle(20, 40, 227, 4),
      {
        radius: 1,
        duration: duration,
        bgColor: 0xe5e5e5,
        barLeftColor: 0xff6522,
        barRightColor: 0xff9d47
      },
      this
    )
  }

  private initWaiting(): void {
    const circle1 = this.currentScene.make
      .graphics({})
      .fillStyle(0x000000)
      .fillCircle(292, 35, 2)
      .setAlpha(0)
    this.add(circle1)

    const circle2 = this.currentScene.make
      .graphics({})
      .fillStyle(0x000000)
      .fillCircle(302, 35, 2)
      .setAlpha(0)
    this.add(circle2)

    const circle3 = this.currentScene.make
      .graphics({})
      .fillStyle(0x000000)
      .fillCircle(312, 35, 2)
      .setAlpha(0)
    this.add(circle3)

    let timeline: Phaser.Tweens.Timeline = null

    this.on('showWaiting', () => {
      !!this.playBtn && this.playBtn.setAlpha(0)
      !!this.pauseBtn && this.pauseBtn.setAlpha(0)

      circle1.setAlpha(0.2)
      circle2.setAlpha(0.2)
      circle3.setAlpha(0.2)
      // 创建动画时间轴
      timeline = this.currentScene.tweens.createTimeline({})
      timeline.add({
        targets: circle1,
        alpha: 0.6,
        delay: 300,
        duration: 10,
        onCompleteScope: this,
        onComplete() {
          circle3.setAlpha(0.2)
        }
      })
      timeline.add({
        targets: circle2,
        alpha: 0.6,
        delay: 300,
        duration: 10,
        onCompleteScope: this,
        onComplete() {
          circle1.setAlpha(0.2)
        }
      })
      timeline.add({
        targets: circle3,
        alpha: 0.6,
        delay: 300,
        duration: 10,
        onCompleteScope: this,
        onComplete() {
          circle2.setAlpha(0.2)
        }
      })
      // 执行
      timeline.loopDelay = 300
      timeline.loop = -1
      timeline.play()
    })

    this.on('hiddenWaiting', () => {
      if (this.isPlaying === true) {
        !!this.playBtn && this.playBtn.setAlpha(0)
        !!this.pauseBtn && this.pauseBtn.setAlpha(1)
      } else {
        !!this.playBtn && this.playBtn.setAlpha(1)
        !!this.pauseBtn && this.pauseBtn.setAlpha(0)
      }

      if (!!timeline) {
        timeline.stop()
        timeline.destroy()
      }
      circle1.setAlpha(0)
      circle2.setAlpha(0)
      circle3.setAlpha(0)
    })
  }

  public stop(): void {
    this.isPlaying = false
    this.sound.pause()
    this.sound.currentTime = 0
    this.playBtn.setAlpha(1)
    this.pauseBtn.setAlpha(0)
    this.currentTime.setText('00:00')
    !!this.progressBar && this.progressBar.emit('stop')
  }
}

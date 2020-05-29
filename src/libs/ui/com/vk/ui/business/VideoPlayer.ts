import Utils from '../../phaser/utils/Utils'
import UIUtils from '../../phaser/utils/UIUtils'
import SceneBase from '../../phaser/scene/SceneBase'
import UIComponent from '../../phaser/components/UIComponent'
import Video from '../../phaser/components/Video'
import Button from '../../phaser/components/Button'
import MediaProgressBar from './MediaProgressBar'

// 接口
interface IVideoPlayerInfo {
  title?: string
  description?: string
  direction: string
  source: HTMLVideoElement
  poster: Phaser.GameObjects.Image
  startBtn: Phaser.GameObjects.Image
  backBtn: Button
  playBtn: Button
  pauseBtn: Button
}

export default class VideoPlayer extends UIComponent {
  private currentScene: SceneBase
  private info: IVideoPlayerInfo
  private originContainer: Phaser.GameObjects.Container
  private holdContainer: Phaser.GameObjects.Container
  private video: Video
  private progressBar: MediaProgressBar
  private ready: boolean = false
  private isPlaying: boolean = false
  // 锁住状态
  private isHolding: boolean = false
  // 等待状态
  private isWating: boolean = false

  public constructor(
    $scene: SceneBase,
    $rect: Phaser.Geom.Rectangle,
    $info: IVideoPlayerInfo,
    $parent: Phaser.GameObjects.Container = null
  ) {
    super($scene, $rect, $parent)

    // variables
    this.currentScene = $scene
    this.info = $info

    this._init()
    this.monitor()
  }

  private _init(): void {
    // 初始化全屏容器
    const _rect = this.currentScene.camera.getCameraRect()
    this.originContainer = UIUtils.CreatContainer(this.currentScene, _rect)
    this.originContainer.setAlpha(0)
    this.originContainer.setDepth(1)

    // 常驻容器
    this.holdContainer = UIUtils.CreatContainer(this.currentScene, _rect)
    this.holdContainer.setAlpha(0)
    this.holdContainer.setDepth(1)

    this.initPoster()
    this.initContentArea()
    this.initVideo()
    this.initPlayBtn()
    this.initPauseBtn()
    this.initCover()
    this.initBackBtn()
    this.initWaiting()

    this.video.on('ready', () => {
      this.ready = true
      this.initDuration()
      this.initProgressBar()
      this.initFullScrenDuration()
    })
  }

  private monitor(): void {
    this.once(
      'destroy',
      () => {
        this.video.destroy()
      },
      this
    )
  }

  private initPoster(): void {
    // 视频封面
    const poster = this.info.poster
    poster.setInteractive().on(
      'pointerup',
      e => {
        // 防止滑动误操作
        const offsetX = (window as any).Math.abs(e.upX - e.downX)
        const offestY = (window as any).Math.abs(e.upY - e.downY)
        if (offsetX > 2 || offestY > 2) {
          return
        }
        this.showFullScren()
      },
      this
    )
    this.add(poster)

    // 开始按钮
    this.add(this.info.startBtn)
  }

  private initContentArea(): void {
    if (!this.info.title && !this.info.description) return
    // 背景
    const graphic = this.currentScene.add.graphics({})
    graphic.fillStyle(0xffffff, 1)
    graphic.fillRoundedRect(0, 187, 335, 84, { tl: 0, tr: 0, bl: 20, br: 20 })
    this.add(graphic)

    // 标题
    const textStyle1 = UIUtils.CreatTextStyle(18, 'left', '#4A4A4A')
    UIUtils.CreatText(this.currentScene, this.info.title, 11, 200, textStyle1, this)

    // 描述
    const textStyle2 = UIUtils.CreatTextStyle(14, 'left', '#4A4A4A')
    UIUtils.CreatText(this.currentScene, this.info.description, 11, 229, textStyle2, this)
  }

  private initVideo(): void {
    this.video = new Video({
      source: this.info.source
    })

    // 横版视频时
    if (this.info.direction === 'horizontal') {
      this.video.setStyle('width', window.innerHeight + 'px')
      this.video.setStyle('height', window.innerWidth + 'px')
      this.video.setStyle('transform', 'translate(-50%, -50%) rotate(90deg)')
    } else {
      this.video.setStyle('width', window.innerWidth + 'px')
      this.video.setStyle('height', window.innerHeight + 'px')
    }

    this.video.on('play', () => {
      this.isPlaying = true
      // 锁住状态，不允许用户点击
      this.isHolding = true
      // 轮训获得时长
      const timer = setInterval(() => {
        if (!this.ready) {
          this.emit('showWaiting')
          !!this.progressBar && this.progressBar.emit('pause')
          return
        }
        clearInterval(timer)
        this.emit('showPauseBtn')
        this.emit('hiddenPlayBtn')
        this.emit('showCover')
        !!this.progressBar && this.progressBar.emit('start')
        this.emit('startFullScrenDuration')
        this.currentScene.tweens.add({
          targets: this.originContainer,
          alpha: 0,
          ease: 'Sine.easeInOut',
          duration: 800,
          onCompleteScope: this,
          onComplete: () => {
            this.isHolding = false
          }
        })
        this.emit('play')
      }, 100)
    })

    this.video.on('stop', () => {
      this.isPlaying = false
      this.emit('showPlayBtn')
      this.emit('hiddenPauseBtn')
      !!this.progressBar && this.progressBar.emit('stop')
      this.emit('stopFullScrenDuration')
    })

    // 播放结束时
    this.video.on('ended', () => {
      setTimeout(() => {
        this.isPlaying = false
        this.video.seek(0)
        this.emit('showPlayBtn')
        this.emit('hiddenPauseBtn')
        this.emit('hiddenCover')
        !!this.progressBar && this.progressBar.emit('stop')
        this.emit('stopFullScrenDuration')
        this.originContainer.setAlpha(1)
      }, 500)
    })

    // 进度
    this.video.on('timeupdate', res => {
      this.emit('updateCurrentTime', res)
    })

    // 当用户已移动/跳跃到音频/视频中的新位置时
    this.video.on('seeked', res => {
      this.emit('updateCurrentTime', res)
    })

    this.video.on('enterFullScreen', () => {
      this.emit('hiddenBackBtn')
    })

    this.video.on('exitFullScreen', () => {
      this.hiddenFullScren()
    })

    // 当音频/视频在已因缓冲而暂停或停止后已就绪时
    this.video.on('playing', () => {
      this.emit('hiddenWaiting')
    })

    // 当视频由于需要缓冲下一帧而停止
    this.video.on('waiting', () => {
      this.emit('showWaiting')
      !!this.progressBar && this.progressBar.emit('pause')
    })

    this.video.on('error', () => {
      console.warn('error')
    })
  }

  private initDuration(): void {
    // 背景
    const graphic = this.currentScene.add.graphics({})
    graphic.fillStyle(0x000000, 0.4)
    graphic.fillRoundedRect(278, 157, 47, 20, 9)
    this.add(graphic)

    // 总时长
    const _textStyle = UIUtils.CreatTextStyle(10, 'center', '#ffffff')
    const _text = Utils.GetTimeTextForMs(this.video.getDuration() * 1000)
    const duration = UIUtils.CreatText(this.currentScene, _text, 302, 168, _textStyle, this)
    duration.setOrigin(0.5, 0.5)
  }

  private initPlayBtn(): void {
    const playBtn = this.info.playBtn
    this.originContainer.add(playBtn)
    playBtn.setAlpha(0)
    playBtn.setPosition(
      this.originContainer.displayWidth / 2 - playBtn.displayWidth / 2,
      this.originContainer.displayHeight / 2 - playBtn.displayWidth / 2
    )

    // 横版视频时按钮旋转90度
    if (this.info.direction === 'horizontal') {
      const image: any = playBtn.first
      image.setAngle(90)
    }

    playBtn.on('pointerup', () => {
      this.video.play()
    })

    this.on('showPlayBtn', () => {
      playBtn.setAlpha(1)
    })

    this.on('hiddenPlayBtn', () => {
      playBtn.setAlpha(0)
    })
  }

  private initPauseBtn(): void {
    const pauseBtn = this.info.pauseBtn
    this.originContainer.add(pauseBtn)
    pauseBtn.setAlpha(0)
    pauseBtn.setPosition(
      this.originContainer.displayWidth / 2 - pauseBtn.displayWidth / 2,
      this.originContainer.displayHeight / 2 - pauseBtn.displayWidth / 2
    )

    // 横版视频时按钮旋转90度
    if (this.info.direction === 'horizontal') {
      const image: any = pauseBtn.first
      image.setAngle(90)
    }

    this.on('showPauseBtn', () => {
      pauseBtn.setAlpha(1)
    })

    this.on('hiddenPauseBtn', () => {
      pauseBtn.setAlpha(0)
    })
  }

  private initBackBtn(): void {
    const backBtn = this.info.backBtn
    this.holdContainer.add(backBtn)
    backBtn.setPosition(20, 20)

    // 横版视频时按钮旋转90度
    if (this.info.direction === 'horizontal') {
      backBtn.setPosition(this.holdContainer.displayWidth - backBtn.displayWidth - 20, 20)
      const image: any = backBtn.first
      image.setAngle(90)
    }

    backBtn.on('pointerup', () => {
      this.hiddenFullScren()
    })

    this.on('hiddenBackBtn', () => {
      backBtn.setAlpha(0)
    })
  }

  private initCover(): void {
    const rect = this.currentScene.camera.getCameraRect()
    const container = UIUtils.CreatContainer(this.currentScene, rect)
    container.setAlpha(0)

    const coverRect = new Phaser.Geom.Rectangle(0, 0, window.innerWidth * 2, window.innerHeight * 2)
    const cover = UIUtils.CreatContainer(this.currentScene, coverRect, container)
    cover.setDepth(0)

    cover.setInteractive().on('pointerup', () => {
      // 锁住状态不可点击
      if (this.isHolding) return
      if (this.isWating) return
      this.video.pause()
      this.emit('showPlayBtn')
      this.emit('hiddenPauseBtn')
      this.emit('pauseFullScrenDuration')
      !!this.progressBar && this.progressBar.emit('pause')
      this.originContainer.setAlpha(1)
    })

    this.on('showCover', () => {
      container.setAlpha(1)
    })

    this.on('hiddenCover', () => {
      container.setAlpha(0)
    })
  }

  private initProgressBar(): void {
    // 背景
    const graphic = this.currentScene.add.graphics({})
    graphic.fillStyle(0x000000, 0.7)
    // 横版视频
    if (this.info.direction === 'horizontal') {
      graphic.fillRoundedRect(20, 20, 38, this.holdContainer.displayHeight - 40, 19)
    } else {
      graphic.fillRoundedRect(
        20,
        this.holdContainer.displayHeight - 38 - 20,
        this.holdContainer.displayWidth - 40,
        38,
        19
      )
    }
    this.holdContainer.add(graphic)

    let _rect
    // 横版视频
    if (this.info.direction === 'horizontal') {
      _rect = new Phaser.Geom.Rectangle(41, 41, this.holdContainer.displayHeight - 82, 4)
    } else {
      _rect = new Phaser.Geom.Rectangle(
        41,
        this.holdContainer.displayHeight - 4 - 37,
        this.holdContainer.displayWidth - 82,
        4
      )
    }

    this.progressBar = new MediaProgressBar(
      this.currentScene,
      _rect,
      {
        radius: 1,
        duration: this.video.getDuration() * 1000,
        bgColor: 0x363a3c,
        barLeftColor: 0xff6522,
        barRightColor: 0xff9d47
      },
      this.holdContainer
    )

    // 横版视频
    if (this.info.direction === 'horizontal') {
      !!this.progressBar && this.progressBar.setAngle(90)
    }
  }

  private initFullScrenDuration(): void {
    let _rect = null
    // 横版视频
    if (this.info.direction === 'horizontal') {
      _rect = new Phaser.Geom.Rectangle(49, 29, 88, 20)
    } else {
      _rect = new Phaser.Geom.Rectangle(41, this.holdContainer.displayHeight - 20 - 29, 88, 20)
    }
    const contaier = UIUtils.CreatContainer(this.currentScene, _rect, this.holdContainer)

    // 背景
    const graphic = this.currentScene.add.graphics({})
    graphic.fillStyle(0x5e5e5e, 1)
    graphic.fillRoundedRect(0, 0, 88, 20, 11)
    contaier.add(graphic)

    // 进度：时长
    const _textStyle = UIUtils.CreatTextStyle(10, 'center', '#ffffff')
    const _text = '00:00 / ' + Utils.GetTimeTextForMs(this.video.getDuration() * 1000)
    const currentTime = UIUtils.CreatText(this.currentScene, _text, 44, 10, _textStyle, contaier)
    currentTime.setOrigin(0.5, 0.5)

    // 横版视频
    if (this.info.direction === 'horizontal') {
      contaier.setAngle(90)
    }

    this.on('updateCurrentTime', res => {
      currentTime.setText(
        Utils.GetTimeTextForMs(res * 1000) +
          ' / ' +
          Utils.GetTimeTextForMs(this.video.getDuration() * 1000)
      )
    })

    let animas = null
    this.on('startFullScrenDuration', () => {
      if (!!animas) {
        if (animas.isPaused()) {
          animas.resume()
        } else {
          animas.restart()
        }
      } else {
        // 横版视频
        if (this.info.direction === 'horizontal') {
          animas = this.currentScene.tweens.add({
            targets: contaier,
            y: this.holdContainer.displayHeight - 38 - 88,
            duration: this.video.getDuration() * 1000
          })
        } else {
          animas = this.currentScene.tweens.add({
            targets: contaier,
            x: this.holdContainer.displayWidth - 41 - 88,
            duration: this.video.getDuration() * 1000
          })
        }
      }
    })

    this.on('pauseFullScrenDuration', () => {
      !!animas && animas.pause()
    })

    this.on('stopFullScrenDuration', () => {
      if (!!animas) {
        if (animas.isPaused()) {
          animas.resume()
        }
        animas.restart()
        animas.stop()
      }

      // 横版视频
      if (this.info.direction === 'horizontal') {
        contaier.x = 49
      } else {
        contaier.x = 41
      }
    })
  }

  private initWaiting(): void {
    const _rect = new Phaser.Geom.Rectangle(
      this.originContainer.displayWidth / 2,
      this.originContainer.displayHeight / 2,
      0,
      0
    )
    const contaier = UIUtils.CreatContainer(this.currentScene, _rect, this.originContainer)

    const circle1 = this.currentScene.make
      .graphics({})
      .fillStyle(0x000000)
      .fillCircle(-20, 0, 4)
      .setAlpha(0)
    contaier.add(circle1)

    const circle2 = this.currentScene.make
      .graphics({})
      .fillStyle(0x000000)
      .fillCircle(0, 0, 4)
      .setAlpha(0)
    contaier.add(circle2)

    const circle3 = this.currentScene.make
      .graphics({})
      .fillStyle(0x000000)
      .fillCircle(+20, 0, 4)
      .setAlpha(0)
    contaier.add(circle3)

    // 横版视频
    if (this.info.direction === 'horizontal') {
      contaier.setAngle(90)
    }

    let timeline: Phaser.Tweens.Timeline = null

    this.on('showWaiting', () => {
      if (this.isWating) return

      this.isWating = true
      this.emit('hiddenPlayBtn')
      this.emit('hiddenPauseBtn')

      contaier.setAlpha(1)
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
      if (!this.isWating) return

      this.isWating = false
      if (this.isPlaying === true) {
        this.emit('hiddenPlayBtn')
        this.emit('showPauseBtn')
      } else {
        this.emit('showPlayBtn')
        this.emit('hiddenPauseBtn')
      }

      if (!!timeline) {
        timeline.stop()
        timeline.destroy()
      }
      contaier.setAlpha(0)
    })
  }

  private showFullScren(): void {
    this.setAlpha(0)
    this.originContainer.setAlpha(1)
    this.holdContainer.setAlpha(1)
    this.emit('showCover')
    this.video.play()
    this.emit('fullscreen')
  }

  private hiddenFullScren(): void {
    this.stop()
    this.emit('stop')
    this.emit('closescreen')
  }

  public stop(): void {
    this.setAlpha(1)
    this.originContainer.setAlpha(0)
    this.holdContainer.setAlpha(0)
    this.emit('hiddenCover')
    this.video.stop()
  }
}

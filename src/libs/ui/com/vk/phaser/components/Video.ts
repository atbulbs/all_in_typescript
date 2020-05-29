import SLP_CORELIB from '../../../../../core'

// 接口
interface IVideo {
  parent?: HTMLElement // 父容器
  source: HTMLVideoElement
  poster?: string
  muted?: boolean
  style?: any
}
/**
 * Video.ts
 *
 *
 *     creat on:   2019/06/06
 *
 * 视频组件
 *
 * @event window.addEventListener('play')
 * @event window.addEventListener('pause')
 * @event window.addEventListener('stop')
 * @event window.addEventListener('error')
 * @event window.addEventListener('ended')
 * @event window.addEventListener('ready')
 * @event window.addEventListener('timeupdate')
 * @event window.addEventListener('seeked')
 * @event window.addEventListener('waiting')
 *
 * Example:
 * ```
 *       public create(): void {
 *
 *          const video = new VP.Video({
 *              ratio: scene.camera.getScale(),
 *              canvasWidth: 375,
 *              canvasHeight: 603,
 *              source: "http://www.w3school.com.cn/example/html5/mov_bbb.mp4",
 *              type: "video/mp4",
 *              muted: true,
 *              style: {
 *                  w: 300,
 *                  h: 200,
 *                  x: 75 / 2,
 *                  y: 50
 *              }
 *          })
 *
 *          video.on('ended', ()=>{
 *              console.log("ended")
 *          })
 *      }
 * ```
 */
export default class Video extends SLP_CORELIB.Events {
  /**
   * 父容器
   */
  private parent: HTMLElement
  /**
   * 是否静音播放
   */
  private muted: boolean = false
  private videoContainer: HTMLDivElement
  private video: any
  private videoStyle: Object = {}
  /**
   * 缩略图
   */
  private posterImage: string

  constructor(params: IVideo) {
    super()

    this.parent = !!params.parent ? params.parent : document.body
    this.video = params.source
    this.posterImage = params.poster
    this.muted = !!params.muted ? params.muted : false
    this.videoStyle = params.style

    this._init()
    this.moniter()
  }

  private _init(): void {
    // 动态生成视频容器
    this.videoContainer = document.createElement('div')
    this.videoContainer.setAttribute('class', 'video_container')
    this.videoContainer.style.setProperty('position', 'absolute')
    this.videoContainer.style.setProperty('z-index', '-10')
    this.videoContainer.style.setProperty('display', 'none')
    this.videoContainer.style.setProperty('background-color', '#000000')

    if (!!this.videoStyle) {
      if (!!this.videoStyle['w']) {
        this.videoContainer.style.setProperty('width', this.videoStyle['w'] + 'px')
      }

      if (!!this.videoStyle['h']) {
        this.videoContainer.style.setProperty('height', this.videoStyle['h'] + 'px')
      }

      if (!!this.videoStyle['x']) {
        this.videoContainer.style.setProperty('left', this.videoStyle['x'] + 'px')
      }

      if (!!this.videoStyle['y']) {
        this.videoContainer.style.setProperty('top', this.videoStyle['y'] + 'px')
      }
    } else {
      this.videoContainer.style.setProperty('top', '50%')
      this.videoContainer.style.setProperty('left', '50%')
      this.videoContainer.style.setProperty('transform', 'translate(-50%, -50%)')
    }

    // 设置静音
    if (!!this.muted) this.video.muted = true

    // 设置封面
    !!this.posterImage && this.video.setAttribute('poster', this.posterImage)

    // 设置样式
    this.video.style.setProperty('width', '100%')
    this.video.style.setProperty('height', '100%')
    this.video.style.setProperty('display', 'block')
    this.video.style.setProperty('object-fit', 'contain')

    // 插入到容器
    this.videoContainer.appendChild(this.video)
    this.parent.appendChild(this.videoContainer)

    this.video.setAttribute('webkit-playsinline', 'true')
    this.video.setAttribute('x5-playsinline', 'true')
    this.video.setAttribute('playsinline', 'true')
    this.video.setAttribute('x5-video-player-type', 'h5')
    // this.video.setAttribute('x5-video-player-fullscreen', 'true')
    // this.video.setAttribute('x5-video-orientation', 'landscape')

    // 轮询获得时长
    const timer1 = setInterval(() => {
      if (this.video.readyState !== 4) return
      if (!this.video.duration) return
      clearInterval(timer1)
      this.fire('ready')
    }, 100)
  }

  private moniter(): void {
    this.video.addEventListener(
      'play',
      () => {
        this.fire('play')
      },
      false
    )

    this.video.addEventListener(
      'pause',
      () => {
        this.fire('pause')
      },
      false
    )

    // 当在音频/视频加载期间发生错误时
    this.video.addEventListener(
      'error',
      () => {
        this.fire('error')
      },
      false
    )

    // 当音频/视频在已因缓冲而暂停或停止后已就绪时
    this.video.addEventListener(
      'playing',
      () => {
        this.fire('playing')
      },
      false
    )

    // 播放结束时
    this.video.addEventListener(
      'ended',
      () => {
        this.fire('ended')
      },
      false
    )

    // 进度
    this.video.addEventListener(
      'timeupdate',
      () => {
        this.fire('timeupdate', this.video.currentTime)
      },
      false
    )

    // 当用户已移动/跳跃到音频/视频中的新位置时
    this.video.addEventListener(
      'seeked',
      () => {
        this.fire('seeked', this.video.currentTime)
      },
      false
    )

    // 当视频由于需要缓冲下一帧而停止
    this.video.addEventListener(
      'waiting',
      () => {
        this.fire('waiting')
      },
      false
    )

    // 微信中进入全屏
    this.video.addEventListener('x5videoenterfullscreen', () => {
      this.fire('enterFullScreen')
    })

    // 微信中退出全屏
    this.video.addEventListener('x5videoexitfullscreen', () => {
      this.fire('exitFullScreen')
    })
  }
  /**
   * 销毁
   */
  public destroy(): void {
    if (!this.videoContainer) return
    this.video.pause()
    this.video.currentTime = 0
    this.parent.removeChild(this.videoContainer)
    this.videoContainer = null
  }
  /**
   * 设置样式
   */
  public setStyle(key, value, priority?): void {
    if (!!priority) {
      this.videoContainer.style.setProperty(key, value, priority)
    } else {
      this.videoContainer.style.setProperty(key, value)
    }
  }
  /**
   * 播放
   */
  public play(): void {
    this.videoContainer.style.setProperty('display', 'block')
    this.video.play()
  }
  /**
   * 暂停
   */
  public pause(): void {
    this.video.pause()
  }
  /**
   * 停止
   */
  public stop(): void {
    this.video.pause()
    this.video.currentTime = 0
    this.videoContainer.style.setProperty('display', 'none')
    this.fire('stop')
  }
  /**
   * 获得总时长
   * @return 总时长，单位：秒
   */
  public getDuration(): number {
    return this.video.duration
  }
  /**
   * 跳过
   * @param $time     需要跳转到的位置，单位：秒
   */
  public seek($time: number = 0): void {
    this.video.currentTime = $time
  }
  /**
   * 获得当前位置
   * @return 当前位置，单位：秒
   */
  public getCurrentTime(): number {
    return this.video.currentTime
  }
  /**
   * 获得当前音量
   * @return 当前音量
   */
  public getVolume(): number {
    return this.video.volume
  }
  /**
   * 设置音量
   * @param $volume     期望音量
   */
  public setVolume($volume: number): void {
    this.video.volume = $volume
  }
  /**
   * 获得就绪状态
   *
   * 0 = HAVE_NOTHING - 没有关于音频/视频是否就绪的信息
   * 1 = HAVE_METADATA - 关于音频/视频就绪的元数据
   * 2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
   * 3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的
   * 4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放
   *
   * @return 就绪状态
   */
  public getReadyState(): number {
    return this.video.readyState
  }
}

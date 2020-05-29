import SLP_CORELIB from '../../../../../core'

/**
 * Audio.ts
 *
 *
 *     creat on:   2019/06/10
 *
 * 音频组件
 *
 * @event window.addEventListener('play')
 * @event window.addEventListener('pause')
 * @event window.addEventListener('stop')
 * @event window.addEventListener('error')
 * @event window.addEventListener('ended')
 * @event window.addEventListener('timeupdate')
 * @event window.addEventListener('seeked')
 * @event window.addEventListener('waiting')
 *
 * Example:
 * ```
 * ```
 */
export default class H5Audio extends SLP_CORELIB.Events {
  private player: HTMLAudioElement

  constructor() {
    super()

    this.init()
    this.monitor()
  }

  private init(): void {
    this.player = new Audio()
  }

  private monitor(): void {
    // 当在音频/视频加载期间发生错误时
    this.player.addEventListener('error', () => {}, false)
    // 播放结束时
    this.player.addEventListener('ended', () => {}, false)
    // 当浏览器可以播放音频/视频时
    this.player.addEventListener(
      'canplay',
      () => {
        this.player.play()
      },
      false
    )
    // // 开始播放时
    // window.audioPlayer.addEventListener('play', ()=>{
    //     console.log("play")
    // }, false)
    // // 当浏览器刻意不获取媒体数据时
    // this.player.addEventListener('suspend', ()=> {
    //     console.log("suspend")
    // }, false)
    // this.player.addEventListener('abort', ()=> {
    //     console.log("abort")
    // }, false)
    // this.player.addEventListener('progress', ()=> {
    //     console.log("progress")
    // }, false)
    // this.player.addEventListener('stalled', ()=> {
    //     console.log("stalled")
    // }, false)
    // this.player.addEventListener('canplay', ()=> {
    //     console.log("canplay")
    // }, false)
    // this.player.addEventListener('loadeddata', ()=> {
    //     console.log("loadeddata")
    // }, false)
    // this.player.addEventListener('loadedmetadata', ()=> {
    //     console.log("loadedmetadata")
    // }, false)
    // this.player.addEventListener('durationchange', ()=> {
    //     console.log("durationchange")
    // }, false)
    // // 当视频由于需要缓冲下一帧而停止
    // this.player.addEventListener('waiting', ()=> {
    //     console.log("waiting" )
    // }, false)
    // // 当目前的播放列表为空时
    // this.player.addEventListener('emptied', ()=>{
    //     console.log("emptied")
    // }, false)
    // // 当浏览器开始查找音频/视频时
    // this.player.addEventListener('loadstart', ()=> {
    //     console.log("loadstart")
    // }, false)
  }

  // 播放音频
  public play(source) {
    // 打开音频
    this.player.muted = false
    // 当前资源和新资源相同时继续播，不同时加载新资源并播放
    if (!source || this.player.src !== source) {
      this.player.src = source
      this.player.load()
    } else {
      this.player.play()
    }
  }
  // 暂停音频
  public pause() {
    this.player.pause()
    // 静音
    this.player.muted = true
  }
  // 终止播放
  public stop() {
    this.pause()
    this.player.src = null
  }
}

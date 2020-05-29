import Button from '../../phaser/components/Button'
/*
 * 语音评测接口
 *
 * 2020.01.14
 */
interface IEvaluater {
  env: string // SDK所需连接的API的环境
  appId: string // 项目appId
  userId: string // 用户id
  debug: boolean // 是否输出SDK运行日志
  standardSoundBackGround: Phaser.GameObjects.Image // 原音按钮背景
  standardSoundIcon: Button // 原音按钮
  standardSoundAnimas: Phaser.GameObjects.Sprite // 原音播放中效果
  recordStartBtn: Phaser.GameObjects.Container // 录音开始按钮
  recordStopBtn: Phaser.GameObjects.Container // 录音结束按钮
  voicePlayBtn: Phaser.GameObjects.Container // 播放录音按钮
  voiceStopBtn: Phaser.GameObjects.Container // 停止录音按钮
  type?: string // SDK类型
  selfWX?: any // 传入wx对象
  onResult?: Function // 评测成功后回调
  onError?: Function // 评测失败后回调
}

export default IEvaluater

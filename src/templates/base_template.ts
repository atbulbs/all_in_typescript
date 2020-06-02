export default abstract class BaseTemplate {

  constructor (scene: Phaser.Scene, parent: Phaser.GameObjects.Container, config: Object) {}

  // 构建UI
  build (): void {}

  // 监听提交
  onSubmit (handleSubmit: Function = (res: Object) => {}): void {}

  // 处理销毁, 移除事件监听
  handleDestroy () {}

}
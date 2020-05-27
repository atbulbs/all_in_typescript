export default class IndexScene extends Phaser.Scene {

  constructor () {
    super({ key: 'IndexScene' })
  }

  preload () {

  }

  create () {
    // this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Hello Phaser!', {
    //   color: '0xff0000',
    //   fontSize: '25px'
    // }).setOrigin(.5)
    const rect = new Phaser.Geom.Rectangle(0, 0, 375, 667)
    const graphics = this.add.graphics({ fillStyle: { color: 0x00ffff } })
    const designRatio = 375 / 667
    const viewRatio = window.innerWidth / window.innerHeight
    let scale
    if (designRatio > viewRatio) {
      console.warn('以宽为基准做缩放')
      scale = window.innerWidth / 375
    } else {
      console.warn('以高为基准做缩放')
      scale = window.innerHeight / 667
    }
    console.warn('缩放比例', scale)
    rect.setSize(375 * scale, 667 * scale)
    rect.setPosition((window.innerWidth - rect.width) / 2, (window.innerHeight - rect.height) / 2)
    graphics.fillRectShape(rect)

    // console.warn('414 / 736', 414 / 736)

    // console.warn('this', this)

    console.warn('camera', this.cameras)

    // this.cameras.main.setZoom(414 / 375)
    // this.cameras.main.setScroll(-(414 - 375) / 2, -(736 - 667) / 2)

    // const outerCamera: Phaser.Cameras.Scene2D.Camera = this.cameras.add(0, 0, window.innerWidth, window.innerHeight)
    // outerCamera.setScroll(10, 10)

  }

}
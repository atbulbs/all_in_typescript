export default class BaseScene extends Phaser.Scene {

  // 适配缩放比例
  protected zoom: number
  protected backgroundRectX: number = 0
  protected backgroundRectY: number = 0
  protected designWidth: number = 375
  protected designHeight: number = 667
  protected designRatio = 375 / 667
  protected viewRatio = window.innerWidth / window.innerHeight
  protected contentRect: Phaser.Geom.Rectangle
  protected backgroundRect: Phaser.Geom.Rectangle

  constructor () {
    super({ key: 'IndexScene' })
  }

  create () {

    this.add.text(375 / 2, 667 / 2, 'Hello Phaser!', {
      color: '0xff0000',
      fontSize: '25px'
    }).setOrigin(.5)

    // 根据设计稿的宽高比与视口的宽高比判断缩放的基准
    if (this.designRatio > this.viewRatio) {
      // 以宽为基准做缩放
      this.zoom = window.innerWidth / this.designWidth
      this.backgroundRectY = -(window.innerHeight / this.zoom - this.designHeight) / 2
    } else {
      // 以高为基准做缩放
      this.zoom = window.innerHeight / this.designHeight
      this.backgroundRectX = -(window.innerWidth / this.zoom - this.designWidth) / 2
    }

    this.cameras.main.setZoom(this.zoom)
    this.cameras.main.setScroll(-(window.innerWidth - this.designWidth) / 2, -(window.innerHeight - this.designHeight) / 2)

    if (this.designRatio > this.viewRatio) {
      this.buildBackgroundRect()
      this.buildContentRect()
    } else {
      this.buildBackgroundRect()
      this.buildContentRect()
    }

  }

  private buildContentRect () {
    this.contentRect = new Phaser.Geom.Rectangle(0, 0, this.designWidth, this.designHeight)
    const contentRectGraphics = this.add.graphics({ lineStyle: { color: 0x0000ff, width: 7 } })
    contentRectGraphics.strokeRectShape(this.contentRect)

    const container1 = this.add.container(0, 0)
    const container1Rect = new Phaser.GameObjects.Rectangle(this, 375 / 4, 375 / 4, 375 / 2, 375 / 2, 0x00ffff)
    container1.add(container1Rect)
    container1Rect.setInteractive()
    container1Rect.on('pointerdown', e => {
      console.warn('container1Rect', e)
    })
    const text1 = this.add.text(0, 0, 'container1Rect', {
      color: '0xff0000',
      fontSize: '18px'
    })
    container1.add(text1)

    text1.setOrigin(.5)
    text1.x = 375 / 4
    text1.y = 375 / 4

    const container2 = this.add.container(0, 0)
    const container2Rect = new Phaser.GameObjects.Rectangle(this, 375 / 4 + 100, 375 / 4 + 100, 375 / 2, 375 / 2, 0xff00ff)
    container2.add(container2Rect)
    container2Rect.setInteractive()
    container2Rect.on('pointerdown', e => {
      console.warn('container2Rect', e)
    })
    const text2 = this.add.text(0, 0, 'container2Rect', {
      color: '0xff0000',
      fontSize: '18px'
    })
    container2.add(text2)

    text2.setOrigin(.5)
    text2.x = 375 / 4 + 100
    text2.y = 375 / 4 + 100

  }

  private buildBackgroundRect () {
    this.backgroundRect = new Phaser.Geom.Rectangle(this.backgroundRectX, this.backgroundRectY, window.innerWidth / this.zoom, window.innerHeight / this.zoom)
    const backgroundRectGraphics = this.add.graphics({ lineStyle: { color: 0xff0000, width: 7 } })
    backgroundRectGraphics.strokeRectShape(this.backgroundRect)
  }

}
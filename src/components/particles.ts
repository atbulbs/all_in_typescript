/**
 * @description 粒子, 从中间向四周弹射
 */

export default class Particles extends Phaser.GameObjects.Container {
  // 模态框背景
  modalBackground
  // 卡片列表
  pieceList: Array<any> = []
  // 重力
  gravity: number = 0.00002
  // 第一次更新
  firstUpdate: boolean
  // 开始计时
  updateStartTime: number = 0

  constructor(scene) {
    super(scene, 0, 0)
    this.scene.add.existing(this)
    this.addPieces()
    this.hide()
  }

  // 展示动画
  public show() {
    this.setAlpha(1)
    this.gravity = 0.00002
    this.showPieces()
  }

  // 隐藏动画
  public hide() {
    this.setAlpha(0)
    this.scene.events.removeListener('update', this.handleUpdate, this)
  }

  // 刷新碎片
  private handleUpdate(e) {
    if (this.firstUpdate) {
      this.updateStartTime = e
      this.firstUpdate = false
    }
    const time = e - this.updateStartTime
    this.pieceList.forEach((piece) => {
      const img = piece.img
      if (piece.canMove) {
        img.x += piece.velocityX * time
        // 最高点
        if (piece.velocityY * -1 >= this.gravity) {
          img.y += piece.velocityY * time + (this.gravity * time * time) / 2
          this.gravity *= 1.0001
          piece.highestTime = time
        } else {
          this.gravity = 0.00002 * 4 * 0.9 * 0.8
          img.y += (this.gravity * Math.pow(time - piece.highestTime, 2)) / 2
        }
      }
      // 越界检查
      if (img.x > 375 || img.y > 667) {
        piece.canMove = false
        img.x = piece.startX
        img.y = piece.startY
      }
    })
  }

  // 添加碎片
  private addPieces() {
    this.pieceList = []
    for (let i = 50; i > 0; --i) {
      const x = 375 / 2
      const y = 375 / 2
      const img = this.createPiecesItem(x, y)
      const piece = {
        img,
        // x初速度
        velocityX: this.getRandomVelocityX(),
        // y初速度
        velocityY: this.getRandomVelocityY(),
        // x起始坐标
        startX: x,
        // y起始坐标
        startY: y,
        // 是否可移动
        canMove: true,
      }
      this.pieceList.push(piece)
    }
  }

  createPiecesItem(x, y) {
    const piece = this.scene.add.container(375 / 2, 375 / 2)
    const colors = [
      0xa4f4fb,
      0xf3c77f,
      0xbc98ff,
      0xf4f7f4,
      0xff7d7d,
      0xfff587,
      0xc7ff5f,
      0xff7e5f,
      0x8ed4f9,
      0xffeb1f,
      0xe2fba4,
      0xadc1ff,
    ]
    // 图形
    const graphics = this.scene.add.graphics()
    // 随机获取一种颜色
    graphics.fillStyle(colors[Math.floor(Math.random() * colors.length)], 1)
    graphics.fillCircle(0, 0, this.getRandomIntInclusive(3, 8))
    piece.add(graphics)
    return piece
  }

  // 展示碎片动画
  private showPieces() {
    // 碎片复位
    this.pieceList.forEach((piece) => {
      piece.canMove = true
      const img = piece.img
      img.x = piece.startX
      img.y = piece.startY
      piece.velocityX = this.getRandomVelocityX()
      piece.velocityY = this.getRandomVelocityY()
      // 设置大小
      const width = this.getRandomIntInclusive(13, 31)
      const height = this.getRandomIntInclusive(15, 31)
      img.setSize(width, height).setDisplaySize(width, height)
    })
    window['pieceList'] = this.pieceList
    this.firstUpdate = true
    this.scene.events.on('update', this.handleUpdate, this)
  }

  // 获取随机X速度
  private getRandomVelocityX() {
    return (
      this.getRandomIntInclusive(1, 35) *
      0.0003 *
      (Math.random() > 0.5 ? 1 : -1)
    )
  }

  // 获取随机Y速度
  private getRandomVelocityY() {
    return this.getRandomIntInclusive(-35, -15) * 0.0003 * 2
  }

  // 获取两数之间的随机整数
  protected getRandomIntInclusive(min, max, hasMinus = false) {
    min = Math.ceil(min)
    max = Math.floor(max)
    let res = Math.floor(Math.random() * (max - min + 1)) + min //含最大值，含最小值
    if (res === 0) {
      res = this.getRandomIntInclusive(min, max, hasMinus)
    }
    return res
  }
}

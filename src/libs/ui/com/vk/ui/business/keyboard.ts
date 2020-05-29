import UIUtils from '../../phaser/utils/UIUtils'
import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import UIComponent from '../../phaser/components/UIComponent'
import BaseScene from '../../phaser/scene/SceneBase'

const FONT_FAMILY = 'PingFangSC,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,STHeiti,"sans-serif"'
// 数据
interface KeyboardInfo {
  backgroundImageName?: string
  backspaceImageName?: string
  closeImageName?: string
  keyColor: string
  keyBackGroundColor: number
  closeBackGroundColor: number
}
/**
 * @description 键盘
 */
export default class Keyboard extends UIComponent {
  // 当前场景
  currentScene: BaseScene
  // 键盘背景
  keyboardBackground
  // 输入的回调
  inputCallback: Function
  // 背景图片名称
  backgroundImageName: string
  // 返回键图片名称
  backspaceImageName: string
  // 关闭按钮图片名称
  closeImageName: string
  // 按键字体颜色
  keyColor: string
  // 按键背景颜色
  keyBackGroundColor: number
  // 关闭按键背景颜色
  closeBackGroundColor: number
  // 是否已显示
  isShow: boolean = false

  constructor(scene: BaseScene, $info: KeyboardInfo) {
    super(scene, Keyboard.getRect(scene))
    this.backgroundImageName = $info.backgroundImageName
    this.backspaceImageName = $info.backspaceImageName
    this.closeImageName = $info.closeImageName
    this.keyColor = $info.keyColor
    this.keyBackGroundColor = $info.keyBackGroundColor
    this.closeBackGroundColor = $info.closeBackGroundColor

    this.setName('keyboard')
    this.currentScene = scene
    this.init()
  }

  static getRect($scene: BaseScene): Phaser.Geom.Rectangle {
    const _cr = $scene.camera.getCameraRect()
    return new Phaser.Geom.Rectangle(0, 768 - _cr.y + 25, 1024, 262)
  }

  private init() {
    // 键盘矩形
    const keyboardRect = new Phaser.Geom.Rectangle(-448, 0, 1920, 262)
    // 如果传了背景图片名称
    if (this.backgroundImageName) {
      // 键盘背景
      this.keyboardBackground = UIUtils.CreatImage(
        this.currentScene,
        'keyboardBackground',
        keyboardRect,
        this
      )
      // 键盘背景设置可交互, 防止点击穿透到键盘下面的按钮
      this.keyboardBackground.setInteractive()
    } else {
      this.keyboardBackground = UIUtils.CreatContainer(this.currentScene, keyboardRect, this)
      // 如果没有传背景图片
      UIUtils.CreatRect(this.currentScene, keyboardRect, 0x8ad428, 1, 10, this.keyboardBackground)
      // 键盘背景设置可交互, 防止点击穿透到键盘下面的按钮
      // 调整按键点击区域位置
      const _rect = new Rectangle(
        0,
        0,
        this.keyboardBackground.width,
        this.keyboardBackground.height
      )
      _rect.setPosition(_rect.centerX, _rect.centerY)
      // 按键设置可交互
      this.keyboardBackground.setInteractive(_rect, Rectangle.Contains)
    }
    // 按键背景样式
    const keysStyleArray = [
      {
        name: 'backspace',
        x: 754 + 62 + 16,
        y: 176,
        width: 62,
        height: 62
      },
      {
        name: 'close',
        x: 936,
        y: -25,
        width: 42,
        height: 42
      }
    ]
    if (this.backspaceImageName) {
      keysStyleArray.push({
        name: 'backspace',
        x: 754 + 62 + 16,
        y: 176,
        width: 62,
        height: 62
      })
    }
    // 字母二维矩阵
    const letters = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '-']
    ]
    // 每行字母的Y坐标
    const rowYArray = [20, 98, 176]
    // 每行第一个字母的X坐标
    const rowStartXArray = [130, 150, 208]
    letters.forEach((row, rowIndex) => {
      // 每行字母的y坐标
      const y = rowYArray[rowIndex]
      row.forEach((name, columnIndex) => {
        // 每个字母的x坐标
        const x = rowStartXArray[rowIndex] + (62 + 16) * columnIndex
        keysStyleArray.push({ name, x, y, width: 62, height: 62 })
      })
    })
    keysStyleArray.forEach(item => {
      const { name, x, y, width, height } = item
      // 按键矩形
      const keyRect = new Phaser.Geom.Rectangle(x, y, width, height)
      // 按键抬起背景颜色
      const keyUpBackground = UIUtils.CreatRect(
        this.currentScene,
        keyRect,
        name !== 'close' ? 0xf8f9ff : this.closeBackGroundColor,
        1,
        10,
        this
      )
      // 按键按下背景颜色
      const keyDownBackground = UIUtils.CreatRect(
        this.currentScene,
        keyRect,
        this.keyBackGroundColor,
        1,
        10,
        this
      ).setAlpha(0)
      // 按键容器
      const keyDIV: Container = UIUtils.CreatContainer(this.currentScene, keyRect, this)
      // 调整按键点击区域位置
      const _rect = new Rectangle(0, 0, keyDIV.width, keyDIV.height)
      _rect.setPosition(_rect.centerX, _rect.centerY)
      // 按键设置可交互
      keyDIV.setInteractive(_rect, Rectangle.Contains)
      // 按键上的图片
      let img
      // 按键抬起的文字
      let keyUpText
      // 按键按下的文字
      let keyDownText
      if (name === 'backspace') {
        // 删除键的图片
        // 如果有删除键图片名称
        if (this.backspaceImageName) {
          img = this.addImage({
            imgName: 'keyboardBackspace',
            x: 10,
            y: 16,
            width: 41,
            height: 30,
            parent: keyDIV
          }).setAlpha(0.3)
        } else {
          // 如果没有删除键图片名称
          const style = {
            font: `bold 34px ${FONT_FAMILY}`,
            color: '#259270',
            align: 'center'
          }
          img = UIUtils.CreatText(this.currentScene, '←', width / 2, height / 2, style, keyDIV)
            .setOrigin(0.5, 0.5)
            .setAlpha(0.3)
        }
      } else if (name === 'close') {
        // 关闭键的图片
        // 如果有关闭键图片名称
        if (this.closeImageName) {
          img = this.addImage({
            imgName: 'keyboardClose',
            x: 11,
            y: 11,
            width: 20.22,
            height: 20.22,
            parent: keyDIV
          })
        } else {
          // 如果没有关闭键图片名称
          const style = {
            font: `bold 22px ${FONT_FAMILY}`,
            color: '#259270',
            align: 'center'
          }
          img = UIUtils.CreatText(this.currentScene, 'x', 42 / 2, 42 / 2, style, keyDIV).setOrigin(
            0.5,
            0.5
          )
        }
      } else {
        // 按键抬起文字样式
        const keyUpTextStyle = {
          font: `bold 34px ${FONT_FAMILY}`,
          color: this.keyColor,
          align: 'center'
        }
        // 按键抬起文字
        keyUpText = UIUtils.CreatText(
          this.currentScene,
          name,
          width / 2,
          height / 2,
          keyUpTextStyle,
          keyDIV
        ).setOrigin(0.5, 0.5)
        // 按键按下文字样式
        const keyDownTextStyle = {
          font: `bold 34px ${FONT_FAMILY}`,
          color: '#ffffff',
          align: 'center'
        }
        // 按键按下文字
        keyDownText = UIUtils.CreatText(
          this.currentScene,
          name,
          width / 2,
          height / 2,
          keyDownTextStyle,
          keyDIV
        )
          .setOrigin(0.5, 0.5)
          .setAlpha(0)
      }
      // 按键按下时切换样式
      keyDIV.on('pointerdown', () => {
        if (name === 'backspace') {
          img.setAlpha(1)
        } else if (name === 'close') {
          img.setAlpha(0.3)
        } else {
          keyDownBackground.setAlpha(1)
          keyUpBackground.setAlpha(0)
          keyDownText.setAlpha(1)
          keyUpText.setAlpha(0)
        }
        // 按键抬起时切换样式
        keyDIV.once('pointerup', () => {
          if (name === 'backspace') {
            img.setAlpha(0.3)
          } else if (name === 'close') {
            img.setAlpha(1)
            this.hide()
          } else {
            keyDownBackground.setAlpha(0)
            keyUpBackground.setAlpha(1)
            keyDownText.setAlpha(0)
            keyUpText.setAlpha(1)
          }
          this.inputCallback(name.toLowerCase())
        })
        // 按键移出
        keyDIV.once('pointerout', e => {
          if (name === 'backspace') {
            img.setAlpha(0.3)
          } else if (name === 'close') {
            img.setAlpha(1)
          } else {
            keyDownBackground.setAlpha(0)
            keyUpBackground.setAlpha(1)
            keyDownText.setAlpha(0)
            keyUpText.setAlpha(1)
          }
        })
      })
    })
  }

  // 监听输入
  public onInput(callback: Function) {
    this.inputCallback = callback
  }

  // 展示键盘
  public show() {
    if (this.isShow) return
    this.isShow = true
    this.emit('show')
    const tweens = [
      {
        targets: this,
        y: this.y - 262 - 25,
        duration: 300,
        ease: 'Sine.ease'
      }
    ]
    this.currentScene.tweens.timeline({ tweens })
    return this
  }

  // 隐藏键盘
  public hide() {
    this.isShow = false
    this.emit('hide')
    const tweens = [
      {
        targets: this,
        y: this.y + 262 + 25,
        duration: 300,
        ease: 'Sine.ease'
      }
    ]
    this.currentScene.tweens.timeline({ tweens })
    return this
  }

  // 添加图片
  private addImage(option: any) {
    const { imgName, x, y, width, height, parent } = option
    const imgRect = new Phaser.Geom.Rectangle(x, y, width, height)
    const img = UIUtils.CreatImage(this.currentScene, imgName, imgRect, parent)
    return img
  }
}

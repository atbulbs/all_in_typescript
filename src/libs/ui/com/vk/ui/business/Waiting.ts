/**
 * @author
 * @copyright    2018 Digitsensitive
 * @description  Asteroid: answer box
 * @license      Digitsensitive
 */
import SceneBase from '../../phaser/scene/SceneBase'
import Layer from '../../phaser/components/Layer'
import Container = Phaser.GameObjects.Container
import Rectangle = Phaser.Geom.Rectangle
import UIUtils from '../../phaser/utils/UIUtils'

export default class Waiting extends Layer {
  private currentScene: SceneBase
  private _mask: Phaser.GameObjects.Graphics

  private circle1: Phaser.GameObjects.Graphics
  private circle2: Phaser.GameObjects.Graphics
  private circle3: Phaser.GameObjects.Graphics

  private animas1: Phaser.Tweens.Tween
  private animas2: Phaser.Tweens.Tween
  private animas3: Phaser.Tweens.Tween
  private timer: any

  constructor(scene: SceneBase, $rect: Phaser.Geom.Rectangle, $parent: Container = null) {
    super(scene, $rect, 0.5, 0.5, $parent)

    // variables
    this.currentScene = scene
    this._init()
  }

  private _init(): void {
    this.setScale(0).setAlpha(0)

    // 透明蒙层
    const _rect = this.currentScene.camera.getCameraRect()
    this._mask = UIUtils.CreatRect(this.currentScene, _rect, 0x000000, 0)
    this._mask.setInteractive(_rect, Rectangle.Contains)
    this._mask.setAlpha(0)

    // 背景
    const graphics = this.currentScene.make.graphics({})
    graphics.fillStyle(0x000000)
    graphics.fillRoundedRect(-84, -43, 168, 86, 20)
    graphics.setAlpha(0.8)
    this.add(graphics)

    this.circle1 = this.currentScene.make
      .graphics({})
      .fillStyle(0xffffff)
      .fillCircle(-20, 0, 6)
    this.add(this.circle1)

    this.circle2 = this.currentScene.make
      .graphics({})
      .fillStyle(0xffffff)
      .fillCircle(0, 0, 6)
    this.add(this.circle2)

    this.circle3 = this.currentScene.make
      .graphics({})
      .fillStyle(0xffffff)
      .fillCircle(20, 0, 6)
    this.add(this.circle3)
  }

  // 显示加载动画
  public show(): void {
    // 显示加载动效
    this._mask.setAlpha(1)
    this.setScale(1).setAlpha(1)
    this.circle1.setAlpha(0.4)
    this.circle2.setAlpha(0.4)
    this.circle3.setAlpha(0.4)

    if (!this.animas1) {
      this.animas1 = this.currentScene.tweens.add({
        targets: this.circle1,
        alpha: 1,
        duration: 10,
        onCompleteScope: this,
        onComplete() {
          this.circle3.setAlpha(0.4)
        }
      })
    }

    if (!this.animas2) {
      this.animas2 = this.currentScene.tweens.add({
        targets: this.circle2,
        alpha: 1,
        delay: 310,
        duration: 10,
        onCompleteScope: this,
        onComplete() {
          this.circle1.setAlpha(0.4)
        }
      })
    }

    if (!this.animas3) {
      this.animas3 = this.currentScene.tweens.add({
        targets: this.circle3,
        alpha: 1,
        delay: 620,
        duration: 10,
        onCompleteScope: this,
        onComplete() {
          this.circle2.setAlpha(0.4)
        }
      })
    }

    this.timer = setInterval(() => {
      this.animas1.restart()
      this.animas2.restart()
      this.animas3.restart()
    }, 1240)
  }

  // 移除加载动画
  public hidden(): void {
    this.currentScene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 100
    })
    // 停止动画
    !!this.timer && clearInterval(this.timer)
    !!this.animas1 && this.animas1.stop()
    !!this.animas1 && this.animas2.stop()
    !!this.animas1 && this.animas3.stop()
    this._mask.setAlpha(0)
  }
}

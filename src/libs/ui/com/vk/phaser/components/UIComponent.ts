import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import GameObject = Phaser.GameObjects.GameObject
import { Scene } from 'phaser'
/**
 * UIComponent.ts
 *
 *
 *     creat on:   2019/05/29 17:07:03
 *
 * UI组件基础类,继承自 Phaser.GameObjects.Container
 */
export default class UIComponent extends Container {
  /**
   * 组件是否可用，默认值 true，按钮可用。
   */
  public enable: boolean = true

  /**所在场景 */
  protected _scene: Scene

  /**
   * 构造函数
   * @param $scene        场景
   * @param $rect         所在的区域（大小和位置）
   * @param $parent       父容器                    如此值不为null，则当前UIComponent将被添加至此Container中
   *
   * @see Phaser.Geom.Rectangle
   *
   * 如$parent不为空将会被添加到此容器中，否则将被直接添加到场景当中
   */
  public constructor($scene: Scene, $rect: Rectangle, $parent: Container = null) {
    super($scene, $rect.x, $rect.y)
    this._scene = $scene
    this.setSize($rect.width, $rect.height)
    if ($parent) {
      $parent.add(this)
    } else {
      $scene.sys.displayList.add(this)
    }
  }

  /**
   * 设置可Touch区域。如为空，则以宽高和（0，0）点创建一个矩形作为可触区域。若宽|高为0，则不进行任何操作。
   *
   * 注意：Phaser 3.15 的点击区域描述有问题，这里是为了兼容引擎的错误逻辑，有可能随之引擎升级出现未知的问题
   *
   * @param $rect 可touch区域,默认为null此时将把此容器宽高范围内设置为Touch区域
   */
  public setTouchArea($rect: Rectangle = null): void {
    if (!$rect) {
      if (this.width == 0 || this.height == 0) {
        return
      }
      $rect = new Rectangle(0, 0, this.width, this.height)
      //Phaser 3.15 的点击区域描述有问题，这里是为了兼容引擎的错误逻辑，有可能随之引擎升级出现未知的问题
      $rect.setPosition($rect.centerX, $rect.centerY)
    }
    this.setInteractive($rect, Rectangle.Contains)
  }

  /**
   * 判断某个容器是是当前容器的子对象（不递归子容器）
   * @param {Phaser.GameObjects.GameObject} $c    要判断的子对象
   *
   * @returns {boolean}                           是否在此容器中
   */
  public hasChild($c: GameObject): boolean {
    if (!$c) {
      return false
    }
    let a = this.getAll()
    let i: integer = a.indexOf($c)
    return i > -1
  }

  /**
   * 为子对象设置显示索引
   * @param {Phaser.GameObjects.GameObject} $c    子对象
   * @param {integer} $index                      索引值
   */
  public setChildIndex($c: GameObject, $index: integer): void {
    if (!this.hasChild($c)) {
      return
    }
    this.remove($c)
    this.addAt($c, $index)
  }

  /**
   * 将某子对象置顶显示
   * @param {Phaser.GameObjects.GameObject} $c    要置顶的子对象
   */
  public set2Top($c: GameObject) {
    let i = this.getIndex($c)
    let max: integer = this.numChildren() - 1
    if (i < 0 || i == max) {
      return
    }
    this.remove($c)
    this.add($c)
  }

  /**
   * 获取子显示对象个数
   *
   * @returns {integer}   个数
   */
  public numChildren(): integer {
    let a = this.getAll()
    return a.length
  }
}

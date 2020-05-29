import UIComponent from './UIComponent'
import Image = Phaser.GameObjects.Image
import Text = Phaser.GameObjects.Text
import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import { Scene } from 'phaser'
import UIUtils from '../utils/UIUtils'
import { PhaserEvents } from '../enum/PhaserEvents'
import SoundManager from '../utils/SoundUtils'

/**
 * Title.ts
 *
 *
 *     creat on:   2019/06/06 17:20:27
 *
 * 标题栏组件
 *
 * Example：
 * ```
 *       public create():void{
 *              let style_ = UIUtils.CreatTextStyle(30 , "letf" , "#00ffff");
 *              let rect_:Rectangle = new Rectangle(0 , 300 , 260 , 60);
 *              let title_:Title = new Title(this , rect_ , "btn" , "这是一个Title" , style_)
 *        }
 * ```
 */
export default class Title extends UIComponent {
  /**
   * 构造函数
   * @param $scene            场景
   * @param $rect             渲染区域，包括位置和坐标的矩形
   * @param $texture          背景纹理
   * @param $label            文本
   * @param $textStyle        文本样式，可以由UIUtils.CreatTextStyle生成
   * @param $parent           父容器
   *
   *
   * @see UIUtils.CreatTextStyle
   * @see Phaser.Geom.Rectangle
   */

  protected _bg: Image
  public text: Text

  public constructor(
    $scene: Scene,
    $rect: Rectangle,
    $texture: string,
    $label: string = '',
    $textStyle: Object = null,
    $parent: Container = null
  ) {
    super($scene, $rect, $parent)

    let rect_ = new Rectangle(0, 0, $rect.width, $rect.height)
    this._bg = UIUtils.CreatImage($scene, $texture, rect_, this)
    this.text = UIUtils.CreatText($scene, $label, 0, 0, $textStyle, this)
    this.measure()
  }

  //布局计算
  protected measure(): void {
    const txt_ = this.text
    if (!txt_.text) {
      return
    }
    txt_.x = (this.width - txt_.width) / 2
    txt_.y = (this.height - txt_.height) / 2
  }

  //interface:
  /**
   * 设置按钮文字
   * @param $s    文字
   */
  public setLabel($s: string): void {
    this.text.text = $s
    this.measure()
  }

  /**
   * 获取按钮文字
   */
  public getLabel(): string {
    return this.text.text
  }

  /**
   * 设置文本样式
   * @param $size         字号大小
   * @param $color        字体颜色
   * @param $family       文本字体
   */
  public setTextStyle($size: integer, $color: string, $family = 'Arial Rounded MT Bold'): void {
    let txt_ = this.text
    txt_.setColor($color)
    txt_.setFontSize($size)
    txt_.setFontFamily($family)
    this.measure()
  }
}

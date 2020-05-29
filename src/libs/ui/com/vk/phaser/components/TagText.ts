import { Scene } from 'phaser'
require('../plugins/rextagtext.3.19.0.min')
const rextagtext = window['rextagtext']

/**
 * TagText.ts
 *
 *
 *     creat on:   2019/06/06
 *
 * TagText类,继承自 Rex 的 tagText 插件。
 * @see Guide: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tagtext/
 *
 * Example:
 *       public create():void{
 *
 *          const textStyle = VP.UIUtils.CreatTextStyle(20, 'left', '#000000')
 *          const text = VP.UIUtils.CreatTagText(this, "test <class='highlight'>text</class>", 200, 0, textStyle, {
 *              highlight: {
 *                  color: '#FF0000'
 *              }
 *          })
 *      }
 */
export default class TagText extends rextagtext {
  /**
   * 构造函数
   * @param $scene             需要传入scene场景作为构造器
   * @param $x                 x
   * @param $y                 y
   * @param $text              文字内容
   * @param $style             样式
   * @param $tag               标签
   *
   * @see Phaser.GameObjects.Text
   */
  public constructor(
    $scene: Scene,
    $x: number,
    $y: number,
    $text: string,
    $style: Object,
    $tag: Object = {}
  ) {
    super($scene, $x, $y, $text, TagText.setParams($style, $tag))
    const self: any = this
    $scene.add.existing(self)
  }
  /**
   * 合并文本样式和标签样式
   *
   * @param $style             样式
   * @param $tag               标签
   *
   * @return 合并之后的样式
   */
  private static setParams($style: Object, $tag: Object): Object {
    return Object.assign($style, { tags: $tag })
  }
}

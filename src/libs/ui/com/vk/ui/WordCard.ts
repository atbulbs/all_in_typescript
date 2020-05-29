import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import { Scene } from 'phaser'
import { Button } from '../phaser/VPClass'
// import { Scene } from "vk-micro-sdk-game/dist/types/phaser/vkPhaser";

/**
 * WordCard.ts
 *
 *
 *     creat on:   2019/06/10 15:28:31
 *
 * 单词卡片(图文混排组件)
 */
export default class WordCard extends Button {
  public constructor(
    $scene: Scene,
    $rect: Rectangle,
    $texture: string,
    $label: string = '',
    $textStyle: Object = null,
    $parent: Container = null
  ) {
    super($scene, $rect, $texture, $label, $textStyle, $parent)

    this.useSacleEffect = false
    //TODO...  设置默认样式
  }

  /*protected measure():void{
        //TODO... 布局计算
    }*/
}

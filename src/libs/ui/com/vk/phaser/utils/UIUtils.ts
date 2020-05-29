import { Scene } from 'phaser'

import Point = Phaser.Geom.Point
import Rectangle = Phaser.Geom.Rectangle
import GameObject = Phaser.GameObjects.GameObject
import Image = Phaser.GameObjects.Image
import Text = Phaser.GameObjects.Text
import Graphics = Phaser.GameObjects.Graphics
import Sprite = Phaser.GameObjects.Sprite
import Container = Phaser.GameObjects.Container
import Texture = Phaser.Textures.Texture
import TextureSource = Phaser.Textures.TextureSource
import Config = Phaser.Core.Config
import { AlignType } from '../enum/AlignType'
import ResScene from '../scene/ResScene'
import TagText from '../components/TagText'
/**
 * UIUtils.ts
 *
 *
 *     creat on:   2019/03/13 11:35:33
 *
 *  UI工具类
 */
export default class UIUtils {
  /**
   * 创建Image,以左上角为中心点
   * @param $scene       需要传入scene场景作为构造器
   * @param texture_     图片的纹理
   * @param $rect        Rectangle（nullable）
   * @param $parent      父级容器（nullable）
   *
   * @return 目标Image
   *
   * @see Phaser.Geom.Rectangle
   * @see Phaser.GameObjects.Image
   * @see Phaser.GameObjects.Container
   */
  public static CreatImage(
    $scene: Scene,
    $texture: string | Object,
    $rect: Rectangle = null,
    $parent: Container = null
  ): Image {
    let img_: Image = null
    let texture_ = $texture instanceof Object ? $texture['content'] : $texture
    let frame_ = $texture instanceof Object && $texture['frame']

    if ($scene instanceof ResScene) {
      img_ = ($scene as ResScene).addImg(0, 0, texture_, frame_)
    } else {
      img_ = $scene.add.image(0, 0, texture_, frame_)
    }

    img_.displayOriginX = img_.displayOriginY = 0
    if ($rect) {
      img_.x = $rect.x
      img_.y = $rect.y
      img_.displayWidth = $rect.width
      img_.displayHeight = $rect.height
    }
    if ($parent) {
      $parent.add(img_)
    }
    return img_
  }

  /**
   * 创建Image,以中心为中心点
   * @param $scene       需要传入scene场景作为构造器
   * @param texture_     图片的纹理
   * @param $rect        Rectangle（nullable）
   * @param $parent      父级容器（nullable）
   *
   * @return 目标Image
   *
   * @see Phaser.Geom.Rectangle
   * @see Phaser.GameObjects.Image
   * @see Phaser.GameObjects.Container
   */
  public static CreatImage_center(
    $scene: Scene,
    $texture: string | Object,
    $rect: Rectangle = null,
    $parent: Container = null
  ) {
    let texture_ = $texture instanceof Object ? $texture['content'] : $texture
    let frame_ = $texture instanceof Object && $texture['frame']
    let img_: Image = null
    if ($scene instanceof ResScene) {
      img_ = ($scene as ResScene).addImg(0, 0, texture_, frame_)
    } else {
      img_ = $scene.add.image(0, 0, texture_, frame_)
    }
    if ($rect) {
      img_.displayWidth = $rect.width
      img_.displayHeight = $rect.height
      img_.x = $rect.x + $rect.width / 2
      img_.y = $rect.y + $rect.height / 2
    }
    if ($parent) {
      $parent.add(img_)
    }
    return img_
  }

  /**
   * 构建填充矩形并返回，可以构建纯色的直角矩形和圆角矩形
   * @param $scene       需要传入scene场景作为构造器
   * @param $rect        初始区域Rectangle
   * @param $color       要填充的颜色
   * @param $alpha       要填充的透明度，默认值为1
   * @param $radius      圆角角度，默认值为0（直角矩形）
   * @param $parent      父级容器，默认为null（直接添加到Scene中）
   *
   * @return 定制好的Graphics
   *
   * @see Phaser.Geom.Rectangle
   */
  public static CreatRect(
    $scene: Scene,
    $rect: Rectangle,
    $color: integer,
    $alpha: number = 1,
    $radius: number = 0,
    $parent: Container = null
  ): Graphics {
    let graphics_: Graphics = $scene.add.graphics()
    graphics_.x = $rect.x
    graphics_.y = $rect.y

    let rect_: Rectangle = new Rectangle(0, 0, $rect.width, $rect.height)
    UIUtils.FillRect(graphics_, rect_, $color, $alpha, $radius)
    if ($parent) {
      $parent.add(graphics_)
    }
    return graphics_
  }

  /**
   * 构建填充矩形图片并返回，可以构建纯色的直角矩形和圆角矩形
   * @param $scene       需要传入scene场景作为构造器
   * @param $rect        初始区域Rectangle
   * @param $color       要填充的颜色
   * @param $alpha       要填充的透明度，默认值为1
   * @param $radius      圆角角度，默认值为0（直角矩形）
   * @param $parent      父级容器，默认为null（直接添加到Scene中）
   *
   * @return 定制好的Graphics
   *
   * @see Phaser.Geom.Rectangle
   */
  public static CreatRectImage(
    $scene: Scene,
    $rect: Rectangle,
    $key: string,
    $color: integer,
    $alpha: number = 1,
    $radius: number = 0,
    $parent: Container = null
  ): Image {
    // 检测是否已有对应资源
    if (!$scene.game.textures.exists($key)) {
      let graphics_: Graphics = $scene.add.graphics()
      graphics_.x = $rect.x
      graphics_.y = $rect.y

      let rect_: Rectangle = new Rectangle(0, 0, $rect.width, $rect.height)
      UIUtils.FillRect(graphics_, rect_, $color, $alpha, $radius)

      // 转成图片资源
      graphics_.generateTexture($key, $rect.width, $rect.height)
      graphics_.destroy()
    }

    const _img = this.CreatImage($scene, $key, $rect, $parent)
    return _img
  }

  /**
   * 填充圆角矩形
   * @param $graphics           要填充的Graphics
   * @param $rect        要填充的区域Rectangle
   * @param $color       要填充的颜色
   * @param $alpha       要填充的透明度，默认值为1
   * @param $radius      圆角角度，默认值为0（直角矩形）
   *
   * @see Phaser.Geom.Rectangle
   */
  public static FillRect(
    $graphics: Graphics,
    $rect: Rectangle,
    $color: integer,
    $alpha: number = 1,
    $radius: number = 0
  ): void {
    $graphics.beginPath()
    $graphics.fillStyle($color, $alpha)
    if ($radius == 0) {
      $graphics.fillRect($rect.x, $rect.y, $rect.width, $rect.height)
    } else {
      $graphics.fillRoundedRect($rect.x, $rect.y, $rect.width, $rect.height, $radius)
    }
  }

  /**
   * 创建文本样式
   * @param $size    字号
   * @param $align   对齐方式
   * @param $family  字体类型
   * @param $weight  字体粗细
   * @param $color   文字颜色
   * @param $lineHeight  行高
   *
   * @return  文本样式
   */
  public static CreatTextStyle(
    $size,
    $align,
    $color,
    $family = 'Arial Rounded MT Bold',
    $weight = null,
    $lineHeight = null
  ): Object {
    let style_ = {
      fontSize: $size + 'px',
      align: $align,
      fontFamily: $family,
      color: $color
    }

    if ($weight) {
      style_['weight'] = $weight
    }
    if ($lineHeight) {
      style_['line-height'] = $lineHeight
    }

    return style_
  }

  /**
   * 创建文本
   * @param $scene             需要传入scene场景作为构造器
   * @param $text              文字内容
   * @param $x                 x
   * @param $y                 y
   * @param $style             样式
   * @param $parent            父级容器
   *
   * @return 文本
   *
   * @see Phaser.Geom.Rectangle
   */
  public static CreatText(
    $scene: Scene,
    $text: string,
    $x: number,
    $y: number,
    $style: Object,
    $parent = null
  ): Text {
    let txt_: Text = $scene.add.text(
      $x,
      $y,
      $text,
      Object.assign($style, {
        // 用于提升清晰度
        resolution: 3
      })
    )
    if ($parent) {
      $parent.add(txt_)
    }
    return txt_
  }

  /**
   * 创建标签文本
   * @param $scene             需要传入scene场景作为构造器
   * @param $text              文字内容
   * @param $x                 x
   * @param $y                 y
   * @param $style             样式
   * @param $tag               标签
   * @param $parent            父级容器
   *
   * @return 文本
   */
  public static CreatTagText(
    $scene: Scene,
    $text: string,
    $x: number,
    $y: number,
    $style: Object,
    $tag: Object = {},
    $parent = null
  ): TagText {
    let txt_ = new TagText(
      $scene,
      $x,
      $y,
      $text,
      Object.assign($style, {
        // 用于提升清晰度
        resolution: 3
      }),
      $tag
    )
    if ($parent) {
      $parent.add(txt_)
    }
    return txt_
  }

  /**
   * 创建文容器
   * @param $scene             需要传入scene场景作为构造器
   * @param $rect              Rectangle 容器的宽高和坐标
   * @param $parent            父容器（nullable）
   *
   * @return  创建出来的容器
   *
   * @see Phaser.Geom.Rectangle
   */
  public static CreatContainer(
    $scene: Scene,
    $rect: Rectangle,
    $parent: Container = null
  ): Container {
    let container_: Container = $scene.add.container($rect.x, $rect.y)
    container_.width = $rect.width
    container_.height = $rect.height
    if ($parent) {
      $parent.add(container_)
    }

    return container_
  }

  /**
   * 添加雪碧图动画
   * @param $scene     场景
   * @param $texture   纹理名称
   * @param $aniKey    动画名          用来定义和播放动画
   * @param $rect      布局区域        定义动画的位置和大小
   * @param $repeat    重复次数        默认为-1，无限循环播放
   * @param $rate      帧率
   * @param $parent    父容器
   * @param $autoPlay  是否自动播放
   *
   * @return Sprite动画
   *
   * @see Phaser.Geom.Rectangle
   */
  public static CreatSpriteAnimation(
    $scene: Scene,
    $texture: string,
    $aniKey: string,
    $rect: Rectangle = null,
    $repeat: integer = -1,
    $rate: integer = 6,
    $parent: Container = null,
    $autoPlay: boolean = true
  ): Sprite {
    let obj_ = {
      key: $aniKey,
      repeat: $repeat,
      frames: $scene.anims.generateFrameNumbers($texture, {}),
      frameRate: $rate
    }
    $scene.anims.create(obj_)
    let spr_: Sprite = $scene.add.sprite(0, 0, $texture)
    spr_.anims.load($aniKey)
    if ($rect) {
      UIUtils.Fit2Rect(spr_, $rect)
    }
    if ($parent) {
      $parent.add(spr_)
    }
    if ($autoPlay) {
      spr_.anims.play($aniKey)
    }
    return spr_
  }

  /**
   *  将显示对象紧贴至矩形区域
   * @param $child       GameObject,支持Image等
   * @param $rect     Rectangle 目标区域，即现实对象实际出现的区域
   * @param $align    GameObject参考点所在位置 ,枚举为AlignType
   *
   * @see com.vk.enum.AlignType
   * @see Phaser.Geom.Rectangle
   *
   *  注意：
   *      必须预先设置显示对象的width、height值
   *
   *  支持的对象：Image、Sprite、Graphics等
   */
  public static Fit2Rect(
    $child: any,
    $rect: Rectangle,
    $align: AlignType = AlignType.TopLeft
  ): void {
    if (!$child || !$child.width || !$child.height) {
      return
    }
    let point_: Point = new Point()
    switch ($align) {
      case AlignType.TopLeft:
        point_.setTo(0, 0)
        break
      case AlignType.Center:
        point_.setTo($child.width / 2, $child.height / 2)
        break
      case AlignType.Auto:
        point_.setTo($child.displayOriginX, $child.displayOriginY)
        break
    }

    $child.displayOriginX = point_.x
    $child.displayOriginY = point_.y
    $child.displayWidth = $rect.width
    $child.displayHeight = $rect.height
    $child.x = $rect.x + point_.x
    $child.y = $rect.y + point_.y
  }

  /**
   * 计算相似外矩形
   * @param  $designWidth       设计宽度
   * @param  $designHeight      设计高度
   * @param  $windowWidth       舞台宽度
   * @param  $windowHeight      舞台高度
   *
   * @return Rectangle   相似外矩形
   */
  public static CalcOutArea(
    $designWidth: integer,
    $designHeight: integer,
    $windowWidth: integer = 0,
    $windowHeight: integer = 0
  ): Rectangle {
    $windowWidth = $windowWidth > 0 ? $windowWidth : window.innerWidth
    $windowHeight = $windowHeight > 0 ? $windowHeight : window.innerHeight

    let rect_: Rectangle = new Rectangle()
    const sx_: number = $windowWidth / $designWidth
    const sy_: number = $windowHeight / $designHeight
    const s_: number = Math.max(sx_, sy_)
    rect_.width = Math.ceil($designWidth * s_)
    rect_.height = Math.ceil($designHeight * s_)
    rect_.x = Math.round(($windowWidth - rect_.width) / 2)
    rect_.y = Math.round(($windowHeight - rect_.height) / 2)
    return rect_
  }

  /**
   * 计算相似内矩形
   * @param  $designWidth       设计宽度
   * @param  $designHeight      设计高度
   * @param  $windowWidth       舞台宽度
   * @param  $windowHeight      舞台高度
   *
   * @return Rectangle   相似内矩形
   */
  public static CalcInnerArea(
    $designWidth: integer,
    $designHeight: integer,
    $windowWidth: integer = 0,
    $windowHeight: integer = 0
  ): Rectangle {
    $windowWidth = $windowWidth > 0 ? $windowWidth : window.innerWidth
    $windowHeight = $windowHeight > 0 ? $windowHeight : window.innerHeight

    let rect_: Rectangle = new Rectangle()
    const sx_: number = $windowWidth / $designWidth
    const sy_: number = $windowHeight / $designHeight
    const s_: number = Math.min(sx_, sy_)
    rect_.width = Math.ceil($designWidth * s_)
    rect_.height = Math.ceil($designHeight * s_)
    rect_.x = Math.round(($windowWidth - rect_.width) / 2)
    rect_.y = Math.round(($windowHeight - rect_.height) / 2)
    return rect_
  }

  /**
   * 递归得到获取$child 在Scene根下的位置， 通常用以设置此GameObject的mask设置
   *
   * @param $child 要计算的GameObject   必须继承Phaser.GameObjects.Components.Transform，如：Text、Sprite、Image等
   *
   * @return 在Scene根下的位置
   */
  public static getScenePos($child: GameObject): Point {
    const point_ = new Point($child['x'], $child['y'])
    while ($child.parentContainer) {
      $child = $child.parentContainer
      point_.x += $child['x']
      point_.y += $child['y']
    }
    return point_
  }

  /**
   * 获取某对象在舞台上的当前可视区域
   *
   * @param {Phaser.GameObjects.GameObject} $child    要计算的现实对象
   * @param {Phaser.Core.Config} $gameConfig          当前Game实例配置
   *
   * @returns {Phaser.Geom.Rectangle}                 这个对象可以显示的区域
   */
  public static getSceneArea($child: GameObject, $gameConfig: Config): Rectangle {
    let w = $gameConfig.width as number
    let h = $gameConfig.height as number
    let rect_: Rectangle = new Rectangle(0, 0, w, h)
    let point_ = UIUtils.getScenePos($child)
    rect_.setPosition(-point_.x, -point_.y)
    return rect_
  }

  /**
   * 获取纹理原始图片大小
   * @param {Phaser.Scene} $scene   场景
   * @param {string} $texture       纹理key
   *
   * @returns {Phaser.Geom.Rectangle}   描述纹理大小的矩形
   */
  public static getTerxtureSize($scene: Scene, $texture: string): Rectangle {
    let texture_: Texture = $scene.textures.get($texture)
    let source_: TextureSource = texture_.source[0]
    let rect_: Rectangle = new Rectangle(0, 0, source_.width, source_.height)
    return rect_
  }
}

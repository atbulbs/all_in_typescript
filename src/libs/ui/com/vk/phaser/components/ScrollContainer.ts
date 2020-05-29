import Point = Phaser.Geom.Point
import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import { Scene, Data } from 'phaser'
import UIComponent from './UIComponent'
import Graphics = Phaser.GameObjects.Graphics
import UIUtils from '../utils/UIUtils'
import DragHelper from '../tools/DragHelper'
import { EventTypes } from '../enum/EventTypes'
import IMasker from './IMasker'

/**
 * ScrollContainer.ts
 *
 *
 *     creat on:   2019/06/05 11:22:56
 *
 * 垂直滚动容器。滚动时派发EventTypes.Scroll事件
 * 受enable参数影响，当enable为false时，不可拖动
 * 注意：
 *      1. 如需要改变坐标和宽高或进行缩放时，必须调用resetArea方法重新进行布局定位。本组件不支持缩放、旋转、扭曲操作，强行设置相关参数可能造成显示异常。
 *      2. 不可直接设置 x、y坐标和宽高
 *
 * Event：EventTypes.Scroll
 *
 * Example：
 * ```
 *       public create():void{
 *              const rect_:Rectangle = new Rectangle(150 , 350 , 100 , 100);
 *              const scroll_:ScrollContainer = new ScrollContainer(this , rect_);
 *              rect_.setPosition(0 , 0);
 *              const img_ = UIUtils.CreatImage(this , "dude" , rect_ , scroll_);
 *              scroll_.setContentHeight(150);
 *        }
 * ```
 */

/**
 * @todo
 * 两个区域互相不影响
 * 移动端拖拽不受影响
 * 区域滚动页面不滚动
 * 长度不够不用做监听
 */

export default class ScrollContainer extends UIComponent implements IMasker {
  /**是否显示滚动滑块 */
  public showScrollBar: boolean = false

  private _mask: Graphics

  /**内容高度 */
  private _contentHeight: number
  /**滚动上边界 */
  protected _top: number
  /**组件的位置区域 */
  private _rect: Rectangle
  private _drager: DragHelper

  private _bg: Graphics

  private _scrollBar: Graphics
  private _scrollBarHeight: integer
  showScrollBarTimer
  hideScrollBarTimer

  /**
   * 构造函数
   * @param $scene        场景
   * @param $rect         所在的区域（大小和位置）
   *
   * @see Phaser.Geom.Rectangle
   *
   * 与其父类不同，无$parent参数，且不能被添加到其他容器中，即：只能在Scene下直接使用。
   */
  public constructor(
    $scene: Scene,
    $outerRect: Rectangle,
    $rect: Rectangle,
    $parent: Container = null
  ) {
    super($scene, $rect, $parent)
    //设置mask
    this._rect = Rectangle.Clone($rect)
    const graphics_ = UIUtils.CreatRect($scene, $rect, 0x000000, 0)

    const gmask_ = graphics_.createGeometryMask(this._mask)
    this.setMask(gmask_)
    this._mask = graphics_

    //设置dragHelper
    // $scene.sys.displayList.swap(this, graphics_)
    const rect_ = new Rectangle(0, 0, this.width, this.height)
    graphics_.setInteractive(rect_, Rectangle.Contains)
    const drager_ = new DragHelper($scene)
    drager_.setTarget(graphics_)
    drager_.on(EventTypes.DragStart, this.onDragStart, this)
    drager_.on(EventTypes.DragMove, this.onDragMove, this)
    drager_.on(EventTypes.DragStop, this.onDragEnd, this)
    this._drager = drager_
    //初始化drag范围
    this.setContentHeight($rect.height)
    this.refuseMaskPos()

    const userAgent = navigator.userAgent
    // iPad ua: "Mozilla/5.0 (iPad; CPU OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E302 vkhybrid/2.1.4 app_kid/2.15.0 ios/11.3.1 devicemodel/iPad4,5 osversion/11.3.1 study-app/2.15.0 --ipad" = $2
    // android pad ua: "Mozilla/5.0 (iPad; CPU OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E216 devicemodel/iPad7,5 osversion/11.3 vkhybrid/0.0.1 study-apad/1.0.0 --apad"
    const isIPad = userAgent.endsWith('--ipad')
    const isAPad = userAgent.endsWith('--apad')
    // 只在pc端支持鼠标滚轮, 避免在pad上与拖动的冲突
    if (!(isIPad || isAPad)) {
      // 添加鼠标滚轮监听区域
      const handleWheel = this.handleWheel.bind(this)
      const outerGraphics = UIUtils.CreatRect($scene, Rectangle.Clone($outerRect), 0x000000, 0)
      outerGraphics.setInteractive(
        new Rectangle(0, 0, $outerRect.width, $outerRect.height),
        Rectangle.Contains
      )
      outerGraphics.on('wheel', handleWheel)
      const html = window.document.documentElement
      const body = window.document.body
      let scrollTop
      let enterFlag = false
      const _scroll = ($event) => {
        html.scrollTop = scrollTop
        document.body.scrollTop = scrollTop
      }
      outerGraphics.on('pointerover', () => {
        if (!enterFlag) {
          // 禁用dom滚动
          scrollTop = html.scrollTop || body.scrollTop
          window.addEventListener('scroll', _scroll, false)
        } else {
          enterFlag = true
        }
      })
      outerGraphics.on('pointerout', () => {
        // 恢复dom滚动
        enterFlag = false
        window.removeEventListener('scroll', _scroll, false)
      })


    }
  }

  // 添加鼠标滚轮监听
  private handleWheel(e) {
    if (this.showScrollBarTimer) {
      return
    } else {
      this.showScrollBarTimer = setTimeout(() => {
        window.clearTimeout(this.showScrollBarTimer)
        this.showScrollBarTimer = null
        this.onDragStart(this._drager)
        this.onDragMove(this._drager, 0, e.deltaY)
      }, 50)
    }
    if (this.hideScrollBarTimer) {
      return
    } else {
      this.hideScrollBarTimer = setTimeout(() => {
        window.clearTimeout(this.hideScrollBarTimer)
        this.hideScrollBarTimer = null
        this.onDragEnd(this._drager)
      }, 1500)
    }
  }

  //事件处理
  private onDragStart($drager: DragHelper): void {
    if (!this.showScrollBar) {
      return
    }

    if (this.height > this._contentHeight) {
      return
    }

    this._scrollBarHeight = this.height * (this.height / this._contentHeight)
    let rect_
    if (!this._scrollBar) {
      rect_ = new Rectangle(this.width - 6, 0, 6, this._scrollBarHeight)
      this._scrollBar = UIUtils.CreatRect(this._scene, rect_, 0x000000, 0.2, 3, this)
    } else {
      this._scrollBar.clear()
      rect_ = new Rectangle(0, 0, 6, this._scrollBarHeight)
      UIUtils.FillRect(this._scrollBar, rect_, 0x000000, 0.2, 3)
      this._scrollBar.visible = true
    }
    this.refuseBarPos()
  }

  private onDragMove($drager: DragHelper, $dx: number, $dy: number): void {
    if (!this.enable) {
      return
    }
    let pos_ = this.y
    let y = this.y + $dy
    y = Math.min(this._rect.y, y)
    y = Math.max(this._top, y)
    this.y = y

    if (this.y != pos_) {
      this.refuseBarPos()
      this.emit(EventTypes.Scroll, this)
    }
  }

  private onDragEnd($drager: DragHelper): void {
    if (this._scrollBar) {
      this._scrollBar.visible = false
    }
  }

  private refuseBarPos(): void {
    if (!this.showScrollBar || !this._scrollBar) {
      return
    }
    const dy_ = this._rect.y - this.y
    this._scrollBar.y = dy_ + (dy_ / this._contentHeight) * this.height
  }

  private measureTop(): void {
    const height_ = this._contentHeight
    if (height_ <= this._rect.height) {
      this._top = this._rect.top
    } else {
      this._top = this._rect.y - (height_ - this._rect.height)
    }
  }

  //interface
  /**
   * 根据Phaser原生的getBounds来测量和计算最大拖动范围
   */
  public measureContentHeight(): void {
    let rect_ = this.getBounds()
    this.setContentHeight(rect_.height)
  }

  /**
   * 设定内容高度，并根据此高度计算最大拖动范围
   * @param $height
   */
  public setContentHeight($height: number): void {
    this._contentHeight = $height

    this.measureTop()
  }

  /**
   * 重新设定此组件所在区域
   * @param $rect 组件所在区域
   */
  public resetArea($rect: Rectangle): void {
    this._rect.setTo($rect.x, $rect.y, $rect.width, $rect.height)
    this.measureTop()
  }

  /**
   * 复位，恢复到无scroll的位置
   */
  public reset(): void {
    this.y = this._rect.y
  }

  /**
   * 销毁
   * @param $fromeScene
   */
  public destroy($fromeScene = false): void {
    if (!!this._bg) {
      this._bg.destroy()
      this._bg = null
    }
    this._drager.removeAllListeners()
    super.destroy($fromeScene)
  }

  /**
   * 获取遮罩和Touch事件对象
   *
   * @return 一个位于Scene中的Graphics，用于对ScrollContainer进行遮罩并回去拖动所需的Touch事件
   */
  public getInteractive(): Graphics {
    return this._mask
  }

  /**
   * 手动开始拖动
   */
  public startDrag(): void {
    this._drager.startDrag()
  }

  /**
   * 设置位置
   * @param $x x坐标
   * @param $y y坐标
   */
  public setPos($x: number, $y: number): void {
    let dy_ = this.y - this._rect.y
    this._rect.x = $x
    this._rect.y = $y
    this.setPosition($x, $y + dy_)
    this.refuse()
  }

  /**
   * 重新定位滚动顶端Top，以及mask的位置
   */
  public refuse(): void {
    this.refuseMaskPos()
    this.measureTop()
  }

  /**
   * 刷新Mask位置
   *
   * @see UIUtils.getScenePos
   */
  public refuseMaskPos(): void {
    let dy_ = this.y - this._rect.y
    let p_: Point = UIUtils.getScenePos(this)
    this._mask.setPosition(p_.x, p_.y - dy_)
  }
}

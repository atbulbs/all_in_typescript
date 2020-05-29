import GameObject = Phaser.GameObjects.GameObject
import { PhaserEvents } from '../enum/PhaserEvents'
import { EventTypes } from '../enum/EventTypes'

/**
 * PageTurn.ts
 *
 *
 *     creat on:   2019/06/04 14:53:38
 *
 * 翻页辅助逻辑，传入上一页和下一页按钮，用户点击按钮触发翻页事件，
 * 引发：EventTypes.Change、EventTypes.Prev、EventTypes.Next
 * 首页时，自动隐藏上一页按钮。末页时，隐藏下一页按钮.如果tatial为0，则同事隐藏上一页和下一页按钮。
 *
 * Event: EventTypes.Prev
 * Event: EventTypes.Next
 * Event: EventTypes.Change
 *
 * Example:
 * ```
 *      public create():void{
 *          const rect_:Rectangle = new Rectangle(50 , 200 , 80 , 40);
 *          const prev_:Button = new Button(this , rect_ , "btn" , "上一页");
 *          rect_.x = 200;
 *          const next_:Button = new Button(this , rect_ , "btn" , "下一页");
 *          const page_:PageTurn = new PageTurn(prev_ , next_);
 *          page_.setData(0 , 10);
 *          page_.on(EventTypes.Change , function($val:integer):void{
 *              console.log("翻页：" + $val + "/" + page_.getTotial());
 *          } , this);
 *      }
 * ```
 */
export default class PageTurn extends Phaser.Events.EventEmitter {
  /**总页数*/
  protected _totial: integer = 1
  /**当前索引 */
  protected _index: integer = 0

  private _prev: GameObject
  private _next: GameObject
  private _prev_disable: GameObject
  private _next_disable: GameObject

  public constructor($prev: GameObject = null, $next: GameObject = null) {
    super()
    this.setButtons($prev, $next)
  }

  //事件响应
  private onPrev(): void {
    let i = this._index - 1
    i = Math.max(0, i)
    if (i == this._index) {
      return
    }
    this._index = i
    this.refuse()
    this.emit(EventTypes.Prev, this._index)
    this.emit(EventTypes.Change, this._index)
  }

  private onNext(): void {
    let i = this._index + 1
    i = Math.min(this._totial - 1, i)
    if (i == this._index) {
      return
    }
    this._index = i
    this.refuse()
    this.emit(EventTypes.Next, this._index)
    this.emit(EventTypes.Change, this._index)
  }

  private refuse(): void {
    if (this._totial > 0) {
      this._prev['visible'] = this._index > 0
      this._next['visible'] = this._index < this._totial - 1
    } else {
      this._prev['visible'] = false
      this._next['visible'] = false
    }
    if (this._prev_disable) {
      this._prev_disable['visible'] = !this._prev['visible']
    }
    if (this._next_disable) {
      this._next_disable['visible'] = !this._next['visible']
    }
  }

  //interface
  /**
   * 设置被点击的GameObject
   * @param $prev     上一页
   * @param $next     下一页
   */
  public setButtons(
    $prev: GameObject,
    $next: GameObject,
    $prev_disable: GameObject = null,
    $next_disable: GameObject = null
  ): void {
    this._prev_disable = $prev_disable
    this._next_disable = $next_disable
    if (this._prev) {
      this._prev.off(PhaserEvents.pointerdown, this.onPrev, this, false)
    }
    if (this._next) {
      this._next.off(PhaserEvents.pointerdown, this.onNext, this, false)
    }
    this._prev = $prev
    this._next = $next
    this._prev.on(PhaserEvents.pointerdown, this.onPrev, this)
    this._next.on(PhaserEvents.pointerdown, this.onNext, this)
  }

  /**
   * 设置数据
   * @param $index        当前索引    有效区间：0-（$totial-1），超出范围将被舍入至有效区间
   * @param $totial       总页数      有效区间：>=0，超出范围将被舍入至有效区间
   */
  public setData($index: integer, $totial: integer): void {
    this._totial = Math.max($totial, 0)
    $index = Math.max($index, 0)
    $index = Math.min($totial - 1, 0)
    this._index = $index
    this.refuse()
  }

  /**
   * 设置当前索引
   * @param $index    当前索引    有效区间：0-（totial-1），超出范围将被舍入至有效区间
   */
  public setIndex($index: integer): void {
    $index = Math.max($index, 0)
    $index = Math.min(this._totial - 1, 0)
    this._index = $index
    this.refuse()
  }

  /**
   * 返回总页数
   *
   * @return 总页数
   */
  public getTotial(): integer {
    return this._totial
  }

  /**
   * 返回当前索引
   *
   * @return 当前Index
   */
  public getIndex(): integer {
    return this._index
  }

  public setPrevVisible(value: boolean): void {
    this._prev['visible'] = value
    if (this._prev_disable) {
      this._prev_disable['visible'] = !this._prev['visible']
    }
  }

  public setNextVisible(value: boolean): void {
    this._next['visible'] = value
    if (this._next_disable) {
      this._next_disable['visible'] = !this._next['visible']
    }
  }

  public setPrevAlpha(value: number): void {
    this._prev['alpha'] = value
    if (this._prev_disable) {
      this._prev_disable['alpha'] = value
    }
  }

  public setNextAlpha(value: number): void {
    this._next['alpha'] = value
    if (this._next_disable) {
      this._next_disable['alpha'] = value
    }
  }
}

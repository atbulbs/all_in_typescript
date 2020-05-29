import ScrollContainer from './ScrollContainer'
import Rectangle = Phaser.Geom.Rectangle
import { Scene } from 'phaser'

/**
 * List.ts
 *
 *
 *     creat on:   2019/06/06 13:51:56
 *
 * List组件
 *
 * @see ScrollContainer
 *
 * 注意：
 *      1. List如需拖动功能，必须直接置于Scene之下（原因同ScrollContainer组件）
 *      2. ListItem必须自行设定height来完成布局，也可通过设置gap来完成此动作
 *
 * Example:
 * ```
 *      public create():void{
 *          let rect_:Rectangle = new Rectangle(0 , 200 , 200 , 200);
 *          let list_:List = new List(this , rect_ , MyListItem);
 *          let data_ = ["1" , "2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "11" , "12" , "13" , "14"];
 *          list_.setListData(data_);
 *       }
 *
 *
 * class MyListItem extends UIComponent implements IListRender{
 *
 *      private _txt:Text;
 *
 *      public constructor($scene: Scene, $rect:Rectangle, $parent:Container = null) {
 *        super( $scene , $rect , $parent);
 *        const style_ = UIUtils.CreatTextStyle(20 , "left" , "#00ff00")
 *        this._txt = UIUtils.CreatText($scene , "" , 50 , 0 , style_ , this);
 *
 *        //设置Item高度，这很重要。如果ListItem的heigh是0，所有Item会叠在一起。
 *        this.height = 40;
 *      }
 *
 *      public setItemData($data:any):void{
 *        this._txt.text = $data;
 *      }
 * }
 * ```
 */
export default class List extends ScrollContainer {
  private _itemType: any

  /**相邻ListItem之间的间隔 */
  public gap: number = 0

  /**
   * 构造函数
   * @param $scene        场景
   * @param $rect         所在的区域（大小和位置）
   * @param $itemType     ListItem渲染器类型          这个类需要继承UIComponent(或实现其构造函数功能)，并实现IListRender接口。
   *
   * @see IListRender
   * @see UIComponent
   * @see Phaser.Geom.Rectangle
   */
  public constructor($scene: Scene, $outerRect: Rectangle, $rect: Rectangle, $itemType: Class) {
    super($scene, $outerRect, $rect)
    this._itemType = $itemType
  }

  /**
   * 为List设置渲染所用的数据
   * @param $a    List数据数组
   */
  public setListData($a: any[]): void {
    this.reset()
    let num_: integer = $a ? $a.length : 0
    const children_ = this.list
    while (children_.length > num_) {
      let child_ = this.getAt(children_.length - 1)
      child_.destroy(true)
    }

    let rect_ = new Rectangle(0, 0, this.width, 0)
    for (let i = 0; i < $a.length; i++) {
      let item_: any = null
      if (i < children_.length) {
        item_ = children_[i]
      } else {
        item_ = new this._itemType(this._scene, rect_, this)
      }
      item_.setItemData($a[i])
      item_.y = rect_.y
      rect_.y += item_.height + this.gap
    }
    rect_.y -= rect_.y > 0 ? this.gap : 0
    this.setContentHeight(rect_.y)
  }
}

/**
 * LineModel.ts
 *
 *
 *     creat on:   2019/05/27 17:35:10
 *
 * 连线题数据结构（1对1类型）
 *
 * Example:
 * ```
 *      //初始化模型 + 数据赋值
 *      let o:LineModel = new LineModel();
 *      o.add("橘子" ,"水果");
 *      o.add("米饭" ,"主食");
 *      o.add("鹦鹉" ,"动物");

 *      //模拟连线过程
 *      console.log("连线开始");
 *      let testData = [["橘子" ,"水果"] , ["鹦鹉" ,"水果"] ,  ["鹦鹉" ,"动物"] ,  ["米饭" ,"主食"] , ]
 *      for(let i=0; i<testData.length ; i++){
 *          let a = testData[i];
 *          let b:boolean = o.try2Select(a[0] , a[1]);
 *          console.log("连线" , a , b);
 *      }

 *      //游戏结果判断
 *      if(o.isComplete()){
 *          console.log("全部连线完成");
 *      }else{
 *          console.log("连线尚未完成");
 *      }
 * ```
*/
export default class LineModel {
  private _data: Object = new Object()

  /**
   * 添加数据
   * @param $leftId       左侧选项Id
   * @param $rightId      对应的右侧选项Id
   */
  public add($leftId: string, $rightId: string): void {
    const item_: Item = new Item($leftId, $rightId)
    this._data[$leftId] = item_
  }

  /**
   * 判断左右选项是否匹配
   * @param $leftId       左侧选项Id
   * @param $rightId      右侧选项Id
   *
   * @return      是否匹配
   */
  public isRight($leftId: string, $rightId: string): boolean {
    const item_: Item = this._data[$leftId]
    if (!item_) {
      return false
    }
    let b: boolean = item_.rightId == $rightId
    return b
  }

  /**
   * 选中某项
   * @param $leftId   左侧选项Id
   */
  public select($leftId: string): void {
    let item_: Item = this._data[$leftId]
    if (item_) {
      item_.selected = true
    }
  }

  /**
   * 尝试进行连线。如果给定左右选项Id匹配，则返回true，否则返回false
   * @param $leftId       左侧选项Id
   * @param $rightId      右侧选项Id
   *
   * @return      返回连线是否成功
   */
  public try2Select($leftId: string, $rightId: string): boolean {
    let b = this.isRight($leftId, $rightId)
    if (b) {
      let item: Item = this._data[$leftId]
      item.selected = true
    }
    return b
  }

  /**
   * 取消某条连线
   * @param $leftId 左侧选项Id
   */
  public unSelected($leftId: string): void {
    let item_: Item = this._data[$leftId]
    if (item_) {
      item_.selected = false
    }
  }

  /**
   * 刷新数据，即：删除所有选项数据。
   */
  public refuse(): void {
    this._data = new Object()
  }

  /**
   * 判断游戏是否已经完成
   *
   * @return true-游戏已完成，false-游戏还未完成
   */
  public isComplete(): boolean {
    let b: boolean = true
    for (let key in this._data) {
      let item_: Item = this._data[key]
      if (!item_.selected) {
        b = false
        break
      }
    }
    return b
  }
}

/**
 * 一对连线选项的数据结构
 */
class Item {
  /**左侧选项Id */
  public leftId: string
  /**右侧选项Id */
  public rightId: string
  /**是否已经选中，默认为false */
  public selected: boolean = false

  /**
   * 构造函数
   * @param $leftId       左侧选项Id
   * @param $rightId      右侧选项Id
   */
  public constructor($leftId: string, $rightId: string) {
    this.leftId = $leftId
    this.rightId = $rightId
  }
}

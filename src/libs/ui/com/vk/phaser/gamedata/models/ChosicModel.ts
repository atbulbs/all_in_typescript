/**
 * ChosicModel.ts
 *
 *
 *     creat on:   2019/05/27 16:09:41
 *
 * 一道选择题（含多选/单选）的数据结构，含有一组选项
 *
 * Example：
 * ```
 *      //初始化数据
 *      let o:ChosicModel = new ChosicModel();
 *      o.add("0" , true);
 *      o.add("1" , false);
 *      o.add("2" , true);
 *      o.add("3" , false);
 *
 *      //模拟答题过程
 *      o.try2Select("0");
 *      o.try2Select("1");
 *      o.try2Select("2");
 *
 *      //判断是否已完成：
 *      if(o.isComplete()){
 *          console.log("已选中所有正确答案！");
 *      }
 * ```
 */
export default class ChosicModel {
  private _data: Object = {}

  /**
   * 添加选项
   * @param $id           选项Id
   * @param $isTrue       该选项是否正确
   */
  public add($id: string, $isTrue: boolean): void {
    const o: Item = new Item($id, $isTrue)
    this._data[$id] = o
  }

  /**
   * 判断某选项是否正确
   * @param $id       选项Id
   *
   * @return          是否为正确选项
   */
  public isRight($id: string): boolean {
    const item_: Item = this._data[$id]
    if (!item_) {
      return false
    }
    return item_.isTrue
  }

  /**
   * 选中某选项
   * @param $id       选项Id
   */
  public selected($id: string): void {
    const item_: Item = this._data[$id]
    if (item_) {
      item_.selected = true
    }
  }

  /**
   * 取消选中某选项
   * @param $id       选项Id
   */
  public unselected($id: string): void {
    const item_: Item = this._data[$id]
    if (item_) {
      item_.selected = false
    }
  }

  /**
   * 尝试选中某选项。若该选项为正确选项，则选中该选项并返回true。否则，不进行任何操作并返回false
   *
   * @param $id       选项Id
   *
   * @return 是否成功选中
   */
  public try2Select($id: string): boolean {
    const item_: Item = this._data[$id]
    if (item_.isTrue) {
      item_.selected = true
    }
    return item_.isTrue
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
    for (let k in this._data) {
      let item_: Item = this._data[k]
      if (item_.isTrue != item_.selected) {
        b = false
        break
      }
    }
    return b
  }
}

/**
 * 一个选项的数据
 */
class Item {
  /**选项Id */
  public id: string
  /**该选项是否为正确选项 */
  public isTrue: boolean
  /**是否已经选中，默认为false */
  public selected: boolean = false

  /**
   * 构造函数
   * @param $id           选项Id
   * @param $isTrue       该选项是否为正确选项
   */
  public constructor($id: string, $isTrue: boolean) {
    this.id = $id
    this.isTrue = $isTrue
  }
}

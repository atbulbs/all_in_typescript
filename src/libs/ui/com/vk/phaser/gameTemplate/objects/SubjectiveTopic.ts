import TopicData from '../models/Topic'
import BaseTopic from './BaseTopic'
import Option from './BaseOption'

/**
 * 题模版 > 主观题型
 */
export default class SubjectiveTopic extends BaseTopic {
  /**
   * 构造函数
   * @param $scene            场景
   * @param $parent           父容器
   *
   *
   * @see UIUtils.CreatTextStyle
   * @see Phaser.Geom.Rectangle
   */
  public constructor($scene: Phaser.Scene, $data: TopicData) {
    super($scene, $data)
    this._init()
  }

  /**
   * 输入
   * @param $item             输入对象
   *
   * @memberof SubjectiveTopic
   */
  public _input($item: Option): void {
    if (this.resultMap[this.currentIndex].item) return
    this._check($item)
    this._next()
  }

  /**
   * 删除
   *
   * 当前填空位有输入项时优先删除当前填空位输入项
   * 没有时删除前一个填空位输入项
   * 如果当前为第一个填空位则不再查询前一个填空位
   */
  public _delete(): void {
    let _index = this.currentIndex
    let _result = this.resultMap[_index]
    if (!_result.item && this.currentIndex > 0) {
      _index = _index - 1
      _result = this.resultMap[_index]
    }
    // 没有输入项时终止删除操作
    if (!_result.item) return
    // 销毁当前输入项
    _result.item.destroy()
    // 重置状态
    this._reset(_index)
    this._next()
  }
}

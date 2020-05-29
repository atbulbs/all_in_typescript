import MatchResultData from '../models/MatchResult'
import TopicData from '../models/Topic'
import Option from './BaseOption'
import UIComponent from '../../components/UIComponent'

/**
 * 基础匹配题模版
 *
 * @流程 _init > _check > _next > _complete > _result
 */
export default class BaseTopic extends UIComponent {
  protected currentScene: Phaser.Scene // 当前激活填空位索引
  protected currentIndex: number = 0
  protected dataMap: TopicData // 数据
  protected resultMap: Array<MatchResultData> = [] // 结果集
  protected cursor: Phaser.GameObjects.Container // 光标 - 表示被激活的边框

  /**
   * 构造函数
   * @param $scene            场景
   * @param $data             题目数据
   *
   * @see Phaser.Geom.Rectangle
   */
  public constructor($scene: Phaser.Scene, $data: TopicData) {
    super($scene, new Phaser.Geom.Rectangle(0, 0, 0, 0))
    // 初始化变量
    this.currentScene = $scene
    this.dataMap = $data
  }

  /**
   * 初始化题型模版
   */
  protected _init(): void {
    this.initResultMap()
  }

  /**
   * 确认单词选择对错
   * @param $item             需要拿来匹配的对象
   *
   * @return                  匹配结果，1-错误 2-正确
   */
  public _check($item: Option): number {
    const _result = this.resultMap[this.currentIndex]
    _result.item = $item
    let _status = 0
    // 对
    if (_result.target.getMatchKey() === $item.getMatchKey()) {
      _status = 2
      // 错
    } else {
      _status = 1
    }
    // 状态
    _result.status = _status
    return _status
  }

  /**
   * 下一个
   *
   * @return                  下一个填空位的索引值
   */
  public _next(): number {
    // 激活下一个可选填空位
    for (let i = 0; i < this.resultMap.length; i++) {
      if (this.resultMap[i].target.enable && this.resultMap[i].status === 0) {
        this.currentIndex = i
        break
      }
      // 所有填空位皆为不可选时可过关
      if (i === this.resultMap.length - 1) {
        this._complete()
      }
    }
    // 返回索引值
    this.emit('next', this.currentIndex)
    return this.currentIndex
  }

  /**
   * 完成答题
   */
  public _complete(): void {
    this.emit('complete')
  }

  /**
   * 答题结果
   */
  public _result(): void {
    // 验证是否全部答对
    let _isPass = true
    for (let i = 0; i < this.resultMap.length; i++) {
      if (this.resultMap[i].status === 1) {
        _isPass = false
        break
      }
    }
    // 通知场景进入下一步
    this.emit('result', _isPass, this.resultMap)
  }

  /**
   * 重置单个结果状态
   * @param $index             指定结果的索引值
   */
  public _reset($index?: number): void {
    const _index = $index !== undefined ? $index : this.currentIndex
    const _result = this.resultMap[_index]
    _result.item = null
    _result.status = 0
  }

  // 初始化结果集
  private initResultMap(): void {
    // 过滤干扰项
    const _words = this.dataMap.matchWords.filter(e => {
      return !e.isDisturbanceTerm
    }, this)
    // 创建结果集
    for (let i = 0; i < _words.length; i++) {
      this.resultMap.push(new MatchResultData())
    }
  }

  /**
   * 更改当前填空位索引
   * @param $index             指定索引值
   *
   * @return 指定填空位中已匹配的对象，没有时返回null
   */
  public changeIndex($index: number): Option {
    if ($index >= this.resultMap.length) return
    this.currentIndex = $index
    return this.resultMap[this.currentIndex].item
  }

  /**
   * 设置填空位集合
   * @param $targets             填空位对象数组
   */
  public setTargets($targets: Array<Option>): void {
    for (let i = 0; i < $targets.length; i++) {
      const _result = this.resultMap[i]
      _result.target = $targets[i]
    }
  }
}

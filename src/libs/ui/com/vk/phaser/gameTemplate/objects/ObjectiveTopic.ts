import TopicData from '../models/Topic'
import BaseTopic from './BaseTopic'
/**
 * 匹配题模版 > 客观题型
 */
export default class ObjectiveTopic extends BaseTopic {
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
}

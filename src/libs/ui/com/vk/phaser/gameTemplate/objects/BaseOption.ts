import OptionInterface from '../models/interface/IOption'

/**
 * 选项基础对象
 */
interface BaseOption {
  /**
   * 数据
   */

  dataMap: OptionInterface
  /**
   * 匹配词
   */
  matchKey: string
  /**
   * 是否可用
   */
  enable: boolean
  /**
   * 内容
   */
  contents: Phaser.GameObjects.Text
  getMatchKey(): string
  getContents(): Phaser.GameObjects.Text
  setContents(): void
  destroy(fromScene?: boolean): void
}

export default BaseOption

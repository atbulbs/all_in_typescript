/*
 * 匹配关键字接口
 *
 * 2019.11.29
 */
interface IOption {
  word: string
  showWord?: string // 用于显示的单词
  fontSize?: number
  image?: Phaser.Types.Loader.FileTypes.ImageFileConfig // 单词图片
  isShowField?: boolean // 是否为显示在题干中的内容
  isShowTips?: boolean // 是否展示提示信息
  isDisturbanceTerm?: boolean // 是否为干扰项
}

export default IOption

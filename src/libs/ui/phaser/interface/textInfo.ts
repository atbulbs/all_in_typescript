/*
 * 文本信息接口
 *
 * 2018.12.17
 */

import IPositionInfo from './iPositionInfo'

// 试图数据接口
interface TextInfo extends IPositionInfo {
  content: string | Array<string>
  fontSize?: number
  fontFamily?: string
  color?: string
  wordWrapMode?: string // 0|'none'|1|'word'|2|'char'|'character'
  wordWrapWidth?: number
  padding?: any
  tags?: any
}

export default TextInfo

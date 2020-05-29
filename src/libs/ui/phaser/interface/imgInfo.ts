/*
 * 图片信息接口
 *
 * 2018.12.17
 */

import IPositionInfo from './iPositionInfo'

// 试图数据接口
interface ImgInfo extends IPositionInfo {
  name: string
  url?: string
  frame?: string // 帧
  fit?: string // 填充类型
}

export default ImgInfo

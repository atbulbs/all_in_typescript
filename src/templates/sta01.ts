/**
 * @description sta01模板 文字四选一
 * @type
 *  1. 图片 + 音频
 *  2. 图片
 *  3. 图片 + 文案
 *  4. 文案
 *
 *  选项数量2-4, 只有一个正确选项, 其他为干扰项
 *
 * 细节:
 * 选项数量2, 3时布局
 * 选项排序随机
 *
 * 选择错误, 提示错误, 标出正确选项, 同时出现下一步按钮
 * 选择正确, 提示正确, 自动进入下一步
 */

import Base from './base_template'

export default class Sta01 implements Base {
  cb

  constructor (scene, parent, data) {

  }

  check () {

  }

  onSubmit (cb) {
    this.cb = cb
  }
}
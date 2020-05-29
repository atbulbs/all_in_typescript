import Option from '../objects/BaseOption'
/*
 * 匹配题型 - 匹配结果数据模型
 *
 * 2019.12.03
 */
class MatchResult {
  constructor(
    public status: number = 0, // 匹配状态 0:未匹配、1:错误、2:正确
    public item?: Option, // 选项
    public target?: Option // 填空位
  ) {}
}

export default MatchResult

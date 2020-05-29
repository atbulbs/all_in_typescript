/*
 * 识记环节数据模型
 *
 * 2019.11.28
 */

import IOption from './interface/IOption'

class Topic {
  constructor(
    public id: string,
    public word: string, // 题目对应单词
    public matchWords: Array<IOption>, // 题目对应填空位
    public theme: string, // 该题对应的环节
    public type: string // 题型
  ) {}
}

export default Topic

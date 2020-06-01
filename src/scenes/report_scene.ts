/**
 * @description 基础场景
 */

// import { VP } from '../../../../workspace/vk-micro-sdk-game/src/vk-micro-sdk-game'
import { VP } from '../libs/ui/index'
import BaseScene from './base_scene'

export default class ReportScene extends BaseScene {

  constructor () {
    super('ReportScene')
  }

  create () {
    this.fitScreen()
    const { top, left, width, height } = this.background
    this.add.rectangle(top, left, width, height, 0xff6699)
    this.add.text(375 / 2, 667 / 2 + 30, 'ReportScene', {
      color: '0xff0000',
      fontSize: '18px'
    }).setOrigin(.5)
  }

}
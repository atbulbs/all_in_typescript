/**
 * @description 得分模态框
 */

import Modal from './modal'

export default class MonsterModal extends Phaser.GameObjects.Container {

  modal: Modal
  handleHide: Function

  constructor (scene) {
    super(scene)
    this.modal = new Modal(scene)
    scene.add.existing(this)
  }

}
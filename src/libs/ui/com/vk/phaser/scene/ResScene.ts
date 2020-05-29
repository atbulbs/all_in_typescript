/**
 * ResScene.ts
 *
 *
 *     creat on:   2019/06/12 10:34:10
 *
 * 资加载源Scene，增加了对新资源架子啊方式的支持
 */
export default class ResScene extends Phaser.Scene {
  public id

  public addImg(
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ): Phaser.GameObjects.Image {
    if (!this.textures.exists(texture)) {
      this.textures.addImage(texture, this.getResource(texture))
    }
    return frame ? this.add.image(x, y, texture, frame) : this.add.image(x, y, texture)
  }

  public addSound(key: string): Phaser.Sound.BaseSound {
    if (!this.cache.audio.exists(key)) {
      this.cache.audio.add(key, this.getResource(key))
    }
    return this.sound.add(key)
  }

  public getResource(key: string): any {
    return window['SLP_STORAGE'].getItem(key, this.id)
  }
}

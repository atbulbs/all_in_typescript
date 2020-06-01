/**
 * @description 音频播放器组件
 */

export default class AudioPlayer {
  scene
  parent

  constructor (scene, parent, x, y, soundName: string) {
    this.scene = scene
    this.parent = parent
    const speakerContainer = this.scene.add.container(x, y)
    speakerContainer.setSize(55, 55)
    speakerContainer.setInteractive()
    const speaker = this.scene.add.image(0, 0, 'soundBackground')
    speaker.setOrigin(.5)
    speaker.setDisplaySize(55, 55)
    const speakerNormal = this.scene.add.image(0, 0, 'speaker_normal')
    speakerNormal.setOrigin(.5)
    speakerNormal.setDisplaySize(37, 37)
    // const speakerPlay = this.scene.add.image(0, 0, 'speaker_play')
    // speakerPlay.setOrigin(.5)
    // speakerPlay.setDisplaySize(37, 37)
    // speakerPlay.setAlpha(0)

    speakerContainer.add(speaker)
    speakerContainer.add(speakerNormal)
    // speakerContainer.add(speakerPlay)
    this.parent.add(speakerContainer)
    const sound = this.scene.sound.add(soundName)

    const soundframes = this.scene.anims.generateFrameNames("soundPlayAnimas", { start: 0, end: 9, zeroPad: 0, suffix:'.png' })
    this.scene.anims.create({ key: "soundPlayAnimas", frames: soundframes, frameRate: 10, repeat: -1 })
    const speakerPlay = this.scene.add.sprite(0, 0, 'soundPlayAnimas', '1.png')
    speakerPlay.setSize(24, 20).setDisplaySize(24, 20)
    speakerPlay.setAlpha(0)
    speakerContainer.add(speakerPlay)

    speakerContainer.on('pointerdown', () => {
      console.warn('pointerdown')
      speakerNormal.setAlpha(0)
      speakerPlay.setAlpha(1)
      speakerPlay.anims.play("soundPlayAnimas")
      sound.play()
    })
    sound.on('complete', () => {
      speakerNormal.setAlpha(1)
      speakerPlay.setAlpha(0)
    })
  }

}
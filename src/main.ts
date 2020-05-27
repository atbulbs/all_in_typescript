
import Phaser from 'phaser'
import IndexScene from './scenes/index_scene'
console.warn('phaser', Phaser)

const game: Phaser.Game = new Phaser.Game({
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  autoFocus: true,
  transparent: true,
})

game.scene.add('IndexScene', IndexScene, true)



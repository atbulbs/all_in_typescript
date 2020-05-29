
import Phaser from 'phaser'
import IndexScene from './scenes/index_scene'
import LoadingScene from './scenes/loading_scene'
import '../plugins/SpinePlugin.min.js'
const TagTextPlugin:any = require('../plugins/rextagtext.3.17.0.min.js')

const game: Phaser.Game = new Phaser.Game({
  type: Phaser.WEBGL,
  // type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  autoFocus: true,
  transparent: true,
  plugins: {
    global: [
      {
        key: 'TagTextPlugin',
        plugin: TagTextPlugin,
        start: true
      }
    ],
    scene: [
      {
        key: 'SpinePlugin',
        plugin: window['SpinePlugin'],
        mapping: 'spine'
      }
    ]
  },
})


window['__PHASER_GAME__'] = game

// game.scene.add('IndexScene', IndexScene)
game.scene.add('IndexScene', LoadingScene, true)

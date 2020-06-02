
import Phaser from 'phaser'
import LoadScene from './scenes/load_scene'
import KnowScene from './scenes/know_scene'
import ReadScene from './scenes/read_scene'
import WriteScene from './scenes/write_scene'
import PracticeScene from './scenes/practice_scene'
import ReportScene from './scenes/report_scene'
import '../plugins/SpinePlugin.min.js'
const TagTextPlugin:any = require('../plugins/rextagtext.3.17.0.min.js')

const game: Phaser.Game = new Phaser.Game({
  type: Phaser.WEBGL,
  // type: Phaser.CANVAS,
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio * 1.2 || 1,
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

game.scene.add('LoadScene', LoadScene, true)
game.scene.add('KnowScene', KnowScene)
game.scene.add('ReadScene', ReadScene)
game.scene.add('WriteScene', WriteScene)
game.scene.add('PracticeScene', PracticeScene)
game.scene.add('ReportScene', ReportScene)

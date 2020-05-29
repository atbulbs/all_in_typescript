import BaseSound = Phaser.Sound.BaseSound
import Scene = Phaser.Scene
import { PhaserEvents } from '../enum/PhaserEvents'
import ResScene from '../scene/ResScene'

/**
 * SoundManager.ts
 *
 *
 *     creat on:   2019/05/13 14:35:33
 *
 *  音频工具类
 */
export default class SoundManager {
  /**
   * 播放一次声音
   * @param $s        当前场景
   * @param key_      音频key
   *
   * @return     BaseSound
   *
   * @see Phaser.Sound.BaseSound
   */
  public static PlayOnce($s: Scene, $key: string | Object): BaseSound {
    let key_ = $key instanceof Object ? $key['content'] : $key
    let sounnd_: BaseSound
    if ($s instanceof ResScene) {
      sounnd_ = ($s as ResScene).addSound(key_)
    } else {
      $s.sound.add(key_)
    }
    sounnd_.once(
      PhaserEvents.complete,
      function(): void {
        ;(this as BaseSound).destroy()
      },
      sounnd_
    )
    sounnd_.play()
    return sounnd_
  }
}

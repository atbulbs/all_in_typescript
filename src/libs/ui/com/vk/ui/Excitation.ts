// import { VP } from "vk-micro-sdk-game";
import Rectangle = Phaser.Geom.Rectangle
import Container = Phaser.GameObjects.Container
import Image = Phaser.GameObjects.Image
import { Scene } from 'phaser'
import { Layer, UIUtils, SoundManager, PhaserEvents, EventTypes } from '../phaser/VPClass'
/**
 * Excitation.ts
 *
 *
 *     creat on:   2019/06/10 15:58:06
 *
 * 激励组件。可以使用 addData 方法设置若干组图片和声音，并调用 play 播放其中一组，并在播放完成后派发EventTypes.Complete事件。
 *
 *
 * Example:
 *      public preload () {
 *          this.load.image("img_excellent" , 'src/img/excellent.png');
 *          this.load.image("img_good" , 'src/img/good.png');
 *          this.load.image("img_great" , 'src/img/great.png');
 *          this.load.audio("sound_excellent" , 'src/img/excellent.mp3');
 *          this.load.audio("sound_good" , 'src/img/good.mp3');
 *          this.load.audio("sound_great" , 'src/img/great.mp3');
 *      }
 *
 *      public create():void{
 *          let rect_ = new Rectangle(0 , 280 , 240 , 80);
 *          let excellent_ = new Excitation(this , rect_);
 *
 *          excellent_.addData("excellentKey" , "img_excellent" , "sound_excellent");
 *          excellent_.addData("goodKey" , "img_good" , "sound_good");
 *          excellent_.addData("greatKey" , "img_great" , "sound_great");
 *
 *          setInterval(function(){
 *              let n = Math.random();
 *              if(n<0.33){
 *                  excellent_.play("excellentKey")
 *              }else if(n<0.66){
 *                  excellent_.play("greatKey")
 *              }else{
 *                  excellent_.play("goodKey")
 *              }
 *          } , 3000);
 *      }
 *
 */
export default class Excitation extends Layer {
  private _data: Object = new Object()
  private _currectData: ExcitationData
  private _img: Image

  /**
   * 构造函数
   * @param $scene
   * @param $layerRect
   * @param $parent
   *
   * Phaser.Geom.Rectangle
   */
  public constructor($scene: Scene, $layerRect: Rectangle, $parent: Container = null) {
    super($scene, $layerRect, 0.5, 0.7, $parent)
    this.visible = false
  }

  //PLay的过程
  private start($data: ExcitationData): void {
    if (!$data) {
      this.end()
      return
    }
    this._currectData = $data
    this.visible = true
    const container_ = this.getLayer()
    const rect_ = new Rectangle(0, 0, container_.width, container_.height)
    this._img = UIUtils.CreatImage(this._scene, $data.img, rect_, container_)

    this.setScale(0, 0)
    this._scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      onComplete: this.onTween,
      onCompleteScope: this
    })
  }

  private onTween(): void {
    if (!this._currectData.sound) {
      this.end()
      return
    }

    const sound_ = SoundManager.PlayOnce(this._scene, this._currectData.sound)
    sound_.once(PhaserEvents.complete, this.end, this)
  }

  private end(): void {
    if (this._img) {
      this._scene.tweens.add({
        targets: this._img,
        alpha: 0,
        duration: 200,
        onComplete: () => {
          this._img.destroy(true)
          this._img = null
          this.visible = false
          this.emit(EventTypes.Complete)
        },
        onCompleteScope: this
      })
    } else {
      this.visible = false
      this.emit(EventTypes.Complete)
    }
  }

  //Interface
  /**
   * 添加激励效果
   * @param $key          效果的key       在此设置并在在play时使用
   * @param $img          图片key
   * @param $sound        声音key
   *
   *
   * 播放动画和音效（音效可选），播放完成后派发事件 EventTypes.Complete
   *
   * @see EventTypes
   */
  public addData($key: string, $img: string, $sound: string = ''): void {
    const data_ = new ExcitationData($img, $sound)
    this._data[$key] = data_
  }

  /**
   * 播放动画
   * @param $key  动画key    从addItem出传入并在此使用
   *
   * @see EventTypes
   *
   * 播放完成会派发EventTypes.Complete事件
   */
  public play($key): void {
    if (this.visible) {
      return
    }
    const data_ = this._data[$key]
    this.start(data_)
  }
}

class ExcitationData {
  public img: string
  public sound: string

  public constructor($img: string, $sound: string = '') {
    this.img = $img
    this.sound = $sound
  }
}

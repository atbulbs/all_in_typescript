import EventEmitter = Phaser.Events.EventEmitter
import { EventTypes } from '../enum/EventTypes'

/**
 * GameDataModel.ts
 *
 *
 *     creat on:   2019/05/27 15:56:25
 *
 * 游戏数据管理模型
 *
 * Example：
 * ```
 *      //数据赋值
 *      let o:GameDataModel = new GameDataModel();
 *      o.setData([{...}, {...}, {...}, {...}, {...}, {...}])
 *
 *      //游戏开始
 *      o.startGame();
 *      console.log("游戏开始");
 *
 *      //while循环模拟游戏过程
 *      let b:boolean = false;
 *      while(!b){
 *          let d = o.getCurrectData();
 *          console.log("当前游戏进行中：" + d);
 *          b = o.next();
 *      }
 *
 *      console.log("游戏结束");
 * ```
 */
export default class GameDataModel extends EventEmitter {
  private _data: any[] = null

  private _index: integer

  public constructor() {
    super()
  }

  /**
   * 读取游戏数据
   * @param $practiseId 游戏Id
   */
  public load($practiseId: string) {
    const this_: GameDataModel = this
    let url_: string = '/rest/lpqc/lesson/getLessonResource'
    let param_ = {
      subLessonId: $practiseId,
      studentId: (window as any).storage.getItem('studentId', 'g')
    }
    ;(window as any).ajax.get(url_, param_).then($o => {
      this_.setData.call(this_, $o)
      this_.emit(EventTypes.Loaded, $o)
    })
  }

  //流程控制
  /**
   * 设置游戏数据
   * @param $o 一组游戏数据，每项是一个游戏关卡
   */
  public setData($o: any[]): void {
    this._data = $o
  }

  /**
   * 游戏初始化，调用此函数游戏指针将设置为0
   */
  public startGame(): void {
    this._index = 0
  }

  /**
   * 获取游戏关卡总数
   */
  public getTotial(): integer {
    let n = this._data ? this._data.length : 0
    return n
  }

  /**
   * 获取当前关卡的游戏数据
   */
  public getCurrectData(): Object {
    return this._data[this._index]
  }

  /**
   * 游戏是否已完成
   *
   * @return 游戏是否已完成，true-已完成，false-未完成。
   */
  public isComplete(): boolean {
    let b: boolean = true
    if (this._data) {
      b = this._index < this._data.length
    }
    return !b
  }

  /**
   * 指向下一关卡，并返回游戏是否已完成。游戏关卡指针+1。
   *
   * @return 游戏是否已完成，true-已完成，false-未完成。
   */
  public next(): boolean {
    this._index++
    return this.isComplete()
  }
}

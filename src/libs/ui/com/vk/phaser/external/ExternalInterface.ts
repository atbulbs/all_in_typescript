/**
 * ExternalInterface.ts
 *
 *
 *     creat on:   2019/05/24 16:37:52
 *
 * Phaser 与外部的接口，供外界调用和调用外部接口
 *
 *
 * Example：
 * ```
 *      //初始化功能
 *      var g = new Phaser.Game(config);
 *      g["callExternal"] = onGame;
 *      ExternalInterface.init(g);
 *
 *      //外部（js/ts）调用内部函数
 *      g["callInGame"]("test" , {key:"hello"});
 *
 *      //外部向内调用Game接口
 *      ExternalInterface.callExternal("调用外部" , {key1:"hello" , key2:"123456"})
 * ```
 */

import EventEmitter = Phaser.Events.EventEmitter
import { Game } from 'phaser'

export default class ExternalInterface {
  private static _evt: EventEmitter = new EventEmitter()
  private static _external: Function

  /**
   * 初始化接口
   * @param $game Game实例
   */
  public static init($game: Game): void {
    ExternalInterface._evt = new EventEmitter()
    $game['callIn'] = ExternalInterface.callInGame
    ExternalInterface._external = $game['callExternal']
  }

  /**
   * 游戏调用外部接口
   * @param $type
   * @param $data
   */
  public static callExternal($type: string, $data: any = null): void {
    let fun_: Function = ExternalInterface._external
    if (!fun_) {
      return
    }
    fun_($type, $data)
  }

  /**
   * 供外部调用内部接口，如ExternalInterface已初始化成功，则会分发到关注此接口的方法
   * @param $type     接口类型
   * @param $data     传入的数据
   */
  public static callInGame($type: string, $data: any = null): void {
    let evt_: EventEmitter = ExternalInterface._evt
    if (!evt_) {
      return
    }
    evt_.emit($type, $data)
  }

  /**
   * 增加对外部接口的侦听函数，通过Phaser.Events.EventEmitter实现
   *
   * @param $type     类型               对外暴露的接口类型
   * @param $fn       接口回调函数        会响应外部相应接口调用
   * @param $contnt   回调上下文
   *
   * @see Phaser.Events.EventEmitter
   *
   */
  public static addCallBack($type: string, $fn: Function, $contnt: any): void {
    let evt_: EventEmitter = ExternalInterface._evt
    if (!evt_) {
      return
    }
    evt_.on($type, $fn, $contnt)
  }
}

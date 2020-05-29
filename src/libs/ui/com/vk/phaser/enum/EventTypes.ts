/**
 * EventTypes.ts
 *
 *
 *     creat on:   2019/05/06 14:40:16
 *
 * 常用的自定义事件类型枚举
 */

export enum EventTypes {
  AddChild = 'addChild',
  RemoveChild = 'removeChild',
  DragStart = 'dragStart',
  DragMove = 'dragMove',
  DragStop = 'dragStop',
  Scroll = 'scroll',

  SingletonError = 'singletonError',
  ABSError = 'absError',
  IOError = 'ioError',

  Init = 'init',
  Add = 'add',
  Delete = 'delete',
  Remove = 'remove',
  Close = 'close',

  Selected = 'selected',
  Ok = 'ok',
  Cancel = 'cancel',
  Success = 'success',
  Failed = 'failed',
  Complete = 'complete',
  Change = 'change',
  Update = 'update',
  State = 'state',
  DownLoad = 'downLoad',
  Choese = 'choese',
  Find = 'find',
  Save = 'save',

  Size = 'size',
  Resize = 'resize',
  ResizeAtOnce = 'resizeAtOnce',

  Jump = 'jump',
  Buy = 'buy',
  Info = 'info',
  Statistics = 'statistics',
  Image = 'image',

  Shop = 'shop',
  Cart = 'cart',

  Show = 'show',
  Hide = 'hide',
  Enrer = 'enrer',
  Exit = 'exit',
  Out = 'out',
  In = 'in',
  Back = 'back',
  Next = 'next',
  Prev = 'prev',
  Loaded = 'loaded',

  Start = 'start',
  Stop = 'stop',
  Pause = 'pause',
  Resart = 'resart',
  Resume = 'resume',
  Play = 'play',
  Reset = 'reset',
  Restart = 'restart',

  ScrollInStart = 'scrollInStart',
  ScrollOutStart = 'scrollOutStart',
  ScrollInEnd = 'scrollInEnd',
  ScrollOutEnd = 'scrollOutEnd'
}

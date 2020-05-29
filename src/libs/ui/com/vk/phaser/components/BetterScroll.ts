import UIUtils from '../utils/UIUtils'
/**
 * 滚动UI组件, 支持鼠标滚轮事件
 **/

export default class BetterScroll {
  private currentScene
  private scrollContainer: Phaser.GameObjects.Container
  private startY = 0
  private velocity = 0
  private isScrolling = false
  private _contentsHeight: number = 0

  public getScrollContainer(): Phaser.GameObjects.Container {
    return this.scrollContainer
  }

  public constructor(
    currentScene: Phaser.Scene,
    $rect: Phaser.Geom.Rectangle,
    scrollTargets: any[],
    notScrollTargets: any[]
  ) {
    this.registerWheelListener()
    this.currentScene = currentScene
    this.scrollContainer = UIUtils.CreatContainer(this.currentScene, $rect)
    this.scrollContainer.add(scrollTargets)
    this.currentScene.add.container(0, 0, notScrollTargets)
    this._contentsHeight = $rect.height
    this.handleScroll()
    this.currentScene.events.on('update', () => {
      this.handleUpdate($rect)
    })
  }

  // 处理滚动
  private handleScroll() {
    this.currentScene.input.on('pointerdown', pointer => {
      // 记录滚动起始的y坐标
      this.startY = pointer.y
      this.isScrolling = true
    })
    this.currentScene.input.on('pointerup', () => {
      this.isScrolling = false
    })
    this.currentScene.input.on('pointermove', pointer => {
      if (this.isScrolling) {
        let deltaY = pointer.y - this.startY
        this.startY = pointer.y
        this.velocity += (deltaY - this.velocity) * 0.7
      }
    })
    window['addWheelListener'](this.currentScene.game.canvas, e => {
      let handleWheel: any = e => {
        this.velocity += (-e.deltaY - this.velocity) * 0.05
        e.preventDefault()
      }
      // 截流
      let timeId = null
      window.clearTimeout(timeId)
      timeId = window.setTimeout(() => {
        handleWheel(e)
      }, 200)
    })
  }

  // 处理场景刷新
  private handleUpdate($rect: Phaser.Geom.Rectangle) {
    if (Math.abs(this.velocity) < 0.1) return
    // 内容高度小于滚动容器高度时不触发滚动
    if (this.scrollContainer.height >= this._contentsHeight) {
      this.velocity = 0
      return
    }
    this.velocity += -this.velocity * 0.05
    this.scrollContainer.y += this.velocity
    const bottomMax = this.scrollContainer.height + 100 - this._contentsHeight
    if (this.scrollContainer.y < bottomMax) {
      this.scrollContainer.y += (bottomMax - this.scrollContainer.y) * 0.2
    }

    if (this.scrollContainer.y > $rect.y) {
      this.scrollContainer.y += ($rect.y - this.scrollContainer.y) * 0.2
    }

    this.currentScene.events.emit('betterScrollScroll')
  }

  // 注册鼠标滚轮事件
  private registerWheelListener() {
    var prefix = '',
      _addEventListener,
      onwheel,
      support
    // detect event model
    if (window.addEventListener) {
      _addEventListener = 'addEventListener'
    } else {
      _addEventListener = 'attachEvent'
      prefix = 'on'
    }
    // detect available wheel event
    support =
      'onwheel' in document.createElement('div')
        ? 'wheel' // 各个厂商的高版本浏览器都支持"wheel"
        : (document as any).onmousewheel !== undefined
        ? 'mousewheel' // Webkit 和 IE一定支持"mousewheel"
        : 'DOMMouseScroll' // 低版本firefox
    ;(window as any).addWheelListener = function(elem, callback, useCapture) {
      _addWheelListener(elem, support, callback, useCapture)

      // handle MozMousePixelScroll in older Firefox
      if (support == 'DOMMouseScroll') {
        _addWheelListener(elem, 'MozMousePixelScroll', callback, useCapture)
      }
    }
    function _addWheelListener(elem, eventName, callback, useCapture) {
      elem[_addEventListener](
        prefix + eventName,
        support == 'wheel'
          ? callback
          : function(originalEvent) {
              !originalEvent && (originalEvent = window.event)

              // create a normalized event object
              var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: 'wheel',
                deltaMode: originalEvent.type == 'MozMousePixelScroll' ? 0 : 1,
                deltaX: 0,
                deltaZ: 0,
                preventDefault: function() {
                  originalEvent.preventDefault
                    ? originalEvent.preventDefault()
                    : (originalEvent.returnValue = false)
                }
              }
              // calculate deltaY (and deltaX) according to the event
              if (support == 'mousewheel') {
                ;(event as any).deltaY = (-1 / 40) * originalEvent.wheelDelta
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && (event.deltaX = (-1 / 40) * originalEvent.wheelDeltaX)
              } else {
                ;(event as any).deltaY = originalEvent.detail
              }
              // it's time to fire the callback
              return callback(event)
            },
        useCapture || false
      )
    }
  }

  // 添加滚动对象
  public addChildren($child: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]) {
    this.scrollContainer.add($child)
  }

  // 设置滚动区域高度
  public setContentsHeight($value: number) {
    this._contentsHeight = $value
  }
}

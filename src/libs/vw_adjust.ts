const vub = require('viewport-units-buggyfill')

export default function vwAdjust () {
  window.addEventListener('load', () => {
    vub.init({ hacks: (window as any).viewportUnitsBuggyfillHacks })
  })
}
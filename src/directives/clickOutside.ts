import type { Directive, DirectiveBinding } from 'vue'
import type { IPoint } from '@/types'

interface ExtendHTMLElement extends HTMLElement {
  _mouseDownEvent?: Fn<MouseEvent, void>
  _mouseUpEvent?: Fn<MouseEvent, void>
  _clickEvent?: Fn<MouseEvent, void>
}

export const ClickOuside: Directive = {
  mounted(el: ExtendHTMLElement, binding: DirectiveBinding) {
    if (!binding.modifiers.short) {
      let mouseDownPosition: Nullable<IPoint> = null

      el._mouseDownEvent = (event: MouseEvent) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          mouseDownPosition = { x: event.clientX, y: event.clientY }
        }
      }

      el._mouseUpEvent = (event: MouseEvent) => {
        const mouseUpPosition = { x: event.clientX, y: event.clientY }

        if (
          mouseDownPosition &&
          mouseDownPosition.x == mouseUpPosition.x &&
          mouseDownPosition.y == mouseUpPosition.y
        ) {
          binding.value(event)
        }

        mouseDownPosition = null
      }

      document.body.addEventListener('mousedown', el._mouseDownEvent)
      document.body.addEventListener('mouseup', el._mouseUpEvent)
    } else {
      el._clickEvent = (event: MouseEvent) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event)
        }
      }

      document.body.addEventListener('mousedown', el._clickEvent)
    }
  },
  unmounted(el, binding: DirectiveBinding) {
    if (!binding.modifiers.short) {
      document.body.removeEventListener('mousedown', el._mouseDownEvent)
      document.body.removeEventListener('mouseup', el._mouseUpEvent)
    } else {
      document.body.removeEventListener('mousedown', el._clickEvent)
    }
  }
}

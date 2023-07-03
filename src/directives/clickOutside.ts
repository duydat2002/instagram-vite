import type { Directive, DirectiveBinding } from 'vue'
import type { IPoint } from '@/types'

interface ExtendHTMLElement extends HTMLElement {
  _mouseDownEvent?: Fn<MouseEvent, void>
  _mouseUpEvent?: Fn<MouseEvent, void>
  _clickEvent?: Fn<MouseEvent, void>
}

const getParent = (el: ExtendHTMLElement) => {
  const app = document.querySelector('#app')
  const modal = document.querySelector('#modal')
  const popup = document.querySelector('#popup')

  if (app?.contains(el)) return app
  if (modal?.contains(el)) return modal
  if (popup?.contains(el)) return popup
}

const checkClickOutside = (el: ExtendHTMLElement, elClick: ExtendHTMLElement) => {
  return el !== elClick && !el.contains(elClick) && getParent(el) === getParent(elClick)
}

export const ClickOuside: Directive = {
  mounted(el: ExtendHTMLElement, binding: DirectiveBinding) {
    if (!binding.modifiers.short) {
      let mouseDownPosition: Nullable<IPoint> = null

      el._mouseDownEvent = (event: MouseEvent) => {
        if (checkClickOutside(el, event.target as ExtendHTMLElement)) {
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
        if (checkClickOutside(el, event.target as ExtendHTMLElement)) {
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

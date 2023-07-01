let debounced: NodeJS.Timeout
export function debounce(callback: Fn<any, any>, timeout: number = 300) {
  if (debounced) clearTimeout(debounced)
  debounced = setTimeout(() => {
    callback()
  }, timeout)
}

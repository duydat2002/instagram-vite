export function convertTagUser(str: string) {
  return str.replace(/(?<!\w)@(\w+)/g, '<a href="/$1" class="text-link mr-[2px]">$&</a>')
}

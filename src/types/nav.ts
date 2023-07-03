export enum NavTabEnum {
  Home = 'Home',
  Search = 'Search',
  Explore = 'Explore',
  Reels = 'Reels',
  Messenger = 'Messenger',
  Notification = 'Notification',
  CreatePost = 'CreatePost',
  Profile = 'Profile',
  Bar = 'Bar'
}

export interface INav {
  name: NavTabEnum
  title: string
  path?: string
  icon?: any
  iconActive?: any
}

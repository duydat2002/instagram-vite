import Home from '@icons/home.svg'
import HomeActive from '@icons/home-active.svg'
import Search from '@icons/glass.svg'
import SearchActive from '@icons/glass-active.svg'
import Explore from '@icons/explore.svg'
import ExploreActive from '@icons/explore-active.svg'
import Reel from '@icons/reel.svg'
import ReelActive from '@icons/reel-active.svg'
import Messenger from '@icons/messenger.svg'
import MessengerActive from '@icons/messenger-active.svg'
import Heart from '@icons/heart.svg'
import HeartActive from '@icons/heart-active.svg'
import Plus from '@icons/plus-square.svg'
import PlusActive from '@icons/plus-square-active.svg'

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

export interface Nav {
  name: NavTabEnum
  title: string
  path?: string
  icon?: string
  iconActive?: string
  hideMobie?: boolean
}

export const NAVS: Nav[] = [
  { icon: Home, iconActive: HomeActive, title: 'Trang chủ', name: NavTabEnum.Home, path: '/' },
  {
    icon: Search,
    iconActive: SearchActive,
    title: 'Tìm kiếm',
    name: NavTabEnum.Search,
    path: ''
  },
  {
    icon: Explore,
    iconActive: ExploreActive,
    title: 'Khám phá',
    name: NavTabEnum.Explore,
    path: '/explore'
  },
  { icon: Reel, iconActive: ReelActive, title: 'Reels', name: NavTabEnum.Reels, path: '/' },
  {
    icon: Messenger,
    iconActive: MessengerActive,
    title: 'Tin nhắn',
    name: NavTabEnum.Messenger,
    path: '/'
  },
  {
    icon: Heart,
    iconActive: HeartActive,
    title: 'Thông báo',
    name: NavTabEnum.Notification,
    path: ''
  },
  { icon: Plus, iconActive: PlusActive, title: 'Tạo', name: NavTabEnum.CreatePost, path: '' },
  { title: 'Trang cá nhân', name: NavTabEnum.Profile, path: `/${123}` }
]

export const NAVS_MOBILE: Nav[] = [
  { icon: Home, iconActive: HomeActive, title: 'Trang chủ', name: NavTabEnum.Home, path: '/' },
  {
    icon: Explore,
    iconActive: ExploreActive,
    title: 'Khám phá',
    name: NavTabEnum.Explore,
    path: '/explore'
  },
  { icon: Reel, iconActive: ReelActive, title: 'Reels', name: NavTabEnum.Reels, path: '/' },
  { icon: Plus, iconActive: PlusActive, title: 'Tạo', name: NavTabEnum.CreatePost, path: '' },
  {
    icon: Messenger,
    iconActive: MessengerActive,
    title: 'Tin nhắn',
    name: NavTabEnum.Messenger,
    path: '/'
  },
  { title: 'Trang cá nhân', name: NavTabEnum.Profile, path: '/123' }
]

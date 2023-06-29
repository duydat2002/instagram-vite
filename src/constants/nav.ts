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

export const NAVS = [
  { icon: Home, iconActive: HomeActive, title: 'Trang chủ', tab: NavTabEnum.Home, path: '/' },
  {
    icon: Search,
    iconActive: SearchActive,
    title: 'Tìm kiếm',
    tab: NavTabEnum.Search,
    path: '/123',
    noRedirect: true
  },
  {
    icon: Explore,
    iconActive: ExploreActive,
    title: 'Khám phá',
    tab: NavTabEnum.Explore,
    path: '/explore'
  },
  { icon: Reel, iconActive: ReelActive, title: 'Reels', tab: NavTabEnum.Reels, path: '/' },
  {
    icon: Messenger,
    iconActive: MessengerActive,
    title: 'Tin nhắn',
    tab: NavTabEnum.Messenger,
    path: '/'
  },
  {
    icon: Heart,
    iconActive: HeartActive,
    title: 'Thông báo',
    tab: NavTabEnum.Notification,
    path: '#',
    noRedirect: true
  },
  { icon: Plus, iconActive: PlusActive, title: 'Tạo', tab: NavTabEnum.CreatePost, path: '/' }
]

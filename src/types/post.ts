export interface IPost {
  id: string
  userId: string
  caption?: string
  contents: string[]
  thumbs?: string[]
  type: 'image' | 'video' | 'reel' | 'multiple'
  tags?: string[]
  likeCount: number
  commentCount: number
  createdAt: any

  ratio: number
}

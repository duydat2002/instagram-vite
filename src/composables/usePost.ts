import { db } from '@/firebase'
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where
} from 'firebase/firestore'
import { usePostStore } from '@/store'
import type { IPost } from '@/types'

export const usePost = () => {
  const getPost = async (postId: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'posts', postId))

      if (docSnap.exists()) {
        return {
          id: postId,
          ...docSnap.data()
        } as IPost
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getUserPosts = async (userId: string) => {
    try {
      const posts: IPost[] = []
      const querySnapshot = await getDocs(
        query(collection(db, 'posts'), where('userId', '==', userId))
      )

      if (querySnapshot.empty) {
        return null
      } else {
        querySnapshot.forEach((doc) => {
          posts.push({
            id: doc.id,
            ...doc.data()
          } as IPost)
        })

        return posts
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getOtherUserPosts = async (userId: string, postId: string) => {
    try {
      const posts: IPost[] = []
      const querySnapshot = await getDocs(
        query(
          collection(db, 'posts'),
          where('userId', '==', userId),
          where(documentId(), '!=', postId)
        )
      )

      if (querySnapshot.empty) {
        return null
      } else {
        querySnapshot.forEach((doc) => {
          posts.push({
            id: doc.id,
            ...doc.data()
          } as IPost)
        })

        return posts
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const watchPost = (postId: string) => {
    const { setPost } = usePostStore()

    return onSnapshot(doc(db, 'posts', postId), (doc) => {
      if (doc.exists()) {
        console.log('Post change', postId)
        setPost({
          id: doc.id,
          ...doc.data()
        } as IPost)
      }
    })
  }

  return {
    getPost,
    getUserPosts,
    getOtherUserPosts,
    watchPost
  }
}

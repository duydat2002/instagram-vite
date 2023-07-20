import { db } from '@/firebase'
import type { IPost } from '@/types'
import { collection, doc, documentId, getDoc, getDocs, query, where } from 'firebase/firestore'

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

  return {
    getPost,
    getUserPosts,
    getOtherUserPosts
  }
}

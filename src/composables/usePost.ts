import { auth, db } from '@/firebase'
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore'
import { usePostStore, useCreatePostStore } from '@/store'
import type { IPost } from '@/types'
import { useStorage } from '@/composables'

export const usePost = () => {
  const setPost = async () => {
    try {
      const { uploadPosts } = useStorage()
      const { medias, caption, cropperSize } = useCreatePostStore()

      const postRef = await addDoc(collection(db, 'posts'), {})
      const postId = postRef.id

      const dataUrls: string[] = []
      medias.forEach((media) => {
        dataUrls.push(media.canvas.toDataURL())
      })
      const urls = await uploadPosts(postId, dataUrls)

      let type = 'image'
      if (urls && urls.length > 1) {
        type = 'multiple'
      } else {
        type = 'image'
      }

      const post = {
        userId: auth.currentUser!.uid,
        caption: caption,
        contents: urls,
        type,
        likeCount: 0,
        commentCount: 0,
        tags: [],
        ratio: cropperSize.width / cropperSize.height,
        createdAt: serverTimestamp()
      }

      await setDoc(doc(db, 'posts', postId), post)
    } catch (error) {
      console.log(error)
    }
  }

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
    setPost,
    getPost,
    getUserPosts,
    getOtherUserPosts,
    watchPost
  }
}

import { db } from '@/firebase'
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { storeToRefs } from 'pinia'
import { useUserStore, usePostStore, useCommentStore } from '@/store'
import type { ICommentLike, IPostLike, IReplyLike, IUser } from '@/types'
import { useUser } from '.'

export const useLike = () => {
  const getLikedUsers = async (findId: string, type: 'post' | 'comment' | 'reply') => {
    try {
      const { currentUser } = useUserStore()
      const users: IUser[] = []

      // Get all user liked
      const querySnap = await getDocs(
        query(collection(db, `${type}Likes`), where(`${type}Id`, '==', findId))
      )

      // Check currentUserFollowings commentLikes user
      const { getUser } = useUser()
      let hasCurrentUser = false
      const promises = querySnap.docs.map(async (commentLikesDoc) => {
        const userId = commentLikesDoc.data().userId
        const user = await getUser(userId)

        if (userId != currentUser?.id) {
          const docSnap = await getDoc(doc(db, 'followers', `${currentUser?.id}-${userId}`))

          if (docSnap.exists()) {
            users.unshift({
              ...user,
              isCurrentUserFollowing: true
            } as IUser)
          } else {
            users.push({
              ...user,
              isCurrentUserFollowing: false
            } as IUser)
          }
        } else {
          hasCurrentUser = true
        }
      })

      await Promise.all(promises)

      if (hasCurrentUser) {
        users.unshift(currentUser!)
      }

      return users
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // Post Likes
  const likePost = async (postId: string) => {
    try {
      const { currentUser } = storeToRefs(useUserStore())
      const { increaseLikeCount } = usePostStore()

      const likeData = {
        postId,
        userId: currentUser.value?.id,
        createdAt: Timestamp.fromDate(new Date())
      }

      increaseLikeCount()
      let likeDoc
      await Promise.all([
        (likeDoc = addDoc(collection(db, 'postLikes'), likeData)),
        updateDoc(doc(db, 'posts', postId), {
          likeCount: increment(1)
        })
      ])

      likeDoc = await likeDoc
      return {
        ...likeData,
        id: likeDoc.id
      } as IPostLike
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const unlikePost = async (like: IPostLike) => {
    try {
      const { decreaseLikeCount } = usePostStore()

      decreaseLikeCount()
      await Promise.all([
        deleteDoc(doc(db, 'postLikes', like.id)),
        updateDoc(doc(db, 'posts', like.postId), {
          likeCount: increment(-1)
        })
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const getPostLike = async (postId: string) => {
    try {
      const { currentUser } = storeToRefs(useUserStore())

      const querySnapshot = await getDocs(
        query(
          collection(db, 'postLikes'),
          where('postId', '==', postId),
          where('userId', '==', currentUser.value?.id)
        )
      )

      if (querySnapshot.empty) {
        return null
      } else {
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        } as IPostLike
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // Comment Likes
  const likeComment = async (commentId: string) => {
    try {
      const { currentUser } = storeToRefs(useUserStore())
      const { increaseLikeCount } = useCommentStore()

      const likeData = {
        commentId,
        userId: currentUser.value?.id,
        createdAt: Timestamp.fromDate(new Date())
      }

      increaseLikeCount(commentId)
      let likeDoc
      await Promise.all([
        (likeDoc = addDoc(collection(db, 'commentLikes'), likeData)),
        updateDoc(doc(db, 'comments', commentId), {
          likeCount: increment(1)
        })
      ])

      likeDoc = await likeDoc
      return {
        ...likeData,
        id: likeDoc.id
      } as ICommentLike
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const unlikeComment = async (like: ICommentLike) => {
    try {
      const { decreaseLikeCount } = useCommentStore()

      decreaseLikeCount(like.commentId)
      await Promise.all([
        deleteDoc(doc(db, 'commentLikes', like.id)),
        updateDoc(doc(db, 'comments', like.commentId), {
          likeCount: increment(-1)
        })
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const getCommentLike = async (commentId: string) => {
    try {
      const { currentUser } = storeToRefs(useUserStore())

      const querySnapshot = await getDocs(
        query(
          collection(db, 'commentLikes'),
          where('commentId', '==', commentId),
          where('userId', '==', currentUser.value?.id)
        )
      )

      if (querySnapshot.empty) {
        return null
      } else {
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        } as ICommentLike
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // Reply Likes
  const likeReply = async (replyId: string) => {
    try {
      const { currentUser } = storeToRefs(useUserStore())

      const likeData = {
        replyId,
        userId: currentUser.value?.id,
        createdAt: Timestamp.fromDate(new Date())
      }

      let likeDoc
      await Promise.all([
        (likeDoc = addDoc(collection(db, 'replyLikes'), likeData)),
        updateDoc(doc(db, 'replies', replyId), {
          likeCount: increment(1)
        })
      ])

      likeDoc = await likeDoc
      return {
        ...likeData,
        id: likeDoc.id
      } as IReplyLike
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const unlikeReply = async (like: IReplyLike) => {
    try {
      await Promise.all([
        deleteDoc(doc(db, 'replyLikes', like.id)),
        updateDoc(doc(db, 'replies', like.replyId), {
          likeCount: increment(-1)
        })
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const getReplyLike = async (replyId: string) => {
    try {
      const { currentUser } = storeToRefs(useUserStore())

      const querySnapshot = await getDocs(
        query(
          collection(db, 'replyLikes'),
          where('replyId', '==', replyId),
          where('userId', '==', currentUser.value?.id)
        )
      )

      if (querySnapshot.empty) {
        return null
      } else {
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        } as IReplyLike
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  //Delete Likes
  const deleteLikes = async (nameCollection: string, nameField: string, id: string) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, nameCollection), where(nameField, '==', id))
      )

      const promises = querySnapshot.docs.map(async (snap) => {
        await deleteDoc(doc(db, nameCollection, snap.id))
      })

      await Promise.all(promises)
    } catch (error) {
      console.log(error)
    }
  }

  const deletePostLikes = async (postId: string) => {
    await deleteLikes('postLikes', 'postId', postId)
  }

  const deleteCommentLikes = async (commentId: string) => {
    await deleteLikes('commentLikes', 'commentId', commentId)
  }

  const deleteReplyLikes = async (replyId: string) => {
    await deleteLikes('replyLikes', 'replyId', replyId)
  }

  return {
    getLikedUsers,
    likePost,
    unlikePost,
    getPostLike,
    likeComment,
    unlikeComment,
    getCommentLike,
    likeReply,
    unlikeReply,
    getReplyLike,
    deletePostLikes,
    deleteCommentLikes,
    deleteReplyLikes
  }
}

import { db } from '@/firebase'
import { usePostStore, useCommentStore } from '@/store'
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  where,
  orderBy,
  doc,
  Timestamp,
  deleteDoc
} from 'firebase/firestore'
import type { ICommentPost, IReply } from '@/types'

export const useComment = () => {
  const addCommentPost = async (comment: ICommentPost) => {
    try {
      const { increaseCommentCount } = usePostStore()
      const { addComment } = useCommentStore()

      const commentData = {
        ...comment,
        createdAt: Timestamp.fromDate(new Date())
      }
      let commentDoc
      await Promise.all([
        (commentDoc = addDoc(collection(db, 'comments'), commentData)),
        updateDoc(doc(db, 'posts', comment.postId), {
          commentCount: increment(1)
        })
      ])

      commentDoc = await commentDoc
      addComment({
        ...commentData,
        id: commentDoc.id
      })
      increaseCommentCount()
    } catch (error) {
      console.log(error)
    }
  }

  const getCommentsPost = async (postId: string) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'comments'),
          where('postId', '==', postId),
          orderBy('createdAt', 'desc')
        )
      )

      if (querySnapshot.empty) {
        return null
      } else {
        const comments: ICommentPost[] = []
        querySnapshot.forEach((doc) => {
          comments.push({
            id: doc.id,
            ...doc.data()
          } as ICommentPost)
        })
        return comments
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const deleteCommentPost = async (commentId: string) => {
    try {
      const { post } = usePostStore()
      const { deleteComment } = useCommentStore()

      deleteComment(commentId)

      const [_, querySnapshot] = await Promise.all([
        deleteDoc(doc(db, 'comments', commentId)),
        getDocs(query(collection(db, 'replies'), where('commentId', '==', commentId)))
      ])

      const promises = querySnapshot.docs.map(async (replyDoc) => {
        await deleteDoc(doc(db, 'replies', replyDoc.id))
      })

      const deletedCount = querySnapshot.docs.length ? querySnapshot.docs.length + 1 : 1
      await Promise.all([
        updateDoc(doc(db, 'posts', post!.id), {
          commentCount: increment(-deletedCount)
        }),
        ...promises
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const addReply = async (reply: IReply) => {
    try {
      const { increaseReplyCount, resetReplyTo } = useCommentStore()

      await Promise.all([
        addDoc(collection(db, 'replies'), {
          ...reply,
          createdAt: serverTimestamp()
        }),
        updateDoc(doc(db, 'comments', reply.commentId), {
          replyCount: increment(1)
        }),
        updateDoc(doc(db, 'posts', reply.postId), {
          commentCount: increment(1)
        })
      ])
      increaseReplyCount(reply.commentId)
      resetReplyTo()
    } catch (error) {
      console.log(error)
    }
  }

  const getReplies = async (commentId: string) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'replies'),
          where('commentId', '==', commentId),
          orderBy('createdAt', 'asc')
        )
      )

      if (querySnapshot.empty) {
        return null
      } else {
        const replies: IReply[] = []
        querySnapshot.forEach((doc) => {
          replies.push({
            id: doc.id,
            ...doc.data()
          } as IReply)
        })
        return replies
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const deleteReply = async (commentId: string, replyId: string) => {
    try {
      const { post } = usePostStore()
      const { decreaseReplyCount } = useCommentStore()

      decreaseReplyCount(commentId)
      await Promise.all([
        deleteDoc(doc(db, 'replies', replyId)),
        updateDoc(doc(db, 'comments', commentId), {
          replyCount: increment(-1)
        }),
        updateDoc(doc(db, 'posts', post!.id), {
          commentCount: increment(-1)
        })
      ])
    } catch (error) {
      console.log(error)
    }
  }

  return {
    addCommentPost,
    getCommentsPost,
    deleteCommentPost,
    addReply,
    getReplies,
    deleteReply
  }
}

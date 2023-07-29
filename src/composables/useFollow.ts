import { db } from '@/firebase'
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  collection
} from 'firebase/firestore'
import { useUser } from '@/composables'
import { updateWithTransaction } from '@/helpers'
import { useUserStore } from '@/store'
import type { IUser } from '@/types'

export const useFollow = () => {
  const isFollowing = async (followerId: string, followingId: string) => {
    const docSnap = await getDoc(doc(db, 'followers', `${followerId}-${followingId}`))

    return docSnap.exists()
  }

  const setFollow = async (followerId: string, followingId: string) => {
    try {
      await Promise.all([
        await setDoc(doc(db, 'followers', `${followerId}-${followingId}`), {
          followerId,
          followingId,
          createdAt: serverTimestamp()
        }),
        await updateFollowCount(followerId, followingId)
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const deleteFollow = async (followerId: string, followingId: string) => {
    try {
      await Promise.all([
        deleteDoc(doc(db, 'followers', `${followerId}-${followingId}`)),
        updateUnfollowCount(followerId, followingId)
      ])
    } catch (error) {
      console.log(error)
    }
  }

  const getFollows = async (followType: 'followers' | 'followings') => {
    const { currentUser, user } = useUserStore()
    const field = followType == 'followers' ? 'followerId' : 'followingId'
    const oppositeField = followType == 'followers' ? 'followingId' : 'followerId'

    const users: IUser[] = []

    // Get all user follows
    const querySnap = await getDocs(
      query(collection(db, 'followers'), where(oppositeField, '==', user?.id))
    )

    // Check currentUserFollowings followings user
    const { getUser } = useUser()
    let hasCurrentUser = false
    const promises = querySnap.docs.map(async (followDoc) => {
      const followId = followDoc.data()[field]
      const user = await getUser(followId)

      if (followId != currentUser?.id) {
        const docSnap = await getDoc(doc(db, 'followers', `${currentUser?.id}-${followId}`))

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
  }

  const getMutualFollowers = async (userId: string) => {
    const { currentUser } = useUserStore()
    const users: IUser[] = []

    if (currentUser) {
      // Get currentUserFollowings
      const querySnap = await getDocs(
        query(collection(db, 'followers'), where('followerId', '==', currentUser.id))
      )

      // Check currentUserFollowings followings user
      const { getUser } = useUser()
      const promises = querySnap.docs.map(async (followDoc) => {
        const docSnap = await getDoc(
          doc(db, 'followers', `${followDoc.data().followingId}-${userId}`)
        )

        if (docSnap.exists()) {
          const user = await getUser(docSnap.data().followerId)
          users.push(user!)
        }
      })

      await Promise.all(promises)
    }
    return users
  }

  //Update currentUser, user when follow user
  const updateFollowCount = async (followerId: string, followingId: string) => {
    // === SERVER ===
    // Update followingCount of currentUser(followerId)
    await updateWithTransaction(
      doc(db, 'users', followerId),
      'insight.followingCount',
      (oldValue) => oldValue + 1
    )
    // Update followersCount of user(followingId)
    await updateWithTransaction(
      doc(db, 'users', followingId),
      'insight.followersCount',
      (oldValue) => oldValue + 1
    )
  }

  //Update currentUser, user when unfollow user
  const updateUnfollowCount = async (followerId: string, followingId: string) => {
    // === SERVER ===
    // Update followingCount of currentUser(followerId)
    await updateWithTransaction(
      doc(db, 'users', followerId),
      'insight.followingCount',
      (oldValue) => oldValue - 1
    )
    // Update followersCount of user(followingId)
    await updateWithTransaction(
      doc(db, 'users', followingId),
      'insight.followersCount',
      (oldValue) => oldValue - 1
    )
  }

  return {
    isFollowing,
    setFollow,
    deleteFollow,
    getFollows,
    updateFollowCount,
    updateUnfollowCount,
    getMutualFollowers
  }
}

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
          createAt: serverTimestamp()
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

/*
import { db } from '@/firebase'
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  collection
} from 'firebase/firestore'
import { ref, onBeforeUnmount } from 'vue'
import { updateWithTransaction } from '@/helpers'
import { useUserStore } from '@/store'
import { get as lodashGet } from 'lodash'
import type { IUser } from '@/types'

export const useFollow = () => {
  const watchFollowChange = async (followerId: string, followingId: string) => {
    let checkFollowing: Nullable<boolean> = null

    const unsubscribe = onSnapshot(doc(db, 'followers', `${followerId}-${followingId}`), (doc) => {
      if (!doc.metadata.hasPendingWrites) {
        if (doc.exists()) {
          checkFollowing = true
        } else {
          checkFollowing = false
        }
      }
    })

    onBeforeUnmount(() => {
      unsubscribe()
    })

    return checkFollowing
  }

  const getFollows = async (fieldNameFind: string, fieldNameGet: string) => {
    const { currentUser, user } = useUserStore()

    //Ex: Get followers => followingId = userId => get all user - followedId
    let hasCurrentUser = false
    const users = ref<IUser[]>([])

    const querySnap = await getDocs(
      query(collection(db, 'followers'), where(fieldNameFind, '==', user?.id))
    )

    const promises = querySnap.docs.map(async (followDoc) => {
      const docSnap = await getDoc(doc(db, 'users', lodashGet(followDoc.data(), fieldNameGet)))
      if (docSnap.exists()) {
        //Check is currentUser
        if (docSnap.id === currentUser?.id) {
          hasCurrentUser = true
        } else {
          //Check currentUser follow?
          const isCurrentUserFollowing = await isFollowing(currentUser!.id, docSnap.id)
          const userData: IUser = {
            id: docSnap.id,
            ...docSnap.data(),
            isCurrentUserFollowing
          } as IUser
          if (isCurrentUserFollowing) {
            users.value.unshift(userData)
          } else {
            users.value.push(userData)
          }
        }
      }
    })

    await Promise.all(promises)

    if (hasCurrentUser) {
      users.value.unshift(currentUser!)
    }

    return users
  }

  const getFollowers = async () => {
    return await getFollows('followingId', 'followerId')
  }

  const getFollowings = async () => {
    return await getFollows('followerId', 'followingId')
  }

  const getMutualFollowers = async () => {
    const { currentUser, user } = useUserStore()
    const users: IUser[] = []

    const querySnap = await getDocs(
      query(collection(db, 'followers'), where('followingId', '==', user?.id))
    )

    querySnap.docs.map(async (followDoc) => {
      const docSnap = await getDoc(doc(db, 'users', lodashGet(followDoc.data(), 'followerId')))
      if (docSnap.exists()) {
        //Check currentUser follow?
        const isCurrentUserFollowing = await isFollowing(currentUser!.id, docSnap.id)
        if (isCurrentUserFollowing) {
          users.push({
            id: docSnap.id,
            ...docSnap.data(),
            isCurrentUserFollowing
          } as IUser)
        }
      }
    })

    return users
  }

  const isFollowing = async (followerId: string, followingId: string) => {
    const docSnap = await getDoc(doc(db, 'followers', `${followerId}-${followingId}`))

    if (docSnap.exists()) {
      return true
    } else {
      return false
    }
  }

  const setFollow = async (followerId: string, followingId: string) => {
    try {
      await setDoc(doc(db, 'followers', `${followerId}-${followingId}`), {
        followerId,
        followingId,
        createAt: serverTimestamp()
      })
      await updateFollowCount(followerId, followingId)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteFollow = async (followerId: string, followingId: string) => {
    try {
      await deleteDoc(doc(db, 'followers', `${followerId}-${followingId}`))
      await updateUnfollowCount(followerId, followingId)
    } catch (error) {
      console.log(error)
    }
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
    setFollow,
    deleteFollow,
    isFollowing,
    getFollows,
    getFollowers,
    getMutualFollowers,
    getFollowings,
    watchFollowChange
  }
}

*/

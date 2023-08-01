import { auth, db } from '@/firebase'
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  documentId,
  type WhereFilterOp
} from 'firebase/firestore'
import { useUserStore } from '@/store'
import { useFollow } from '@/composables'
import type { IUser, IUserInfo } from '@/types'
import { unionBy } from 'lodash'

export const useUser = () => {
  const getUser = async (userId: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'users', userId))

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as IUser
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getUserWithCheckFollow = async (userId: string) => {
    try {
      const { currentUser } = useUserStore()
      const { isFollowing } = useFollow()
      const user = await getUser(userId)

      if (user) {
        const [isCurrentUserFollowing, isCurrentUserFollower] = await Promise.all([
          isFollowing(currentUser!.id, user.id),
          isFollowing(user.id, currentUser!.id)
        ])
        return {
          ...user,
          isCurrentUserFollowing,
          isCurrentUserFollower
        }
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getCurrentUser = async () => {
    if (auth.currentUser) return await getUser(auth.currentUser!.uid)
    else return null
  }

  const getUserWithQuery = async (field: string, condition: string, value: any) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'users'), where(field, condition as WhereFilterOp, value))
      )

      if (querySnapshot.empty) {
        return null
      } else {
        return {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data()
        } as IUser
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getUserByUsername = async (username: string) => {
    return await getUserWithQuery('username', '==', username)
  }

  // Search use firebase query - phức tạp
  const searchUsers = async (text: string) => {
    const usernameQuery = query(
      collection(db, 'users'),
      where('search.lowerUsername', '>=', text.toLowerCase()),
      where('search.lowerUsername', '<', text.toLowerCase() + '\uf8ff')
    )
    const fullnameQuery = query(
      collection(db, 'users'),
      where('search.lowerFullname', '>=', text.toLowerCase()),
      where('search.lowerFullname', '<', text.toLowerCase() + '\uf8ff')
    )

    const [usernameSnapshot, fullnameSnapshot] = await Promise.all([
      getDocs(usernameQuery),
      getDocs(fullnameQuery)
    ])
    const usernameDocs = usernameSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data()
        } as IUser)
    )
    const fullnameDocs = fullnameSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data()
        } as IUser)
    )

    const userDocs = unionBy(usernameDocs, fullnameDocs, 'id')

    return userDocs
  }

  const getUserSearchHistory = async () => {
    try {
      const { currentUser } = useUserStore()
      const users: IUser[] = []

      const querySnapshot = await getDocs(
        query(collection(db, 'users'), where(documentId(), 'in', currentUser?.searchHistory))
      )

      if (!querySnapshot.empty) {
        const userMap: { [id: string]: IUser } = {}

        querySnapshot.forEach((doc) => {
          const user = {
            id: doc.id,
            ...doc.data()
          } as IUser
          userMap[doc.id] = user
        })

        currentUser?.searchHistory?.forEach((id) => {
          if (userMap[id]) users.push(userMap[id])
        })
      }

      return users
    } catch (error) {
      return []
    }
  }

  const getUsersWithCheckFollow = async (username: string) => {
    const { currentUser } = useUserStore()
    const { isFollowing } = useFollow()
    const users = await searchUsers(username)

    await Promise.all(
      users.map(async (user: IUser) => {
        const isCurrentUserFollowing = await isFollowing(currentUser!.id, user.id)
        const isCurrentUserFollower = await isFollowing(user.id, currentUser!.id)

        return {
          ...user,
          isCurrentUserFollowing,
          isCurrentUserFollower
        } as IUser
      })
    )

    return users
  }

  const updateAvatar = async (userId: string, avatar: string) => {
    await updateDoc(doc(db, 'users', userId), {
      avatar: avatar
    })
  }

  const updateUser = async (userId: string, data: IUserInfo) => {
    await updateDoc(doc(db, 'users', userId), {
      ...data
    })
  }

  const watchUserChange = (userId: string) => {
    const userStore = useUserStore()

    return onSnapshot(doc(db, 'users', userId), (doc) => {
      if (doc.exists()) {
        console.log('Data change', userId)
        if (userId == userStore.currentUser!.id) {
          userStore.updateCurrentUser({
            ...doc.data()
          })
          console.log(userStore.currentUser?.id)
        }

        if (userId == userStore.user?.id) {
          userStore.updateUser({
            ...doc.data()
          })
          console.log(userStore.user?.id)
        }
      }
    })
  }

  return {
    getUser,
    getUserWithCheckFollow,
    getCurrentUser,
    watchUserChange,
    getUserWithQuery,
    getUserByUsername,
    updateAvatar,
    searchUsers,
    updateUser,
    getUsersWithCheckFollow,
    getUserSearchHistory
  }
}

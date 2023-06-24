import { ref, onUnmounted } from 'vue'
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
  type WhereFilterOp
} from 'firebase/firestore'
import { useUserStore } from '@/store'
import type { IUser } from '@/types'

export const useUser = () => {
  const currentUser = ref<IUser | null>(null)
  const user = ref<IUser | null>(null)
  currentUser.value = {
    id: auth.currentUser?.uid,
    ...auth.currentUser
  } as IUser

  const getUser = async (userId: string) => {
    const docSnap = await getDoc(doc(db, 'users', userId))

    if (docSnap.exists()) {
      user.value = {
        id: docSnap.id,
        ...docSnap.data()
      } as IUser
    } else {
      user.value = null
    }

    return user.value
  }

  const getCurrentUser = async () => {
    return await getUser(auth.currentUser!.uid)
  }

  const watchUserChange = (userId: string) => {
    const userStore = useUserStore()

    const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
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

    onUnmounted(() => {
      unsubscribe()
    })
  }

  const getUserWithQuery = async (field: string, condition: string, value: any) => {
    const querySnapshot = await getDocs(
      query(collection(db, 'users'), where(field, condition as WhereFilterOp, value))
    )

    if (querySnapshot.empty) {
      user.value = null
    } else {
      querySnapshot.forEach((doc) => {
        user.value = {
          id: doc.id,
          ...doc.data()
        } as IUser
      })
    }

    return user.value
  }

  const getUserWithUsername = async (username: string) => {
    return await getUserWithQuery('username', '==', username)
  }

  const updateAvatar = async (userId: string, avatar: string) => {
    await updateDoc(doc(db, 'users', userId), {
      avatar: avatar
    })
  }

  return {
    user,
    getUser,
    getCurrentUser,
    watchUserChange,
    getUserWithQuery,
    getUserWithUsername,
    updateAvatar
  }
}

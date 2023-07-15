import { auth, storage } from '@/firebase'
import { ref, uploadBytes, uploadString, getDownloadURL, deleteObject } from 'firebase/storage'

export const useStorage = () => {
  const setAvatar = async (userId: string, file: File) => {
    try {
      const snapshot = await uploadBytes(ref(storage, `${userId}/avatar/${userId}.jpg`), file, {
        contentType: file.type
      })

      const url = await getDownloadURL(snapshot.ref)

      return url
    } catch (err) {
      console.log(err)
    }
  }

  const deleteAvatar = async (userId: string) => {
    try {
      await deleteObject(ref(storage, `${userId}/avatar/${userId}.jpg`))
    } catch (error) {
      console.log(error)
    }
  }

  const uploadPost = async (name: string, dataUrl: string) => {
    try {
      const snapshot = await uploadString(ref(storage, name), dataUrl, 'data_url')

      const url = await getDownloadURL(snapshot.ref)

      return url
    } catch (err) {
      console.log(err)
    }
  }

  const uploadPosts = async (postId: string, dataUrls: string[]) => {
    try {
      const promises = dataUrls.map(async (dataUrl, index) => {
        const url = await uploadPost(
          `${auth.currentUser?.uid}/posts/${postId}/media-${index}.png`,
          dataUrl
        )
        return url
      })

      const urls = await Promise.all(promises)
      return urls
    } catch (error) {
      console.log(error)
    }
  }

  return { setAvatar, deleteAvatar, uploadPosts }
}

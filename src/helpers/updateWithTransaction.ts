import { getDoc, runTransaction, DocumentReference } from 'firebase/firestore'
import { db } from '@/firebase'
import { get as lodashGet } from 'lodash'

export async function updateWithTransaction(
  docRef: DocumentReference,
  fieldName: string,
  calFunction: Fn<any, any>
) {
  try {
    await runTransaction(db, async (transaction) => {
      const doc = await transaction.get(docRef)
      if (doc.exists()) {
        const oldValue = lodashGet(doc.data(), fieldName)
        const newValue = calFunction(oldValue)

        transaction.update(docRef, {
          [fieldName]: newValue
        })

        return newValue
      }
    })

    const updatedDoc = await getDoc(docRef)

    const updatedData = {
      id: updatedDoc.id,
      ...updatedDoc.data()
    }
    return updatedData
  } catch (error) {
    console.log(error)
  }
}

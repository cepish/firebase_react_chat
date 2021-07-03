import React from 'react'
import { db } from '../App'
import { IDoc } from '../types/firebase'

export function useDoc(path: string): IDoc | null {
  const [doc, setDoc] = React.useState<IDoc | null>(null)

  React.useEffect(() => {
    return db.doc(path).onSnapshot(snapshot => {
      const doc = {
        data: snapshot.data(),
        id: snapshot.id,
      } as IDoc

      setDoc(doc)
    })
  }, [path])

  return doc
}

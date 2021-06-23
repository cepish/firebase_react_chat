import React, { useState, useEffect } from 'react'
import { db } from '../App'
import { IUser, IDoc } from '../types/firebase'
import firebase from 'firebase/app'
import { firebaseInstance } from '../App'
import { setUpPresence } from './rtdb'

/** useAuth types  **/
type ILoginErroFunc = React.Dispatch<React.SetStateAction<firebase.auth.Error | null>>

export function useAuth(setLoginError: ILoginErroFunc): IUser | null {
  const [user, setUser] = useState<IUser | null>(null)
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    /* login success callback */
    const loginSucceeded = (firebaseUser: firebase.User | null) => {
      if (firebaseUser) {
        const user = {
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        }

        db.collection('users').doc(user.uid).set(user, { merge: true })

        setUpPresence(user as IUser)

        setUser(user as IUser)
      } else {
        setUser(null)
      }
    }
    /* login fail callback */
    const loginFailed = (error: firebase.auth.Error) => setLoginError(error)

    return firebaseInstance.auth().onAuthStateChanged(loginSucceeded, loginFailed)
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */
  return user
}

/** useCollection types  **/
type IUseCollection<ICollection> = [
  ICollection[],
  React.Dispatch<React.SetStateAction<ICollection[]>>,
]

export function useCollection<ICollection>(
  path: string,
  order?: string | null,
  signature?: { [key: string]: string } | null,
): IUseCollection<ICollection> {
  const [collectionItems, setCollectionItems] = useState<ICollection[]>([])

  useEffect(() => {
    const request = order
      ? db.collection(path).orderBy(order, 'asc')
      : db.collection(path)

    return request.onSnapshot(snapshot => {
      const items: ICollection[] = []
      /* eslint-disable @typescript-eslint/no-explicit-any */
      snapshot.forEach((doc: { [key: string]: any }) => {
        const data: { [key: string]: any } = {}
        /* eslint-enable @typescript-eslint/no-explicit-any */
        if (signature && typeof signature === 'object') {
          for (const key in signature) {
            data[key] = signature[key] === 'func' ? doc[key]() : doc[key]
          }
          items.push(data as ICollection)
        } else {
          items.push(doc.data() as ICollection)
        }
      })

      setCollectionItems(items)
    })
  }, [path, order, signature])

  return [collectionItems, setCollectionItems]
}

export function useDoc(path: string): IDoc | null {
  const [doc, setDoc] = useState<IDoc | null>(null)

  useEffect(() => {
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

export function useOnline(user: IUser | null, channelId: string): void {
  useEffect(() => {
    if (user && user.uid) {
      db.doc(`users/${user.uid}`).update({
        channels: {
          [channelId]: {
            isOnline: true,
          },
        },
      })
    }
  }, [user, channelId])
}

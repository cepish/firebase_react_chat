import React, { useState, useEffect } from 'react'
import { db } from '../App'
import { IUser } from '../types/firebase'
import firebase from 'firebase/app'
import { firebaseInstance } from '../App'
import { setUpPresence } from '../utils/rtdb'

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

import React, { useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import { Nav, Channel, Login } from './components'
import { Router, Redirect } from '@reach/router'
import { useAuth } from './utils/hooks'
import config from './config'
import css from './App.module.scss'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
} else {
  firebase.app()
}
const test = 1
export const firebaseInstance = firebase
export const db = firebaseInstance.firestore()
export const rtdb = firebaseInstance.database()

const App: React.FC = () => {
  const [loginError, setLoginError] = useState<firebase.auth.Error | null>(null)
  const user = useAuth(setLoginError)

  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()

    try {
      await firebaseInstance.auth().signInWithPopup(provider)
    } catch (error) {
      setLoginError(error)
    }
  }

  const { defaultChannel } = config

  const app = (
    <React.Fragment>
      <Nav user={user} />
      <Router>
        <Channel path='/channel/:channelId' user={user} />
        <Redirect noThrow={true} from='/' to={`/channel/${defaultChannel}`} />
      </Router>
    </React.Fragment>
  )

  return (
    <div className={css.app}>
      {user ? app : <Login loginError={loginError} handleSignIn={handleSignIn} />}
    </div>
  )
}

export default App

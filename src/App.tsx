import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import { Nav, Channel, Login } from './components'
import { Router, Redirect } from '@reach/router'
import config from './config'
import css from './App.module.scss'
import { IUser } from './types/firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(config)
} else {
  firebase.app()
}

export const firebaseInstance = firebase
export const db = firebaseInstance.firestore()
export const rtdb = firebaseInstance.database()

/* eslint-disable @typescript-eslint/no-empty-interface */
interface IProps {}
/* eslint-enable @typescript-eslint/no-empty-interface */

interface IState {
  user: IUser | null
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      user: null,
    }
  }
  setUser = (user: IUser | null): void => {
    this.setState({ user })
  }

  render(): React.ReactElement {
    const { defaultChannel } = config
    const { setUser, state } = this
    const { user } = state

    const app = user ? (
      <React.Fragment>
        <Nav user={user} setUser={setUser} />
        <Router>
          <Channel path='/channel/:channelId' user={user} />
          <Redirect noThrow={true} from='/' to={`/channel/${defaultChannel}`} />
        </Router>
      </React.Fragment>
    ) : (
      <Login setUser={setUser} />
    )

    return <div className={css.app}>{app}</div>
  }
}

export default App

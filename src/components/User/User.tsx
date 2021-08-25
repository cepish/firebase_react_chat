import React from 'react'
import css from './User.module.scss'
import { IUser } from '../../types/firebase'
import { ISetUserCallback } from '../../types/app'
import { firebaseInstance } from '../../App'

interface Props {
  user: IUser | null
  setUser: ISetUserCallback
}

const User: React.FC<Props> = props => {
  const { user, setUser } = props

  const handleSignOut = () => {
    setUser(null)
    firebaseInstance.auth().signOut()
  }

  return user ? (
    <div className={css.user}>
      <img className={css.userImage} alt='whatever' role='img' src={user.photoURL} />
      <div>
        <div>{user.displayName}</div>
        <div>
          <button onClick={handleSignOut} className={css.button}>
            log out
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default User

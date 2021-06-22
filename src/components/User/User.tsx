import React from 'react'
import css from './User.module.scss'
import { IUser } from '../../types/firebase'
import { firebaseInstance } from  '../../App'

interface Props {
  user: IUser | null,
}

const User: React.FC<Props> = props => {
  const { user } = props

  const handleSignOut = () => {
    firebaseInstance.auth().signOut()
  }

  return user ? (
    <div className={css.user}>
      <img
        className={css.userImage}
        alt="whatever"
        src={user.photoURL}
      />
      <div>
        <div>{user.displayName}</div>
        <div>
          <button onClick={handleSignOut} className={css.button}>log out</button>
        </div>
      </div>
    </div>
  ) : null
}

export default User

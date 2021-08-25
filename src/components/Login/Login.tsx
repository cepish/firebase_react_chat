import React, { useState, useEffect } from 'react'
import css from './Login.module.scss'
import firebase from 'firebase/app'
import 'firebase/auth'
import { ISetUserCallback } from '../../types/app'
import { useAuth } from '../../hooks/useAuth'
import { firebaseInstance } from '../../App'

interface ILogin {
  setUser: ISetUserCallback
}

const Login: React.FC<ILogin> = props => {
  const { setUser } = props
  const [loginError, setLoginError] = useState<firebase.auth.Error | null>(null)
  const user = useAuth(setLoginError)

  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    /* eslint-disable */

    try {
      await firebaseInstance.auth().signInWithPopup(provider)
    } catch (error) {
      setLoginError(error.message)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError(null)
    handleSignIn()
  }

  return (
    <div className={css.container}>
      <div className={css.outerHolder}>
        <div className={css.innerHolder}>
          <h1 className={css.logo}>Chat</h1>
          <h4 className={css.header}>
            Nice to meet you again! Please, sign in to start chating.
          </h4>
          <form id='signInForm' onSubmit={handleSubmit}>
            <div className={css.formContainer}>
              <input
                type='submit'
                className='btn btn-submit'
                value='Sign in with Google'
              />
            </div>
            <span className={css.loginError}>
              {loginError ? loginError.toString() : null}
            </span>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

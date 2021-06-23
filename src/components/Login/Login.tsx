import React from 'react'
import css from './Login.module.scss'
import firebase from 'firebase/app'

interface ILogin {
  handleSignIn: () => void
  loginError: firebase.auth.Error | null
}

const Login: React.FC<ILogin> = props => {
  const { handleSignIn, loginError } = props

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
              {/* <div className={css.inputWrapper}>
                                <label className={css.label} htmlFor="email">Your Login (email/username)</label>
                                <input type="text" name="email" id="email"/>
                            </div> */}
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

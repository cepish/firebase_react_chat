import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Login from './Login'
import App from '../../App'
import firebase from 'firebase/app'
import { IUser } from '../../types/firebase'

jest.mock('../../utils/rtdb', () => ({
  setUpPresence: jest.fn(),
}))

/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock('firebase/app', () => {
  const set = jest.fn()
  const mAuth = {
    onAuthStateChanged: jest.fn(),
    signInWithPopup: jest.fn(),
  }

  const auth = jest.fn().mockReturnValue(mAuth) as jest.Mocked<any>

  auth.GoogleAuthProvider = jest.fn()

  return {
    apps: {
      length: 0,
    },
    database: () => ({
      ServerValue: {
        TIMESTAMP: new Date().toString(),
      },
    }),
    initializeApp: jest.fn(),
    auth,
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        onSnapshot: jest.fn(),
        doc: jest.fn(() => ({
          set,
        })),
      })),
    })),
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('user auth', () => {
  const USER_NAME = 'Dmitriy K'
  const USER_GREETING_TEXT = 'Nice to meet you again! Please, sign in to start chating.'
  const LOGIN_ERROR_MESSAGE = 'login error'

  const TEST_USER_DATA = {
    displayName: USER_NAME,
    photoURL: 'testPhoto',
    uid: 'testId',
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render user display data on successful response from firebase auth with useAuth hook', () => {
    const mockAuthStateChanged = firebase.auth().onAuthStateChanged as jest.Mocked<any>

    mockAuthStateChanged.mockImplementationOnce(
      (loginSucceeded: (firebaseUser: IUser) => void) => loginSucceeded(TEST_USER_DATA),
    )

    const { queryByText } = render(<App />)

    const mockUserSetCall: jest.Mocked<any> = firebase
      .firestore()
      .collection('test')
      .doc().set

    expect(mockUserSetCall).toHaveBeenCalledTimes(1)
    expect(mockUserSetCall).toHaveBeenCalledWith(TEST_USER_DATA, { merge: true })

    expect(queryByText(USER_NAME)).toBeInTheDocument()
  })

  it('should show login greeting and error message if firebase auth error occurs', () => {
    const mockAuthStateChanged = firebase.auth().onAuthStateChanged as jest.Mocked<any>

    mockAuthStateChanged.mockImplementationOnce(
      (_: () => void, loginFailed: (error: any) => void) =>
        loginFailed(LOGIN_ERROR_MESSAGE),
    )

    const mockUserSetCall: jest.Mocked<any> = firebase
      .firestore()
      .collection('test')
      .doc().set

    const { queryByText } = render(<App />)

    expect(mockUserSetCall).not.toHaveBeenCalled()
    expect(queryByText(USER_NAME)).not.toBeInTheDocument()
    expect(queryByText(USER_GREETING_TEXT)).toBeInTheDocument()
    expect(queryByText(LOGIN_ERROR_MESSAGE)).toBeInTheDocument()
  })
})

describe('login form submit', () => {
  const SET_USER = jest.fn
  const SUBMIT_BUTTON_TEXT = 'Sign in with Google'
  const LOGIN_ERROR_MESSAGE = new Error('login error')

  it('should show error if form submit fails', () => {
    const { queryByText, queryByDisplayValue } = render(<Login setUser={SET_USER} />)

    const mockAuthStateChanged = firebase.auth().signInWithPopup as jest.Mocked<any>
    mockAuthStateChanged.mockImplementationOnce(() => {
      throw LOGIN_ERROR_MESSAGE
    })

    const submitButton = queryByDisplayValue(SUBMIT_BUTTON_TEXT) as Element
    fireEvent.click(submitButton)

    expect(queryByText(LOGIN_ERROR_MESSAGE.message)).toBeInTheDocument()
    expect(mockAuthStateChanged).toHaveBeenCalledTimes(1)
  })

  it('should not show error if form submit is successful', () => {
    const { queryByText, queryByDisplayValue } = render(<Login setUser={SET_USER} />)

    const mockAuthStateChanged = firebase.auth().signInWithPopup as jest.Mocked<any>
    mockAuthStateChanged.mockImplementationOnce(() => null)

    const submitButton = queryByDisplayValue(SUBMIT_BUTTON_TEXT) as Element
    fireEvent.click(submitButton)

    expect(queryByText(LOGIN_ERROR_MESSAGE.message)).not.toBeInTheDocument()
    expect(mockAuthStateChanged).toHaveBeenCalledTimes(1)
  })
})

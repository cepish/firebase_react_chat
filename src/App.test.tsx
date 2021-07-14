import React from 'react'
import { render } from '@testing-library/react'
import firebase from 'firebase/app'
import App from './App'
import { IUser } from './types/firebase'
import './utils/rtdb'

jest.mock('./utils/rtdb', () => ({
  setUpPresence: jest.fn(),
}))

jest.mock('firebase/app', () => {
  const set = jest.fn()

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
    auth: jest.fn().mockReturnValue({ onAuthStateChanged: jest.fn() }),
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

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('user auth', () => {
  const USER_NAME = 'Dmitriy K'
  const USER_GREETING_TEXT = 'Nice to meet you again! Please, sign in to start chating.'

  const mockUserData = {
    displayName: USER_NAME,
    photoURL: 'testPhoto',
    uid: 'testId',
  }

  afterEach(() => {
    jest.resetAllMocks()

    /* re-instantiate auth mock implementation after jest.resetAllMocks() */
    firebase.auth = jest
      .fn()
      .mockReturnValue({ onAuthStateChanged: jest.fn() }) as jest.Mocked<any>

    /* re-instantiate firestore mock implementation after jest.resetAllMocks() */
    firebase.firestore = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({ set: jest.fn() }),
      }),
    }) as jest.Mocked<any>
  })

  it('should render user on successful response from firebase auth', () => {
    const mockAuthStateChanged = firebase.auth().onAuthStateChanged as jest.Mocked<any>

    mockAuthStateChanged.mockImplementationOnce(
      (loginSucceeded: (firebaseUser: IUser) => void) => loginSucceeded(mockUserData),
    )

    const { queryByText } = render(<App />)

    const mockUserSetCall: jest.Mocked<any> = firebase
      .firestore()
      .collection('test')
      .doc().set

    expect(mockUserSetCall).toHaveBeenCalledTimes(1)
    expect(mockUserSetCall).toHaveBeenCalledWith(mockUserData, { merge: true })

    expect(queryByText(USER_NAME)).toBeInTheDocument()
  })

  it('should show login if error occurs', () => {
    const mockAuthStateChanged = firebase.auth().onAuthStateChanged as jest.Mocked<any>

    mockAuthStateChanged.mockImplementationOnce(
      (_: () => void, loginFailed: (error: any) => void) => loginFailed('error'),
    )

    const mockUserSetCall: jest.Mocked<any> = firebase
      .firestore()
      .collection('test')
      .doc().set

    const { queryByText } = render(<App />)

    expect(mockUserSetCall).toHaveBeenCalledTimes(0)
    expect(queryByText(USER_NAME)).not.toBeInTheDocument()
    expect(queryByText(USER_GREETING_TEXT)).toBeInTheDocument()
  })
})

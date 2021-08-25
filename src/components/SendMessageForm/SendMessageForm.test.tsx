import React from 'react'
import SendMessageForm from './SendMessageForm'
import { render, fireEvent } from '@testing-library/react'
import firebase from 'firebase/app'

/* eslint-disable @typescript-eslint/no-explicit-any */

const mock_add = jest.fn()
const mock_doc = jest.fn()

jest.mock('firebase/app', () => {
  return {
    apps: {
      length: 0,
    },
    initializeApp: jest.fn(),
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: mock_doc,
        add: mock_add,
      })),
    })),
    database: jest.fn(),
  }
})

const MOCK_MESSAGE = 'Hello, World!'
const MOCK_NO_USER = null
const MOCK_USER = {
  displayName: 'testName',
  uid: 'testId',
  photoURL: 'testPhoto',
}
const TEST_VALUE = 'test value'

jest.spyOn(console, 'error').mockImplementation(() => null)

beforeEach(() => {
  jest.clearAllMocks()
})

it('should call firebase method and reset input after successful form submit', () => {
  const { getByText, queryByText, getByPlaceholderText } = render(
    <SendMessageForm channelId='testId' user={MOCK_USER} />,
  )

  const submitButton = getByText(/send message/i) as HTMLButtonElement
  const input = getByPlaceholderText(/message #general/i) as HTMLInputElement

  fireEvent.change(input, { target: { value: TEST_VALUE } })
  expect(input.value).toBe(TEST_VALUE)

  fireEvent.click(submitButton)

  expect(queryByText(/unable to send empty message/i)).not.toBeInTheDocument()
  expect(queryByText(/message could not be sent/i)).not.toBeInTheDocument()

  expect(mock_add).toBeCalledTimes(1)

  const { createdAt: mock_createdAt, createdAtStr: mock_createdAtStr } =
    mock_add.mock.calls[0][0]

  expect(mock_add).toBeCalledWith({
    user: (firebase.firestore as jest.Mocked<any>)()
      .collection('users')
      .doc(MOCK_USER.uid),
    userId: MOCK_USER.uid,
    text: TEST_VALUE,
    createdAt: mock_createdAt,
    createdAtStr: mock_createdAtStr,
  })
})

it('should show error on submit if there is no user', () => {
  const { getByPlaceholderText, getByText, queryByText } = render(
    <SendMessageForm channelId='testId' user={MOCK_NO_USER} />,
  )
  const input = getByPlaceholderText(/message #general/i) as HTMLInputElement
  const submitButton = getByText(/send message/i)

  fireEvent.change(input, { target: { value: MOCK_MESSAGE } })
  expect(input.value).toBe(MOCK_MESSAGE)
  fireEvent.click(submitButton)

  expect(queryByText(/message could not be sent/i)).toBeInTheDocument()

  fireEvent.focus(input)
  expect(queryByText(/message could not be sent/i)).not.toBeInTheDocument()
  expect(queryByText(MOCK_MESSAGE)).not.toBeInTheDocument()
})

it('should show error on submit if there message is empty', () => {
  const { getByPlaceholderText, getByText, queryByText } = render(
    <SendMessageForm channelId='testId' user={MOCK_USER} />,
  )
  const input = getByPlaceholderText(/message #general/i) as HTMLInputElement
  const submitButton = getByText(/send message/i)

  fireEvent.change(input, { target: { value: '' } })
  expect(input.value).toBe('')
  fireEvent.click(submitButton)

  expect(queryByText(/unable to send empty message/i)).toBeInTheDocument()
  fireEvent.focus(input)
  expect(queryByText(/unable to send empty message/i)).not.toBeInTheDocument()
})

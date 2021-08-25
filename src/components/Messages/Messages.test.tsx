import React from 'react'
import Messages from './Messages'
import { render, waitFor } from '@testing-library/react'
import { useCollection as mockUseCollection } from '../../hooks/useCollection'
import {
  MOCK_MESSAGES_TWO_USERS,
  MOCK_MESSAGES_ONE_USER,
  MOCK_MESSAGE,
  MOCK_AUTHOR_EXISTS,
  MOCK_AUTHOR_NOT_EXISTS,
  MOCK_MESSAGES_DIFFERENT_DATE,
} from './MessageMockData'

/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock('../../hooks/useCollection')

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show two messages with avatars of two different users', async () => {
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([MOCK_MESSAGES_TWO_USERS])

  MOCK_MESSAGES_TWO_USERS[0].user.get.mockImplementationOnce(() =>
    Promise.resolve(MOCK_AUTHOR_EXISTS),
  )
  MOCK_MESSAGES_TWO_USERS[1].user.get.mockImplementationOnce(() =>
    Promise.resolve(MOCK_AUTHOR_EXISTS),
  )

  const { getByText, getAllByRole } = render(<Messages channelId='testId' />)

  await waitFor(() => {
    const avatars = getAllByRole('presentation')
    const messageDate = getAllByRole('timer')

    expect(avatars).toHaveLength(2)
    expect(messageDate).toHaveLength(1)

    expect(mockUseCollection).toHaveBeenCalledTimes(1)
    expect(getByText(MOCK_MESSAGES_TWO_USERS[0].text)).toBeInTheDocument()
    expect(getByText(MOCK_MESSAGES_TWO_USERS[1].text)).toBeInTheDocument()
  })
})

it('should show two messages and one avatar when messages belong to the same user', async () => {
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([MOCK_MESSAGES_ONE_USER])

  MOCK_MESSAGES_ONE_USER[0].user.get.mockImplementationOnce(() =>
    Promise.resolve(MOCK_AUTHOR_EXISTS),
  )
  MOCK_MESSAGES_ONE_USER[1].user.get.mockImplementationOnce(() =>
    Promise.resolve(MOCK_AUTHOR_EXISTS),
  )

  const { getByText, getAllByRole } = render(<Messages channelId='testId' />)

  await waitFor(() => {
    const avatars = getAllByRole('presentation')
    const messageDate = getAllByRole('timer')

    expect(avatars).toHaveLength(1)
    expect(messageDate).toHaveLength(1)

    expect(mockUseCollection).toHaveBeenCalledTimes(1)
    expect(getByText(MOCK_MESSAGES_ONE_USER[0].text)).toBeInTheDocument()
    expect(getByText(MOCK_MESSAGES_ONE_USER[1].text)).toBeInTheDocument()
  })
})

jest.spyOn(console, 'error').mockImplementation(() => null)

it('should show error text if getting user data fails', async () => {
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([MOCK_MESSAGE]) // or MOCK_MESSAGES_TWO_USERS
  MOCK_MESSAGE[0].user.get.mockImplementationOnce(() => Promise.reject('Error'))

  const { queryByRole, queryByText } = render(<Messages channelId='testId' />)

  await waitFor(() => {
    expect(queryByRole('presentation')).not.toBeInTheDocument()
    expect(queryByText(MOCK_MESSAGE[0].text)).not.toBeInTheDocument()
    expect(queryByText(/Unable to fetch user data/i)).toBeInTheDocument()
  })
})

it('should show two different dates', async () => {
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([
    MOCK_MESSAGES_DIFFERENT_DATE,
  ])
  MOCK_MESSAGES_DIFFERENT_DATE[0].user.get.mockImplementationOnce(() =>
    Promise.resolve(MOCK_AUTHOR_EXISTS),
  )
  MOCK_MESSAGES_DIFFERENT_DATE[1].user.get.mockImplementationOnce(() =>
    Promise.resolve(MOCK_AUTHOR_EXISTS),
  )

  const { getAllByRole, queryByText } = render(<Messages channelId='testId' />)

  await waitFor(() => {
    const avatar = getAllByRole('presentation')
    const messageDate = getAllByRole('timer')

    expect(avatar).toHaveLength(1)
    expect(messageDate).toHaveLength(2)

    expect(mockUseCollection).toHaveBeenCalledTimes(1)

    expect(queryByText(/Unable to fetch user data/i)).not.toBeInTheDocument()

    expect(queryByText(MOCK_MESSAGES_DIFFERENT_DATE[0].text)).toBeInTheDocument()
    expect(queryByText(MOCK_MESSAGES_DIFFERENT_DATE[1].text)).toBeInTheDocument()
  })
})

it('should not show message but show error if author does not exist', async () => {
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([MOCK_MESSAGES_TWO_USERS])

  MOCK_MESSAGES_TWO_USERS[0].user.get.mockImplementationOnce(() =>
    Promise.resolve(MOCK_AUTHOR_NOT_EXISTS),
  )

  MOCK_MESSAGES_TWO_USERS[1].user.get.mockImplementationOnce(() =>
    Promise.resolve(MOCK_AUTHOR_EXISTS),
  )

  const { getAllByRole, getAllByText, queryByText } = render(
    <Messages channelId='testId' />,
  )

  await waitFor(() => {
    expect(mockUseCollection).toHaveBeenCalledTimes(1)

    /** existing user */
    const avatar = getAllByRole('presentation')
    expect(avatar).toHaveLength(1)
    expect(queryByText(MOCK_MESSAGES_TWO_USERS[1].text)).toBeInTheDocument()

    /** not existing user */
    const error = new RegExp('Unable to fetch user data', 'i')
    expect(getAllByText(error)).toHaveLength(1)
    expect(queryByText(MOCK_MESSAGES_TWO_USERS[0].text)).not.toBeInTheDocument()
  })
})

it('should not show messages if there is none of them', async () => {
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([[]])

  const { queryByRole, queryByText } = render(<Messages channelId='testId' />)

  await waitFor(() => {
    expect(mockUseCollection).toHaveBeenCalledTimes(1)
    expect(queryByRole('presentation')).not.toBeInTheDocument()
    expect(queryByText(/Unable to fetch user data/i)).not.toBeInTheDocument()
  })
})

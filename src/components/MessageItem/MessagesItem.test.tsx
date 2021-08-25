import React from 'react'
import MessageItem from './MessageItem'
import { render, waitFor } from '@testing-library/react'
import { IChannelMessage } from '../../types/firebase'

const MOCK_MESSAGE: IChannelMessage = {
  createdAt: {
    seconds: 0,
    nanoseconds: 0,
  },
  createdAtStr: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
  text: 'Hello, world',
  userId: 'testId',
  user: {
    get: jest.fn(),
  },
}

const MOCK_DOC_DATA = {
  exists: true,
  data: jest.fn(() => ({
    displayName: 'DK',
    uid: 'DK_id',
    photoURL: 'photo',
  })),
}

it('should render message item with avatar and day', async () => {
  MOCK_MESSAGE.user.get.mockImplementationOnce(() => Promise.resolve(MOCK_DOC_DATA))

  const { getByRole } = render(
    <MessageItem showAvatar={true} showDay={true} message={MOCK_MESSAGE} />,
  )
  await waitFor(() => {
    const avatar = getByRole('presentation')
    const date = getByRole('timer')

    expect(avatar).toBeInTheDocument()
    expect(avatar).toMatchInlineSnapshot(`
      <div
        class="avatar"
        role="presentation"
        style="background-image: url(photo);"
      />
    `)
    expect(date).toMatchInlineSnapshot(`
      <div
        class="dayText"
        role="timer"
      >
        21 M06 5
      </div>
    `)
  })
})

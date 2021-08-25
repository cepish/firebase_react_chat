import React from 'react'
import { render } from '@testing-library/react'
import Members from './Members'
import { useCollection as mockUseCollection } from '../../hooks/useCollection'
import { IUser } from '../../types/firebase'

jest.mock('../../hooks/useCollection')

/* eslint-disable @typescript-eslint/no-explicit-any */

const CHANNEL_NAME_EXISTS = 'channel_1'
const CHANNEL_NAME_NOT_EXISTS = 'channel_null'

const TEST_MEMBERS_LIST: IUser[] = [
  {
    displayName: 'TEST NAME',
    uid: 'TEST_ID',
    photoURL: '',
    channels: {
      [CHANNEL_NAME_EXISTS]: {
        isOnline: true,
      },
    },
  },
]

it('should show members list', () => {
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([TEST_MEMBERS_LIST])

  const { getByText } = render(<Members channelId={CHANNEL_NAME_EXISTS} />)

  expect(getByText(TEST_MEMBERS_LIST[0].displayName)).toBeInTheDocument()
  expect(mockUseCollection).toHaveBeenCalledTimes(1)
})

it('should show specific css class when a user is offline/online', () => {
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([TEST_MEMBERS_LIST])

  const { rerender, container } = render(<Members channelId={CHANNEL_NAME_EXISTS} />)
  expect(container.firstElementChild?.children[1]).toMatchInlineSnapshot(`
    <div
      class="members"
    >
      <div
        class="member"
      >
        <div
          class="memberStatus online"
        />
        TEST NAME
      </div>
    </div>
  `)
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([TEST_MEMBERS_LIST])

  rerender(<Members channelId={CHANNEL_NAME_NOT_EXISTS} />)

  expect(container.firstElementChild?.children[1]).toMatchInlineSnapshot(`
    <div
      class="members"
    >
      <div
        class="member"
      >
        <div
          class="memberStatus offline"
        />
        TEST NAME
      </div>
    </div>
  `)
})

import React from 'react'
import Nav from './Nav'
import { render } from '@testing-library/react'
import { useCollection as mockUseCollection } from '../../hooks/useCollection'

/* eslint-disable @typescript-eslint/no-explicit-any */

jest.mock('../../hooks/useCollection')

const MOCK_USER = {
  displayName: 'userName',
  uid: 'testId',
  photoURL: 'testPhoto',
}

const MOCK_CHANNEL = {
  id: 'testId',
  data: {
    key: 'value',
  },
}

beforeEach(() => {
  jest.clearAllMocks()
})

it('should show channels list and user', () => {
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([[MOCK_CHANNEL]])

  const { getByRole } = render(<Nav user={MOCK_USER} setUser={() => null} />)

  const userAvatar = getByRole('img')
  const channelsList = getByRole('navigation')

  expect(userAvatar).toBeInTheDocument()
  expect(userAvatar).toMatchInlineSnapshot(`
    <img
      alt="whatever"
      class="userImage"
      role="img"
      src="testPhoto"
    />
  `)
  expect(channelsList).toMatchInlineSnapshot(`
    <nav
      class="channel"
      role="navigation"
    >
      <a
        class="channel"
        href="/channel/testId"
      >
        # 
        testId
      </a>
    </nav>
  `)
})

it('should show no channels list neither a user if there are none of them', () => {
  ;(mockUseCollection as jest.Mocked<any>).mockReturnValueOnce([[]])

  const { queryByRole } = render(<Nav user={null} setUser={() => null} />)

  const userAvatar = queryByRole('img')
  const channelsList = queryByRole('navigation')

  expect(userAvatar).not.toBeInTheDocument()
  expect(channelsList).toMatchInlineSnapshot(`
    <nav
      class="channel"
      role="navigation"
    />
  `)
})

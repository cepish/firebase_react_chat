import React from 'react'
import User from './User'
import { render } from '@testing-library/react'

const MOCK_USER_DATA = {
  displayName: 'TEST',
  uid: 'TEST',
  photoURL: 'TEST',
}

it('should show nothing if there is no user data', () => {
  const { queryByRole, container } = render(<User user={null} setUser={() => null} />)

  expect(queryByRole('img')).not.toBeInTheDocument()
  expect(container.firstElementChild).toMatchInlineSnapshot(`null`)
})

it('should show user data', () => {
  const { queryByRole, container } = render(
    <User user={MOCK_USER_DATA} setUser={() => null} />,
  )

  expect(queryByRole('img')).toBeInTheDocument()
  expect(container.firstElementChild).toMatchInlineSnapshot(`
    <div
      class="user"
    >
      <img
        alt="whatever"
        class="userImage"
        role="img"
        src="TEST"
      />
      <div>
        <div>
          TEST
        </div>
        <div>
          <button
            class="button"
          >
            log out
          </button>
        </div>
      </div>
    </div>
  `)
})

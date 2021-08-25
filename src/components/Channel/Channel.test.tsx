import React from 'react'
import Channel from './Channel'
import { render } from '@testing-library/react'
import { useDoc as mockUseDock } from '../../hooks/useDoc'

jest.mock('../../hooks/useDoc')

afterEach(() => {
  jest.clearAllMocks()
})

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('channel ui', () => {
  const TEST_USER_DATA = {
    displayName: 'Dmitriy K',
    photoURL: 'testPhoto',
    uid: 'testId',
  }
  const TEST_DOC_DATA = {
    id: 'testId',
    data: {
      topic: 'testTopic',
    },
  }
  const DEFAULT_VALUE = 'Loading awesome stuff...'

  it('should show default value if there is no data received from firebase', () => {
    ;(mockUseDock as jest.Mocked<any>).mockReturnValueOnce(null)

    const { getByDisplayValue } = render(<Channel path={'/path'} user={TEST_USER_DATA} />)
    expect(getByDisplayValue(DEFAULT_VALUE)).toBeInTheDocument()
    expect(mockUseDock).toHaveBeenCalledTimes(1)
  })

  it('should show a topic value if there is a data', () => {
    ;(mockUseDock as jest.Mocked<any>).mockReturnValueOnce(TEST_DOC_DATA)

    const { queryByDisplayValue } = render(
      <Channel path={'/path'} user={TEST_USER_DATA} />,
    )
    expect(queryByDisplayValue(DEFAULT_VALUE)).not.toBeInTheDocument()
    expect(queryByDisplayValue(TEST_DOC_DATA.data.topic)).toBeInTheDocument()
    expect(mockUseDock).toHaveBeenCalledTimes(1)
  })

  it('should show change topic from default to a received one', () => {
    ;(mockUseDock as jest.Mocked<any>).mockReturnValueOnce(null)

    const { queryByDisplayValue, rerender } = render(
      <Channel path={'/path'} user={TEST_USER_DATA} />,
    )

    expect(queryByDisplayValue(DEFAULT_VALUE)).toBeInTheDocument()
    expect(mockUseDock).toHaveBeenCalledTimes(1)
    ;(mockUseDock as jest.Mocked<any>).mockReturnValueOnce(TEST_DOC_DATA)

    rerender(<Channel path={'/path'} user={TEST_USER_DATA} />)

    expect(queryByDisplayValue(DEFAULT_VALUE)).not.toBeInTheDocument()
    expect(queryByDisplayValue(TEST_DOC_DATA.data.topic)).toBeInTheDocument()

    expect(mockUseDock).toHaveBeenCalledTimes(2)
  })
})

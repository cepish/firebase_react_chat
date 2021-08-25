export const MOCK_MESSAGES_TWO_USERS = [
  {
    createdAt: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    createdAtStr: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    text: 'Hello',
    user: {
      get: jest.fn(),
    },
    userId: 'testUserId1',
  },
  {
    createdAt: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    createdAtStr: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    text: 'world',
    user: {
      get: jest.fn(),
    },
    userId: 'testUserId2',
  },
]

export const MOCK_MESSAGES_ONE_USER = [
  {
    createdAt: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    createdAtStr: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    text: 'Hello',
    user: {
      get: jest.fn(),
    },
    userId: 'testUserId1',
  },
  {
    createdAt: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    createdAtStr: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    text: 'world',
    user: {
      get: jest.fn(),
    },
    userId: 'testUserId1',
  },
]

export const MOCK_MESSAGE = [
  {
    createdAt: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    createdAtStr: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    text: 'Hello',
    user: {
      get: jest.fn(),
    },
    userId: 'testUserId1',
  },
]

export const MOCK_MESSAGES_DIFFERENT_DATE = [
  {
    createdAt: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    createdAtStr: 'Sat Jun 05 2021 20:02:50 GMT+0300 (Москва, стандартное время)',
    text: 'Hello',
    user: {
      get: jest.fn(),
    },
    userId: 'testUserId1',
  },
  {
    createdAt: 'Tue Aug 10 2021 17:45:29 GMT+0300 (Москва, стандартное время)',
    createdAtStr: 'Tue Aug 10 2021 17:45:29 GMT+0300 (Москва, стандартное время)',
    text: 'World',
    user: {
      get: jest.fn(),
    },
    userId: 'testUserId1',
  },
]

export const MOCK_AUTHOR_EXISTS = {
  exists: true,
  data: jest.fn(() => ({
    displayName: 'DK',
    uid: 'DK_id',
    photoURL: 'photo',
  })),
}

export const MOCK_AUTHOR_NOT_EXISTS = {
  exists: false,
  data: jest.fn(),
}

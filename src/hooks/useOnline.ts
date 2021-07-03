import React from 'react'
import { db } from '../App'
import { IUser } from '../types/firebase'

export function useOnline(user: IUser | null, channelId: string): void {
  React.useEffect(() => {
    if (user && user.uid) {
      db.doc(`users/${user.uid}`).update({
        channels: {
          [channelId]: {
            isOnline: true,
          },
        },
      })
    }
  }, [user, channelId])
}

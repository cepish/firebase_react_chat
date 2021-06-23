//import React, { useState, useEffect} from 'react';
import { IUser } from '../types/firebase'
import { firebaseInstance } from '../App'
import { rtdb } from '../App'

/** detects if a user is online\offline
 * rtdb stands for real time db
 */

export function setUpPresence(user: IUser): void {
  /** database */
  const isOfflineForRTDB = {
    state: 'offline',
    lastChanged: firebaseInstance.database.ServerValue.TIMESTAMP,
  }
  const isOnlineForRTDB = {
    state: 'online',
    lastChanged: firebaseInstance.database.ServerValue.TIMESTAMP,
  }
  /** firestore */
  // const isOfflineForFirestore = {
  //     state: 'offline',
  //     lastChanged: firebaseInstance.firestore.FieldValue.serverTimestamp()
  // }
  // const isOnlineForFirestore = {
  //     state: 'offline',
  //     lastChanged: firebaseInstance.firestore.FieldValue.serverTimestamp()
  // }

  const rtdbRef = rtdb.ref(`/status/${user.uid}`)

  rtdb.ref('.info/connected').on('value', async snapshot => {
    if (!snapshot.val()) return

    await rtdbRef.onDisconnect().set(isOfflineForRTDB)
    rtdbRef.set(isOnlineForRTDB)
  })
}

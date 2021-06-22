import firebase from 'firebase/app'

export interface IMessageTimestamp {
    seconds: number,
    nanoseconds: number,
}

export interface IUser {
    displayName: string,
    uid: string,
    photoURL: string,
    channels?: IOnlineUser,
}

export interface IOnlineUser {
    [key: string]: {
        isOnline: boolean,
    }
}

export interface IDoc {
    id: string,
    data: firebase.firestore.DocumentData,
}

export interface IChannelMessage {
    createdAt: IMessageTimestamp,
    createdAtStr: string,
    text: string,
    user: firebase.firestore.DocumentData,
    userId: string,
}

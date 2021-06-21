import React, { useState, useEffect } from 'react';
import css from './MessageItem.module.scss';
import classNames from 'classnames';
import { IChannelMessage, IUser, IDoc } from '../../types/firebase';

interface IProp {
    message: IChannelMessage,
    showAvatar: boolean,
    showDay: boolean,
}

const MessageItem: React.FC<IProp> = props => {
    const { message, showAvatar, showDay } = props;
    const [author, setAuthor] = useState<IUser | null>(null)
    const [error, setError] = useState<boolean | null>(null)

    useEffect(() => {
        const request = message.user.get();

        return request.then((doc: IDoc['data']) => {
            if (doc.exists) {
                setAuthor(doc.data() as IUser)
            } 
            else {
                setError(true)
            }
        })
    }, [message])

    const getMessageTime = (date: string): string => new Date(date)
        .toTimeString()
        .split(' ')[0]
        .replace(/:\d\d$/, '');

    const getMessagesDate = (date: string): string => new Date(date)
        .toLocaleDateString('ua-UA', { 
            year: '2-digit', 
            month: 'short', 
            day: 'numeric'
        });

    const messageWithAvatar = author ? (
        <div className={classNames(css.message, css.withAvatar)}>
            <div className={css.avatar} style={
                {'backgroundImage': `url(${author.photoURL})`}
            } />
            <div className={css.author}>
                <div>
                    <span className={css.userName}>
                        {author.displayName}
                    </span>
                    <span className={css.timeStamp}>
                        {getMessageTime(message.createdAtStr)}
                    </span>
                </div>               
                <div>
                    {message.text}
                </div>
            </div>
        </div>
    ) : null;

    const messageWithNoAvatar = (
        <div className={classNames(css.message, css.noAvatar)}>
            <div>{message.text}</div>
        </div>
    );
    
    const errorMessage = (
        <div className={classNames(css.message, css.error)}>
            <div><i>Unable to fetch user data.</i></div>
        </div>
    );

    const dateItem = showDay ? (
        <div className={css.day}>
          <div className={css.dayLine}/>
          <div className={css.dayText}>
            {getMessagesDate(message.createdAtStr)}
          </div>
          <div className={css.dayLine} />
        </div>
    ) : null;

    if(error) {
        return <p>{errorMessage}</p>
    }

    const messageItem = showAvatar 
        ? messageWithAvatar
        : messageWithNoAvatar

    return (
        <React.Fragment>
            {dateItem}
            {messageItem}
        </React.Fragment>
    )
}

export default MessageItem;

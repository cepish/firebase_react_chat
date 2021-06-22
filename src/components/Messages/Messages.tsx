import React from 'react'
import css from './Messages.module.scss'
import { IChannelMessage } from '../../types/firebase'
import { useCollection } from '../../utils/hooks'
import { MessageItem, ScrollChat } from '../../components'

interface IProps {
  channelId: string,
}

type IMessageParam = IChannelMessage | null;

const NUMBER_OF_MINUTES = 10
const NUMBER_OF_MILLISECONDS = NUMBER_OF_MINUTES * 1000

const shouldShowAvatar = (prev: IMessageParam, current: IMessageParam): boolean => {
  /* eslint-disable */
  const idsAreTheSame = prev!.userId === current!.userId;

  const timePassed = 
    (current!.createdAt.seconds - prev!.createdAt.seconds) > NUMBER_OF_MILLISECONDS;
  /* eslint-enable */
  return  timePassed || !idsAreTheSame
}

const shouldShowDate = (prev: IMessageParam, current: IMessageParam): boolean => {
  /* eslint-disable */
  const prevDate = new Date(prev!.createdAtStr).getDate()
  const currentDate = new Date(current!.createdAtStr).getDate()
  /* eslint-enable */
  return prevDate !== currentDate
}

const Messages: React.FC<IProps> = props => {
  const { channelId } = props
  const collectionPath = `channels/${channelId}/messages`
  const orderBy = 'createdAt'
  const [messages] = useCollection<IChannelMessage>(collectionPath, orderBy)

  return (
    <ScrollChat className={css.container}>
      <div className={css.etx}>
        That&#39;s every message!
      </div>
      {messages.map((message: IChannelMessage, index: number, all: IChannelMessage[]) => {
        const previous = all[index - 1]
        const isFirstMessage = index === 0
        const messagesExist = previous && message

        const showDay = 
          isFirstMessage || 
          messagesExist && shouldShowDate(previous, message)

        const showAvatar = 
          isFirstMessage ||
          messagesExist && shouldShowAvatar(previous, message)

        return (
          <MessageItem 
            showAvatar={showAvatar}
            showDay={showDay}
            message={message} 
            key={index}
          />
        )
      })}
    </ScrollChat>       
  )
}

export default Messages

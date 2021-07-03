import React from 'react'
import { Members, Messages, SendMessageForm } from '../../components'
import css from './Channel.module.scss'
import config from '../../config'
import { IUser } from '../../types/firebase'
import { useDoc } from '../../hooks/useDoc'
import { useOnline } from '../../hooks/useOnline'

interface Props {
  user: IUser | null
  path: string
  channelId?: string // comes from path prop, so no need to pass it explicitly
}

const { defaultChannel } = config

const Channel: React.FC<Props> = props => {
  const { user, channelId = defaultChannel } = props
  const doc = useDoc(`channels/${channelId}`)
  const topic = doc && doc.data ? doc.data.topic : 'Loading awesome stuff...'

  useOnline(user, channelId)

  return (
    <div className={css.container}>
      <div className={css.mainChannel}>
        <div className={css.info}>
          <div className={css.topic}>
            Topic: <input onChange={() => null} className={css.field} value={topic} />
          </div>
          <div>#{channelId}</div>
        </div>
        <Messages channelId={channelId} />
        <SendMessageForm user={user} channelId={channelId} />
      </div>
      <Members channelId={channelId} />
    </div>
  )
}

export default Channel

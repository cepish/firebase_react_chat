import React, { useState } from 'react'
import css from './SendMessageForm.module.scss'
import { db } from '../../App'
import { IUser } from '../../types/firebase'

interface IProps {
  user: IUser | null
  channelId: string
}

interface IMessageForm extends HTMLFormControlsCollection {
  message: HTMLInputElement
}

const SendMessageForm: React.FC<IProps> = props => {
  const { user, channelId } = props
  const [messageError, setMessageError] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user) {
      setMessageError(`
        Message could not be sent.
        Expected user object to be instance of IUser, instead got ${user}
      `)
      return
    }

    const { currentTarget: target } = event
    const { message } = target.elements as typeof target.elements & IMessageForm
    const { value }: { value: string } = message || {}

    if (!value || !value.trim()) {
      setMessageError('Unable to send empty message')
      return
    }

    const date = new Date()

    db.collection(`channels/${channelId}/messages`).add({
      user: db.collection('users').doc(user.uid),
      userId: user.uid,
      text: value,
      createdAt: date,
      createdAtStr: date.toString(),
    })

    target.reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={css.inputBox}>
        <input
          id='message'
          name='message'
          onChange={() => null}
          onFocus={() => setMessageError(null)}
          className={css.field}
          placeholder='Message #general'
        />
        <button type='submit'>Send Message</button>
        <p className={css.messageError}>{messageError}</p>
      </div>
    </form>
  )
}

export default SendMessageForm

import React from 'react'
import css from './SendMessageForm.module.scss'
import { db } from '../../App'
import { IUser } from '../../types/firebase'

interface IProps {
    user: IUser | null,
    channelId: string,
}

interface IMessageForm extends HTMLFormControlsCollection {
    message: HTMLInputElement,
}

const SendMessageForm: React.FC<IProps> = props => {
    const { user, channelId } = props

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>)  => {
        event.preventDefault()

        if(!user) {
            throw new Error(`
                Message could not be sent.
                Expected user object to be instance of IUser,
                instead got ${user}
            `)
        }
        
        const { currentTarget: target } = event
        const elements = { ...target.elements } as IMessageForm
        const { value } : { value: string } = elements['message']
        const date = new Date()
        db
            .collection(`channels/${channelId}/messages`)
            .add({
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
                id="message"
                name="message"
                onChange={() => null} 
                className={css.field} 
                placeholder="Message #general" 
            />
          </div>
      </form>
    )
  }
  
  export default SendMessageForm
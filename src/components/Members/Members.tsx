import React from 'react';
import css from './Members.module.scss';
import classNames from 'classnames';
import { useCollection } from '../../utils/hooks';
import { IUser, IOnlineUser } from '../../types/firebase';
import { MobileContainerWrapper } from '../../components';
import MembersIcon from './MembersIcon';

interface IProps {
  channelId: string,
}

type IMemeber = IUser & { channels: IOnlineUser }

const Members: React.FC<IProps> = props=> {
  const { channelId } = props;
  const [members] = useCollection<IUser>('users');

  return (
    <MobileContainerWrapper 
      containerClassName={css.container}
      buttonClassName={css.toggleButton}
      icon={<MembersIcon />}
    >
      <div className={css.members}>
        {members.map((member: IUser) => {
          const isOnline =
            member.channels && 
            member.channels[channelId] && 
            member.channels[channelId].isOnline

          return (
            <div className={css.member} key={member.uid}>
              <div className={classNames({
                [css.memberStatus]: true, 
                [css.online]: isOnline,
                [css.offline]: !isOnline,
              })} />
                {member.displayName}
            </div>
          )
        })}
      </div>
    </MobileContainerWrapper>
  );
}

export default Members;

import React from 'react';
import css from './Nav.module.scss';
import classNames from 'classnames';
import { User, MobileContainerWrapper } from '../../components';
import { IDoc, IUser } from '../../types/firebase';
import { useCollection } from '../../utils/hooks';
import { Link } from '@reach/router';
import NavIcon from './NavIcon';

interface Props {
  user: IUser | null,
}

const signature = {'id': 'string', 'data': 'func'};

const Nav: React.FC<Props> = props => {
  const { user } = props;
  const [channels] = useCollection<IDoc>('channels', null, signature);
  const channelsMaybe = !!(channels && channels.length);
  
  return (
    <MobileContainerWrapper 
      containerClassName={css.nav}
      buttonClassName={css.toggleButton}
      icon={<NavIcon />}
    >
      <User user={user}/>
        {channelsMaybe && (
          <nav className={css.channel}>
            {channels!.map(channel =>
              <Link 
                key={channel.id}
                className={classNames({ 
                  [css.channel]: true, 
                  [css.active]: false
                })} 
                to={`/channel/${channel.id}`}>
                # {channel.id}
              </Link>
            )}
          </nav>
        )}
    </MobileContainerWrapper>
  );
}

export default Nav;

import React, { useState, useEffect, useRef } from 'react';
import css from './ScrollChat.module.scss';
import { IChannelMessage } from '../../types/firebase';

interface IProps {
    className: string,
}

const ScrollChat: React.FC<IProps> = props => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [shouldScroll, indicateScroll] = useState<boolean>(true);

    const { current } = ref || { current: null };

    useEffect(() => {
        if(shouldScroll && current) {
          const { children, scrollHeight, scrollTop, clientHeight } = current;
          const lastChild = children[children.length - 1];
  
          setTimeout(() => {
            lastChild.scrollIntoView({ behavior: 'smooth' });
          }, 250)
        }
    })

    const handleScroll = () => {
        if(current) {
            const { children, scrollHeight, scrollTop, clientHeight } = current;
            const atBottom = scrollHeight === clientHeight + scrollTop
            indicateScroll(atBottom)
        }
    }

    return (
        <div {...props} ref={ref} onScroll={handleScroll}/>
    )
}

export default ScrollChat;

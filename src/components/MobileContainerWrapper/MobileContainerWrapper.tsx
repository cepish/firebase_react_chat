import React, { useState } from 'react';
import css from './MobileContainerWrapper.module.scss';
import classNames from 'classnames';

interface IProps {
    containerClassName: string,
    buttonClassName: string,
    icon: JSX.Element,
}

const MobileContainerWrapper: React.FC<IProps> = (props: any) => {
    const { 
        children, 
        icon, 
        containerClassName, 
        buttonClassName 
    } = props;

    const [containerVisible, setContainerVisibility] = useState<boolean>(false);
  
  const containerClasses = classNames({
    [containerClassName]: true,
    [css.visible]: containerVisible,
  });

  return (
    <div className={containerClasses}>
        <button className={buttonClassName} onClick={() => setContainerVisibility(!containerVisible)}>
            {icon}
        </button>
        {children}
    </div>
  );
}

export default MobileContainerWrapper;

import React, { useEffect } from 'react';
import styles from './Avatar.module.scss';
import { getStringAbbreviation } from '../../Helpers';

function getAbbreviation(acronym?: string, name?: string): string {
  if (acronym) {
    return acronym;
  } else if (name) {
    return getStringAbbreviation(name);
  }

  return '';
}

export interface AvatarProps {
  acronym?: string;
  className?: string;
  url?: string | null;
  name?: string;
  size?: 'extraSmall' | 'small' | 'medium' | 'large';
}

export const Avatar = ({
  acronym,
  className = '',
  url,
  name,
  size = 'small'
}: AvatarProps): React.ReactElement<AvatarProps> => {
  const [isImageError, setIsImageError] = React.useState<boolean>(false);

  const onErrorImg = () => {
    setIsImageError(true);
  };

  const onLoadImg = () => {
    setIsImageError(false);
  };

  useEffect(() => {
    setIsImageError(false);
  }, [url]);

  return (
    <div
      className={`${styles.avatar}  ${className} ${
        (isImageError || !url) && !name && !acronym ? styles.empty : ''
      } ${styles[size]}`}
    >
      {!isImageError && url && (
        <img src={url} alt="Avatar" onError={onErrorImg} onLoad={onLoadImg} />
      )}
      {(isImageError || !url) && getAbbreviation(acronym, name)}
    </div>
  );
};

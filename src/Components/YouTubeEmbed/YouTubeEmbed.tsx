import React from 'react';
import styles from './YouTubeEmbed.module.scss';

export interface YouTubeEmbedProps {
  className?: string;
  title: string;
  src: string;
}

export const YouTubeEmbed = ({
  className = '',
  title,
  src
}: YouTubeEmbedProps): React.ReactElement<YouTubeEmbedProps> => {
  return (
    <div className={`${styles.youTubeEmbed} ${className}`}>
      <iframe
        src={`${src}?&modestbranding=1&rel=0`}
        frameBorder="0"
        allowFullScreen
        title={title}
      />
    </div>
  );
};

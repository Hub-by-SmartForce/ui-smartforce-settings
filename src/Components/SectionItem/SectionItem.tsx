import React, { Fragment } from 'react';
import styles from './SectionItem.module.scss';
import { SFIcon } from 'sfui';
import { ThemeTypeContext } from '../../Context';
import DMImageEmpty from '../../Images/DMImageEmpty';
import NMImageEmpty from '../../Images/NMImageEmpty';
import { InteractiveBox } from '../InteractiveBox/InteractiveBox';

export interface SectionItemProps {
  title: string;
  description: string;
  image?: string;
  onClick: () => void;
}

const SectionItem = ({
  title,
  description,
  image,
  onClick
}: SectionItemProps): React.ReactElement<SectionItemProps> => {
  const { themeType } = React.useContext(ThemeTypeContext);
  const hasImage: boolean = image !== undefined;

  return (
    <InteractiveBox
      className={`${styles.sectionItem} ${hasImage ? styles.withImage : ''}`}
      onClick={onClick}
    >
      {hasImage && (
        <div className={styles.image}>
          <Fragment>
            {image !== '' && <img role="presentation" alt="" src={image} />}
            {image === '' && (
              <img
                role="presentation"
                alt=""
                src={`data:image/svg+xml;utf8,${encodeURIComponent(
                  themeType === 'day' ? DMImageEmpty : NMImageEmpty
                )}`}
              />
            )}
          </Fragment>
        </div>
      )}

      <div className={styles.textContainer}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <SFIcon className={styles.icon} icon="Right-2" size="24px" />
    </InteractiveBox>
  );
};

export default SectionItem;

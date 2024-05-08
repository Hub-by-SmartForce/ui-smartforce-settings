import React from 'react';
import styles from './InnerViews.module.scss';
import { SectionItemValue } from '../../SFSettings';
import { InnerView } from './InnerView/InnerView';

export interface InnerViewsProps {
  views: SectionItemValue[];
  isBusinessCard: boolean;
}

const InnerViews = ({
  views,
  isBusinessCard
}: InnerViewsProps): React.ReactElement<InnerViewsProps> => {
  return (
    <div
      className={`${styles.innerViews} ${
        isBusinessCard ? styles.isBusinessCard : ''
      }`}
    >
      {views.map((view: SectionItemValue) => (
        <InnerView
          key={`view-${view.name}`}
          className={styles.innerView}
          view={view}
          hideHeader={isBusinessCard}
          isPhone={false}
        />
      ))}
    </div>
  );
};

export default InnerViews;

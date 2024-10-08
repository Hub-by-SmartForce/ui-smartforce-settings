import React, { useContext, useEffect, useRef } from 'react';
import styles from './BusinessCardPreview.module.scss';
import {
  PanelModal,
  PanelModalAnchor
} from '../../../Components/PanelModal/PanelModal';
import {
  BusinessCard,
  BusinessCardData,
  BusinessCardMediaType
} from 'business-card-component';
import { SFIconButton, SFScrollable } from 'sfui';
import { MediaContext, ThemeTypeContext } from '../../../Context';
import { TourContext, TourTooltip } from '../../../Modules/Tour';

export interface BusinessCardPreviewProps {
  data: BusinessCardData;
  isOpen: boolean;
  onBack: () => void;
  onClose: () => void;
}

export const BusinessCardPreview = ({
  data,
  isOpen,
  onBack,
  onClose
}: BusinessCardPreviewProps): React.ReactElement<BusinessCardPreviewProps> => {
  const { themeType } = React.useContext(ThemeTypeContext);
  const { isPhone } = React.useContext(MediaContext);
  const { onNext: onTourNext } = useContext(TourContext);

  const [mediaType, setMediaType] =
    React.useState<BusinessCardMediaType>('mobile');
  const [anchor, setAnchor] = React.useState<PanelModalAnchor>('right');

  const isMediaMobile: boolean = mediaType === 'mobile';

  const refIsPristine = useRef<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      refIsPristine.current = true;
    }
  }, [isOpen]);

  const onBackButton = () => {
    onTourNext({ tourId: 4, step: 3 });
    setMediaType('mobile');
    onBack();
  };

  const onMediaChange = (type: BusinessCardMediaType) => {
    if (mediaType !== type) {
      if (refIsPristine.current) {
        refIsPristine.current = false;
        onTourNext({ tourId: 4, step: 3 });
      }
      setMediaType(type);
    }
  };

  return (
    <PanelModal
      classes={{
        dialog: {
          root: styles.panelModal,
          paper: styles.dialogPaper,
          container: styles.dialogContainer
        },
        drawer: {
          paper: styles.panelModal
        }
      }}
      anchor={anchor}
      isOpen={isOpen}
      title="Preview Business Card"
      dialogCloseButton={{
        label: 'Close',
        sfColor: 'grey',
        onClick: onBackButton
      }}
      onBack={onBackButton}
      onClose={() => {
        setAnchor('bottom');
        onClose();
      }}
    >
      <div
        className={`${styles.businessCardPreview} ${
          isMediaMobile ? styles.isMediaMobile : ''
        }`}
      >
        <SFScrollable containerClassName={styles.container}>
          <BusinessCard
            className={styles.businessCard}
            data={data}
            themeType={themeType}
            mediaType={mediaType}
          />
        </SFScrollable>

        {!isPhone && (
          <div className={styles.toggleMedia}>
            <TourTooltip
              title="Responsive business card"
              description="You can choose between different devices to see how your business card looks on each one."
              step={3}
              lastStep={4}
              tourId={4}
              placement="right"
              topZIndex
            >
              <div className={styles.toggleMediaButtons}>
                <SFIconButton
                  className={`${styles.icon} ${
                    mediaType === 'mobile' ? styles.active : ''
                  }`}
                  aria-label="Change to mobile screen"
                  sfSize="medium"
                  sfIcon="Smartphone"
                  onClick={() => onMediaChange('mobile')}
                />
                <SFIconButton
                  className={`${styles.icon} ${
                    mediaType === 'desktop' ? styles.active : ''
                  }`}
                  aria-label="Change to desktop screen"
                  sfIcon="Computer"
                  sfSize="medium"
                  onClick={() => onMediaChange('desktop')}
                />
              </div>
            </TourTooltip>
          </div>
        )}
      </div>
    </PanelModal>
  );
};

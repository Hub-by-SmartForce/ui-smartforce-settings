import React, { useEffect, useState } from 'react';
import styles from './ToursCarrouselModal.module.scss';
import { SFDialog, SFDivider } from 'sfui';
import { NavIndicator } from './NavIndicator/NavIndicator';
import { ToursCarrouselModalFooter } from './ToursCarrouselModalFooter/ToursCarrouselModalFooter';
import { TourInfo } from './TourInfo/TourInfo';
import { Tour } from '../../models';
import { YouTubeEmbed } from '../../../../Components/YouTubeEmbed/YouTubeEmbed';

export interface ToursCarrouselModalProps {
  open: boolean;
  tours: Tour[];
  onClose: () => void;
  onStart: (tour: Tour) => void;
}

export const ToursCarrouselModal = (
  props: ToursCarrouselModalProps
): React.ReactElement<ToursCarrouselModalProps> => {
  const [selected, setSelected] = useState(0);
  const tourSelected = props.tours[selected];

  useEffect(() => {
    if (props.open) {
      setSelected(0);
    }
  }, [props.open]);

  const onBack = () => setSelected((s) => s - 1);
  const onNext = () => setSelected((s) => s + 1);

  return (
    <SFDialog
      open={!!tourSelected && props.open}
      PaperProps={{ className: styles.toursCarrouselModal }}
    >
      {!!tourSelected && (
        <>
          <div className={styles.media}>
            <YouTubeEmbed title={tourSelected.title} src={tourSelected.link} />
          </div>

          <SFDivider />
          <div className={styles.content}>
            <NavIndicator size={props.tours.length} selected={selected} />

            <TourInfo
              title={tourSelected.title}
              description={tourSelected.description}
              onStart={() => props.onStart(tourSelected)}
            />

            <ToursCarrouselModalFooter
              className={styles.footer}
              disabledBack={selected === 0}
              disabledNext={props.tours.length === 1}
              onSkip={props.onClose}
              onBack={onBack}
              onNext={selected < props.tours.length - 1 ? onNext : undefined}
              onDone={
                selected === props.tours.length - 1 ? props.onClose : undefined
              }
            />
          </div>
        </>
      )}
    </SFDialog>
  );
};

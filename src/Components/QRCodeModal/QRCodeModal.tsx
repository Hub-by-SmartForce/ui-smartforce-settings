import React, { useEffect, useRef, useState } from 'react';
import styles from './QRCodeModal.module.scss';
import { SFButton, SFDialog, SFTextField } from 'sfui';
import { ContactQRCode } from '../ContactQRCode/ContactQRCode';
import { QRSpinner } from './QRSpinner/QRSpinner';
import { User } from '../../Models';

export interface QRCodeModalProps {
  isOpen: boolean;
  title: string;
  subTitle?: string;
  baseUrl: string;
  user: Partial<User>;
  incidentNumber?: string;
  eventIdentifier?: string;
  onClose?: () => void;
}

export const QRCodeModal = ({
  isOpen,
  title,
  subTitle,
  baseUrl,
  user,
  incidentNumber,
  eventIdentifier,
  onClose
}: QRCodeModalProps): React.ReactElement<QRCodeModalProps> => {
  const [notes, setNotes] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const refTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (isOpen) {
      setNotes('');
    }
  }, [isOpen]);

  const onNotesChange = (value: string) => {
    setNotes(value);
    setIsEditing(true);

    if (refTimer.current) {
      clearTimeout(refTimer.current);
    }

    refTimer.current = setTimeout(() => {
      setIsEditing(false);
    }, 600);
  };

  return (
    <SFDialog
      PaperProps={{ style: { overflowY: 'unset' } }}
      open={isOpen}
      onClose={onClose}
    >
      <div className={styles.qrCodeModal}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subTitle}>{subTitle}</p>
        </div>

        <div className={styles.qrCodeForm}>
          <div className={styles.qrCode}>
            {isEditing && <QRSpinner />}

            {!isEditing && (
              <ContactQRCode
                className={styles.svgImage}
                baseUrl={baseUrl}
                user={user}
                incidentNumber={incidentNumber}
                eventIdentifier={eventIdentifier}
                notes={notes}
                size={272}
              />
            )}
          </div>

          <SFTextField
            label="Add notes"
            helperText="It must be up to 64 characters."
            value={notes}
            inputProps={{ maxLength: 64 }}
            onChange={(event) => onNotesChange(event.target.value)}
          />
        </div>

        <SFButton variant="contained" onClick={onClose} sfColor="grey">
          Close
        </SFButton>
      </div>
    </SFDialog>
  );
};

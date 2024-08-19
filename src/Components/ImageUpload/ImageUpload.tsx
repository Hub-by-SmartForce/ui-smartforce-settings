import React, { ChangeEvent, useContext } from 'react';
import { SFButton } from 'sfui';
import styles from './ImageUpload.module.scss';
import { ImageCropDialog } from './ImageCropDialog/ImageCropDialog';
import { MBtoBytes } from '../../Helpers';
import { ThemeTypeContext } from '../../Context';
import DMImageEmpty from '../../Images/DMImageEmpty';
import NMImageEmpty from '../../Images/NMImageEmpty';

const isValidExtension = (extension: string): boolean => {
  const validExtensions = ['jpg', 'jpeg', 'png'];
  return validExtensions.indexOf(extension.toLowerCase()) !== -1;
};

export interface ImageUploadProps {
  label: string;
  value: string | Blob | null | undefined;
  onClick?: () => void;
  onChange: (value: Blob) => void;
}

export const ImageUpload = ({
  label,
  value,
  onClick,
  onChange
}: ImageUploadProps): React.ReactElement<ImageUploadProps> => {
  const { themeType } = useContext(ThemeTypeContext);
  //Used to re render file input and reset it's value, because it's not controllable
  const [fileInputKey, setFileInputKey] = React.useState<number>(Date.now());
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [imgSrc, setImgSrc] = React.useState<string>();
  const [isError, setIsError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const refInput = React.useRef<HTMLInputElement | null>(null);

  const onClickUpload = () => {
    onClick && onClick();
    refInput.current?.click();
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const extension = file.name.substring(
        file.name.lastIndexOf('.') + 1,
        file.name.length
      );

      if (file.size > MBtoBytes(2)) {
        setErrorMessage('Please upload a picture smaller than 2 MB.');
        setIsError(true);
      } else if (!isValidExtension(extension)) {
        setErrorMessage('We only support PNG or JPG pictures.');
        setIsError(true);
      } else {
        setIsError(false);
        setImgSrc(URL.createObjectURL(file));
        setIsDialogOpen(true);
        setFileInputKey(Date.now());
      }
    }
  };

  const onChoose = (blob: Blob) => {
    setIsDialogOpen(false);
    onChange(blob);
  };

  return (
    <div className={styles.imageUpload}>
      {imgSrc && (
        <ImageCropDialog
          isOpen={isDialogOpen}
          imageSrc={imgSrc}
          onClose={() => setIsDialogOpen(false)}
          onChoose={onChoose}
        />
      )}

      <input
        key={fileInputKey}
        ref={refInput}
        style={{ display: 'none' }}
        type="file"
        accept="image/jpeg, image/png, image/x-png"
        onChange={onFileChange}
      />

      <div className={styles.imageField}>
        {value && typeof value === 'string' && <img alt="" src={value} />}

        {value && typeof value !== 'string' && (
          <img alt="" src={window.URL.createObjectURL(value)} />
        )}

        {!value && (
          <img
            alt=""
            className={styles.emptyBadge}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              themeType === 'day' ? DMImageEmpty : NMImageEmpty
            )}`}
          />
        )}

        <SFButton
          size="small"
          sfColor="blue"
          variant="text"
          onClick={onClickUpload}
          fullWidth={false}
        >
          {label}
        </SFButton>
      </div>

      {isError && <label className={styles.error}>{errorMessage}</label>}
    </div>
  );
};

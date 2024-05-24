import React from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import {
  SFButton,
  SFCommonWhite,
  SFDialog,
  SFIconButton,
  SFScrollable
} from 'sfui';
import styles from './ImageCropDialog.module.scss';
import { MediaContext } from '../../../Context';

const initCrop: Crop = {
  aspect: 1 / 1
} as Crop;

export interface ImageCropDialogProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onChoose: (blob: Blob) => void;
}

export const ImageCropDialog = ({
  isOpen,
  imageSrc,
  onClose,
  onChoose
}: ImageCropDialogProps): React.ReactElement<ImageCropDialogProps> => {
  const { isPhone } = React.useContext(MediaContext);
  const [crop, setCrop] = React.useState(initCrop);

  const refCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const refImg = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (refCanvas.current && refImg.current) {
      const image = refImg.current;
      const canvas = refCanvas.current;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      canvas.width = 256;
      canvas.height = 256;

      ctx.imageSmoothingQuality = 'high';

      ctx.fillStyle = SFCommonWhite;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
    }
  }, [crop]);

  const onImageLoaded = (image: HTMLImageElement) => {
    refImg.current = image;
    const min: number = Math.min(image.width, image.height);
    let x: number = 0;
    let y: number = 0;

    if (image.width > image.height) {
      x = image.width / 2 - image.height / 2;
    } else {
      y = image.height / 2 - image.width / 2;
    }

    setCrop({
      aspect: 1 / 1,
      width: min,
      height: min,
      x: x,
      y: y
    } as Crop);

    return false;
  };

  const onClickChoose = async () => {
    if (refCanvas.current) {
      refCanvas.current.toBlob(
        (blob) => {
          onChoose(blob as Blob);
        },
        'image/jpeg',
        1
      );
    }
  };

  return (
    <SFDialog
      className={styles.dialog}
      PaperProps={{ className: styles.uploadImgDialog }}
      fullScreen={isPhone}
      open={isOpen}
    >
      <header>
        <h4>Move and Scale</h4>
        <SFIconButton sfIcon="Close" sfSize="medium" onClick={onClose} />
      </header>

      <div className={styles.dialogContent}>
        <SFScrollable className={styles.scrollable}>
          <ReactCrop
            className={styles.reactCrop}
            src={imageSrc}
            crop={crop}
            circularCrop
            keepSelection
            minWidth={50}
            minHeight={50}
            onImageLoaded={onImageLoaded}
            onChange={(newCrop: Crop) => setCrop(newCrop)}
          />
        </SFScrollable>
      </div>

      {/* Hidden canvas to export crop image */}
      <canvas ref={refCanvas} />

      <footer>
        {!isPhone && (
          <SFButton
            size="large"
            sfColor="grey"
            variant="text"
            onClick={onClose}
          >
            Discard
          </SFButton>
        )}
        <SFButton
          size="large"
          fullWidth={isPhone}
          onClick={onClickChoose}
          color="primary"
        >
          Choose
        </SFButton>
      </footer>
    </SFDialog>
  );
};

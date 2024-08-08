import React from 'react';
import styles from './ColorPicker.module.scss';
import { SFText } from 'sfui';
import { InteractiveBox } from '../../../../Components';

const colorPalette: string[] = [
  '#0D69F2',
  '#3DC4F5',
  '#40BF62',
  '#F5D93D',
  '#F59C3D',
  '#EB4747',
  '#F075DB',
  '#B447EB'
];

export interface ColorPickerProps {
  selected?: string;
  onClick: (color: string) => void;
  title: string;
}

export const ColorPicker = ({
  selected,
  onClick,
  title
}: ColorPickerProps): React.ReactElement<ColorPickerProps> => {
  const [colorSelected, setColorSelected] = React.useState<string>(
    selected ?? ''
  );

  const onColorClick = (color: string) => {
    setColorSelected(color);
    onClick(color);
  };

  return (
    <div className={styles.colorPicker}>
      <SFText type="component-1-medium">{title}</SFText>
      <div className={styles.colorList}>
        {colorPalette.map((color: string) => (
          <div
            key={`picker-${color}`}
            className={`${styles.container} ${
              color === colorSelected ? styles.selected : ''
            }`}
          >
            <InteractiveBox
              className={styles.color}
              style={{ backgroundColor: color }}
              onClick={() => onColorClick(color)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { Fragment } from 'react';
import { AppsPopover } from './AppsPopover/AppsPopover';

export const SFTopBarApps = (): React.ReactElement<{}> => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  // const onClick: MouseEventHandler<HTMLButtonElement> = (event): void => {
  //   setAnchorEl(event.currentTarget);
  // };

  const onClose = (): void => setAnchorEl(null);

  return (
    <Fragment>
      <AppsPopover anchorEl={anchorEl} onClose={onClose} />

      {/* <SFIconButton
        aria-label='Open apps menu'
        sfIcon="Bento"
        iconSize={20}
        buttonSize={34}
        onClick={onClick}
      /> */}
    </Fragment>
  );
};

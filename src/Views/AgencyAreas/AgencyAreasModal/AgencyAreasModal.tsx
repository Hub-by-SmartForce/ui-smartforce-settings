import React, { useCallback, useContext, useRef } from 'react';
import styles from './AgencyAreasModal.module.scss';
import {
  PanelModal,
  PanelModalAnchor
} from '../../../Components/PanelModal/PanelModal';
import {
  AgencyAreasForm,
  AgencyAreasFormErrors
} from './AgencyAreasForm/AgencyAreasForm';
import { Area, AreaFormValue } from '../../../Models';
import { saveArea, updateArea } from '../../../Services';
import { isEqualObject } from '../../../Helpers';
import { HttpStatusCode, SFButton } from 'sfui';
import {
  ERROR_AREA_ACRONYM_ALREADY_EXISTS,
  ERROR_AREA_NAME_ALREADY_EXISTS
} from '../../../Constants';
import { AreaPolygonEdit } from './AreaPolygonEdit/AreaPolygonEdit';
import { SettingsError } from '../../../Models/Error';
import { ApiContext } from '../../../Context';
import { TourContext, TourTooltip } from '../../../Modules/Tour';

export interface AgencyAreasModalProps {
  isOpen: boolean;
  onBack: () => void;
  onFinish: () => void;
  onClose: () => void;
  onError: (e: SettingsError) => void;
  area?: Area;
}

const defaultFormValue: AreaFormValue = {
  name: '',
  acronym: ''
};

const defaultFormErrors: AgencyAreasFormErrors = {
  name: false,
  acronym: false
};

function isSameArea(value: Partial<Area>, area: Partial<Area>): boolean {
  return isEqualObject<Partial<Area>>(value, area);
}

function hasError(errors: AgencyAreasFormErrors): boolean {
  return errors.name || errors.acronym;
}

function areRequiredFields(area: Partial<Area>, isNew: boolean): boolean {
  return Boolean(
    area.name?.length !== 0 &&
      area.acronym?.length !== 0 &&
      (!isNew || (area.paths && area.paths.length > 0))
  );
}

function isSaveDisabled(
  value: AreaFormValue,
  errors: AgencyAreasFormErrors,
  polygonPaths?: google.maps.LatLngLiteral[],
  area?: Area
): boolean {
  const areaValue: Partial<Area> = {
    ...value,
    paths: polygonPaths
  };

  return (
    !areRequiredFields(areaValue, !area) ||
    hasError(errors) ||
    Boolean(area && isSameArea(areaValue, area))
  );
}

export const AgencyAreasModal = ({
  area,
  isOpen,
  onBack,
  onFinish,
  onClose,
  onError
}: AgencyAreasModalProps): React.ReactElement<AgencyAreasModalProps> => {
  const apiBaseUrl = React.useContext(ApiContext).settings;
  const { onNext: onTourNext, onClose: onTourClose } = useContext(TourContext);
  const [formValue, setFormValue] =
    React.useState<AreaFormValue>(defaultFormValue);
  const [formErrors, setFormErrors] =
    React.useState<AgencyAreasFormErrors>(defaultFormErrors);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [polygonPaths, setPolygonPaths] =
    React.useState<google.maps.LatLngLiteral[]>();
  const [anchor, setAnchor] = React.useState<PanelModalAnchor>('right');

  const refIsFormPristine = useRef<boolean>(true);
  const refIsPolygonPristine = useRef<boolean>(true);

  const onCreateArea = async () => {
    setIsSaving(true);

    try {
      await saveArea(apiBaseUrl, {
        ...formValue,
        paths: polygonPaths
      });

      onFinish();
      setIsSaving(false);
      onBack();
    } catch (e: any) {
      setIsSaving(false);

      if (e.code === HttpStatusCode.BAD_REQUEST) {
        const newErrors: AgencyAreasFormErrors = {
          name: e.detail.includes(ERROR_AREA_NAME_ALREADY_EXISTS),
          acronym: e.detail.includes(ERROR_AREA_ACRONYM_ALREADY_EXISTS)
        };

        setFormErrors(newErrors);
      } else {
        console.error('AgencyAreasModal::CreateArea', e);
        onError(e);
      }
    }
  };

  const onEditArea = async () => {
    setIsSaving(true);

    try {
      await updateArea(apiBaseUrl, (area as Area).id, {
        ...formValue,
        paths: polygonPaths
      });
      onFinish();
      setIsSaving(false);
      onBack();
    } catch (e: any) {
      setIsSaving(false);

      if (e.code === HttpStatusCode.BAD_REQUEST) {
        const newErrors: AgencyAreasFormErrors = {
          name: e.detail.includes(ERROR_AREA_NAME_ALREADY_EXISTS),
          acronym: e.detail.includes(ERROR_AREA_ACRONYM_ALREADY_EXISTS)
        };

        setFormErrors(newErrors);
      } else {
        console.error('AgencyAreasModal::CreateArea', e);
        onError(e);
      }
    }
  };

  const onAgencyAreasFormChange = (value: AreaFormValue) => {
    let newErrors: AgencyAreasFormErrors = formErrors;
    if (formValue.name !== value.name) {
      newErrors = { ...newErrors, name: false };
    }

    if (formValue.acronym !== value.acronym) {
      newErrors = { ...newErrors, acronym: false };
    }

    if (
      refIsFormPristine.current &&
      formValue.name.length > 0 &&
      formValue.acronym.length > 0
    ) {
      refIsFormPristine.current = false;
      onTourNext({ tourId: 5, step: 2 });
    }

    setFormErrors(newErrors);
    setFormValue(value);
  };

  React.useEffect(() => {
    if (isOpen) {
      refIsFormPristine.current = true;
      refIsPolygonPristine.current = true;

      setFormErrors(defaultFormErrors);
      if (!area) {
        setFormValue(defaultFormValue);
        setPolygonPaths(undefined);
      } else {
        setFormValue(area);
        setPolygonPaths(area.paths);
      }
    }
  }, [area, isOpen]);

  // Use callback to prevent re-rendering of AreaPolygonEdit component
  const onPolygonChange = useCallback((paths: google.maps.LatLngLiteral[]) => {
    if (refIsPolygonPristine.current) {
      refIsPolygonPristine.current = false;
      onTourNext({ tourId: 5, step: 3 });
    }
    setPolygonPaths(paths);
  }, []);

  const onDiscard = () => {
    onBack();
    onTourClose([
      { tourId: 5, step: 2 },
      { tourId: 5, step: 3 },
      { tourId: 5, step: 4 },
      { tourId: 5, step: 5 }
    ]);
  };

  return (
    <PanelModal
      anchor={anchor}
      classes={{
        dialog: {
          root: styles.agencyAreasModal,
          paper: styles.dialogPaper,
          container: styles.dialogContainer
        },
        drawer: {
          paper: styles.agencyAreasModal,
          content: styles.drawerContent
        }
      }}
      title={`${area ? 'Edit' : 'Create'} Area`}
      isOpen={isOpen}
      onBack={onBack}
      onClose={() => {
        setAnchor('bottom');
        onClose();
      }}
    >
      <div className={styles.areaForm}>
        <AgencyAreasForm
          errors={formErrors}
          onChange={onAgencyAreasFormChange}
          value={formValue}
        />

        <TourTooltip
          title="Draw the area"
          description="Just drag and drop the nodes (circles) on the figure line. If you need to add more nodes to draw the area, drag and drop the transparent nodes."
          step={3}
          lastStep={5}
          tourId={5}
          topZIndex
          placement="top"
        >
          <AreaPolygonEdit area={area} onChange={onPolygonChange} />
        </TourTooltip>

        <div className={styles.actions}>
          <SFButton
            variant="text"
            sfColor="grey"
            size="large"
            disabled={isSaving}
            onClick={onDiscard}
          >
            Discard
          </SFButton>

          <TourTooltip
            title="Create the area"
            description='By clicking the "Create Area" button, you will create the area in your agency. You can delete the area at any time.'
            step={5}
            lastStep={5}
            tourId={5}
            width="fit"
            placement="top-end"
            topZIndex
          >
            <SFButton
              isLoading={isSaving}
              disabled={isSaveDisabled(
                formValue,
                formErrors,
                polygonPaths,
                area
              )}
              onClick={area ? onEditArea : onCreateArea}
              size="large"
            >
              {area ? 'Save Changes' : 'Create Area'}
            </SFButton>
          </TourTooltip>
        </div>
      </div>
    </PanelModal>
  );
};

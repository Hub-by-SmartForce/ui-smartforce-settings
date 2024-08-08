import React, { useContext } from 'react';
import { SFButton, SFSearch, SFSpinner } from 'sfui';
import styles from './AgencyAreas.module.scss';
import { SettingsContentRender } from '../SettingsContentRender';
import { AgencyAreasModal } from './AgencyAreasModal/AgencyAreasModal';
import { AgencyAreasList } from './AgencyAreasList/AgencyAreasList';
import { AgencyAreasDeleteDialog } from './AgencyAreasDeleteDialog/AgencyAreasDeleteDialog';
import { ViewAreaModal } from './ViewAreaModal/ViewAreaModal';
import { Divider } from '../../Components/Divider/Divider';
import { Area } from '../../Models';
import { AreasContext } from '../../Context';
import { getAreas } from '../../Services';
import { SettingsError } from '../../Models/Error';
import { ApiContext } from '../../Context';
import { TourContext, TourTooltip, useCloseTour } from '../../Modules/Tour';

export interface AgencyAreasProps {
  onClose: () => void;
  onError: (e: SettingsError) => void;
}

export const AgencyAreas = ({
  onClose,
  onError
}: AgencyAreasProps): React.ReactElement<AgencyAreasProps> => {
  const apiBaseUrl = React.useContext(ApiContext).settings;
  const { areas, setAreas } = React.useContext(AreasContext);
  const { onNext: onTourNext, onClose: onTourClose } = useContext(TourContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [isAreaModalOpen, setIsAreaModalOpen] = React.useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    React.useState<boolean>(false);
  const [isViewAreaModalOpen, setIsViewAreaModalOpen] =
    React.useState<boolean>(false);
  const [modalValue, setModalValue] = React.useState<Area>();

  useCloseTour([5]);

  const onModalOpen = () => {
    setIsAreaModalOpen(true);
    setModalValue(undefined);
  };

  const onModalClose = () => {
    setIsAreaModalOpen(false);
  };

  const onSearchArea = (input: string) => {
    setSearchValue(input);
  };

  const onDeleteModalOpen = (deleteArea: Area) => {
    onTourClose([5]);
    setIsDeleteModalOpen(true);
    setModalValue(deleteArea);
  };

  const onDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const onEditAreaModal = (editArea: Area) => {
    onTourClose([5]);
    setModalValue(editArea);
    setIsAreaModalOpen(true);
  };

  const onAreaDelete = (area: Area) => {
    setIsDeleteModalOpen(false);
    const newAreas = areas.filter((a: Area) => a.id !== area.id);
    setAreas(newAreas);
  };

  const onViewArea = (area: Area) => {
    onTourClose([5]);
    setModalValue(area);
    setIsViewAreaModalOpen(true);
  };

  const onFinish = async () => {
    setIsLoading(true);
    try {
      const areas: Area[] = await getAreas(apiBaseUrl);
      setAreas(areas);
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.error('Settings::AgencyAreas::GetArea', e);
      onError(e);
    }
  };

  const onClickCreate = () => {
    onTourNext({ tourId: 5, step: 1 });
    onModalOpen();
  };

  return (
    <div>
      <AgencyAreasModal
        area={modalValue}
        isOpen={isAreaModalOpen}
        onFinish={onFinish}
        onBack={onModalClose}
        onClose={() => {
          onClose();
          onModalClose();
        }}
        onError={onError}
      />
      <AgencyAreasDeleteDialog
        isOpen={isDeleteModalOpen}
        value={modalValue}
        onClose={onDeleteModalClose}
        onDelete={onAreaDelete}
        onError={onError}
      />

      <ViewAreaModal
        isOpen={isViewAreaModalOpen}
        area={modalValue}
        onBack={() => setIsViewAreaModalOpen(false)}
        onClose={() => {
          onClose();
          setIsViewAreaModalOpen(false);
        }}
      />

      <SettingsContentRender
        renderContent={() => (
          <div className={styles.agencyAreas}>
            <TourTooltip
              title="Create your area here"
              description="You can create as many areas as your agency needs. Just click the “Create Area” button and follow the steps."
              step={1}
              lastStep={5}
              tourId={5}
              preventOverflow
            >
              <SFButton
                className={styles.createArea}
                fullWidth
                variant="outlined"
                onClick={onClickCreate}
              >
                Create Area
              </SFButton>
            </TourTooltip>

            <div className={styles.areasList}>
              {areas.length > 0 && (
                <div className={styles.search}>
                  <SFSearch
                    label="Search area"
                    value={searchValue}
                    onChange={onSearchArea}
                  />
                </div>
              )}
              <Divider size={2} />
              {isLoading && (
                <div className={styles.container}>
                  <SFSpinner aria-label="Loading" />
                </div>
              )}
              {!isLoading && (
                <AgencyAreasList
                  areas={areas}
                  onClick={onViewArea}
                  onDelete={onDeleteModalOpen}
                  onEdit={onEditAreaModal}
                  searchValue={searchValue}
                />
              )}
            </div>
          </div>
        )}
      ></SettingsContentRender>
    </div>
  );
};

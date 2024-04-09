import React from 'react';
import styles from './AgencyAreasList.module.scss';
import { TransitionGroup } from 'react-transition-group';
import { Area } from '../../../Models';
import { AgencyAreasListItem } from './AgencyAreasListItem/AgencyAreasListItem';
import { SFButton, SFCollapse, SFDivider } from 'sfui';
import { AgencyAreasNoResult } from './AgencyAreasNoResults/AgencyAreasNoResults';
import { AgencyAreasNoAreasCreated } from './AgencyNoAreasCreated/AgencyNoAreasCreated';

export interface AgencyAreasListProps {
  areas: Area[];
  searchValue: string;
  onClick: (area: Area) => void;
  onDelete: (area: Area) => void;
  onEdit: (area: Area) => void;
}

const AREAS_LIMIT: number = 10;

const getFilteredAreas = (areas: Area[], searchValue: string): Area[] => {
  let visibleAreas: Area[] = areas;

  if (searchValue.length > 2) {
    visibleAreas = visibleAreas.filter((value: Area) =>
      value.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  return visibleAreas;
};

export const AgencyAreasList = ({
  areas,
  searchValue,
  onClick,
  onDelete,
  onEdit
}: AgencyAreasListProps): React.ReactElement<AgencyAreasListProps> => {
  const [limit, setLimit] = React.useState<number>(AREAS_LIMIT);

  const filteredAreas: Area[] = getFilteredAreas(areas, searchValue);
  const visibleAreas: Area[] = filteredAreas.slice(0, limit);

  const showSeeMore: boolean = filteredAreas.length > limit;
  const showSeeLess: boolean =
    limit > visibleAreas.length && limit > AREAS_LIMIT;

  const refSearchValueLength = React.useRef<number>(searchValue.length);

  React.useEffect(() => {
    if (searchValue.length > 2 || refSearchValueLength.current > 2) {
      setLimit(AREAS_LIMIT);
    }

    refSearchValueLength.current = searchValue.length;
  }, [searchValue]);

  return (
    <div className={styles.agencyAreasList}>
      {areas.length === 0 && <AgencyAreasNoAreasCreated />}
      {visibleAreas.length === 0 && areas.length !== 0 && (
        <AgencyAreasNoResult searchValue={searchValue} />
      )}

      {visibleAreas.length > 0 && (
        <TransitionGroup>
          {visibleAreas.map((area: Area, index: number) => (
            <SFCollapse key={area.id} timeout={480}>
              <AgencyAreasListItem
                area={area}
                onClick={() => onClick(area)}
                onEdit={() => onEdit(area)}
                onDelete={() => onDelete(area)}
              />
              {index < visibleAreas.length - 1 && <SFDivider />}
            </SFCollapse>
          ))}
        </TransitionGroup>
      )}

      <div className={styles.footerButtons}>
        {showSeeMore && (
          <SFButton
            fullWidth
            variant="text"
            sfColor="grey"
            onClick={() => setLimit(limit + AREAS_LIMIT)}
          >
            See More
          </SFButton>
        )}
        {showSeeLess && (
          <SFButton
            fullWidth
            variant="text"
            sfColor="grey"
            onClick={() => setLimit(AREAS_LIMIT)}
          >
            See Less
          </SFButton>
        )}
      </div>
    </div>
  );
};

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import styles from './AreaPolygonEdit.module.scss';
import { GoogleMap, Polygon } from '../../../../Components/GoogleMap';
import {
  CustomerContext,
  AreasContext,
  StatesListConfigContext,
  ThemeTypeContext
} from '../../../../Context';
import { Area, Customer } from '../../../../Models';
import { SFIcon, SFTooltip } from 'sfui';
import {
  getActivePolygonStyles,
  getBoundsFromCoords,
  getPolygonDefaultPaths,
  getPolygonStyles,
  isEqualObject
} from '../../../../Helpers';

export interface AreaPolygonEditProps {
  area?: Area;
  onChange: (value: google.maps.LatLngLiteral[]) => void;
}

export const AreaPolygonEdit = ({
  area,
  onChange
}: AreaPolygonEditProps): React.ReactElement<AreaPolygonEditProps> => {
  const customer = useContext(CustomerContext).customer as Customer;
  const statesList = useContext(StatesListConfigContext).statesList;
  const areas = useContext(AreasContext).areas;
  const { themeType } = useContext(ThemeTypeContext);

  const [defaultPaths, setDefaultPaths] = useState<google.maps.LatLngLiteral[]>(
    []
  );

  useEffect(() => {
    if (area && area.paths.length > 0) {
      setDefaultPaths([...area.paths]);
    } else {
      setDefaultPaths(getPolygonDefaultPaths(customer, statesList));
    }
  }, [area, customer, statesList]);

  const onUndo = () => {
    if (area && area.paths.length > 0) {
      setDefaultPaths([...area.paths]);
      onChange(area.paths);
    } else {
      setDefaultPaths(getPolygonDefaultPaths(customer, statesList));
      onChange([]);
    }
  };

  // Use callback to prevent re-rendering of Polygon component
  const onPolygonChange = useCallback(
    (value: google.maps.LatLngLiteral[]) => {
      if (isEqualObject(value, defaultPaths)) {
        if (area && area.paths.length > 0) {
          onChange(area.paths);
        } else {
          onChange([]);
        }
      } else {
        onChange(value);
      }
    },
    [area, defaultPaths, onChange]
  );

  const bounds = useMemo(
    () => getBoundsFromCoords(defaultPaths),
    [defaultPaths]
  );

  return (
    <div className={styles.areaPolygonEdit}>
      <SFTooltip
        title="Restore area"
        // set z-index greater than dialog z-index
        PopperProps={{ style: { zIndex: 1301 } }}
      >
        <div className={styles.undoButton} onClick={onUndo}>
          <SFIcon icon="Reload" size={30} />
        </div>
      </SFTooltip>

      <GoogleMap bounds={bounds}>
        <Polygon
          initialPaths={defaultPaths}
          editable
          draggable
          zIndex={1}
          {...getActivePolygonStyles(themeType)}
          onChange={onPolygonChange}
        />

        {areas
          .filter((a: Area) => a.id !== area?.id && a.paths.length > 0)
          .map((a: Area) => (
            <Polygon
              key={a.id}
              initialPaths={a.paths as google.maps.LatLngLiteral[]}
              {...getPolygonStyles()}
            />
          ))}
      </GoogleMap>
    </div>
  );
};

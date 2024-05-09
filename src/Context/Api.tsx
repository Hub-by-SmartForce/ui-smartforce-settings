import { createContext } from 'react';
import { ApplicationProduct } from '../Models';

export interface ApiContextProps {
  settings: string;
  shifts: string;
  product: ApplicationProduct;
}

export const ApiContext = createContext<ApiContextProps>({
  settings: '',
  shifts: '',
  product: 'cc'
});

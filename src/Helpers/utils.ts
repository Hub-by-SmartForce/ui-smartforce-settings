import debounce from 'lodash.debounce';

export function isEqualObject<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const isFieldEmpty = (value: any): boolean => {
  if (value === null || value === undefined) {
    return true;
  } else if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  } else {
    return false;
  }
};

export const MBtoBytes = (ammount: number) => {
  return ammount * 1048576;
};

export function dispatchCustomEvent<T>(name: string, data?: T): void {
  document.dispatchEvent(new CustomEvent(name, { detail: { ...data } }));
}

export function getCustomEventData<T>(e: Event): T {
  return (e as CustomEvent).detail as T;
}

export function removeRepetead<T>(list: T[]): T[] {
  return list.filter((e: T, index: number) => {
    return list.indexOf(e) === index;
  });
}

// Needed to resolve lodash issue with async
// https://github.com/lodash/lodash/issues/4815
export function asyncDebounce<F extends (...args: any[]) => Promise<any>>(
  func: F,
  wait?: number,
  options?: any
) {
  // @ts-ignore
  const debounced = debounce(
    (resolve, reject, args: Parameters<F>) => {
      func(...args)
        .then(resolve)
        .catch(reject);
    },
    wait,
    options
  );
  return (...args: Parameters<F>): ReturnType<F> =>
    new Promise((resolve, reject) => {
      debounced(resolve, reject, args);
    }) as ReturnType<F>;
}

export function replaceElementAt<T>(list: T[], elem: T, index: number): T[] {
  return [...list.slice(0, index), elem, ...list.slice(index + 1)];
}

export function onKeyUp(e: React.KeyboardEvent, cb?: Function) {
  if (e.key === 'Enter' && cb) {
    cb();
  }
}

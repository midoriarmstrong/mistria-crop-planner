import { useContext, type Context } from 'react';
import { useLocalStorage } from 'react-use';
import type { HookContextValue } from '../types/HookContextValue';
import type { LocalStorageKey } from '../constants/enums/LocalStorageKeys';

/**
 * Uses a local storage hook with a default value.
 * @param key The local storage key to get.
 * @param defaultValue The default value if it does not exist.
 * @returns The value and setter.
 */
export const useLocalStorageWithDefault = <TValue>(
  key: LocalStorageKey,
  defaultValue: TValue,
) => {
  const [value = defaultValue, setValue] = useLocalStorage<TValue>(
    key,
    defaultValue,
  );
  return [value, setValue] as [
    TValue,
    React.Dispatch<React.SetStateAction<TValue>>,
  ];
};

/**
 * Gets a context value and setter from a hook,
 * validating that they're both defined and setting a default if not.
 * This should never throw except in the case of a coding error.
 * @param context The context to safely use.
 * @returns The non-nullable value and setter.
 */
export const useContextWithDefault = <TValue>(
  context: Context<HookContextValue<TValue> | undefined>,
  defaultValue: TValue,
) => {
  const [value, setValue] = useContext(context) ?? [];
  if (!setValue) {
    throw new Error(
      'Context setter not set - has it been correctly configured in a parent component?',
    );
  }

  if (!value) {
    setValue(defaultValue);
    return [defaultValue, setValue] as [typeof defaultValue, typeof setValue];
  }

  return [value, setValue] as [typeof value, typeof setValue];
};

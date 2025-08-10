export type HookContextValue<TValue> = [
  TValue,
  React.Dispatch<React.SetStateAction<TValue>>,
];

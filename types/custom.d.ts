type IToArrayValue<T> = {
  [K in keyof T]: Array<T[K]>;
};

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

declare type Nullable<T> = T | null
declare type Ref<T> = T | null

// declare type PropType<T> = PropConstructor<T> | PropConstructor<T>[]

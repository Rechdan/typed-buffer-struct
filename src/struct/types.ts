// STRUCT BASE

export type Numbers = "sbyte" | "byte" | "short" | "ushort" | "int" | "uint";
export type BigNumbers = "long" | "ulong";

export type Builder = (object: {}, buffer: Buffer) => void;
export type ArrBuilder<T> = (object: T[], buffer: Buffer) => T[];

// HELPERS

export type ReadNumberBuffer = (buffer: Buffer, offset: number, type: Numbers) => number;
export type WriteNumberBuffer = (buffer: Buffer, offset: number, type: Numbers, value: number) => void;
export type ReadBigNumberBuffer = (buffer: Buffer, offset: number, type: BigNumbers) => bigint;
export type WriteBigNumberBuffer = (buffer: Buffer, offset: number, type: BigNumbers, value: bigint) => void;
export type ReadStringBuffer = (buffer: Buffer, offset: number, length: number) => string;
export type WriteStringBuffer = (buffer: Buffer, offset: number, length: number, value: string) => void;

// STRUCT RELATED

export type StructNumber = <T, N extends string>(builder: Builder[], size: number, name: N, type: Numbers) => CreateStructResultOf<T, number, N>;
export type StructBigNumber = <T, N extends string>(builder: Builder[], size: number, name: N, type: BigNumbers) => CreateStructResultOf<T, bigint, N>;
export type StructString = <T, N extends string>(builder: Builder[], size: number, name: N, length: number) => CreateStructResultOf<T, string, N>;
export type StructStruct = <T, T2, N extends string>(
  builder: Builder[],
  size: number,
  name: N,
  struct: BuildStructResult<T2>
) => CreateStructResultOf<T, T2, N>;

// ARRAY RELATED

export type ArrayBuilderResponse<T> = { size: number; builder: ArrBuilder<T> };

export type ArrayBuilder<T> = (build: BuildArrayResponse) => ArrayBuilderResponse<T>;

export type BuildArrayResponseNumberResult = ArrayBuilderResponse<number[]>;
export type BuildArrayResponseNumberFunction = (length: number, type: Numbers) => BuildArrayResponseNumberResult;

export type BuildArrayResponseBigNumberResult = ArrayBuilderResponse<bigint[]>;
export type BuildArrayResponseBigNumberFunction = (length: number, type: BigNumbers) => BuildArrayResponseBigNumberResult;

export type BuildArrayResponse = {
  // numbers
  sbyte: () => BuildArrayResponseNumberResult;
  byte: () => BuildArrayResponseNumberResult;
  short: () => BuildArrayResponseNumberResult;
  ushort: () => BuildArrayResponseNumberResult;
  int: () => BuildArrayResponseNumberResult;
  uint: () => BuildArrayResponseNumberResult;
  // big number
  long: () => BuildArrayResponseBigNumberResult;
  ulong: () => BuildArrayResponseBigNumberResult;
  // extra
  array: <T>(arrLength: number, build: ArrayBuilder<T>) => ArrayBuilderResponse<T[]>;
  string: (stringLength: number) => ArrayBuilderResponse<string[]>;
  struct: <T>(struct: BuildStructResult<T>) => ArrayBuilderResponse<T[]>;
};

export type BuildArray = (length: number) => BuildArrayResponse;

export type StructArray = <T, T2, N extends string>(
  builder: Builder[],
  size: number,
  name: N,
  arrLength: number,
  build: ArrayBuilder<T2>
) => CreateStructResultOf<T, T2, N>;

// STRUCT

export type BuildStructResult<T, T2 = T & { readonly buffer: Buffer }> = ((buffer?: Buffer) => { [K in keyof T2]: T2[K] }) & {
  readonly size: number;
  readonly checkSize: (buffer: Buffer) => boolean;
};

export type CreateStructResultOf<T, T2, N extends string> = CreateStructResult<T & { [K in N]: T2 }>;

export type CreateStructResult<T> = {
  // numbers
  sbyte: <N extends string>(name: N) => CreateStructResultOf<T, number, N>;
  byte: <N extends string>(name: N) => CreateStructResultOf<T, number, N>;
  short: <N extends string>(name: N) => CreateStructResultOf<T, number, N>;
  ushort: <N extends string>(name: N) => CreateStructResultOf<T, number, N>;
  int: <N extends string>(name: N) => CreateStructResultOf<T, number, N>;
  uint: <N extends string>(name: N) => CreateStructResultOf<T, number, N>;
  // big number
  long: <N extends string>(name: N) => CreateStructResultOf<T, bigint, N>;
  ulong: <N extends string>(name: N) => CreateStructResultOf<T, bigint, N>;
  // extras
  string: <N extends string>(name: N, length: number) => CreateStructResultOf<T, string, N>;
  struct: <T2, N extends string>(name: N, struct: BuildStructResult<T2>) => CreateStructResultOf<T, T2, N>;
  array: <T2, N extends string>(name: N, arrLength: number, build: ArrayBuilder<T2[]>) => CreateStructResultOf<T, T2[], N>;
  offset: (length: number) => CreateStructResult<T>;
  // build
  build: () => BuildStructResult<{ [K in keyof T]: T[K] }>;
};

export type CreateStruct<T> = (builder?: Builder[], size?: number) => CreateStructResult<T>;

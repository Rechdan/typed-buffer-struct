import {
  BuildArray,
  BuildArrayResponseBigNumberFunction,
  BuildArrayResponseNumberFunction,
  CreateStruct,
  StructArray,
  StructBigNumber,
  StructNumber,
  StructString,
  StructStruct,
} from "_/struct/types";

import { bigNumbersSize, numbersSize } from "_/struct/base";

import { readBigNumberBuffer, readNumberBuffer, readStringBuffer, writeBigNumberBuffer, writeNumberBuffer, writeStringBuffer } from "_/struct/helpers";

// STRUCT RELATED

const structNumber: StructNumber = (builder, size, name, type) => {
  builder.push((obj, buffer) => {
    Object.defineProperty(obj, name, {
      get: () => readNumberBuffer(buffer, size, type),
      set: (value: number) => writeNumberBuffer(buffer, size, type, value),
      enumerable: true,
    });
  });
  return createStruct(builder, size + numbersSize[type]) as never;
};

const structBigNumber: StructBigNumber = (builder, size, name, type) => {
  builder.push((obj, buffer) => {
    Object.defineProperty(obj, name, {
      get: () => readBigNumberBuffer(buffer, size, type),
      set: (value: bigint) => writeBigNumberBuffer(buffer, size, type, value),
      enumerable: true,
    });
  });
  return createStruct(builder, size + bigNumbersSize[type]) as never;
};

const structString: StructString = (builder, size, name, strLength) => {
  builder.push((obj, buffer) => {
    Object.defineProperty(obj, name, {
      get: () => readStringBuffer(buffer, size, strLength),
      set: (value: string) => writeStringBuffer(buffer, size, strLength, value),
      enumerable: true,
    });
  });
  return createStruct(builder, size + strLength) as never;
};

const structStruct: StructStruct = (builder, size, name, struct) => {
  builder.push((obj, buffer) => {
    const structObj = struct(buffer.subarray(size, size + struct.size));
    delete (structObj as { buffer: unknown }).buffer;
    Object.defineProperty(obj, name, {
      get: () => structObj,
      enumerable: true,
    });
  });
  return createStruct(builder, size + struct.size) as never;
};

// ARRAY RELATED

const arrayNumberFunction: BuildArrayResponseNumberFunction = (arrLength, type) => {
  const numberSize = numbersSize[type];
  return {
    size: numberSize * arrLength,
    builder: (arr, buffer) => {
      for (let i = 0; i < arrLength; i++) {
        Object.defineProperty(arr, i, {
          get: () => readNumberBuffer(buffer, numberSize * i, type),
          set: (value: number) => writeNumberBuffer(buffer, numberSize * i, type, value),
          enumerable: true,
        });
      }
      return arr;
    },
  };
};

const arrayBigNumberFunction: BuildArrayResponseBigNumberFunction = (arrLength, type) => {
  const numberSize = bigNumbersSize[type];
  return {
    size: numberSize * arrLength,
    builder: (arr, buffer) => {
      for (let i = 0; i < arrLength; i++) {
        Object.defineProperty(arr, i, {
          get: () => readBigNumberBuffer(buffer, numberSize * i, type),
          set: (value: bigint) => writeBigNumberBuffer(buffer, numberSize * i, type, value),
          enumerable: true,
        });
      }
      return arr;
    },
  };
};

const buildArray: BuildArray = (arrLength) => ({
  // arrays
  array: (arrLength2, build) => {
    const { size: buildSize, builder: buildBuilder } = build(buildArray(arrLength2));
    return {
      size: buildSize * arrLength,
      builder: (arr, buffer) => {
        for (let i = 0; i < arrLength; i++) {
          const arr2 = buildBuilder([], buffer.subarray(buildSize * i, buildSize * (i + 1)));
          Object.defineProperty(arr, i, {
            get: () => arr2,
            enumerable: true,
          });
        }
        return arr;
      },
    };
  },
  // numbers
  sbyte: () => arrayNumberFunction(arrLength, "sbyte"),
  byte: () => arrayNumberFunction(arrLength, "byte"),
  short: () => arrayNumberFunction(arrLength, "short"),
  ushort: () => arrayNumberFunction(arrLength, "ushort"),
  int: () => arrayNumberFunction(arrLength, "int"),
  uint: () => arrayNumberFunction(arrLength, "uint"),
  // big numbers
  long: () => arrayBigNumberFunction(arrLength, "long"),
  ulong: () => arrayBigNumberFunction(arrLength, "ulong"),
  // extras
  string: (stringLength) => ({
    size: arrLength * stringLength,
    builder: (arr, buffer) => {
      for (let i = 0; i < arrLength; i++) {
        Object.defineProperty(arr, i, {
          get: () => readStringBuffer(buffer, stringLength * i, stringLength),
          set: (value: string) => writeStringBuffer(buffer, stringLength * i, stringLength, value),
          enumerable: true,
        });
      }
      return arr;
    },
  }),
  struct: (struct) => ({
    size: arrLength * struct.size,
    builder: (arr, buffer) => {
      for (let i = 0; i < arrLength; i++) {
        const structObj = struct(buffer.subarray(i * struct.size, (i + 1) * struct.size));
        delete (structObj as { buffer: unknown }).buffer;
        Object.defineProperty(arr, i, {
          get: () => structObj,
          enumerable: true,
        });
      }
      return arr;
    },
  }),
});

const structArray: StructArray = (builder, size, name, arrLength, build) => {
  const { size: buildSize, builder: buildBuilder } = build(buildArray(arrLength));
  builder.push((obj, buffer) => {
    const arr = buildBuilder([], buffer.subarray(size, buildSize + size));
    Object.defineProperty(obj, name, {
      get: () => arr,
      enumerable: true,
    });
  });
  return createStruct(builder, size + buildSize) as never;
};

// STRUCT

const createStruct: CreateStruct<{}> = (builder = [], size = 0) => ({
  // numbers
  sbyte: (name) => structNumber(builder, size, name, "sbyte"),
  byte: (name) => structNumber(builder, size, name, "byte"),
  short: (name) => structNumber(builder, size, name, "short"),
  ushort: (name) => structNumber(builder, size, name, "ushort"),
  int: (name) => structNumber(builder, size, name, "int"),
  uint: (name) => structNumber(builder, size, name, "uint"),
  // big numbers
  long: (name) => structBigNumber(builder, size, name, "long"),
  ulong: (name) => structBigNumber(builder, size, name, "ulong"),
  // extras
  string: (name, length) => structString(builder, size, name, length),
  struct: (name, struct) => structStruct(builder, size, name, struct),
  array: (name, arrLength, build) => structArray(builder, size, name, arrLength, build),
  offset: (length) => createStruct(builder, size + length),
  // build
  build: () => {
    const newObj = (buffer = Buffer.alloc(size)) => {
      const obj = {};
      builder.forEach((build) => build(obj, buffer));
      return Object.assign(obj, {
        get buffer() {
          return buffer;
        },
      });
    };
    return Object.assign(newObj, { size, checkSize: (buffer: Buffer) => buffer.byteLength === size });
  },
});

const newStruct = () => createStruct();

export default newStruct;

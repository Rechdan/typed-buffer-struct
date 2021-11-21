import { ReadBigNumberBuffer, ReadNumberBuffer, ReadStringBuffer, WriteBigNumberBuffer, WriteNumberBuffer, WriteStringBuffer } from "_/struct/types";

export const readNumberBuffer: ReadNumberBuffer = (buffer, offset, type) => {
  switch (type) {
    case "sbyte":
      return buffer.readInt8(offset);
    case "byte":
      return buffer.readUInt8(offset);
    case "short":
      return buffer.readInt16LE(offset);
    case "ushort":
      return buffer.readUInt16LE(offset);
    case "int":
      return buffer.readInt32LE(offset);
    case "uint":
      return buffer.readUInt32LE(offset);
  }
};

export const writeNumberBuffer: WriteNumberBuffer = (buffer, offset, type, value) => {
  switch (type) {
    case "sbyte":
      buffer.writeInt8(value, offset);
      break;
    case "byte":
      buffer.writeUInt8(value, offset);
      break;
    case "short":
      buffer.writeInt16LE(value, offset);
      break;
    case "ushort":
      buffer.writeUInt16LE(value, offset);
      break;
    case "int":
      buffer.writeInt32LE(value, offset);
      break;
    case "uint":
      buffer.writeUInt32LE(value, offset);
      break;
  }
};

export const readBigNumberBuffer: ReadBigNumberBuffer = (buffer, offset, type) => {
  switch (type) {
    case "long":
      return buffer.readBigInt64LE(offset);
    case "ulong":
      return buffer.readBigUInt64LE(offset);
  }
};

export const writeBigNumberBuffer: WriteBigNumberBuffer = (buffer, offset, type, value) => {
  switch (type) {
    case "long":
      buffer.writeBigInt64LE(value, offset);
      break;
    case "ulong":
      buffer.writeBigUInt64LE(value, offset);
      break;
  }
};

export const readStringBuffer: ReadStringBuffer = (buffer, offset, length) => {
  return buffer.toString("latin1", offset, offset + length).replaceAll("\0", "");
};

export const writeStringBuffer: WriteStringBuffer = (buffer, offset, length, value) => {
  buffer.fill(0, offset, offset + length, "latin1").write(value, offset, offset + length, "latin1");
};

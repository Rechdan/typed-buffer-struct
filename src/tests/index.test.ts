import newStruct from "_/struct";

const basicStruct = newStruct()
  /* 0 to 15  = 16  */ .string("name", 16)
  /* 16       = 1   */ .sbyte("sbyte")
  /* 17       = 1   */ .byte("byte")
  /* 18 to 19 = 2   */ .short("short")
  /* 20 to 21 = 2   */ .ushort("ushort")
  /* 22 to 25 = 4   */ .int("int")
  /* 26 to 29 = 4   */ .uint("uint")
  /* 30 to 37 = 8   */ .long("long")
  /* 38 to 45 = 8   */ .ulong("ulong")
  .build();

describe("basic struct", () => {
  test("buffer size", () => {
    const structToTest = basicStruct();
    expect(basicStruct.size).toBe(46);
    expect(structToTest.buffer.byteLength).toBe(46);
  });

  test("is buffer empty", () => {
    const structToTest = basicStruct();
    expect(structToTest.buffer.every((v) => v === 0)).toBe(true);
  });

  test("buffer updated after name set", () => {
    const structToTest = basicStruct();
    structToTest.name = "ABCDEF";
    expect(structToTest.buffer[0]).toBe(0x41);
    expect(structToTest.buffer[1]).toBe(0x42);
    expect(structToTest.buffer[2]).toBe(0x43);
    expect(structToTest.buffer[3]).toBe(0x44);
    expect(structToTest.buffer[4]).toBe(0x45);
    expect(structToTest.buffer[5]).toBe(0x46);
    expect(structToTest.sbyte).toBe(0);
    expect(structToTest.byte).toBe(0);
    expect(structToTest.short).toBe(0);
    expect(structToTest.ushort).toBe(0);
    expect(structToTest.int).toBe(0);
    expect(structToTest.uint).toBe(0);
    expect(structToTest.long).toBe(0n);
    expect(structToTest.ulong).toBe(0n);
  });

  test("buffer updated after values set", () => {
    const structToTest = basicStruct();
    structToTest.sbyte = 1;
    structToTest.byte = 2;
    structToTest.short = 3;
    structToTest.ushort = 4;
    structToTest.int = 5;
    structToTest.uint = 6;
    structToTest.long = 7n;
    structToTest.ulong = 8n;
    expect(structToTest.sbyte).toBe(1);
    expect(structToTest.byte).toBe(2);
    expect(structToTest.short).toBe(3);
    expect(structToTest.ushort).toBe(4);
    expect(structToTest.int).toBe(5);
    expect(structToTest.uint).toBe(6);
    expect(structToTest.long).toBe(7n);
    expect(structToTest.ulong).toBe(8n);
    expect(structToTest.buffer.readInt8(16)).toBe(1);
    expect(structToTest.buffer.readUInt8(17)).toBe(2);
    expect(structToTest.buffer.readInt16LE(18)).toBe(3);
    expect(structToTest.buffer.readUInt16LE(20)).toBe(4);
    expect(structToTest.buffer.readInt32LE(22)).toBe(5);
    expect(structToTest.buffer.readUInt32LE(26)).toBe(6);
    expect(structToTest.buffer.readBigInt64LE(30)).toBe(7n);
    expect(structToTest.buffer.readBigUInt64LE(38)).toBe(8n);
  });
});

const structWithArray = newStruct()
  /* 0 to 7   = 8   */ .array("arr", 4, (b) => b.ushort())
  .build();

describe("struct with array", () => {
  test("buffer size", () => {
    const structToTest = structWithArray();
    expect(structWithArray.size).toBe(8);
    expect(structToTest.buffer.byteLength).toBe(8);
  });

  test("is buffer empty", () => {
    const structToTest = structWithArray();
    expect(structToTest.buffer.every((v) => v === 0)).toBe(true);
  });

  test("check array length", () => {
    const structToTest = structWithArray();
    expect(structToTest.arr.length).toBe(4);
  });

  test("check array values set", () => {
    const structToTest = structWithArray();
    structToTest.arr[0] = 1;
    structToTest.arr[1] = 2;
    structToTest.arr[2] = 3;
    structToTest.arr[3] = 4;
    expect(structToTest.arr[0]).toBe(1);
    expect(structToTest.arr[1]).toBe(2);
    expect(structToTest.arr[2]).toBe(3);
    expect(structToTest.arr[3]).toBe(4);
    expect(structToTest.buffer.readUInt16LE(0)).toBe(1);
    expect(structToTest.buffer.readUInt16LE(2)).toBe(2);
    expect(structToTest.buffer.readUInt16LE(4)).toBe(3);
    expect(structToTest.buffer.readUInt16LE(6)).toBe(4);
  });
});

const structWith2DArray = newStruct()
  /* 0 to 159 = 160 */ .array("arr", 4, (b) => b.array(10, (b) => b.uint()))
  .build();

describe("struct with 2D array", () => {
  test("buffer size", () => {
    const structToTest = structWith2DArray();
    expect(structWith2DArray.size).toBe(160);
    expect(structToTest.buffer.byteLength).toBe(160);
  });

  test("is buffer empty", () => {
    const structToTest = structWith2DArray();
    expect(structToTest.buffer.every((v) => v === 0)).toBe(true);
  });

  test("check array length", () => {
    const structToTest = structWith2DArray();
    expect(structToTest.arr.length).toBe(4);
    for (const subArr of structToTest.arr) {
      expect(subArr.length).toBe(10);
    }
  });
});

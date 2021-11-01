import { BigNumbers, Numbers } from "_/struct/types";

export const numbersSize: Record<Numbers, number> = { sbyte: 1, byte: 1, short: 2, ushort: 2, int: 4, uint: 4 };
export const bigNumbersSize: Record<BigNumbers, number> = { long: 8, ulong: 8 };

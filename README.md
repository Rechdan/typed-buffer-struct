# typed-buffer-struct

This is a package which helps the user to create a Struct with automatic Buffer creation.

## How to use

```ts
// import it first
import newStruct from "typed-buffer-struct";

// then, create typed structs with it!
const sStats = newStruct()
  /* 0 to  3 */ .uint("level")
  /* 4 to  7 */ .uint("attack")
  /* 8 to 11 */ .uint("defense")
  .build(); // total of 12 bytes

const sCharacter = newStruct()
  /*  0 to 11 */ .string("name", 12)
  /* 12 to 23 */ .struct("stats", sStats)
  .build(); // total of 24 bytes

const sAccount = newStruct()
  /* 0 to 95 */ .array("characters", 4, (b) => b.struct(sCharacter))
  .build(); // total of 96 bytes

// now, lets create a new account
const account = sAccount();

// lets add a name to the second and third array indexes
account.characters[1].name = "Amazing!";
account.characters[2].name = "Testing";

// and finally, lets get the Buffer
console.log("Account buffer:", account.buffer);

/*
OUTPUT:
0: 000000000000000000000000000000000000000000000000
1: 416d617a696e672100000000000000000000000000000000
2: 54657374696e670000000000000000000000000000000000
3: 000000000000000000000000000000000000000000000000
(here I divided the output in 4 sections, just to show the 4 characters in the account)
*/
```

# Ogre

An experimental Framework for handling the sharing of state in Typescript
Applications.

[Named after Ogres, because Ogres are like onions, they have layers.](https://www.youtube.com/watch?v=-FtCTW2rVFM)

## Example

In order to use this module, create (and export) an ogre in a file

```ts
// ogre.ts
import { makeOgre } from "https://deno.land/x/ogre/mod.ts";

export default makeOgre({ name: "Fred" });
```

then within your module code, import this ogre and add layers, as seen in
[layer1.ts](./example/layer1.ts) and [layer2.ts](./example/layer2.ts).

Finally, within your main program file, import the layers you want, and call the
start function on the ogre.

```ts
import Fred from "./ogre.ts";

await import("./layer2.ts");
await import("./layer1.ts");

await Fred.start();

console.log("Started!");
```

A full example can be found in [The Example Folder](./example/)

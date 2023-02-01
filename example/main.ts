import Fred from "./ogre.ts";

await import("./layer2.ts");
await import("./layer1.ts");

await Fred.start();

console.log("Started!");

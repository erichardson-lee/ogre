import Fred from "./ogre.ts";

export default Fred.addLayer({
  id: "layer1",
  init: () => {
    console.log("layer1 init");

    return { foo: "bar" };
  },
});

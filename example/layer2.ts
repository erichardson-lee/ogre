import Fred from "./ogre.ts";
import Layer1 from "./layer1.ts";

export default Fred.addLayer(
  {
    id: "layer2",
    init: (data) => {
      console.log("layer2 init", data.layer1?.foo);

      return 21;
    },
    dependsOn: [Layer1],
  },
);

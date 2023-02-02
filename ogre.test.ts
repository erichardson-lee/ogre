import { makeOgre } from "./ogre.ts";
import {} from "https://deno.land/std@0.173.0/testing/asserts.ts";

Deno.test("Out of order layer dependencies should throw", async () => {
  const shrek = makeOgre({ name: "Shrek", hideShrek: true });

  const _b = shrek.addLayer({
    id: "b",
    init: (deps) => {
      deps.a?.bar;
    },
    //@ts-ignore force b to depend on a, but a is not yet added, so this should error
    dependsOn: [{ id: "a" }],
  });

  const _a = shrek.addLayer(
    { id: "a", init: () => ({ foo: "test", bar: "baz" }), dependsOn: [] },
  );

  await shrek.start();
});

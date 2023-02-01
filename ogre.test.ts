import { makeOgre } from "./ogre.ts";
import { assertRejects } from "https://deno.land/std@0.173.0/testing/asserts.ts";

Deno.test("Out of order layer dependencies should throw", () => {
  const shrek = makeOgre({ name: "Shrek" });

  const _b = shrek.addLayer({
    id: "b",
    init: (deps) => {
      deps.a?.bar;
    },
    //@ts-expect-error force b to depend on a, but a is not yet added, so this should error
    dependsOn: [{ id: "a" }],
  });

  const _a = shrek.addLayer(
    { id: "a", init: () => ({ foo: "test", bar: "baz" }), dependsOn: [] },
  );

  assertRejects(() => shrek.start());
});

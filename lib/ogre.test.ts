import { makeOgre } from "./ogre.ts";
import { assertRejects } from "https://deno.land/std@0.173.0/testing/asserts.ts";

Deno.test("Adding layers out of dependency order should not throw", async () => {
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

Deno.test("Looped layer dependencies should throw", () => {
  const shrek = makeOgre({ name: "Shrek", hideShrek: true });

  const _a = shrek.addLayer({
    id: "a",
    init: () => void 0,
    //@ts-ignore force a to depend on b
    dependsOn: [{ id: "b" }],
  });

  const _b = shrek.addLayer({
    id: "b",
    init: () => void 0,
    //@ts-ignore force b to depend on a
    dependsOn: [{ id: "a" }],
  });

  assertRejects(() => shrek.start());
});

Deno.test("Non Existant layer dependencies should throw", () => {
  const shrek = makeOgre({ name: "Shrek", hideShrek: true });

  const _a = shrek.addLayer({
    id: "a",
    init: () => void 0,
    //@ts-ignore force a to depend on b
    dependsOn: [{ id: "b" }],
  });

  assertRejects(() => shrek.start());
});

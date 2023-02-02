import { sort } from "./sort.ts";
import { assertEquals } from "https://deno.land/std@0.173.0/testing/asserts.ts";

Deno.test("Sorts dependencies", () => {
  const data = new Map<string, { id: string; dependencies: string[] }>();

  const a = { id: "a", dependencies: [] };
  const b = { id: "b", dependencies: ["a", "d"] };
  const c = { id: "c", dependencies: ["b"] };
  const d = { id: "d", dependencies: ["a"] };

  data.set("b", b);
  data.set("a", a);
  data.set("c", c);
  data.set("d", d);

  const sorted = sort(data);

  assertEquals(sorted, [a, d, b, c]);
});

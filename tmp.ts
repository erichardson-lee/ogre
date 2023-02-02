let a = new Set();
a.add("a");
a.add("b");
a.add("c");

for (const value of a.values()) {
  a.delete("b");
}

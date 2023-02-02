import { getLogger, Logger } from "https://deno.land/std@0.175.0/log/mod.ts";
import { sort } from "./sort.ts";

type MakeOgreCfg = {
  name: string;
  hideShrek?: boolean;
  logger?: Logger;
};

// deno-lint-ignore no-explicit-any
type AnyLayer = Layer<any, string, any>;

type DependencyData<Deps extends AnyLayer> = {
  [layer in Deps as layer["id"]]-?: layer["data"];
};

type Layer<Data, ID extends string, Dependencies extends AnyLayer[]> = {
  id: ID;
  dependencies: Dependencies[number]["id"][];
  init(deps: DependencyData<Dependencies[number]>): Data | Promise<Data>;
  data?: Data;
};

export function makeOgre(
  { name, hideShrek = false, logger = getLogger() }: MakeOgreCfg,
) {
  if (!hideShrek) {
    logger.info(
      [
        "                                        ",
        "  ⢀⡴⠑⡄       ⣀⣀⣤⣤⣤⣀⡀                  ",
        "  ⠸⡇ ⠿⡀   ⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀              ",
        "      ⠑⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆             ",
        "      ⢀⡀⠁  ⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆            ",
        "     ⢀⡾⣁⣀ ⠴⠂⠙⣗⡀ ⢻⣿⣿⠭⢤⣴⣦⣤⣹   ⢀⢴⣶⣆    ",
        "    ⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⠸⣼⡿   ",
        "   ⢀⡞⠁⠙⠻⠿⠟⠉ ⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉         ",
        "   ⣾⣷⣶⠇  ⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇          ",
        "   ⠉⠈⠉  ⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇          ",
        "         ⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇           ",
        "          ⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿            ",
        "        ⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇            ",
        "        ⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃             ",
        "         ⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁              ",
        "           ⠉⠛⠻⠿⠿⠿⠿⠛⠉                  ",
        "                                        ",
      ].join("\n"),
    );
  }
  logger.info("Creating new Ogre named " + name + "...");

  const layers = new Map<string, AnyLayer & { initalized?: true }>();

  let started = false;

  return {
    addLayer<Data, Deps extends AnyLayer[], ID extends string>(
      l: Pick<Layer<Data, ID, Deps>, "id" | "init"> & { dependsOn?: Deps },
    ): Layer<Data, ID, Deps> {
      const layer: Layer<Data, ID, Deps> = {
        ...l,
        dependencies: l.dependsOn?.map((d) => d.id) ?? [],
        data: undefined,
      };

      if (layers.has(l.id)) {
        throw new Error("Layer with id " + l.id + " already exists");
      }

      layers.set(l.id, layer);
      return layer;
    },
    async start(): Promise<void> {
      if (started) {
        throw new Error("Ogre " + name + "already started, cannot start twice");
      }
      started = true;

      logger.info("Starting Ogre " + name + "...");

      const sortedLayers = sort(layers);

      for (const layer of sortedLayers) {
        logger.debug(
          `Starting layer ${layer.id} [${layer.dependencies.join(",")}]`,
        );

        const deps = Object.fromEntries(layer.dependencies.map((id) => {
          const dep = layers.get(id);
          if (!dep) {
            throw new Error(
              `Layer ${layer.id} depends on ${id} but it does not exist`,
            );
          }
          if (!dep.initalized) {
            throw new Error(
              `Layer ${layer.id} depends on ${id} but it has not been initialized`,
            );
          }
          return [id, dep.data] as [id: string, data: unknown];
        }));

        layer.data = await layer.init(deps);
        layer.initalized = true;
      }
    },
  };
}

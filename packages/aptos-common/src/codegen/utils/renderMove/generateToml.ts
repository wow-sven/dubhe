import { ObeliskConfig } from "../../types";
import { formatAndWriteMove } from "../formatAndWrite";

export function generateToml(config: ObeliskConfig, srcPrefix: string) {
  let code = `[package]
name = "${config.name}"
version = "1.0.0"
authors = []

[addresses]
${config.name} = "_"

[dev-addresses]

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"

[dev-dependencies]
`;
  formatAndWriteMove(
    code,
    `${srcPrefix}/contracts/${config.name}/Move.toml`,
    "formatAndWriteMove"
  );
}

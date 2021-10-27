import { MigrationBuilder } from "node-pg-migrate";
import { configure } from "./migration-builder-utils";
import { auditableColumns } from "./auditable-columns";

const tableName = "";

const up = (pgm: MigrationBuilder) => {
    const config = configure({ pgm, tableName });
};

const down = (pgm: MigrationBuilder) => {};

export { up, down };

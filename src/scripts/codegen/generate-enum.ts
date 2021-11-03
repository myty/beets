import _ from "lodash";
import { Project, PropertySignature } from "ts-morph";
import { log } from "./log";
import { getTableName } from "./utils";
import upath from "upath";
import { Paths } from "./constants/paths";
import { Enums } from "./constants/enums";

const generateEnum = (project: Project, properties: PropertySignature[]) => {
    const name = Enums.Tables.name;
    const file = project.createSourceFile(Enums.Tables.filePath, undefined, {
        overwrite: true,
    });

    file.addEnum({
        name,
        members: properties.map((property) => ({
            name: getTableName(property),
            value: property.getName(),
        })),
    });

    file.addExportDeclaration({ namedExports: [name] });

    log.info(`Writing enum '${name}' to ${file.getBaseName()}...`);
};

export { generateEnum };

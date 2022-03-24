import path from 'path';
import fs from 'fs';
import openApiTS, { SchemaObject } from 'openapi-typescript';
import info from '../docs/config/basicInfo';
import servers from '../docs/config/servers';
import components from '../docs/config/components';
import tags from '../docs/config/tags';
import security from '../docs/config/security';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import parserTypescript from 'prettier/parser-typescript.js';
import prettier from 'prettier';
import Logger from '../log/logger';

const docs: Omit<OpenAPIV3.Document, 'paths'> = {
  openapi: '3.0.1',
  info,
  servers,
  security,
  components,
  tags,
};

let prettierOptions: prettier.Options = {
  parser: 'typescript',
  plugins: [parserTypescript],
};

const userOptions = {
  semi: true,
  printWidth: 80,
  singleQuote: true,
  trailingComma: 'all',
  proseWrap: 'always',
} as prettier.Options;

prettierOptions = {
  ...(userOptions || {}),
  ...prettierOptions,
  plugins: [...(prettierOptions.plugins as prettier.Plugin[])],
};

(async function () {
  const schemaObject = {};

  try {
    Logger.info('🔧 building the paths object...');
    // get every files of the schemas directory
    const schemaFiles = readDir('./api/docs/schemas').map(
      (file) => file.split('schemas/')[1].split('.')[0],
    );
    for (let index = 0; index < schemaFiles.length; index++) {
      await import(
        `../${path.join('./docs/schemas', schemaFiles[index]).split('.')[0]}`
      )
        .then(
          // add the path as key and schema as value to the schemaObject
          (module) => {
            const path = module.default.path;
            delete module.default.path;
            schemaObject[path] = { ...module.default };
          },
        )
        .catch((err) => {
          Logger.error(`couldn't import an openAPiSchema \n ${err.stack}`);
          throw new Error(err);
        });
    }

    const openApiDefinition: OpenAPIV3.Document = {
      paths: schemaObject,
      ...docs,
    };

    Logger.info('🚧 Creating the typescript definitions...');
    const types = await openApiTS(
      openApiDefinition as unknown as Record<string, SchemaObject>,
      {
        formatter(node: SchemaObject) {
          if (node.format === 'date-time') {
            return 'Date';
          }
        },
      },
    );

    Logger.info('📝 Writing the docs');
    const openApiDoc = prettier.format(
      "import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';const openApiDocs:OpenAPIV3.Document = " +
        JSON.stringify(openApiDefinition) +
        '; export default openApiDocs',
      prettierOptions,
    );

    fs.writeFileSync(
      path.join(__dirname, '..', 'docs', 'openApiDoc.ts'),
      openApiDoc,
    );

    fs.writeFileSync(path.join(__dirname, '..', 'types', 'schema.ts'), types);

    Logger.info('✅ API Types have been generated ! ');
  } catch (err) {
    Logger.error(`❌ Generate types failed\n${err.stack}`);
    throw new Error(err);
  }
})();

/**
 *
 * @description Return all the files of a folder including files of sub-folder
 * @param {string} dir The root folder
 * @return {string[]} A list of all the files
 * @author Romain Guarinoni
 */

function readDir(dir: string): string[] {
  let results: string[] = [];
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = dir + '/' + file;
    const stats = fs.statSync(filePath);
    if (stats && stats.isDirectory()) {
      results = results.concat(readDir(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

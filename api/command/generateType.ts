import docs from '../docs/config/index';
import fs from 'fs';
import { series } from 'async';
import { exec } from 'child_process';
import rimraf from 'rimraf';
import path from 'path';
// import schemas from '../api/docs/schemas';

export default async function createAPITypes(): Promise<void> {
  const schemaObject: {
    [key: string]: string;
  } = {};

  try {
    // console.log('🗑️ Delete existing type');
    // rimraf.sync(path.join(__dirname, '..', 'docs', 'config', 'paths.ts'), {});
    // rimraf.sync(path.join(__dirname, '..', 'types', 'doc.json'), {});
    // rimraf.sync(path.join(__dirname, '..', 'types', 'schema.ts'), {});

    console.log('🔧 building the paths object...');
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
          console.log(err);
          throw new Error(err);
        });
    }

    fs.writeFileSync(
      path.join(__dirname, '..', 'docs', 'config', 'paths.ts'),
      "import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';const paths:OpenAPIV3.Document['paths'] = " +
        JSON.stringify(schemaObject) +
        '; export default paths',
    );

    console.log('🚧 Writing the JSON API file...');
    fs.writeFileSync(
      path.join(__dirname, '..', 'types', 'doc.json'),
      JSON.stringify(docs),
    );
    console.log('⏳ writing the types from the JSON file...');

    series([
      () =>
        exec(
          // eslint-disable-next-line
          'npx openapi-typescript ./api/types/doc.json --output ./api/types/schema.ts',
        ),
    ]);

    console.log('✅ API Types have been generated ! ');
  } catch (err) {
    throw new Error(err);
  }
}

/**
 *
 * @description Return all the files of a folder including files of sub-folder
 * @param {string} dir The root folder
 * @return {string[]} A list of all the files
 * @author Romain Guarinoni
 */

function readDir(dir: string) {
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

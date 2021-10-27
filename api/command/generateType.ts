import docs from '../docs/config/index';
import fs, { readdirSync } from 'fs';
import { series } from 'async';
import { exec } from 'child_process';
import path from 'path';

// import schemas from '../api/docs/schemas';

export default async function createAPITypes(): Promise<void> {
  const schemaObject: {
    [key: string]: string;
  } = {};

  try {
    console.log('🔧 building the paths object...');
    // get every files of the schemas directory
    const schemaFiles = readdirSync('./api/docs/schemas');
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
      './api/docs/config/schemas.ts',
      "import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';const paths:OpenAPIV3.Document['paths'] = " +
        JSON.stringify(schemaObject) +
        '; export default paths',
    );

    console.log('🚧 Writing the JSON API file...');
    fs.writeFileSync('./api/types/doc.json', JSON.stringify(docs));
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

import docs from '../api/docs/index';
import fs from 'fs';
import {series} from 'async';
import {exec} from 'child_process';
import {readdir} from 'fs/promises';
import path from 'path';
import schema from '../api/docs/schemas';
import assert from 'assert';
// import schemas from '../api/docs/schemas';

export default function createAPITypes() {
  return new Promise(async (resolve, reject) => {
    const schemaObject: {
      paths : {
        [key: string]: string;
      }
    } = {paths: {}};

    try {
      // get every files of the schemas directory
      const schemaFiles = await readdir('./api/docs/schemas');

      for (let index = 0; index < schemaFiles.length; index++) {
        // get the default exported schema from the file
        const schema = require(path.join(
            '../api/docs/schemas',
            schemaFiles[index],
        )).default;

        // add the path as key and schema as value to the schemaObject
        schemaObject['paths'][schema.path] = {...schema};
      }

      // fs.writeFileSync(
      //     './api/docs/test.ts',
      //     'export default '+ JSON.stringify(schemaObject),
      // );


      try {
        assert.deepEqual(schemaObject, schema);
        console.log('SUCCESS');
      } catch (err) {
        console.error(err);
      }

      console.log('🚧 Writing the JSON API file...');
      fs.writeFileSync('doc.json', JSON.stringify(docs));
      console.log('⏳ writing the types from the JSON file...');
      series([
        () => exec('npx openapi-typescript doc.json --output schema.ts'),
      ]);

      console.log('✅ API Types have been generated ! ');
      resolve({});
    } catch (err) {
      reject(err);
    }
  });
}

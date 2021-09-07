import docs from '../api/docs/index';
import fs from 'fs';
import {series} from 'async';
import {exec} from 'child_process';

export default function createAPITypes() {
  return new Promise((resolve, reject)=>{
    try {
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



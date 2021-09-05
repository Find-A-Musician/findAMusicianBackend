import docs from '../api/docs/index';
import fs from 'fs';
import {series} from 'async';
import {exec} from 'child_process';


export default function createAPITypes() {
  try {
    console.log('🚧 Writing the JSON API file...');
    fs.writeFileSync('doc.json', JSON.stringify(docs));
    console.log('⏳ writing the types from the JSON file...');
    series([
      () => exec('npx openapi-typescript doc.json --output schema.ts'),
    ]);
    console.log('✅ API Types have been generated ! ');
  } catch (err) {
    console.error('⚠️ An error has occured while writing files');
    console.log(err);
  }
}



"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../api/docs/index"));
const fs_1 = __importDefault(require("fs"));
const async_1 = require("async");
const child_process_1 = require("child_process");
function createAPITypes() {
    return new Promise((resolve, reject) => {
        try {
            console.log('🚧 Writing the JSON API file...');
            fs_1.default.writeFileSync('doc.json', JSON.stringify(index_1.default));
            console.log('⏳ writing the types from the JSON file...');
            (0, async_1.series)([
                () => (0, child_process_1.exec)('npx openapi-typescript doc.json --output schema.ts'),
            ]);
            console.log('✅ API Types have been generated ! ');
            resolve({});
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.default = createAPITypes;

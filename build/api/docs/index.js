"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basicInfo_1 = __importDefault(require("./basicInfo"));
const servers_1 = __importDefault(require("./servers"));
const components_1 = __importDefault(require("./components"));
const tags_1 = __importDefault(require("./tags"));
const index_1 = __importDefault(require("./schemas/index"));
const docs = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, basicInfo_1.default), servers_1.default), components_1.default), tags_1.default), index_1.default);
exports.default = docs;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const initializeTypes_1 = __importDefault(require("./command/initializeTypes"));
const user_1 = __importDefault(require("./api/routes/user"));
const index_1 = __importDefault(require("./api/docs/index"));
exports.PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
const httpApp = new http_1.default.Server(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/user', user_1.default);
app.get('/docs', (req, res) => {
    res.status(200).json(index_1.default);
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(index_1.default));
if (process.env.NODE_ENV === 'production') {
    // Static folder
    app.use(express_1.default.static(__dirname + '/public/'));
    // Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}
httpApp.listen(exports.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, initializeTypes_1.default)();
    console.log(' 🔌 Listening on port : http://localhost:' + exports.PORT);
    console.log('📕 Swager documention : http://localhost:' + exports.PORT + '/api-docs');
}));

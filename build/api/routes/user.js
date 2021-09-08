"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/:other/:test', (req, res) => {
    console.log(req.params.other);
    console.log(req.params.test);
    console.log(req.body.id);
    res.status(200).json({ id: 'it works' });
});
exports.default = router;

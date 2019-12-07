"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const api_1 = require("./api");
const app = express();
app.set("port", process.env.PORT || 5000);
api_1.default.init(app);
exports.default = app;
//# sourceMappingURL=app.js.map
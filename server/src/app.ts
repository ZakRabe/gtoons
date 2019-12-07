import * as express from "express";
import api from "./api";


const app = express();
app.set("port", process.env.PORT || 5000);

api.init(app);

export default app
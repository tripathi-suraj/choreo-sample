import express from "express";

import { dirname,join } from 'path';
import { fileURLToPath } from 'url';
import { readdir ,unlinkSync} from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

import * as Home from "./routes/index.mjs";
import * as Uploader from "./routes/upload.mjs";
import * as config from './prod-config.mjs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// add a book - request body should contain a title, status and an author
process.base = __dirname;
process.autokill = false;

const vars={};
Object.assign(vars,config);
vars.config.base = __dirname;

process.vars = vars;

setInterval(()=>{
  if(process.autokill){
    let uploadDir=`${process.base}/uploads`;
    readdir(uploadDir,function(err,files){
      console.log(Date.now())
      files && files.length > 0 && files.forEach((e,i)=>{
        if(e){
          unlinkSync(`${uploadDir}/${e}`);
        }
      })
    });
  }
},((1000 * 60) * 60 ) * 2);

Home.attachRoutes(app);
Uploader.attachRoutes(app);
// health check
app.get("/healthz", (_, res) => {
  return res.sendStatus(200);
});

app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  res.status(500);
  res.json({ error: err.message });
});

app.use("*", (_, res) => {
  return res
    .status(404)
    .json({ error: "the requested resource does not exist on this server" });
});




export default app;

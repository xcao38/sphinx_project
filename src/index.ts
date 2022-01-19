import express from 'express';
import dotenv from 'dotenv'
import {protect} from "./middleware";
import {handleProtected} from "./routes/protected";
import {handlePublic} from "./routes/public";
import path from 'path'


// Enable dotenv: https://www.npmjs.com/package/dotenv
dotenv.config()

const app = express();

app.set('view engine', 'ejs')
app.use(express.static("public"))
// This page requires authentication
app.get('/documentation',
  protect,
  handleProtected)
  .use('/documentation', protect,  express.static(path.join(__dirname, '..', 'static', 'html')))


// All other URLs show the public page.
app.use(handlePublic);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

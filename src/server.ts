import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { connect } from "mongoose";
import Router from "./routes/productRoutes";
import * as swaggerDocument from './swagger.json';

const app = express();

app.use(express.json());
app.use(express.static("public"));

const port = process.env.PORT || 8000;

// Serve Swagger UI
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use(Router);

//Database Connection
const dbPath = 'mongodb://localhost:27017/pizza';
// const options = {useNewUrlParser: true, useUnifiedTopology: true}
const mongo = connect(dbPath);

mongo.then(() => {
  console.log('connected');
}, error => {
  console.log(error, 'error');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

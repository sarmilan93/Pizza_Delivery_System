import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { connect } from "mongoose";
import productRouter from "./routes/productRoutes";
import userRouter from './routes/userRoutes';
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

app.use(productRouter);
app.use(userRouter);

//Database Connection
const dbPath = 'mongodb://localhost:27017/pizza';
const mongo = connect(dbPath);

mongo.then(() => {
  console.log('connected');
}, error => {
  console.log(error, 'error');
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

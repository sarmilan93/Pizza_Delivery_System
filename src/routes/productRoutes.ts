import express from "express";
import ProductController from "../controllers/productController";

const router = express.Router();
const productController = new ProductController();

router.get("/ping", (_req, res) => {
  productController.getMessage()
    .then(response => {
      res.send(response);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
});

export default router;
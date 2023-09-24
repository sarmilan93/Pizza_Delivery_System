import express from "express";
import ProductController from "../controllers/productController";
import { authenticateUser } from "../middleware/authMiddleware";

const productRouter = express.Router();
const productController = new ProductController();

//Create Products - only admin
productRouter.post("/products/addProducts", authenticateUser('Admin'), (_req, res) => {
  productController.createProducts(_req.body)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => {
      res.status(500).send("Failed to add new product");
    });
});

//Get Products - only admin
productRouter.get("/products/getProducts", authenticateUser('Admin'), (_req, res) => {
  productController.getProducts()
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => {
      res.status(500).send("Failed to get products");
    });
});

//Get Product By ID - only admin
productRouter.get("/products/getProducts/:id", authenticateUser('Admin'), (_req, res) => {
  productController.getProductsById(_req.params.id)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => {
      res.status(500).send("Failed to get product");
    });
});

//Update Product By ID - only admin
productRouter.put("/products/updateProduct/:id", authenticateUser('Admin'), (_req, res) => {
  productController.updateProduct(_req.body, _req.params.id)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => {
      res.status(500).send("Failed to update a product");
    });
});

//Delete Product By ID - only admin
productRouter.delete("/products/deleteProduct/:id", authenticateUser('Admin'), (_req, res) => {
  productController.deleteProductsById(_req.params.id)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => {
      res.status(500).send("Failed to delete a product");
    });
});

export default productRouter;
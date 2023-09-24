import express from "express";
import ProductController from "../controllers/productController";

const productRouter = express.Router();
const productController = new ProductController();

//Create Products
productRouter.post("/products/addProducts", (_req, res) => {
  productController.createProducts(_req.body)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => {
      res.status(500).send("Failed to add new product");
    });
});

//Get Products
productRouter.get("/products/getProducts", (_req, res) => {
  productController.getProducts()
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => {
      res.status(500).send("Failed to get products");
    });
});

//Get Product By ID
productRouter.get("/products/getProducts/:id", (_req, res) => {
  productController.getProductsById(_req.params.id)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => {
      res.status(500).send("Failed to get product");
    });
});

//Update Product By ID
productRouter.put("/products/updateProduct/:id", (_req, res) => {
  productController.updateProduct(_req.body, _req.params.id)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => {
      res.status(500).send("Failed to update a product");
    });
});

//Delete Product By ID
productRouter.delete("/products/deleteProduct/:id", (_req, res) => {
  productController.deleteProductsById(_req.params.id)
    .then(response => {
      res.status(201).send(response);
    })
    .catch(error => {
      res.status(500).send("Failed to delete a product");
    });
});

export default productRouter;
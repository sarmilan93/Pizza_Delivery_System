import express from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import OrderController from "../controllers/orderController";

const orderRouter = express.Router();
const orderController = new OrderController();

//Create Orders - only admin
orderRouter.post("/orders/createOrder", authenticateUser('Admin'), (_req, res) => {
    orderController.createOrder(_req.body)
        .then(response => {
            res.status(201).send(response);
        })
        .catch(error => {
            res.status(500).send("Failed to add new product");
        });
});

//Get Orders
orderRouter.get("/orders/getOrders", authenticateUser(['Admin', 'KitchenStaff', 'StoreStaff', 'DeliveryStaff']), (_req, res) => {
    orderController.getOrders()
        .then(response => {
            res.status(201).send(response);
        })
        .catch(error => {
            res.status(500).send("Failed to get products");
        });
});

//Get Order By ID
orderRouter.get("/orders/getOrders/:id", authenticateUser(['Admin', 'KitchenStaff', 'StoreStaff', 'DeliveryStaff', 'Customer']), (_req, res) => {
    orderController.getOrderById(_req.params.id)
        .then(response => {
            res.status(201).send(response);
        })
        .catch(error => {
            res.status(500).send("Failed to get order!");
        });
});

//Get Order By Customer ID
orderRouter.get("/orders/getCustomerOrders/:customerid", authenticateUser(['Admin', 'KitchenStaff', 'StoreStaff', 'DeliveryStaff', 'Customer']), (_req, res) => {
    orderController.getOrderByCustomerId(_req.params.customerid)
        .then(response => {
            res.status(201).send(response);
        })
        .catch(error => {
            res.status(500).send("Failed to get order!");
        });
});

//Update Order By ID - only admin
orderRouter.put("/orders/updateOrder/:id", authenticateUser(['Admin', 'KitchenStaff', 'StoreStaff', 'DeliveryStaff']), (_req, res) => {
    orderController.updateOrder(_req.body, _req.params.id)
        .then(response => {
            res.status(201).send(response);
        })
        .catch(error => {
            res.status(500).send("Failed to update a order!");
        });
});

//Delete Order By ID - only admin
orderRouter.delete("/orders/deleteOrder/:id", authenticateUser('Admin'), (_req, res) => {
    orderController.deleteOrderById(_req.params.id)
        .then(response => {
            res.status(201).send(response);
        })
        .catch(error => {
            res.status(500).send("Failed to delete a order!");
        });
});


export default orderRouter;
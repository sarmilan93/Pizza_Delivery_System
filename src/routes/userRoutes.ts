import express from "express";
import UserController from "../controllers/userController";
import { authenticateUser, getStaff } from "../middleware/authMiddleware";

const userRouter = express.Router();
const userController = new UserController();

//Register User
userRouter.post("/users/register", (_req, res) => {
    const staff = getStaff(_req, res);

    if (staff.role == "KitchenStaff" || staff.role == "DeliveryStaff") {
        res.status(500).send("User not authorized to perform this action");
    }
    else if (staff.role == "StoreStaff") {
        if (_req.body.role == "Customer") {
            registerUser(_req, res);
        }
        else {
            res.status(500).send("User not authorized to perform this action");
        }
    }
    else if (staff.role == "Admin") {
        registerUser(_req, res);
    }
    else if (staff == "Missing Token" && _req.body.role == "Customer") {
        registerUser(_req, res);
    }
    else {
        res.status(500).send("User not authorized to perform this action");
    }
});

//Common function for register
function registerUser(_req: any, res: any) {
    userController.registerUser(_req.body)
        .then(response => {
            res.status(201).send(response);
        })
        .catch(error => {
            res.status(500).send("Failed to add new User!");
        });
}

//Login User
userRouter.post("/users/login", (_req, res) => {
    userController.login(_req.body)
        .then(response => {
            res.cookie("token", response.data);
            res.status(201).send(response);

        })
        .catch(error => {
            res.status(500).send("Failed to login with given credentials!");
        });
});

export default userRouter;
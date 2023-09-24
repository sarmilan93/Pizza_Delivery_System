import express from "express";
import UserController from "../controllers/userController";

const userRouter = express.Router();
const userController = new UserController();

//Register User
userRouter.post("/users/register", (_req, res) => {
    userController.registerUser(_req.body)
        .then(response => {
            res.status(201).send(response);
        })
        .catch(error => {
            res.status(500).send("Failed to add new User!");
        });
});

//Login User
userRouter.post("/users/login", (_req, res) => {
    userController.login(_req.body)
        .then(response => {
            res.cookie("token", response.data);
            res.status(201).send(response.message);

        })
        .catch(error => {
            res.status(500).send("Failed to login with given credentials!");
        });
});

export default userRouter;
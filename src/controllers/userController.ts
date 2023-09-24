import { Controller, Post, Route, Body, SuccessResponse, Tags } from "tsoa";
import User from "../models/User";
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'inventory';

interface UserResponse {
    message: string,
    data: any
}

interface RegisterInterface {
    username: string;
    email: string;
    password: string;
    role: "Admin" | "KitchenStaff" | "StoreStaff" | "DeliveryStaff" | "Customer";
}

interface LoginInterface {
    email: string;
    password: string;
}

@Route("users")
@Tags('Users')
export default class UserController extends Controller {

    @SuccessResponse("201", "Registered")
    @Post("/register")
    public async registerUser(@Body() req: RegisterInterface): Promise<UserResponse> {

        try {
            const { username, email, password, role } = req;

            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return {
                    message: "User already exists",
                    data: existingUser
                }
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = new User({
                    username,
                    email,
                    password: hashedPassword,
                    role
                });

                const newUserData = await newUser.save();

                return {
                    message: "User Registered Successfully",
                    data: newUserData
                }

            }
        } catch (error) {
            return Promise.reject(new Error('Failed to create User'));
        }

    }

    @Post('/login')
    public async login(@Body() req: LoginInterface): Promise<UserResponse> {

        try {
            const { email, password } = req;

            const user = await User.findOne({ email });

            if(!user){
                return {
                    message: "Cannot Login!",
                    data: "User not found with for a given email address!"
                }
            }
            else {
                const verifyPassword = await bcrypt.compare(password, user.password);

                if (!verifyPassword) {
                    return {
                        message: "Cannot Login!",
                        data: "Invalid Password!"
                    }
                }
                else {
                    const token = jwt.sign(
                        { userId: user._id, role: user.role },
                        JWT_SECRET,
                        { expiresIn: '1h' }
                    );

                    return {
                        message: "Login Success",
                        data: token
                    }
                }
            }

        } catch (error) {
            return Promise.reject(new Error('Failed to Login!'));
        }

    }
}


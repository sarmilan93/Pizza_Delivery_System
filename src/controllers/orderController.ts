import { Controller, Get, Post, Route, Body, SuccessResponse, Path, Put, Tags, Delete } from "tsoa";
import mongoose from 'mongoose';
import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";

interface OrderInterface {
    customer: string,
    products: {
        product: string,
        quantity: number,
    }[],
    status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Canceled' | 'Completed',
    orderType: 'Pickup' | 'Delivery'
}

interface OrderResponse {
    message: string,
    data: any
}

@Route("orders")
@Tags('Orders')
export default class OrderController extends Controller {

    //Create Order Controller
    @SuccessResponse("201", "Created")
    @Post("/createOrder")
    public async createOrder(@Body() _req: OrderInterface): Promise<OrderResponse> {
        try {
            const { customer, products, status, orderType } = _req;

            const existingCustomer = await User.findById(customer);
            if (!existingCustomer) {
                this.setStatus(400);
                return {
                    message: "Customer not found",
                    data: ''
                }
            }
            else {
                for (const productEntry of products) {
                    const { product, quantity } = productEntry;
                    const existingProduct = await Product.findById(product);

                    if (!existingProduct) {
                        this.setStatus(400);
                        return {
                            message: `Product not found for product ID: ${product}`,
                            data: ''
                        }
                    }

                    if (quantity <= 0) {
                        this.setStatus(400);
                        return {
                            message: 'Invalid product quantity',
                            data: ''
                        }
                    }
                }

                const newOrder = new Order({
                    customer,
                    products,
                    status,
                    orderType,
                });

                const response = await newOrder.save();
                return {
                    message: "Order Created Successfully!",
                    data: response
                }
            }

        } catch (error) {
            return Promise.reject(new Error('Failed to create new Order'));
        }
    }

    // Get Products Controller
    @Get("/getOrders")
    public async getOrders(): Promise<OrderResponse> {
        try {

            const response = await Order.find().exec();
            return {
                message: "Got the Orders.",
                data: response
            };

        } catch (error) {
            return Promise.reject(new Error('Failed to get orders'));
        }
    }

    //Get Orders By ID Controller
    @Get("/getOrders/{id}")
    public async getOrderById(@Path() id: string): Promise<OrderResponse> {
        try {

            const response = await Order.findById(id).exec();
            return {
                message: "Got the order!",
                data: response
            };

        } catch (error) {
            return Promise.reject(new Error('Failed to get order'));
        }
    }

    //Get Orders By Customer ID Controller
    @Get("/getCustomerOrders/{customerid}")
    public async getOrderByCustomerId(@Path() customerid: string): Promise<OrderResponse> {
        try {

            const response = await Order.find({ customer: customerid }).exec();
            if (!response) {
                return {
                    message: "Orders not found for this customer",
                    data: response
                };
            }
            return {
                message: "Got the orders!",
                data: response
            };

        } catch (error) {
            return Promise.reject(new Error('Failed to get order'));
        }
    }

    //Update Order By ID Controller
    @SuccessResponse("201", "Updated")
    @Put("/updateOrder/{id}")
    public async updateOrder(@Body() _req: OrderInterface, @Path() id: string): Promise<OrderResponse> {
        try {

            const existingOrder = await Order.findById(id).exec();

            if (!existingOrder) {
                this.setStatus(404);
                return {
                    message: "Order not found",
                    data: ''
                };
            }

            const { customer, products, status, orderType } = _req;

            if (customer) {
                const customerId = new mongoose.Types.ObjectId(customer);
                const existingCustomer = await User.findById(customerId).exec();
                console.log("customerId: ", customerId, customer)
                console.log("existingOrder: ", existingOrder)
                if (!existingCustomer) {
                    this.setStatus(400);
                    return {
                        message: "Customer not found",
                        data: ''
                    };
                }
                // existingOrder.customer = customerId.toString();
            }

            if (products) {
                for (const productEntry of products) {
                    const { product, quantity } = productEntry;
                    const existingProduct = await Product.findById(product);

                    if (!existingProduct) {
                        this.setStatus(400);
                        return {
                            message: `Product not found for product ID: ${product}`,
                            data: ''
                        };
                    }

                    if (quantity <= 0) {
                        this.setStatus(400);
                        return {
                            message: "Invalid product quantity",
                            data: ''
                        };
                    }
                }
                // existingOrder.products = products;
            }

            if (status) {
                existingOrder.status = status;
            }

            if (orderType) {
                existingOrder.orderType = orderType;
            }

            existingOrder.updatedAt = new Date();

            const response = await existingOrder.save();

            return {
                message: "Order Updated",
                data: response
            };

        } catch (error) {
            return Promise.reject(new Error('Failed to update a product'));
        }
    }

    @Delete("/deleteOrder/{id}")
    public async deleteOrderById(@Path() id: string): Promise<OrderResponse> {
        try {

            const deletedOrder = await Order.findByIdAndRemove(id);

            if (!deletedOrder) {
                this.setStatus(404);
                return {
                    message: "'Order not found!",
                    data: ''
                };
            }

            return {
                message: "Order deleted!",
                data: deletedOrder
            };

        } catch (error) {
            return Promise.reject(new Error('Failed to delete product'));
        }
    }
}
import { Controller, Get, Post, Route, Body, SuccessResponse, Path, Put, Tags, Delete } from "tsoa";
import Product from "../models/Product";

interface ProductResponse {
  message: string,
  data: any
}

interface ProductInterface {
  name: string,
  sku: string,
  size: "Small" | "Regular" | "Large",
  price: number
}

@Route("products")
@Tags('Products')
export default class ProductController extends Controller {

  //Create Products Controller
  @SuccessResponse("201", "Created")
  @Post("/addProducts")
  public async createProducts(@Body() _req: ProductInterface): Promise<ProductResponse> {
    try {
      const { name, sku, size, price } = _req;

      const product = new Product({
        name,
        sku,
        size,
        price
      });

      const response = await product.save();
      return {
        message: "Product Added Successfully!",
        data: response
      }

    } catch (error) {
      return Promise.reject(new Error('Failed to create a product'));
    }
  }

  // Get Products Controller
  @Get("/getProducts")
  public async getProducts(): Promise<ProductResponse> {
    try {

      const response = await Product.find().exec();
      return {
        message: "Got the Products!",
        data: response
      };

    } catch (error) {
      return Promise.reject(new Error('Failed to get products'));
    }
  }

  //Get Products By ID Controller
  @Get("/getProducts/{id}")
  public async getProductsById(@Path() id: string): Promise<ProductResponse> {
    try {

      const response = await Product.findById(id).exec();
      return {
        message: "Got the Product!",
        data: response
      };

    } catch (error) {
      return Promise.reject(new Error('Failed to get product'));
    }
  }

  //Update Products By ID Controller
  @SuccessResponse("201", "Created")
  @Put("/updateProduct/{id}")
  public async updateProduct(@Body() _req: ProductInterface, @Path() id: string): Promise<ProductResponse> {
    try {
      const validSizes = ["Small", "Regular", "Large"];
      if (validSizes.includes(_req.size)) {
        const { name, sku, size, price } = _req;

        const response = await Product.findById(id).exec();
        if (response) {
          response.name = name;
          response.sku = sku;
          response.size = size;
          response.price = price

          const updatedResponse = await response.save();

          return {
            message: "Product Updated Successfully!",
            data: updatedResponse
          }
        }
        return {
          message: "Product not exist!",
          data: "Cannot update data for given id!"
        }
      }
      else {
        return {
          message: "Cannot Update Data",
          data: "Invalid size value! It must be => Small | Regular | Large"
        }
      }
    } catch (error) {
      return Promise.reject(new Error('Failed to update a product'));
    }
  }

  @Delete("/deleteProduct/{id}")
  public async deleteProductsById(@Path() id: string): Promise<ProductResponse> {
    try {

      const deletedProduct = Product.findByIdAndRemove(id);

      return {
        message: "Product deleted!",
        data: deletedProduct
      };

    } catch (error) {
      return Promise.reject(new Error('Failed to delete product'));
    }
  }
}
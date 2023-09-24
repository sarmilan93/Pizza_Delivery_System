import { Schema, model } from "mongoose";

export interface ProductInterface {
    name: string,
    sku: string,
    size: "Small" | "Regular" | "Large",
    price: number
}

let productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        enum: ['Small', 'Regular', 'Large'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});

productSchema.pre('save', function (next) {
    const product = this;
    const baseSKU = "Pizza";
    product.sku = `${baseSKU}_${product.size}`;
    next();
})

const Product = model('Product', productSchema, 'Product');
export default Product;
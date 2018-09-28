import {
    ShoppingBasket,
    Product,
    Coupon
} from "./shopping-basket";
import assert from "assert";

describe("Shopping", function () {
    it("Create basket", function () {
        new ShoppingBasket();
    });

    it("Add product to basket", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);

        assert.equal(basket.products.size, 1);
    });

    it("change quantity", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        basket.changeCountOfProduct(onion, 5);

        assert.equal(basket.products.get(onion), 5);
    });
    it("delete product", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();
        
        basket.AddProduct(onion, 10);
        basket.DeleteProduct(onion);
        assert.equal(basket.products.has(onion),false);
    });
    it("delete  absent product", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();
        
        //basket.AddProduct(onion, 10);
        //basket.DeleteProduct(onion);
        assert.equal(basket.DeleteProduct(onion),undefined);
    });
    it("Create coupon", function(){
        let coupon=new Coupon(500,0,"");
    });
});
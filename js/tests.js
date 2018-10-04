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
    it ("create product", function(){
        new Product(20);
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

        assert.deepEqual(basket.products.get(onion), {count: 5,subSum: 120});
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
        assert.equal(basket.DeleteProduct(onion),undefined);
    });
    it("Create coupon", function(){
        let coupon=new Coupon("money", 200);

    });
    it("create wrong type coupon",function(){
        assert.throws(()=>{new Coupon("hhh",200);}, Error);

    });
});
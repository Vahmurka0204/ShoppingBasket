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
    it("create product", function () {
        new Product(20);
    });

    it("Add product to basket", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);

        assert.equal(basket.products.size, 1);
    });
    it("redo Add product to basket", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        basket.Undo();
        basket.Redo();
        assert.equal(basket.products.size, 1);
    });

    it("change quantity", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        basket.ChangeCountOfProduct(onion, 5);

        assert.deepEqual(basket.products.get(onion), {
            count: 5,
            subSum: 120
        });
    });
    it("change quantity wrong number", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);

        assert.throws(() => {
            basket.ChangeCountOfProduct(onion, -5);
        }, Error);
    });
    it("delete product", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        basket.DeleteProduct(onion);
        assert.equal(basket.products.has(onion), false);
    });
    it("undo delete product", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        basket.DeleteProduct(onion);
        basket.Undo();
        assert.deepEqual(basket.products.get(onion), {
            count: 10,
            subSum: 240
        });
    });
    it("redo undo delete product", function () {
        debugger;
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();
        basket.AddProduct(onion, 10);
        basket.DeleteProduct(onion);
        basket.Undo();
        basket.Redo();
        assert.equal(basket.products.has(onion), false);
    });
    it("delete  absent product", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();
        assert.equal(basket.DeleteProduct(onion), undefined);
    });
    it("Create coupon", function () {
        let coupon = new Coupon("money", 200);

    });
    it("create wrong type coupon", function () {
        assert.throws(() => {
            new Coupon("hhh", 200);
        }, Error);

    });
    it("create coupon without type", function () {
        assert.throws(() => {
            new Coupon(200);
        }, Error);

    });
    it("use money coupon", function () {
        let coupon = new Coupon("money", 200);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 15);
        basket.UseCoupon(coupon);
        assert.equal(basket.totalSumm, 100);

    });
    it("use persent coupon", function () {
        let coupon = new Coupon("persent", 50);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon);
        assert.equal(basket.totalSumm, 300);

    });
    it("undo use money coupon", function () {
        let coupon = new Coupon("money", 700);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon);
        basket.Undo();
        assert.equal(basket.totalSumm, 600);

    });
    it("use product money coupon", function () {
        let coupon = new Coupon("money", 200);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 15);
        basket.UseCoupon(coupon, onion);
        assert.equal(basket.products.get(onion).subSum, 100);

    });
    it("undo use product money coupon", function () {
        let coupon = new Coupon("money", 200);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 15);
        basket.UseCoupon(coupon, onion);
        basket.Undo();
        assert.equal(basket.products.get(onion).subSum, 300);

    });
    it("use product money coupon discount > Summ", function () {
        let coupon = new Coupon("money", 1000);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 15);
        basket.UseCoupon(coupon, onion);
        assert.equal(basket.products.get(onion).subSum, 0);

    });
    it("use product persent coupon", function () {
        let coupon = new Coupon("persent", 50);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon, onion);
        assert.equal(basket.products.get(onion).subSum, 300);

    });
    it("undo use product persent coupon", function () {
        let coupon = new Coupon("persent", 50);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon, onion);
        basket.Undo();
        assert.equal(basket.products.get(onion).subSum, 600);

    });
    it("redo undo use product persent coupon", function () {
        let coupon = new Coupon("persent", 50);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon, onion);
        basket.Undo();
        basket.Redo();
        assert.equal(basket.products.get(onion).subSum, 300);

    });
    it("undo change", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();
        basket.AddProduct(onion, 10);
        basket.ChangeCountOfProduct(onion, 15);
        basket.Undo();
        assert.deepEqual(basket.products.get(onion), {
            count: 10,
            subSum: 240
        });

    });
    it("undo redo change", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();
        basket.AddProduct(onion, 10);
        basket.ChangeCountOfProduct(onion, 15);
        basket.Undo();
        basket.Redo();
        assert.deepEqual(basket.products.get(onion), {
            count: 15,
            subSum: 360
        });

    });
    it("print check", function () {
        let onion = new Product("onion", 10);
        let tomato = new Product("tomato", 12);
        let basket = new ShoppingBasket();
        let coupon = new Coupon("money", 30);
        basket.AddProduct(onion, 10);
        basket.AddProduct(tomato, 4);
        basket.UseCoupon(coupon, tomato);
        assert.equal(basket.PrintCheck(), "1. onion  10  100.00\n2. tomato  4  18.00\nThe coupon is applied to tomato. Discount amount is 30$\nTotal: 118.00");

    });
    it("print persent coupon", function () {
        let coupon = new Coupon("persent", 50);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon);
        assert.equal(basket.PrintCheck(), "1. onion  30  600.00\nThe coupon is applied to basket. Discount amount is 50%\nTotal: 300.00");

    });
    it("clear redo after new operation", function () {
        let onion = new Product("onion", 10);
        let tomato = new Product("tomato", 12);
        let basket = new ShoppingBasket();
        let pumpkin = new Product("pumpkin", 75);
        basket.AddProduct(onion, 10);
        basket.AddProduct(tomato, 4);
        basket.ChangeCountOfProduct(onion, 5);
        basket.Undo();
        basket.Undo();
        basket.AddProduct(pumpkin, 1);
        assert.equal(basket.redoArray.length, 0);
    });
    it("undo zero operation",function(){
        let basket=new ShoppingBasket();
        basket.Undo();
    });
    it("redo zero operation",function(){
        let basket=new ShoppingBasket();
        basket.Redo();
    });
    it("coupon cancellation without use coupon", function(){
        let basket=new ShoppingBasket();
        let coupon=new Coupon("money",20);
        assert.throws(()=>{basket.couponCancellation(coupon);}, Error);
    });
});
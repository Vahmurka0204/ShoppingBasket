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

    it("change quantity", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        basket.changeCountOfProduct(onion, 5);

        assert.deepEqual(basket.products.get(onion), {
            count: 5,
            subSum: 120
        });
    });
    it("delete product", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        basket.DeleteProduct(onion);
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
        basket.changeCountOfProduct(onion, 15);
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
        basket.changeCountOfProduct(onion, 15);
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
        assert.equal(basket.PrintCheck(), true);

    });
});
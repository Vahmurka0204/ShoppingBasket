import {
    ShoppingBasket,
    Product,
    Coupon
} from "./shopping-basket";
import assert from "assert";

describe("Shopping basket tests", function () {
    it("Create basket", function () {
        new ShoppingBasket();
    });
    it("Сreate product", function () {
        new Product("onion", 20);
    });
    it("Сreate wrong product", function () {
        new Product("onion", -20);
    });
    it("Add product to basket", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        var lastState = basket.statesOfBasket[basket.statesOfBasket.length - 1];
        assert.equal(lastState.products.size, 1);
    });
    it("redo Add product to basket", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        basket.Undo();
        basket.Redo();
        var lastState = basket.statesOfBasket[basket.statesOfBasket.length - 1];
        assert.equal(lastState.products.size, 1);
    });

    it("change product quantity", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        basket.ChangeCountOfProduct(onion, 5);
        var lastState = basket.statesOfBasket[basket.statesOfBasket.length - 1];
        assert.deepEqual(lastState.products.get(onion), {
            count: 5,
            subSum: 120
        });
    });
    it("change quantity, wrong number", function () {
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
        var lastState = basket.statesOfBasket[basket.statesOfBasket.length - 1];
        assert.equal(lastState.products.has(onion), false);
    });
    it("undo delete product", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();

        basket.AddProduct(onion, 10);
        basket.DeleteProduct(onion);
        basket.Undo();
        var lastState = basket.statesOfBasket[basket.cursor - 1];
        assert.deepEqual(lastState.products.get(onion), {
            count: 10,
            subSum: 240
        });
    });
    it("redo delete product", function () {
        debugger;
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();
        basket.AddProduct(onion, 10);
        basket.DeleteProduct(onion);
        basket.Undo();
        basket.Redo();
        var lastState = basket.statesOfBasket[basket.statesOfBasket.length - 1];
        assert.equal(lastState.products.has(onion), false);
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
    it("create coupon without one parameter", function () {
        assert.throws(() => {
            new Coupon(200);
        }, Error);
    });
    it("use money coupon for basket", function () {
        let coupon = new Coupon("money", 200);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 15);
        basket.UseCoupon(coupon);
        var lastState = basket.statesOfBasket[basket.statesOfBasket.length - 1];
        assert.deepEqual(lastState.Coupon, {
            coupon: {
                typeOfCoupon: "money",
                discountAmount: 200
            },
            product: {
                name: "basket"
            }
        });
    });
    it("use persent coupon for basket", function () {
        let coupon = new Coupon("persent", 50);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon);
        var lastState = basket.statesOfBasket[basket.statesOfBasket.length - 1];
        assert.deepEqual(lastState.Coupon, {
            coupon: {
                typeOfCoupon: "persent",
                discountAmount: 50
            },
            product: {
                name: "basket"
            }
        });
    });

    it("undo use money coupon for basket", function () {
        let coupon = new Coupon("money", 700);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon);
        basket.Undo();
        var lastState = basket.statesOfBasket[basket.cursor - 1];
        assert.deepEqual(lastState.Coupon, {
            coupon: null,
            product: null
        });
    });
    it("use money coupon for product", function () {
        let coupon = new Coupon("money", 200);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 15);
        basket.UseCoupon(coupon, onion);
        var lastState = basket.statesOfBasket[basket.statesOfBasket.length - 1];
        assert.deepEqual(lastState.Coupon, {
            coupon: {
                typeOfCoupon: "money",
                discountAmount: 200
            },
            product: {
                name: "onion",
                price: 20
            }
        });
    });
    it("use money coupon for absent product", function () {
        let coupon = new Coupon("money", 200);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        let tomato=new Product("tomato", 30);
        basket.AddProduct(onion, 15);
        basket.UseCoupon(coupon, tomato);
        var lastState = basket.statesOfBasket[basket.statesOfBasket.length - 1];
        assert.deepEqual(lastState.Coupon, {
            coupon: 
                null
            ,
            product: null
        });
    });
    it("undo use money coupon for product", function () {
        let coupon = new Coupon("money", 200);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 15);
        basket.UseCoupon(coupon, onion);
        basket.Undo();
        var lastState = basket.statesOfBasket[basket.cursor - 1];
        assert.deepEqual(lastState.Coupon, {
            coupon: null,
            product: null
        });
    });

    it("redo use product persent coupon", function () {
        let coupon = new Coupon("persent", 50);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon, onion);
        basket.Undo();
        basket.Redo();
        var lastState = basket.statesOfBasket[basket.cursor - 1];
        assert.deepEqual(lastState.Coupon, {
            coupon: {
                typeOfCoupon: "persent",
                discountAmount: 50
            },
            product: {
                name: "onion",
                price: 20
            }
        });
    });
    it("undo change product quantity", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();
        basket.AddProduct(onion, 10);
        basket.ChangeCountOfProduct(onion, 15);
        basket.Undo();
        var lastState = basket.statesOfBasket[basket.cursor - 1];
        assert.deepEqual(lastState.products.get(onion), {
            count: 10,
            subSum: 240
        });

    });
    it("redo change product quantity", function () {
        let onion = new Product("onion", 24);
        let basket = new ShoppingBasket();
        basket.AddProduct(onion, 10);
        basket.ChangeCountOfProduct(onion, 15);
        basket.Undo();
        basket.Redo();
        var lastState = basket.statesOfBasket[basket.cursor - 1];
        assert.deepEqual(lastState.products.get(onion), {
            count: 15,
            subSum: 360
        });

    });
    it("print check money coupon", function () {
        let onion = new Product("onion", 10);
        let tomato = new Product("tomato", 12);
        let basket = new ShoppingBasket();
        let coupon = new Coupon("money", 30);
        basket.AddProduct(onion, 10);
        basket.AddProduct(tomato, 4);
        basket.UseCoupon(coupon, tomato);
        assert.equal(basket.PrintCheck(), "The coupon is applied to tomato. Discount amount is 30$\n1. onion  10  100.00\n2. tomato  4  18.00\nTotal: 118.00");

    });
    it("print check money coupon for delete product", function () {
        let onion = new Product("onion", 10);
        let tomato = new Product("tomato", 12);
        let basket = new ShoppingBasket();
        let coupon = new Coupon("money", 30);
        basket.AddProduct(onion, 10);
        basket.AddProduct(tomato, 4);
        basket.UseCoupon(coupon, tomato);
        basket.DeleteProduct(tomato);
        assert.equal(basket.PrintCheck(), "1. onion  10  100.00\nTotal: 100.00");

    });
    it("print check money coupon, discount amount> subSum", function () {
        let onion = new Product("onion", 10);
        let tomato = new Product("tomato", 12);
        let basket = new ShoppingBasket();
        let coupon = new Coupon("money", 50);
        basket.AddProduct(onion, 10);
        basket.AddProduct(tomato, 4);
        basket.UseCoupon(coupon, tomato);
        assert.equal(basket.PrintCheck(), "The coupon is applied to tomato. Discount amount is 50$\n1. onion  10  100.00\n2. tomato  4  0.00\nTotal: 100.00");

    });
    it("print check", function () {
        let onion = new Product("onion", 10);
        let tomato = new Product("tomato", 12);
        let basket = new ShoppingBasket();
        basket.AddProduct(onion, 10);
        basket.AddProduct(tomato, 4);
        assert.equal(basket.PrintCheck(), "1. onion  10  100.00\n2. tomato  4  48.00\nTotal: 148.00");

    });
    it("print check persent coupon", function () {
        debugger;
        let coupon = new Coupon("persent", 50);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon);
        assert.equal(basket.PrintCheck(), "The coupon is applied to basket. Discount amount is 50%\n1. onion  30  600.00\nTotal: 300.00");

    });
    it("print check persent coupon for product", function () {
        debugger;
        let coupon = new Coupon("persent", 50);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon, onion);
        assert.equal(basket.PrintCheck(), "The coupon is applied to onion. Discount amount is 50%\n1. onion  30  300.00\nTotal: 300.00");

    });
    it("print check money coupon, discount amount > Total", function () {
        debugger;
        let coupon = new Coupon("money", 700);
        let basket = new ShoppingBasket();
        let onion = new Product("onion", 20);
        basket.AddProduct(onion, 30);
        basket.UseCoupon(coupon);
        assert.equal(basket.PrintCheck(), "The coupon is applied to basket. Discount amount is 700$\n1. onion  30  600.00\nTotal: 0.00");

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
        assert.equal(basket.statesOfBasket.length, basket.cursor);
    });
    it("undo zero operation", function () {
        let basket = new ShoppingBasket();
        basket.Undo();
    });
    it("redo zero operation", function () {
        let basket = new ShoppingBasket();
        basket.Redo();
    });
    it("coupon cancellation without use coupon", function () {
        let basket = new ShoppingBasket();
        let coupon = new Coupon("money", 20);
        assert.throws(() => {
            basket.couponCancellation(coupon);
        }, Error);
    });
});
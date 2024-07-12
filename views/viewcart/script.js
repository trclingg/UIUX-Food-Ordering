// REGION 1
import express from 'express';
const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(__dirname + "/views"));
var gBASE_URL = "https://64747ed27de100807b1b0fa4.mockapi.io/api/v1/";

// var gBASE_URL = "https://food-ordering-fvo9.onrender.com/api";
var gVoucherDiscountNumber = 0;
var gVoucherId = 0;
// REGION 2
$(document).ready(function () {
    onPageViewCartLoad();
    // callApiGetAllVoucher();
    // onGetVoucherDiscountNumberClick("10056");
    getBill();
    // add event for plus button
    $(document).on("click", ".cart-add-product", function () {
        increaseQuantity(this);
    });

    // add event for minus button
    $(document).on("click", ".cart-minus-product", function () {
        decreaseQuantity(this);
    });

    // add event for remove button
    $(document).on("click", ".cart-remove-product", function () {
        removeProduct(this);
    });
    // add event for voucher redeem button
    $(document).on("click", "#btn-voucher-redeem", function () {
        // alert("redeem");
        redeemVoucher();
    });
    // add event for check out for the payment modal
    $(document).on("click", "#btn-check-out", function () {
        // show modal
        $('#modal-payment-form').modal('show');
    
    });
    // add event for check out for the go to payment button
    $(document).on("click", "#btn-payment-check-out", function () {
        // show modal
        callApiToCreateOrder();
       
    });
    // add event for select payment method
    $(document).on("click", ".checkbox-container", function () {
        var checkbox = $(this).find(".check-method");
        var methodRow = $(this).closest(".method-row");

        if (!checkbox.is(":checked")) {
            $(".method-row").removeClass("checked");
            $(".check-method").prop("checked", false);
            methodRow.addClass("checked");
            checkbox.prop("checked", true);
        } else {
            $(".method-row").removeClass("checked");
            $(".check-method").prop("checked", false);
        }
    });

    // add event for payment method modal close button
    $(document).on("click", ".btn-payment-complete", function () {
        // show modal
        // clear modal form
        $("#payment-user-fname").val("");
        $("#payment-user-lname").val("");
        $("#payment-user-phone").val("");
        $("#payment-user-email").val("");
        $("#payment-user-address").val("");
        // unchecked all radio button
        $(".method-row").removeClass("checked");


        // hide modal success
        $('#modal-payment-success').modal('hide');
        // make cart empty
        localStorage.removeItem("cart");
        // load page again
        onPageViewCartLoad();

    });



});

// REGION 3
function onPageViewCartLoad() {
    // get cart items from local storage
    var cartItems = JSON.parse(localStorage.getItem("cart"));

    // if cart is empty
    if (cartItems == null || cartItems.length == 0) {
        // display empty cart message
        // console.log("cart is empty");
        // empty UI products
        var vTableBody = $("tbody").html("");
        // change cart icon to grey
        $("#nav-bar-cart-icon > img").attr("src", "../images/Cardcart.png");
        getBill();
    }
    // if cart is not empty
    else {
        getBill();
        // display cart items
        displayCartItems(cartItems);
        // change cart icon to yello
        $("#nav-bar-cart-icon > img").attr("src", "../images/yellowCart.png");
    }
}

function redeemVoucher() {
    // get voucher code
    var vVoucherCode = $("#inp-voucher").val();
    if (vVoucherCode == "") {
        alert("Please enter voucher code");
        gVoucherDiscountNumber = 0;
        gVoucherId = 0;
        getBill();
    }
    else {
        // call api to get voucher discount number
        onGetVoucherDiscountNumberClick(vVoucherCode);
    }
}

function callApiToCreateOrder() {
    // check if there is voucher id valid
    if (gVoucherDiscountNumber == 0) {
        // call api to create order
        callApiToCreateOrderWithoutVoucher();
    }
    else {
        // call api to create order
        callApiToCreateOrderWithVoucher();
    }


}
// REGION 4
function callApiToCreateOrderWithVoucher() {
    var vOrderCreate = {
        firstName: "",
        lastName: "",
        // Chú ý validate email
        email: "",
        address: "",
        phone: "",
        voucherId: 0,
        // Payment method là 1 trong 3 giá trị: CreditCard - Paypal - BankTransfer
        methodPayment: "",
        details: [
        ]
    };
    // thu thap thong tin tu form
    vOrderCreate.voucherId = gVoucherId;
    thuThapThongTinTuForm(vOrderCreate);

    // validate thong tin
    var vIsValid = validateThongTin(vOrderCreate);
    // console.log(vIsValid);
    if (vIsValid) {
        // call api
        $.ajax({
            url: gBASE_URL + "/orders",
            type: "POST",
            data: JSON.stringify(vOrderCreate),
            contentType: "application/json",
            success: function (response) {
                console.log(response);
                // alert("Order created successfully");
                // clear cart
                // localStorage.removeItem("cart");
                $('#modal-payment-form').modal('hide');
                $('#modal-payment-success').modal('show');
            }
        })
    }
}

function callApiToCreateOrderWithoutVoucher() {
    var vOrderCreate = {
        firstName: "",
        lastName: "",
        // Chú ý validate email
        email: "",
        address: "",
        phone: "",
        // Payment method là 1 trong 3 giá trị: CreditCard - Paypal - BankTransfer
        methodPayment: "",
        details: [
        ]
    };
    // thu thap thong tin tu form
    thuThapThongTinTuForm(vOrderCreate);
    // validate thong tin
    var vIsValid = validateThongTin(vOrderCreate);
    // console.log(vIsValid);
    if (vIsValid) {
        // call api
        $.ajax({
            url: gBASE_URL + "/orders",
            type: "POST",
            data: JSON.stringify(vOrderCreate),
            contentType: "application/json",
            success: function (response) {
                console.log(response);
                // alert("Order created successfully");
                // clear cart
                // localStorage.removeItem("cart");
                $('#modal-payment-form').modal('hide');
                $('#modal-payment-success').modal('show');
            }
        })
    }
}
function displayCartItems(paramCartArray) {
    var vTableBody = $("tbody").html("");
    for (var i = 0; i < paramCartArray.length; i++) {
        var vProduct = paramCartArray[i];

        var vTableRow = $(`
            <!-- start a product -->
                    <tr class="border-bottom row">
                        <!-- PRODUCT -->
                        <td class="col-6 my-3">
                            <div class="row" style="margin: auto;">
                                <!-- img -->
                                <div class="col-xl-3 col-lg-12" class="cart-img"><img src="${vProduct.imageUrl}" alt="">
                                </div>
                                <!-- content -->
                                <div class="col-xl-8 col-lg-12">
                                    <div class="cart-product-name"> ${vProduct.name}</div>
                                    <div class="cart-product-description">beef patties, Iceberg lettuce, American
                                        cheese,
                                        pickles, ...</div>
                                </div>
                            </div>

                        </td>
                        <!-- PRICE -->
                        <td class="col-2 d-flex flex-column align-items-start justify-content-center cart-total-price" style="width: fit-content;">
                            $${vProduct.quantity * vProduct.price}
                        </td>
                        <!-- QTY -->
                        <td class="col-2 my-3 d-flex flex-column align-items-start justify-content-center " style=" margin: auto;">
                            <div class=" d-flex flex-column align-items-center">
                                <div class="row rounded quantity-box my-2" style="margin: auto;">
                                    <span class="cart-minus-product">-</span>
                                    <span class="cart-number-product"> ${vProduct.quantity}</span>
                                    <span class="cart-add-product">+</span>
                                </div>
                                <div class="row cart-remove-product text-center" style="margin: auto;">
                                    Remove Item
                                </div>
                            </div>
                        </td>
                        <!-- UNIT PRICE -->
                        <td class="col-2 cart-unit-price my-3 d-flex flex-column align-items-start justify-content-center">$${vProduct.price}</td>
                    </tr>
                    <!-- end a product -->
            `).appendTo(vTableBody);

    }
}

function increaseQuantity(paramAddButton) {
    // get current quantity
    var vCurrentQuantity = $(paramAddButton).siblings(".cart-number-product").text();
    // convert to number
    vCurrentQuantity = parseInt(vCurrentQuantity);
    // increase quantity
    vCurrentQuantity++;
    // update quantity
    $(paramAddButton).siblings(".cart-number-product").text(vCurrentQuantity);
    // update in the cart local storage and reload to get total price
    // get product name
    var vProductName = $(paramAddButton).parent().parent().parent().siblings().find(".cart-product-name").text().trim();
    // get cart items from local storage
    var cartItems = JSON.parse(localStorage.getItem("cart"));
    // loop through cart items
    for (var i = 0; i < cartItems.length; i++) {
        // if product name matches
        if (cartItems[i].name == vProductName) {
            // alert("match");
            // update quantity
            cartItems[i].quantity = vCurrentQuantity;
            // update cart items in local storage
            localStorage.setItem("cart", JSON.stringify(cartItems));
            break;
        }
    }
    onPageViewCartLoad();



}

function decreaseQuantity(paramMinusButton) {
    // get current quantity
    var vCurrentQuantity = $(paramMinusButton).siblings(".cart-number-product").text();
    // convert to number
    vCurrentQuantity = parseInt(vCurrentQuantity);
    // decrease quantity
    vCurrentQuantity--;
    // update quantity
    if (vCurrentQuantity < 1) {
        vCurrentQuantity = 1;
    }
    $(paramMinusButton).siblings(".cart-number-product").text(vCurrentQuantity);

    // update in the cart local storage and reload to get total price
    // get product name
    var vProductName = $(paramMinusButton).parent().parent().parent().siblings().find(".cart-product-name").text().trim();
    // get cart items from local storage
    var cartItems = JSON.parse(localStorage.getItem("cart"));
    // loop through cart items
    for (var i = 0; i < cartItems.length; i++) {
        // if product name matches
        if (cartItems[i].name == vProductName) {
            // alert("match");
            // update quantity
            cartItems[i].quantity = vCurrentQuantity;
            // update cart items in local storage
            localStorage.setItem("cart", JSON.stringify(cartItems));
            break;
        }
    }
    onPageViewCartLoad();
}

function removeProduct(paramRemoveButton) {
    // get product name
    var vProductName = $(paramRemoveButton).parent().parent().siblings().find(".cart-product-name").text();
    // get cart items from local storage
    var cartItems = JSON.parse(localStorage.getItem("cart"));
    var vCartItemName = cartItems[0].name;


    // loop through cart items
    for (var i = 0; i < cartItems.length; i++) {
        // if product name matches
        if (cartItems[i].name == vProductName.trim()) {
            // alert("found");
            // remove product from cart
            cartItems.splice(i, 1);
            // update cart items in local storage
            localStorage.setItem("cart", JSON.stringify(cartItems));
            break;
        }
    }
    onPageViewCartLoad();

}

function calculateTotalBill() {
    // get cart items from local storage
    var cartItems = JSON.parse(localStorage.getItem("cart"));
    // get total bill
    var vTotalBill = 0;
    // loop through cart items
    if (cartItems != null) {
        if (cartItems.length != 0) {
            for (var i = 0; i < cartItems.length; i++) {
                // calculate total bill
                vTotalBill += cartItems[i].quantity * cartItems[i].price;
            }
        }
    }
    return vTotalBill;

}

function callApiGetAllVoucher() {
    $.ajax({
        url: gBASE_URL + "/vouchers",
        type: "GET",
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
        }
    })
}

function onGetVoucherDiscountNumberClick(paramVoucherId) {
    var vQueryVoucherCode = {
        voucherCode: paramVoucherId.trim()
    };
    // var vDiscount = 0;
    var vSearchParams = new URLSearchParams(vQueryVoucherCode);
    $.ajax({
        url: gBASE_URL + "/vouchers" + "?" + vSearchParams.toString(),
        type: "GET",
        success: function (response) {
            if (response.length == 0) {
                alert("Voucher code is not valid");
                gVoucherDiscountNumber = 0;
                gVoucherId = 0;
                getBill();
            }
            else {
                // alert("Voucher code is valid");
                gVoucherDiscountNumber = response[0].discount;
                // get voucher id for later
                gVoucherId = response[0].id;
                getBill();
            }
            // return vDiscount;
        },
        error: function (response) {
            console.log(response);
            gVoucherDiscountNumber = 0;
            getBill();
            // return vDiscount;
        }
    });

}

function getBill() {
    var vTotalBill = calculateTotalBill();
    $("#subtotal-row").html("$" + vTotalBill);
    if (gVoucherDiscountNumber == 0) {
        $("#coupon-row").html("No");

    }
    else {
        $("#coupon-row").html(gVoucherDiscountNumber + "%");
    }
    var vFinalBill = vTotalBill + 20 - gVoucherDiscountNumber * vTotalBill / 100;
    $("#total-bill-row").html("$" + vFinalBill);
}

function thuThapThongTinTuForm(paramObjectOrder) {
    // get cart items from local storage and edit details
    var cartItems = JSON.parse(localStorage.getItem("cart"));
    for (var i = 0; i < cartItems.length; i++) {
        var vOrderDetail = {
            foodId: cartItems[i].id,
            quantity: cartItems[i].quantity
        };
        paramObjectOrder.details.push(vOrderDetail);
    }
    // get first name
    var vFirstName = $("#payment-user-fname").val();
    paramObjectOrder.firstName = vFirstName;
    // get last name
    var vLastName = $("#payment-user-lname").val();
    paramObjectOrder.lastName = vLastName;
    // get email
    var vEmail = $("#payment-user-email").val();
    paramObjectOrder.email = vEmail;
    // get phone number
    var vPhoneNumber = $("#payment-user-mobile").val();
    paramObjectOrder.phone = vPhoneNumber;
    // get address
    var vAddress = $("#payment-user-address").val();
    paramObjectOrder.address = vAddress;
    // get method payment from 3 checkbox
    var vMethodPayment = "";
    if ($("#credit-debit-method").is(":checked")) {
        vMethodPayment = "CreditCard";
    }
    else if ($("#bank-transfer-method").is(":checked")) {
        vMethodPayment = "BankTransfer";
    }
    else if ($("#paypal-method").is(":checked")) {
        vMethodPayment = "Paypal";
    }
    paramObjectOrder.methodPayment = vMethodPayment;
    // console.log(paramObjectOrder);
}

function validateThongTin(paramObjectOrder) {
    // khong duoc de trong, check box phai chon 1
    if (paramObjectOrder.firstName == "") {
        alert("First name is required");
        return false;
    }
    if (paramObjectOrder.lastName == "") {
        alert("Last name is required");
        return false;
    }
    if (paramObjectOrder.email == "") {
        alert("Email is required");
        return false;
    }
    if (paramObjectOrder.phone == "") {
        alert("Phone number is required");
        return false;
    }
    if (paramObjectOrder.address == "") {
        alert("Address is required");
        return false;
    }
    if (paramObjectOrder.methodPayment == "") {
        alert("Method payment is required");
        return false;
    }
    if (paramObjectOrder.details.length == 0) {
        alert("Please select food to proceed payment");
        return false;
    }
    return true;
}


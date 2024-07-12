const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(__dirname + "/views"));
// REGION 1
var gPerpage = 9;
// var vPagenum = 0;
var gTotalRecords = 8;
var gTotalPages = Math.ceil(gTotalRecords / gPerpage);
var gMinPrice = 0;
var gMaxPrice = 300;
var gRating = [];


// REGION 2
$(document).ready(function () {

    onPageLoad();
    // add event for the slider price range
    $("#slider-range").on("slidechange", function () {
        // alert("Slider changed");
        getNewSliderRange();
    });

    // add event for the rating sorting
    $(".check-rate input").on("change", function () {
        if ($(this).is(":checked")) {
            gRating.push($(this).val());
        }
        else {
            var vIndex = gRating.indexOf($(this).val());
            gRating.splice(vIndex, 1);
        }
        //    console.log(gRating);
        getNewRating();
    });

    // add event for the cart icon on the nav bar
    $(document).on("click", "#nav-bar-cart-icon", function (e) {
        e.preventDefault();
        console.log("Cart icon clicked");
        window.location.href = "../viewcart/viewcart.html";
    });

    // add event for the plus select button on each card
    $("#menu-cards-home").on("click", ".plus-select", function () {
       
        var vCard = $(this).closest(".card-with-id");
        addSelectionToCart(vCard);

    });
}
);
// REGION 3
function onPageLoad() {

    // Thực hiện xử lý hiển thị của trang 1
    makeCallToLoadMenuSection(1);
    makeCallToLoadSlider();
    loadCartColor();
}

function addSelectionToCart(paramCard) {
    // add quantity to object
    var vQuantity = 1;
    paramCard.data("pizzaObject").quantity = vQuantity;
    // take object card that was selected

    var vSelectionObject = paramCard.data("pizzaObject");
    console.log("Selection Object:", vSelectionObject);

    // create local storage
    var vLocalStorageArray =  JSON.parse(localStorage.getItem("cart")) || [];
    // check if item is already in cart, if yes, increase quantity
    var vIsItemInCart = false;
    var vItemInCartIndex;
    for (var bI = 0; bI < vLocalStorageArray.length; bI++) {
        var vItemInCart = vLocalStorageArray[bI];
        if (vItemInCart.id == vSelectionObject.id) {
            vIsItemInCart = true;
            vItemInCartIndex = bI;
            break;
        }
    }
    if (vIsItemInCart) {
        // increase quantity
        vLocalStorageArray[vItemInCartIndex].quantity += 1; 
    }
    else {
    vLocalStorageArray.push(vSelectionObject);
    }
    // console.log("Local Storage Array:", vLocalStorageArray);
    // save local storage
    localStorage.setItem("cart", JSON.stringify(vLocalStorageArray));
    // localStorage.setItem("cart", vLocalStorageArray));
    loadCartColor();
}

// REGION 4
function onGetOrdersPaginationClick(gPerpage, vPageIndex) {
    const vQueryParams = new URLSearchParams({
        "_limit": gPerpage,
        "_page": vPageIndex,
        'priceMin': gMinPrice,
        'priceMax': gMaxPrice
    });
    if (gRating.length > 0) {
        // use for each
        gRating.forEach(function (paramRating) {
            vQueryParams.append("rating", paramRating);
        });
    }
    $.ajax({
        type: 'get',
        url: 'https://food-ordering-fvo9.onrender.com/api/pizza?' + vQueryParams.toString(),
        dataType: 'json',
        success: function (paramData) {
            console.log(paramData);
            renderMenuDataToUI(paramData);
        },
        error: function (paramError) {
            console.log(paramError);
        }
    });
}

function renderMenuDataToUI(paramMenuPizzas) {
    var vMenuRow = $("#menu-cards-home .row:first-child");
    vMenuRow.html("");
    // console.log(paramMenuPizzas.rows.length);
    if (paramMenuPizzas.rows.length == 0) {
        vMenuRow.html("End of data..");
    }
    for (var bI = 0; bI < paramMenuPizzas.rows.length; bI++) {
        // define var
        var menuPizza = paramMenuPizzas.rows[bI];
        var menuPizzaName = menuPizza.name;
        var menuPizzaPrice = menuPizza.price;
        var menuPizzaImage = menuPizza.imageUrl;
        var menuPizzaTime = menuPizza.time;
        var menuPizzaRating = menuPizza.rating;
        var menuPizzaId = menuPizza.id;
        // console.log("yes");

        // make card


        $(`<div class="mb-4 pl-0 col-xl-4 col-lg-6 col-md-6 card-with-id " style="min-width: 0;">
                        <div class=" menu card px-0 mx-0">
                            <img src=${menuPizzaImage} alt="">
                            <!-- product card detail -->
                            <div id="product-card-detail"
                                class=" pt-3 d-flex flex-grow flex-column justify-content-start ">
                                <!-- row1 -->
                                <div class=" mx-3 mb-3 d-flex justify-content-between ">
                                    <div class="title">${menuPizzaName}</div>
                                    <div class="price">$${menuPizzaPrice}</div>
                                </div>
                                <!-- row2 -->
                                <div class=" mx-3 d-flex justify-content-between">
                                    <div class="rating-and-timing d-flex">
                                        <div class="rating mr-2">
                                            <img src="../images/blackstar.png" style="width: 12px;
                                            height: 12px; position: relative; top: -2px;" alt="">
                                            <span>${menuPizzaRating}</span>
                                        </div>
                                        <div class="timing">
                                            ${menuPizzaTime}
                                        </div>
                                    </div>
                                    <!-- add -->
                                    <div class="plus-select"><img src="../images/addbutton.png" alt="" style="width: 22px;
                                        height: 22px;"></div>
                                </div>
                            </div>
                        </div>

                    </div>
`).data("id", menuPizzaId).data("pizzaObject", menuPizza).appendTo(vMenuRow);
    }
}

function createPagination(vPageIndex) {
    // Xóa trắng phần tử cũ
    $("#page_container").html("");


    for (var bI = 1; bI < 6; bI++) {
        // Nếu là trang hiện tại thì thêm class disabled
        if (vPageIndex == bI) {
            $("#page_container").append("<div class=' disabled'><a href='javascript:void(0)' class='page-link'>" + bI + "</a></div>");
        } else {
            $("#page_container").append("<div class='' onclick='makeCallToLoadMenuSection(" + bI + ")'><a ' class='page-link'>" + bI + "</a></div>");
        }

    }

}

function makeCallToLoadMenuSection(vPagenum) {
    // Hàm tạo thanh phân trang
    createPagination(vPagenum);

    // Hàm hiển thị dữ liệu dựa vào 2 tham số phân trang
    onGetOrdersPaginationClick(gPerpage, vPagenum - 1);
    // onGetOrdersPaginationClick();
}

function makeCallToLoadSlider() {
    $("#slider-range").slider({
        range: true,
        values: [10, 30],
        min: 10,
        max: 30,
        step: 1,
        slide: function (event, ui) {
            $("#min-price").html(ui.values[0]);

            $("#max-price").html(ui.values[1]);
        }
    });
}

function getNewSliderRange() {
    gMinPrice = $("#min-price").html();
    gMaxPrice = $("#max-price").html();
    // load lại dữ liệu
    makeCallToLoadMenuSection(1);

}

function getNewRating() {
    // load lại dữ liệu
    makeCallToLoadMenuSection(1);
}


function loadCartColor(){
    console.log(JSON.parse(localStorage.getItem("cart")));
     // get cart items from local storage
     var cartItems = JSON.parse(localStorage.getItem("cart"));
    if (cartItems == null || cartItems.length == 0) {
        // change source image of cart icon
        // alert("Cart is not empty");
       
        $("#nav-bar-cart-icon >img").attr("src", "../images/Cardcart.png");
    }
    else {
        // console.log(cartItems); 
        $("#nav-bar-cart-icon > img").attr("src", "../images/yellowCart.png");

    }
}


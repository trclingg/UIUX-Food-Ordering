
// REGION 1: GLOBAL VARIABLES
var gBASE_URL = "https://64747ed27de100807b1b0fa4.mockapi.io/api/v1/";

// REGION 2: ADD EVENT LISTENERS

$(document).ready(function () {
    onPageLoad();


// add event for the plus select button on each card
$("#kitchen-cards-home").on("click", ".plus-select", function () {
    // alert("Add to cart");
    var vCard = $(this).closest(".card-with-id");
    addSelectionToCart(vCard);
    
});
// add event for the cart icon on the nav bar
$(document).on("click", "#nav-bar-cart-icon", function(e) {
    e.preventDefault();
    console.log("Cart icon clicked");
    window.location.href = "./viewcart/viewcart.html";
  });
  
});
// REGION 3: EVENTS
function onPageLoad() {
    // call Api to load menu data
    callApiToLoadMenuData();
    callApiToLoadBlogData();
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

// REGION 4: FUNCTIONS
function callApiToLoadMenuData() {
    $.ajax({
        url: gBASE_URL + "/pizza",
        type: "GET",
        success: function (response) {
            console.log(response);
            renderMenuDataToUI(response);
        },
        error: function (response) {
            console.log(response);
        }
    })
}

function callApiToLoadBlogData() {
    $.ajax({
        url: gBASE_URL + "/blogs",
        type: "GET",
        success: function (response) {
            console.log("Blog:", response);
            renderBlogsDataToUI(response);

        },
        error: function (response) {
            console.log(response);
        }
    })
}


function renderMenuDataToUI(paramMenuPizzas) {
    var vMenuRow = $("#kitchen-cards-home .row");
    vMenuRow.html("");

    for (var bI = 0; bI < paramMenuPizzas.length; bI++) {
        // define var
        var menuPizza = paramMenuPizzas[bI];
        var menuPizzaName = menuPizza.name;
        var menuPizzaPrice = menuPizza.price;
        var menuPizzaImage = menuPizza.imageUrl;
        var menuPizzaTime = menuPizza.time;
        var menuPizzaRating = menuPizza.rating;
        var menuPizzaId = menuPizza.id;
        // make card


        $(`<div class="my-2 col-xl-3 col-lg-4 col-md-6 card-with-id " style="min-width: 0;">
                        <div class=" kitchen card px-0 mx-0">
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
                                            <img src="./images/blackstar.png" style="width: 12px;
                                            height: 12px; position: relative; top: -2px;" alt="">
                                            <span>${menuPizzaRating}</span>
                                        </div>
                                        <div class="timing">
                                            ${menuPizzaTime}
                                        </div>
                                    </div>
                                    <!-- add -->
                                    <div class="plus-select"><img src="./images/addbutton.png" alt="" style="width: 20px;
                                        height: 22px;"></div>
                                </div>
                            </div>
                        </div>

                    </div>
`).data("id", menuPizzaId).data("pizzaObject", menuPizza).appendTo(vMenuRow);
    }
}

function renderBlogsDataToUI(paramBlogs) {
    var vBlogLeft = $("#blog-cards-frame .left>.row").html("");
    var vBlogMain = $("#blog-cards-frame .main>.row").html("");
    var vBlogRight = $("#blog-cards-frame .right>.row").html("");

    for (var bI = 0; bI < paramBlogs.length; bI++) {
        // define var
        var blog = paramBlogs[bI];
        var blogTitle = blog.title;
        var blogImage = blog.imageUrl;
        var blogDescription = blog.description;
        var blogId = blog.id;
        // make card
        var vCardBlog = $(`<!-- start a blog card -->
        <div class="col-12 blog card m-2">

            <div class="row" style=" margin: auto;">
                <div alt="" class="col img"></div>
                <div id="blog-card-detail" class="col-sm-6 col-md-12 py-3">
                    <div class="title">${blogTitle} </div>
                    <div class="description">${blogDescription}</div>
                </div>
            </div>
        </div>
        <!-- end a blog card -->`).data("id", blogId);
        vCardBlog.find(".img").css("background-image", `url(${blogImage})`);

        if (bI < 2) {
            vCardBlog.appendTo(vBlogLeft);
        }
        else if (bI == 2) {
            vCardBlog.appendTo(vBlogMain);
            vCardBlog.find(".blog.card").attr("id", "main-blog-card");
            vCardBlog.find(".title").attr("id", "main-blog-title");
            vCardBlog.find(".img").attr("id", "main-blog-img");
            vCardBlog.find(".description").attr("id", "main-blog-description");
            vCardBlog.appendTo(vBlogMain);
        }

        else {
            vCardBlog.find(".blog.card").addClass("col-md-5");
            vCardBlog.appendTo(vBlogRight);

        }
    }
}

function loadCartColor(){
    console.log(JSON.parse(localStorage.getItem("cart")));
     // get cart items from local storage
     var cartItems = JSON.parse(localStorage.getItem("cart"));
    if (cartItems == null || cartItems.length == 0) {
        // change source image of cart icon
        // alert("Cart is not empty");
       
        $("#nav-bar-cart-icon >img").attr("src", "./images/Cardcart.png");
    }
    else {
        // console.log(cartItems); 
        $("#nav-bar-cart-icon > img").attr("src", "./images/yellowCart.png");

    }
}

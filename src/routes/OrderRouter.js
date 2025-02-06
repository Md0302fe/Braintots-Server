// import express
const express = require("express");
// import express router
const router = express.Router();
const OrderController = require("../controllers/OrderController");

// middleware
const {
  authDetailUserMidleware,
  authMidleware,
} = require("../middleware/AuthMidleware");

// # CREATE - Order / POST
router.post("/create", OrderController.createOrder);

// # CREATE - CATEGORY FOR Order / POST
router.post("/create-category", OrderController.createCategory);

// # UPDATE - Order / POST
router.put("/update/:id", authMidleware, OrderController.updateOrder);

// # UPDATE - Order / POST
router.put("/delivering-success/:id", authMidleware, OrderController.updateDeliveringOrder);

// # GET - Order - DETAIL / GET
router.get("/details/:id", OrderController.getDetailOrder);

// # DELETE - DELETE-Order / DELETE
router.post("/cancel", OrderController.deleteOrder);

// # DELETE DELETE--MANY-TOKEN - DELETE
router.delete("/delete-many", authMidleware, OrderController.deleteManyOrder);

// # GET- All - Orders  / GET
router.post("/get-orders", OrderController.getAllOrder);

// # GET- All - Orders Admin / GET
router.post("/get-all-orders", OrderController.getAllOrders);

// # GET- All - Orders-Delivering Admin / GET
router.post("/get-delivering-orders", OrderController.getDeliveringOrders);

// # GET- All - Orders-Delivering Admin / GET
router.post("/get-success-orders", OrderController.getSuccessOrders);

// # GET-ALL - CATEGORY / GET
router.get("/get-all-category", OrderController.getAllCategory);

module.exports = router;

// File này là Order / Router dành riêng cho User
/*-------------------------------------------------------*/
// router ==> controller ==> services
// sau đó services gữi 1 json(object) ==> controller ==> return res.status(200).json(respone); controller phản hồi.

const JwtService = require("../services/JwtService");
const OrderService = require("../services/OrderService");

// Phương Thức Khởi Tạo 1 New Order
const createOrder = async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.status(500).json({
        status: "ERROR",
        message: "Thông tin đơn hàng không hợp lệ",
      });
    }
    const respone = await OrderService.createOrder(data);
    // Log ra API check ,
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      eMsg: error,
    });
  }
};

// Phương Thức Khởi Tạo 1 New Category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(200).json({
        status: "ERROR",
        message: "Tên loại hàng không hợp lệ",
      });
    }

    const respone = await OrderService.createCategory(req.body);
    // Log ra API check ,
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      eMsg: error,
    });
  }
};

// Phương Thức Update Thông Tin Của Order
const updateOrder = async (req, res) => {
  try {
    // Lấy được id Order thông qua URL (/Order-user/:id) / get = params
    const OrderId = req.params.id;
    console.log("OrderId => ", OrderId);
    if (!OrderId) {
      res.status(500).json({
        status: "ERROR",
        message: "Mã đơn đặt hàng không hợp lệ !",
      });
    }
    const respone = await OrderService.updateOrder(OrderId);
    // Log API Check
    return res.status(200).json(respone);
  } catch (error) {
    console.log("Có lỗi trong quá trình cập nhật đơn hàng : ", error);
    return res.status(404).json({
      eMsg: error,
    });
  }
};

// Phương Thức Update Thông Tin Của Order
const updateDeliveringOrder = async (req, res) => {
  try {
    // Lấy được id Order thông qua URL (/Order-user/:id) / get = params
    const OrderId = req.params.id;
    if (!OrderId) {
      res.status(500).json({
        status: "ERROR",
        message: "Mã đơn đặt hàng không hợp lệ !",
      });
    }
    const respone = await OrderService.updateDeliveringOrder(OrderId);
    // Log API Check
    return res.status(200).json(respone);
  } catch (error) {
    console.log("Có lỗi trong quá trình cập nhật đơn hàng : ", error);
    return res.status(404).json({
      eMsg: error,
    });
  }
};

// Phương Thức Get Detail User
const getDetailOrder = async (req, res) => {
  try {
    const OrderId = req.params.id;
    const respone = await OrderService.getDetailOrder(OrderId);
    // Log API Check
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      eMsg: error,
    });
  }
};

// Phương Thức Delele User
// Lấy được order_id người dùng thông qua URL (/update-user/:id) / get = params
// const OrderId = req.params.id;
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      res.status(500).json({
        status: "ERROR",
        message: "Mã đơn hàng không hợp lệ !",
      });
    }

    const respone = await OrderService.deleteOrder(orderId);
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      eMsg: error,
    });
  }
};

// Phương Thức DELETE Many
const deleteManyOrder = async (req, res) => {
  try {
    // Lấy được id người dùng thông qua URL (/update-user/:id) / get = params
    const ids = req.body;
    if (!ids) {
      res.status(200).json({
        status: "ERROR",
        message: "The Order ids is required !",
      });
    }

    const respone = await OrderService.deleteManyOrder(ids);

    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      eMsg: error,
    });
  }
};

// Phương Thức Get All Order by User Id
const getAllOrder = async (req, res) => {
  try {
    const { userId, limitPage } = req.body;
    const respone = await OrderService.getAllOrder(userId, +limitPage || 4);
    // Log API Check
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      eMsg: error,
    });
  }
};

// Phương Thức Get All Order - admin
const getAllOrders = async (req, res) => {
  try {
    const { limitPage } = req.body;
    const respone = await OrderService.getAllOrders(+limitPage || 12);
    // Log API Check
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      eMsg: error,
    });
  }
};

// Phương Thức Get All Order - admin
const getDeliveringOrders = async (req, res) => {
  try {
    const { limitPage } = req.body;
    const respone = await OrderService.getDeliveringOrders(+limitPage || 12);
    // Log API Check
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      eMsg: error,
    });
  }
};

// Phương Thức Get All Order - admin
const getSuccessOrders = async (req, res) => {
  try {
    const { limitPage } = req.body;
    const respone = await OrderService.getSuccessOrders(+limitPage || 12);
    // Log API Check
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      eMsg: error,
    });
  }
};



// Phương Thức Get All Order
const getAllCategory = async (req, res) => {
  try {
    // Lưu ý , với mỗi key query được sử dụng 2 lần thì nó sẽ có dạng array []
    const respone = await OrderService.getAllCategory();
    // Log API Check
    return res.status(200).json(respone);
  } catch (error) {
    return res.status(404).json({
      eMsg: error,
    });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getDetailOrder,
  deleteOrder,
  getAllOrder,
  deleteManyOrder,
  createCategory,
  getAllCategory,
  getAllOrders,
  getDeliveringOrders,
  updateDeliveringOrder,
  getSuccessOrders,
};

// File này nằm trong Controller / Folder điều khiển
// Controller chứa logic xử lý từng yêu cầu cụ thể, kiểm tra dữ liệu yêu cầu, và đưa ra phản hồi cho client.
// Controller nhận dữ liệu từ route, gọi service để thực hiện các thao tác cần thiết, và sau đó trả về kết quả.
// Giúp tách biệt giữa luồng điều khiển và xử lý logic phức tạp.

// req.body (sau khi có body-parse giúp trã giữ liệu về dạng json) => dữ liệu có sẳn ở dạng object

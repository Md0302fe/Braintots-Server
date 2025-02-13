const Order = require("../models/Order");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const bcrypt = require("bcryptjs");

const {} = require("../services/JwtService");

// Hàm Tạo 1 Order Mới -
const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      dataUser,
      isPaid,
      paidAt,
      isDelivered,
      deliveredAt,
      status,
    } = newOrder;

    const shippingAddress = {
      fullName: dataUser.name,
      address: dataUser.address,
      phone: dataUser.phone,
    };

    const dataRequest = {
      orderItems: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: dataUser.id,
      isPaid,
      paidAt,
      isDelivered,
      deliveredAt,
      status,
    };

    try {
      // Create Schema Order
      const createdOrder = await Order.create(dataRequest);
      console.log("createdOrder => ", createdOrder);
      if (createdOrder) {
        console.log("Đã tạo đơn thành công => ", createdOrder);
        return resolve({
          status: "OK",
          message: "Tạo đơn đặt hàng thành công",
          data: createdOrder,
        });
      } else {
        console.log("Đã xảy ra lỗi trong quá trình tạo đơn ");
      }
    } catch (error) {
      console.log("Quá trình đặt đơn hàng xảy ra lỗi => ", error);
      return resolve({
        status: "ERROR",
        message: "Hệ thống đang gặp sự cố",
      });
    }
  });
};

// Hàm Tạo 1 Category Mới
const createCategory = (newCategory) => {
  return new Promise(async (resolve, reject) => {
    const { name } = newCategory;
    try {
      const existedCategory = await Category.findOne({
        name: name,
      });

      // Nếu Existed Order tồn tại
      if (existedCategory != null) {
        console.log("existedCategory ", existedCategory.name);
        return resolve({
          status: "ERROR",
          message: `Loại Hàng ${existedCategory.name} đã tồn tại !`,
        });
      }

      // Create Schema Order
      const createdCategory = await Category.create({
        name,
      });

      if (createdCategory) {
        return resolve({
          status: "OK",
          message: "Tạo loại hàng thành công",
          data: createdCategory,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Hàm Update User
const updateOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // gọi và update user by id + data cần update , nếu muốn trả về object mới cập nhật thì cần thêm {new:true}
      const currentTimeString = new Date().toLocaleDateString();

      const updateOrder = await Order.findByIdAndUpdate(
        id,
        { status: "Đang giao", deliveredAt: currentTimeString },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updateOrder) {
        return resolve({
          status: "ERROR",
          message: `Không tìm thấy id sản phẩm !`,
        });
      }
      return resolve({
        status: "OK",
        message: "Xác nhận đơn hàng thành công",
        updateOrder,
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Hàm Update User
const updateDeliveringOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // gọi và update user by id + data cần update , nếu muốn trả về object mới cập nhật thì cần thêm {new:true}
      const currentTimeString = new Date().toLocaleString();
      const updateOrder = await Order.findByIdAndUpdate(
        id,
        { status: "Đã giao", paidAt: currentTimeString , isDelivered: true , isPaid : true },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updateOrder) {
        return resolve({
          status: "ERROR",
          message: `Không tìm thấy id sản phẩm !`,
        });
      }
      return resolve({
        status: "OK",
        message: "Xác nhận đơn hàng thành công",
        updateOrder,
      });
    } catch (error) {
      reject(error);
    }
  });
};

// // Hàm Get Detail Order
const getDetailOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await Order.findOne({
        _id: id,
      })
        .populate("orderItems.product")
        .populate("user"); // Sử dụng populate để lấy thông tin category

      if (response === null) {
        return resolve({
          status: "ERROR",
          message: "Sản phẩm không tồn tại!",
        });
      }

      // Order.type sẽ chứa thông tin của category nếu bạn dùng populate
      return resolve({
        status: "OK",
        message: `Truy cập chi tiết sản phẩm ${response._id} thành công`,
        data: response,
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Hàm Delete Order
const deleteOrder = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm Order(object) trong hệ thống thông qua (_id) / tìm id -> đợi -> dùng await
      const res = await Order.findOne({ _id: orderId });

      // Nếu Order không tồn tại trong hệ thống
      if (res === null) {
        return resolve({
          status: "ERROR",
          message: `Sản phẩm không tồn tại!`,
        });
      }

      // gọi và delete Order by id
      const deleteOrder = await Order.findByIdAndDelete(orderId);
      return resolve({
        status: "OK",
        message: "Hủy đơn hàng thành công",
      });
    } catch (error) {
      console.log("Có lỗi xảy ra trong quá trình hủy đơn hàng => ", error);
      return resolve({
        status: "ERROR",
        message: "Hủy đơn hàng thất bại",
      });
    }
  });
};

// Hàm Delete Order
const deleteManyOrder = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Delete Many Order
      await Order.deleteMany({ _id: ids });
      return resolve({
        status: "OK",
        message: "Xóa danh sách sản phẩm thành công",
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Hàm Get All Order -- Sort Sản Phẩm -- Filter Sản Phẩm
const getAllOrder = (userId, limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Chuyển userId thành ObjectId
      const objectId = new mongoose.Types.ObjectId(userId);
      // Đếm tổng số Order với userId
      const totalOrder = await Order.countDocuments({ user: objectId });
      // Tính tổng số trang
      const totalPage = Math.ceil(totalOrder / limit);

      const allOrder = await Order.find({ user: objectId })
        .limit(limit) // Giới hạn số bản ghi trên mỗi trang
        .skip(page * limit) // Bỏ qua các bản ghi của các trang trước
        .sort({ createdAt: -1 }); // Sắp xếp giảm dần theo ngày tạo

      return resolve({
        status: "OK",
        message: "Get All Order Success",
        totalItems: totalOrder,
        currentPage: page + 1,
        totalPage: totalPage,
        data: allOrder,
      });
    } catch (error) {
      console.log("Quá trình lấy thông tin order xảy ra lỗi => ", error);
      return resolve({
        status: "ERROR",
        message: "Quá trình lấy thông tin order xảy ra lỗi",
      });
    }
  });
};

// Hàm Get All Order -- Sort Sản Phẩm -- Filter Sản Phẩm
const getAllOrders = (limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Đếm tổng số Order với userId
      const totalOrder = await Order.countDocuments();
      // Tính tổng số trang
      const totalPage = Math.ceil(totalOrder / limit);

      const allOrder = await Order.find({ isDeleted: false })
        .limit(limit) // Giới hạn số bản ghi trên mỗi trang
        .skip(page * limit) // Bỏ qua các bản ghi của các trang trước
        .sort({ createdAt: -1 }); // Sắp xếp giảm dần theo ngày tạo

      return resolve({
        status: "OK",
        message: "Get All Order Success",
        totalItems: totalOrder,
        currentPage: page + 1,
        totalPage: totalPage,
        data: allOrder,
      });
    } catch (error) {
      console.log("Quá trình lấy thông tin order xảy ra lỗi => ", error);
      return resolve({
        status: "ERROR",
        message: "Quá trình lấy thông tin order xảy ra lỗi",
      });
    }
  });
};

// Hàm Get All Order -- Sort Sản Phẩm -- Filter Sản Phẩm
const getDeliveringOrders = (limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Đếm tổng số Order với userId
      const totalOrder = await Order.countDocuments();
      // Tính tổng số trang
      const totalPage = Math.ceil(totalOrder / limit);

      const allOrder = await Order.find({
        isDeleted: false,
        status: "Đang giao",
      })
        .limit(limit) // Giới hạn số bản ghi trên mỗi trang
        .skip(page * limit) // Bỏ qua các bản ghi của các trang trước
        .sort({ createdAt: -1 }); // Sắp xếp giảm dần theo ngày tạo

      return resolve({
        status: "OK",
        message: "Get All Delivering Order Success",
        totalItems: totalOrder,
        currentPage: page + 1,
        totalPage: totalPage,
        data: allOrder,
      });
    } catch (error) {
      console.log("Quá trình lấy thông tin order xảy ra lỗi => ", error);
      return resolve({
        status: "ERROR",
        message: "Quá trình lấy thông tin order xảy ra lỗi",
      });
    }
  });
};

// Hàm Get All Order -- Sort Sản Phẩm -- Filter Sản Phẩm
const getSuccessOrders = (limit, page) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Đếm tổng số Order với userId
      const totalOrder = await Order.countDocuments();
      // Tính tổng số trang
      const totalPage = Math.ceil(totalOrder / limit);

      const allOrder = await Order.find({
        isDeleted: false,
        status: "Đã giao",
      })
        .limit(limit) // Giới hạn số bản ghi trên mỗi trang
        .skip(page * limit) // Bỏ qua các bản ghi của các trang trước
        .sort({ createdAt: -1 }); // Sắp xếp giảm dần theo ngày tạo

      return resolve({
        status: "OK",
        message: "Get All Success Order Success",
        totalItems: totalOrder,
        currentPage: page + 1,
        totalPage: totalPage,
        data: allOrder,
      });
    } catch (error) {
      console.log("Quá trình lấy thông tin order xảy ra lỗi => ", error);
      return resolve({
        status: "ERROR",
        message: "Quá trình lấy thông tin order xảy ra lỗi",
      });
    }
  });
};

// Hàm Get All Order -- Sort Sản Phẩm -- Filter Sản Phẩm
const getAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Category.find();
      return resolve({
        status: "OK",
        message: "Get All Category Success",
        data: allOrder,
      });
    } catch (error) {
      reject(error);
    }
  });
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

// File services này là file dịch vụ /
// UserService này cung cấp các dịch vụ liên quan tới user.

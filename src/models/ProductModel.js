const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    masanpham: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    selled: { type: Number, default: 0 },
    description: { type: String },
  },
  {
    timestamps: true,
    // turn on virtual fields
    toJSON: {virtuals:true}, // Bật virtual fields khi chuyển đổi thành JSON
    toObject: { virtuals: true }, // Bật virtual fields khi chuyển đổi thành object
  }
);

// Virtual field to calculated price after discount
productSchema.virtual("priceAfterDiscount").get(function() {
  return this.price - ((this.price * this.discount) / 100);
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

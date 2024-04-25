const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../models/product.model");

router.post("/", async (req, res) => {
  try {
    const {
      name,
      productId,
      totalStock,
      stockLeft,
      dateOrdered,
      category,
      price,
      description,
      images,
    } = req.body;

    if (
      !name ||
      !productId ||
      !totalStock ||
      !stockLeft ||
      !dateOrdered ||
      !category ||
      !price
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProduct = new Product({
      name,
      productId,
      totalStock,
      stockLeft,
      dateOrdered,
      category,
      price,
      description,
      images,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a specific product by productId or name
router.get("/:param", async (req, res) => {
  try {
    const { param } = req.params;

    let products = await Product.find({
      isActive: true,
      $or: [
        { productId: { $regex: new RegExp(param, "i") } },
        { name: { $regex: new RegExp(param, "i") } },
      ],
    });

    if (!products.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a product by productId
router.put("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const updatedFields = req.body;

    // Find the product by productId
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product fields
    Object.keys(updatedFields).forEach((key) => {
      product[key] = updatedFields[key];
    });

    // Save the updated product
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/products/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by productId
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete the product
    await Product.findOneAndDelete({ _id: productId });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const upload = multer({ dest: "../Digi-Prescriptions Main Site/uploads" });

router.post(
  "/add-product",
  upload.single("product_image"),
  async (req, res) => {
    try {
      const {
        "Product Name": productName,
        "Product Id": productId,
        "Total Stock": totalStock,
        "Stock Left": stockLeft,
        "Date Ordered": dateOrdered,
        "Product Category": productCategory,
        "Product Price": productPrice,
        "Product Description": productDescription,
      } = req.body;

      const name = productName;
      const category = productCategory;
      const price = productPrice;
      const description = productDescription;

      if (
        !name ||
        !productId ||
        !totalStock ||
        !stockLeft ||
        !dateOrdered ||
        !category ||
        !price ||
        !description
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      let images = null;
      if (req.file) {
        images = `./uploads/${req.file.filename}`;
      }

      const newProduct = new Product({
        name: productName,
        productId,
        totalStock,
        stockLeft,
        dateOrdered,
        category,
        price,
        description,
        images,
      });

      const savedProduct = await newProduct.save();

      res.status(201).json(savedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;

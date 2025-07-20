// src/components/AddProduct.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Admin.css";

const Admin = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",        // Added category field
    suitableFor: ""      // Comma-separated values for array
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      description: form.description,
      image: form.image,
      category: form.category,
      suitableFor: form.suitableFor
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),  // Convert to array
    };

    try {
      const res = await axios.post("http://localhost:5000/products", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
      setForm({ name: "", price: "", description: "", image: "", category: "", suitableFor: "" });
    } catch (err) {
      setMessage("❌ Failed to add product");
      console.error(err);
    }
  };

  return (
    <div className="add-product-container">
      <h2>➕ Add Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        <input type="text" name="image" value={form.image} onChange={handleChange} placeholder="Image URL (optional)" />

        {/* New Category Field */}
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Vegan">Vegan</option>
        </select>

        {/* Suitable For Tags */}
        <input
          type="text"
          name="suitableFor"
          value={form.suitableFor}
          onChange={handleChange}
          placeholder="Suitable For (comma separated, e.g. Diabetic, Cancer, Jaundice)"
        />

        <button type="submit">Add Product</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default Admin;

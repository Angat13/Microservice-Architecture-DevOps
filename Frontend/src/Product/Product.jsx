import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Product.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.error("Error fetching products:", err);
        toast.error("❌ Failed to load products");
      });
  }, []);

  const handleAddToCart = async (productName) => {
    try {
      // Step 1: Place order only
      const res = await axios.post(
        "http://localhost:5002/order",
        { product: productName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`✅ ${res.data.message}`);

      // Step 2: Redirect to payment
      setTimeout(() => navigate("/pay"), 1000);
    } catch (err) {
      console.error("❌ Failed to place order:", err);
      toast.error("❌ Failed to place order");
    }
  };

  return (
    <div className="products-container">
      <h2>🛍️ Available Products</h2>
      <div className="product-grid">
        {products.map((p, i) => (
          <div key={i} className="product-card">
            <img
              src={p.image || "https://via.placeholder.com/150"}
              alt={p.name}
            />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <span>₹{p.price}</span>
            <button
              className="cart-btn"
              onClick={() => handleAddToCart(p.name)}
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;

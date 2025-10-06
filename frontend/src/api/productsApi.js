const API_URL = "http://localhost:5000/api/products";

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// API call headers with JWT
const getHeaders = () => {
  // token check
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  };
};

// GET all products
export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getHeaders(),
    });

    if (response.status === 401) {
      // token exp or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) throw new Error("Failed to fetch products");

    return await response.json();

  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// GET single product
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getHeaders(),
    });
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) throw new Error("Failed to fetch product");
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// POST create product
export const createProduct = async (productData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    if (!response.ok) throw new Error("Failed to create product");
    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// PUT update product
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    if (!response.ok) throw new Error("Failed to update product");
    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// DELETE product
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Session expired. Please login again.");
    }
    if (!response.ok) throw new Error("Failed to delete product");
    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

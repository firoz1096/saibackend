const pool = require("../db/db");

// GET all services
const getServices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// POST a new service
const createService = async (req, res) => {
  try {
    const { service_name, service_des, service_image } = req.body;

    const result = await pool.query(
      "INSERT INTO services (service_name, service_des, service_image) VALUES ($1, $2, $3) RETURNING *",
      [service_name, service_des, service_image]
    );

    res.status(201).json({ message: "Service created", data: result.rows[0] });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// PUT Update a service by ID
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, service_des, service_image } = req.body;

    const result = await pool.query(
      "UPDATE services SET service_name = $1, service_des = $2, service_image = $3 WHERE id = $4 RETURNING *",
      [service_name, service_des, service_image, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service updated", data: result.rows[0] });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// DELETE a service by ID
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM services WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted", data: result.rows[0] });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { getServices, createService, updateService, deleteService };

const pool = require("../db/db");

// GET About info
const getAboutInfo = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT description, image FROM about WHERE id = 1"
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No about info found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching About info:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// PUT Update About info (single row)
const updateAboutInfo = async (req, res) => {
  try {
    const { description, image } = req.body;

    const result = await pool.query(
      "UPDATE about SET description = $1, image = $2 WHERE id = 1 RETURNING *",
      [description, image]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No about info found to update" });
    }

    res.json({ message: "About info updated successfully", data: result.rows[0] });
  } catch (err) {
    console.error("Error updating About info:", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { getAboutInfo, updateAboutInfo };

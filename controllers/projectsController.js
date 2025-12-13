const pool = require("../db/db");

// GET all projects
const getProjects = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// POST a new project
const createProject = async (req, res) => {
  try {
    const { project_title, project_images } = req.body;

    // Ensure project_images is an array
    if (!Array.isArray(project_images)) {
      return res.status(400).json({ message: "project_images must be an array" });
    }

    const result = await pool.query(
      "INSERT INTO projects (project_title, project_images) VALUES ($1, $2) RETURNING *",
      [project_title, project_images]
    );

    res.status(201).json({ message: "Project created", data: result.rows[0] });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// PUT Update a project by ID
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { project_title, project_images } = req.body;

    // Ensure project_images is an array
    if (!Array.isArray(project_images)) {
      return res.status(400).json({ message: "project_images must be an array" });
    }

    const result = await pool.query(
      "UPDATE projects SET project_title = $1, project_images = $2 WHERE id = $3 RETURNING *",
      [project_title, project_images, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project updated", data: result.rows[0] });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Database error" });
  }
};


// DELETE a project by ID
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted", data: result.rows[0] });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Database error" });
  }
};




module.exports = { getProjects, createProject, updateProject, deleteProject };

const express = require("express");
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require("../controllers/projectsController");

// GET all projects
router.get("/", getProjects);

// POST a new project
router.post("/", createProject);

// PUT update a project by ID
router.put("/:id", updateProject);

// delete  a project by ID
router.delete("/:id", deleteProject);

module.exports = router;

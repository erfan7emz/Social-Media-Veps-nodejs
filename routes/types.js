const validateObjectId = require("../middleware/validateObjectId");
// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");
// const mongoose = require("mongoose");
const express = require("express");
const { Type, validate } = require("../models/type");
const router = express.Router();

router.get("/", async (req, res) => {
  const type = await Type.find()
    .select("-__v")
    .sort("name");
  res.send(type);
});

//[auth, admin]
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let type = new Type({ name: req.body.name });
  type = await type.save();

  res.send(type);
});

//[auth, admin]
router.delete("/:id", validateObjectId, async (req, res) => {
  const type = await Type.findByIdAndRemove(req.params.id);

  if (!type)
    return res.status(404).send("The sector with the given ID was not found.");

  res.send(type);
});

module.exports = router;
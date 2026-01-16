const Design = require("../models/Design");

// ✅ GET all designs
exports.getDesigns = async (req, res) => {
  const designs = await Design.find({ userId: req.user.id });
  res.json(designs);
};

// ✅ CREATE design
exports.createDesign = async (req, res) => {
  const { id, name, tables, relationships } = req.body;

  const design = await Design.create({
    id,
    name,
    tables,
    relationships,
    userId: req.user.id
  });

  res.status(201).json(design);
};

// ✅ UPDATE design (IMPORTANT FIX)
exports.updateDesign = async (req, res) => {
  const { name, tables, relationships } = req.body;

  const design = await Design.findOneAndUpdate(
    { id: req.params.id, userId: req.user.id }, // ✅ use `id`
    {
      name,
      tables,
      relationships
    },
    { new: true }
  );

  if (!design) {
    return res.status(404).json({ message: "Design not found" });
  }

  res.json(design);
};

// ✅ DELETE design (IMPORTANT FIX)
exports.deleteDesign = async (req, res) => {
  await Design.findOneAndDelete({
    id: req.params.id,     // ✅ use `id`
    userId: req.user.id
  });

  res.json({ message: "Design deleted" });
};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorieSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
  description: { type: String, required: true, maxLength: 150 },
});

CategorieSchema.virtual('url').get(function () {
  return `/catalog/categorie/${this.id}`;
});

module.exports = mongoose.model('Categorie', CategorieSchema);

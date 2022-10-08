const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  description: { type: String, required: true, maxLength: 150 },
  category: [{ type: Schema.Types.ObjectId, ref: 'Categorie' }],
  price: { type: Number, required: true },
  num_stock: { type: Number, required: true },
});

ItemSchema.virtual('url').get(function () {
  return `/catalog/item/${this.id}`;
});

module.exports = mongoose.model('Item', ItemSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  description: { type: String, required: true, maxLength: 150 },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  price: { type: Number, required: true },
  num_stock: { type: Number, required: true },
});

MovieSchema.virtual('url').get(function () {
  return `/catalog/movie/${this.id}`;
});

module.exports = mongoose.model('Movie', MovieSchema);

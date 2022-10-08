const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: { type: String, required: true, maxLength: 50 },
  release_date: { type: Date },
  synopsis: { type: String, required: true, maxLength: 500 },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  rate: { type: Number, required: true },
  price: { type: Number, required: true },
  num_stock: { type: Number, required: true },
});

MovieSchema.virtual('url').get(function () {
  return `/catalog/movie/${this.id}`;
});

module.exports = mongoose.model('Movie', MovieSchema);

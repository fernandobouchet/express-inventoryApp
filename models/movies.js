const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const MovieSchema = new Schema({
  title: { type: String, required: true, maxLength: 50 },
  release_date: { type: Date },
  synopsis: { type: String, required: true, maxLength: 500 },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  rate: { type: Number, required: true, max: 10, min: 0 },
  price: { type: Number, required: true },
  num_stock: { type: Number, required: true },
});

MovieSchema.virtual('url').get(function () {
  return `/catalog/movie/${this.id}`;
});

MovieSchema.virtual('release_date_formated').get(function () {
  return DateTime.fromJSDate(this.release_date).toLocaleString(
    DateTime.DATE_MED
  );
});

MovieSchema.virtual('release_date_formated_form').get(function () {
  return DateTime.fromJSDate(this.release_date).toFormat('yyyy-MM-dd');
});

module.exports = mongoose.model('Movie', MovieSchema);

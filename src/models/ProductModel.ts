import { model, Schema } from 'mongoose';

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    photo: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    weight: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model('Product', ProductSchema);

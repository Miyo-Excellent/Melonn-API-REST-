import { model, Schema } from 'mongoose';

const PromiseDateSchema: Schema = new Schema(
  {
    packMin: {
      type: Number,
      require: true,
    },
    packMax: {
      type: Number,
      require: true,
    },
    shipMin: {
      type: Number,
      require: true,
    },
    shipMax: {
      type: Number,
      require: true,
    },
    deliveryMin: {
      type: Number,
      require: true,
    },
    deliveryMax: {
      type: Number,
      require: true,
    },
    readyPickupMin: {
      type: Number,
      require: true,
    },
    readyPickupMax: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model('PromiseDate', PromiseDateSchema);

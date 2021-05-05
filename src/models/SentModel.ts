import { model, Schema } from 'mongoose';

const SentSchema: Schema = new Schema(
  {
    address: { type: String, require: true },
    city: { type: Number, require: true },
    region: { type: String, require: true },
    country: { type: String, require: true },
    shippingMethod: { type: String, require: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model('Sent', SentSchema);

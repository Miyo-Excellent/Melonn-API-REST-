import { model, Schema } from 'mongoose';

const OrderSchema: Schema = new Schema(
  {
    buyer: { ref: 'User', type: Schema.Types.ObjectId },
    description: { type: String },
    number: { type: Number, require: true, unique: true },
    products: [{ ref: 'Products', type: Schema.Types.ObjectId }],
    promiseDate: { ref: 'PromiseDate', type: Schema.Types.ObjectId },
    seller: { ref: 'Store', type: Schema.Types.ObjectId },
    sent: { ref: 'Sent', type: Schema.Types.ObjectId },
    title: { type: String, require: true },
  },
  { timestamps: true, versionKey: false },
);

export default model('Order', OrderSchema);

import { model, Schema } from 'mongoose';

const SaleSchema: Schema = new Schema(
  {
    name: String,
    order: {
      ref: 'Order',
      type: Schema.Types.ObjectId,
    },
    products: [
      {
        ref: 'Product',
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model('Sale', SaleSchema);

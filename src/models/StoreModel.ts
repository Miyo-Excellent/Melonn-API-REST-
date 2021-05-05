import { model, Schema } from 'mongoose';

const StoreSchema: Schema = new Schema(
  {
    name: { type: String, unique: true, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model('Store', StoreSchema);

import { model, Schema } from 'mongoose';

import config from 'config';

const RoleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      enum: config.database.roles,
      default: 'USER',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model('Role', RoleSchema);

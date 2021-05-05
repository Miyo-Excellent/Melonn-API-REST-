import { model, Schema } from 'mongoose';

const UserSchema: Schema = new Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    withValidationAccount: {
      type: Boolean,
      default: false,
    },
    store: { ref: 'Store', type: Schema.Types.ObjectId },
    roles: [{ ref: 'Role', type: Schema.Types.ObjectId }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default model('User', UserSchema);

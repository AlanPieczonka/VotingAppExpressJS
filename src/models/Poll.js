import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    options: [
      {
        title: {
          type: String,
          required: true,
          unique: true,
        },
        votes: {
          type: Number,
          default: 0,
          min: 0,
          max: 99,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Poll', schema);

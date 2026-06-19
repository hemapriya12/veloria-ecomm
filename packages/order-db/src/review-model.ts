import mongoose, { InferSchemaType, model } from "mongoose";
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    productId:   { type: Number, required: true },
    productName: { type: String, default: "" },
    userId:      { type: String, required: true },
    userName:    { type: String, required: true },
    rating:      { type: Number, required: true, min: 1, max: 5 },
    comment:     { type: String, required: true },
  },
  { timestamps: true }
);

export type ReviewSchemaType = InferSchemaType<typeof ReviewSchema>;
export const Review = model<ReviewSchemaType>("Review", ReviewSchema);

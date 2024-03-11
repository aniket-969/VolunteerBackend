import mongoose, { Schema } from "mongoose";

const opportunityCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String, 
      required: true,
      
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const OpportunityCategory = mongoose.model(
  "OpportunityCategory",
  opportunityCategorySchema
);

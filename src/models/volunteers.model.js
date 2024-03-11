import mongoose, { Schema } from "mongoose";
import { User } from "../models/user.model.js";

const eventModel = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      country: String,
      county: String,
      road: String,
      state: String,
      village: String,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["Volunteer", "Organization"],
      required: true,
    },
    skills: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skills",
    },
    expiresAt: {
      type: Date,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OpportunityCategory",
    },
  },
  {
    timestamps: true,
  }
);

eventModel.pre("save", async function (next) {
  try {
    const user = await User.findById(this.createdBy);
    if (user.fullName === "Guest23@#$"){
      this.expiresAt = user.expiresAt;
    }
       
    next(); 
  } catch (error) {
    next(error); 
  }
});

eventModel.index({ location: "2dsphere" });

eventModel.index({ role: 1 });

eventModel.index({ startDate: 1 });

export const VolunteerOpportunity = mongoose.model(
  "VolunteerOpportunity",
  eventModel
);

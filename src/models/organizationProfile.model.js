import mongoose, { Schema } from "mongoose";

const organizationProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  description: {
    type: String,
  },
  
});

export const OrganizationProfile = mongoose.model('OrganizationProfile', organizationProfileSchema);

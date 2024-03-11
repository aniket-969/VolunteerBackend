import mongoose, { Schema } from "mongoose";

const volunteerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  skills: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skills',
  },
  
});
export const VolunteerProfile = mongoose.model('VolunteerProfile', volunteerProfileSchema);

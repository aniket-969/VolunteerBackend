import mongoose,{Schema} from "mongoose";

const skillSchema = new mongoose.Schema(
    {
        skillName: {
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
)
export const Skills = mongoose.model(
    "Skills", 
    skillSchema
  );
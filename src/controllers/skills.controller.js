import { Skills } from "../models/skills.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const skillForm = asyncHandler(async(req,res)=>{
    const {skillName,description} = req.body;
    console.log(req.body);
    
//     console.log('lfsdfs fdfdf');
    
//     console.log(req.body);
     
// console.log('reached here');
 
    if (  
        [skillName,description].some(
          (field) => field?.trim() === ""
        )
      ) {
        throw new ApiError(400, "All fields are required");
      }

      console.log(req.body);

      const skillData = await Skills.create({
        skillName,
        description
      })

      
  return res
  .status(201)
  .json(
    new ApiResponse(
      200,
      skillData,
      "Skill form submitted successfully"
    )
  );
}) 
export {skillForm}
import {OpportunityCategory} from "../models/opportunityCategory.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const OpportunityCategoryForm = asyncHandler(async(req,res)=>{

    const {categoryName,description} = req.body

    if (  
        [categoryName,description].some(
          (field) => field?.trim() === ""
        )
      ) {
        throw new ApiError(400, "All fields are required");
      }

      console.log(req.body);

      const OpportunityCategoryData = await OpportunityCategory.create({
        categoryName,
        description
      })

      
  return res
  .status(201)
  .json(
    new ApiResponse(
      200,
      OpportunityCategoryData,
      "Category form submitted successfully"
    )
  );
})
export {OpportunityCategoryForm}
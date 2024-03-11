import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { VolunteerProfile } from "./../models/volunteerProfile.model.js";

const VolunteerProfileForm = asyncHandler(async (req, res) => {
  const userId = req.body.user._id;
  const { skillId } = req.body;
  console.log(skillId, userId);
  const volunteerProfileData = await VolunteerProfile.create({
    user: userId,
    skills: skillId,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        volunteerProfileData,
        "Volunteer profile submitted successfully"
      )
    );
});

export { VolunteerProfileForm };

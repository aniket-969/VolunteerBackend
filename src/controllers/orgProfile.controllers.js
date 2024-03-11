import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OrganizationProfile } from "./../models/organizationProfile.model.js";

const OrganizationProfileForm = asyncHandler(async (req, res) => {
  const { description } = req.body;
  const userId = req.body.user._id;

  const organizationProfileData = await OrganizationProfile.create({
    user: userId,
    description,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        organizationProfileData,
        "Organization profile submitted successfully"
      )
    );
});

export { OrganizationProfileForm };

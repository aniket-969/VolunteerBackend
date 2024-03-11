import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { VolunteerOpportunity } from "./../models/volunteers.model.js";

const volunteerForm = asyncHandler(async (req, res) => {
  const {
    title,
    latitude,
    longitude,
    description,
    contactEmail,
    contactPhone,
    startDate,
    endDate,
    role,
    country,
    county,
    road,
    state,
    village,
    skills,
    category,
    createdBy,
  } = req.body;

  console.log(req.body);

  if (
    [title, description, contactEmail, startDate, endDate, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  console.log(req.files);
  const volunteerLocalPaths = req.files?.avatar?.map((file) => file.path);
  // const volunteerLocalPaths = req.files?.avatar[0]?.path

  if (!volunteerLocalPaths || volunteerLocalPaths.length === 0) {
    throw new ApiError(400, "At least one volunteer local file is required");
  }

  const avatar = await Promise.all(
    volunteerLocalPaths.map((path) => uploadOnCloudinary(path))
  );
  console.log("This is avatar here 37", avatar);

  // const avatar = await uploadOnCloudinary(volunteerLocalPaths)

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const imageUrls = avatar.map((image) => image.url);
  console.log(imageUrls);

  const VolunteerData = await VolunteerOpportunity.create({
    title,
    description,
    location: {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
      country,
      county,
      road,
      state,
      village,
    },
    contactEmail,
    contactPhone,
    startDate,
    endDate,
    images: imageUrls,
    role,
    skills,
    category,
    createdBy,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        VolunteerData,
        "Volunteer form submitted successfully"
      )
    );
});

const getAllVolunteers = asyncHandler(async (req, res) => {
  try {
    const allVolunteers = await VolunteerOpportunity.find()
      .populate("createdBy", "username fullName").populate("category", "categoryName description").populate("skills", "skillName description").exec();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allVolunteers,
          "All volunteers fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching all volunteers:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Internal Server Error:unable to fetch user")
      );
  }
});

const getUserVolunteerData = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  try {
    const userData = await VolunteerOpportunity.find({ createdBy: userId })
      .populate("createdBy", "username fullName")
      .populate("skills", "skillName description");

    if (!userData || userData.length == 0) {
      return res.json({
        message: "No volunteer opportunities found for the user",
      });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching volunteer opportunities:", error);
    res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});

const getNearestData = asyncHandler(async (req, res) => {
  try {
    const { latitude, longitude } = req.params;
    console.log("Latitude:", parseFloat(latitude));
    console.log("Longitude:", parseFloat(longitude));
    const nearestVolunteerOpportunities = await VolunteerOpportunity.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
        },
      },
    })
      .populate("createdBy", "username fullName")
      .populate("skills", "skillName description").populate("category", "categoryName description")
      .exec();

    console.log(nearestVolunteerOpportunities);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          nearestVolunteerOpportunities,
          "Nearest volunteer opportunities retrieved successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching nearest volunteer opportunities:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Internal Server Error: Unable to retrieve nearest volunteer opportunities"
        )
      );
  }
});

const getPostData = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(postId);

    const postData = await VolunteerOpportunity.findOne({ _id: postId })
      .populate("createdBy", "username fullName")
      .populate("skills", "skillName description").populate("category", "categoryName description").exec();

    console.log(postData);

    return res
      .status(200)
      .json(
        new ApiResponse(200, postData, "Post details retrieved successfully")
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Internal Server Error: Unable to retrieve nearest volunteer opportunities"
        )
      );
  }
});

const getVolunteerDataBySkill = asyncHandler(async (req, res) => {
  const skillName = req.query.skillName;
  console.log(skillName);
  const opportunities = await VolunteerOpportunity.find()
    .populate("skills", "skillName description")
    .populate("createdBy", "username fullName").populate("category", "categoryName description").exec();

  if (!opportunities) {
    throw new ApiError(400, "There was problem retrieving volunteer data");
  }
  const volData = opportunities.filter(
    (opportunity) =>
      opportunity.skills && opportunity.skills.skillName === skillName
  );

  console.log(volData);

  if (!volData) {
    throw new ApiError(400, "There was a problem fetching volunteer data");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, volData, "Data retrieved successfully"));
});
 
const getVolunteerDataByDate = asyncHandler(async (req, res) => {
  const opportunities = await VolunteerOpportunity.find()
    .sort({ createdAt: -1 })
    .populate("skills", "skillName description")
    .populate("createdBy", "username fullName").populate("category", "categoryName description").exec();

  if (!opportunities) {
    throw new ApiError(400, "There was a problem retrieving volunteer data");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, opportunities, "Data retrieved successfully"));
});

const getOrganisationCategoryData = asyncHandler(async (req, res) => {
  const oppName = req.query.oppName;
  console.log(oppName);
  const opportunities = await VolunteerOpportunity.find()
    .populate("category", "categoryName description")
    .populate("createdBy", "username fullName").exec();
  console.log(opportunities);

  if (!opportunities) {
    throw new ApiError(400, "There was problem retrieving volunteer data");
  }
  const volData = opportunities.filter(
    (opportunity) =>
      opportunity.category && opportunity.category.categoryName === oppName
  );

  console.log(volData);

  if (!volData) {
    throw new ApiError(400, "There was a problem fetching volunteer data");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, volData, "Data retrieved successfully"));
});

const getVolunteerDataOnly = asyncHandler(async (req, res) => {
  const volunteerData = await VolunteerOpportunity.find({
    role: "Volunteer",
  }).populate("skills", "skillName description")
  .populate("createdBy", "username fullName").exec();

  if (!volunteerData) {
    throw new ApiError(400, "There was a problem fetching volunteer data");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, volunteerData, "Data retrieved successfully"));
});

const getOpportunityDataOnly = asyncHandler(async (req, res) => {
  const oppData = await VolunteerOpportunity.find({
    role: "Organization",
  }).populate("createdBy", "username fullName").populate("category", "categoryName description").exec();

  if (!oppData) {
    throw new ApiError(400, "There was a problem fetching volunteer data");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, oppData, "Data retrieved successfully"));
});
 
const deleteVolunteerData = asyncHandler(async (req, res) => {
  const deletedVolunteer = await VolunteerOpportunity.findByIdAndDelete(req.params.id);
  if (!deletedVolunteer) {
    return res.status(404).json({ message: "Volunteer not found" });
  }
  res.json({ message: "Volunteer deleted successfully" });
});

export {
  volunteerForm,
  getAllVolunteers,
  getUserVolunteerData,
  getNearestData,
  getPostData,
  getVolunteerDataBySkill,
  getVolunteerDataByDate,
  getOrganisationCategoryData,
  getOpportunityDataOnly,
  getVolunteerDataOnly,
  deleteVolunteerData
};

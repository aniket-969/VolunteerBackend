import { Router } from "express";
import {
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  refreshTokens
} from "../controllers/user.controller.js";
import { upload } from "./../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVolunteerData,
  getAllVolunteers,
  getNearestData,
  getOpportunityDataOnly,
  getOrganisationCategoryData,
  getPostData,
  getUserVolunteerData,
  getVolunteerDataByDate,
  getVolunteerDataBySkill,
  getVolunteerDataOnly,
  volunteerForm,
} from "../controllers/volunteer.controller.js";
import { skillForm } from "../controllers/skills.controller.js";
import { OpportunityCategoryForm } from "../controllers/organisation.controller.js";
import { OrganizationProfileForm } from "../controllers/orgProfile.controllers.js";
import { VolunteerProfileForm } from "../controllers/volunteerProfile.controller.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshTokens").post(refreshTokens)

router.route("/user").get(getUserDetails);

router.route("/volunteer-form").post(
  upload.fields([
    {
      name: "avatar",
    },
  ]),
  volunteerForm
);
  
router.route("/volunteers").get(getAllVolunteers);

router.route("/volunteer/:userId").get(getUserVolunteerData);

router.route("/volunteer/post/:postId").get(getPostData);

router.route("/volunteer/location/:latitude/:longitude").get(getNearestData);

router.route("/skillData").get(getVolunteerDataBySkill);

router.route("/latestData").get(getVolunteerDataByDate);

router.route("/opportunityData").get(getOrganisationCategoryData);

router.route("/opportunityDataOnly").get(getOpportunityDataOnly);
router.route("/volunteerDataOnly").get(getVolunteerDataOnly);

router.route("/skill-form").post(upload.none(), skillForm);

router
  .route("/opportunity-category")
  .post(upload.none(), OpportunityCategoryForm);

router.route("/organization-profile").post(OrganizationProfileForm);

router.route("/volunteer-profile").post(VolunteerProfileForm);

router.delete('/volunteers/:id',deleteVolunteerData)

export default router;

import express from "express";
import {
  createPlan,
  createPlanFeature,
  getPlanFeatures,
  getPlans,
} from "../controller/plan.controller";

const router = express.Router();

router.route("/").get(getPlans).post(createPlan);
router.route("/features").get(getPlanFeatures).post(createPlanFeature);

export default router;

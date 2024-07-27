const userModel = require("../models/userModel");
const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");
const { combineSlices } = require("@reduxjs/toolkit");

const invertoryController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    //validation
    if (!user) {
      throw new Error("User not found");
    }
    // if (InventoryType === "in" && user.role === "hospital") {
    //   throw new Error("Invaild role and Invertory type");
    // }
    // if (InventoryType === "out" && user.role === "donar") {
    //   throw new Error("Invaild role and Invertory type");
    // }

    if (req.body.InventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroups;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quanitity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            InventoryType: "in",
            bloodGroups: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroups",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("Total In", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      //calculate OUT Blood Quanitity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            InventoryType: "out",
            bloodGroups: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroups",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in & Out Calc
      const availableQuanityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available `,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }

    //save inventory
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(200).send({
      success: true,
      message: "Inventory created successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "unable to crate Invertory",
      error,
    });
  }
};

//get all blood records controller
const getInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error,
    });
  }
};
//geting recent top 3 transactions from database
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent Invenotry Data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Recent Inventory API",
      error,
    });
  }
};
//get all hospital blood records controller
const getHospitalInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get hospital comsumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get consumer Inventory",
      error,
    });
  }
};

//get doners list from database
const getDonarsController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    // get donar
    const donarId = await inventoryModel.distinct("donar", {
      organisation,
    });
    // console.log(donarId);
    const donars = await userModel.find({ _id: { $in: donarId } });
    return res.status(200).send({
      success: true,
      message: "donar Fetched successfully",
      donars,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "unable to Get doanrs data from database",
      error,
    });
  }
};

//get hospital list from database
const getHospitalsController = async (req, res) => {
  try {
    //get organisation id
    const organisation = req.body.userId;
    //get the hospital id
    const hospitalId = await inventoryModel.distinct("hospital");
    //get hospitals
    const hospitals = await userModel.find({ _id: { $in: hospitalId } });
    return res.status(200).send({
      success: true,
      message: "hospital Fetched successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "unable to Get hospitals data from database",
      error,
    });
  }
};
const getOrganisationController = async (req, res) => {
  try {
    //get the donar id
    // const org = req.body.userId;

    const orgId = await inventoryModel.distinct("organisation");

    //find the organisation
    const organisations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      success: true,
      message: "organisation Fetched successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "unable to Get orgnisation data from database",
      error,
    });
  }
};

const getOrganisationForHospitalController = async (req, res) => {
  try {
    //get the donar id
    const hospital = req.body.userId;

    const orgId = await inventoryModel.distinct("organisation");

    //find the organisation
    const organisations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      success: true,
      message: "organisation Fetched successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "unable to Get orgnisation data from database",
      error,
    });
  }
};

module.exports = {
  invertoryController,
  getInventory,
  getDonarsController,
  getHospitalsController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getHospitalInventory,
  getRecentInventoryController,
};

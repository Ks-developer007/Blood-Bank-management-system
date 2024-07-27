const inventoryModel = require("../models/inventoryModel");
const mongoose = require("mongoose");

const BloodGroupDetailsControlles = async (req, res) => {
  try {
    const BloodGroup = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
    const BloodgroupsData = [];
    const organisation = new mongoose.Types.ObjectId(req.body.userId);
    //get Single Blood Groups
    await Promise.all(
      BloodGroup.map(async (bloodGroups) => {
        //COunt TOTAL IN
        const totalIn = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroups: bloodGroups,
              InventoryType: "in",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //COunt TOTAL OUT
        const totalOut = await inventoryModel.aggregate([
          {
            $match: {
              bloodGroups: bloodGroups,
              InventoryType: "out",
              organisation,
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$quantity" },
            },
          },
        ]);
        //CALCULATE TOTAL
        const availabeBlood =
          (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

        //PUSH DATA
        BloodgroupsData.push({
          bloodGroups,
          totalIn: totalIn[0]?.total || 0,
          totalOut: totalOut[0]?.total || 0,
          availabeBlood,
        });
      })
    );
    return res.status(200).send({
      success: true,
      message: "Blood deatils get Successfully",
      BloodgroupsData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Cannot get blood groups from API",
      error,
    });
  }
};
module.exports = { BloodGroupDetailsControlles };

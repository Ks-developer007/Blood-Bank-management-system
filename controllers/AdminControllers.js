const userModel = require("../models/userModel");

const getDonarListController = async (req, res) => {
  try {
    const donarList = await userModel
      .find({ role: "user" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Donar List get success",
      TotalCount: donarList.length,
      donarList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error getting donar list",
    });
  }
};

const getHospitalListController = async (req, res) => {
  try {
    const hospitalList = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "hospital List get success",
      TotalCount: hospitalList.length,
      hospitalList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error getting hospital list",
    });
  }
};

const getOrgListController = async (req, res) => {
  try {
    const orgList = await userModel
      .find({ role: "organisation" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "organisation List get success",
      TotalCount: orgList.length,
      orgList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error getting organisation list",
    });
  }
};

//DELETE function controller
const deleteListController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Data deleted successfully from database",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "cannot detele donar list",
    });
  }
};
module.exports = {
  getDonarListController,
  getHospitalListController,
  getOrgListController,
  deleteListController,
};

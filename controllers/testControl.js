const testControllers = (req,res)=>{
    res.status(200).json({
        massage:"welcome user ",
        success:true,
    })
    }

module.exports = {testControllers}
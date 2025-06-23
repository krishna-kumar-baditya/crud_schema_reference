const mongoose = require('mongoose')

const UserDetailsSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId,ref : 'user'},
    address: { type: String, required: true },
    bloodGroup: { type: String, required: true,default: '' },
    isDeleted : {type : Boolean,default:false}
},{
    versionKey : false,
    timestamps : true
})
const UserDetailsModel = new mongoose.model('userdetails',UserDetailsSchema)
module.exports = UserDetailsModel
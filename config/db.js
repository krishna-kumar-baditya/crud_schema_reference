const mongoose = require('mongoose')
class ConnectDB{
    async dbConnection(){
        try {
            await mongoose.connect(process?.env?.MONGODB_URL)
            console.log('Databse connected successfully');
            
        } catch (error) {
            console.log(`database failed to connect : ${error.message}`);
            
        }
    }
}
module.exports = new ConnectDB()
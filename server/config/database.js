import mongoose from "mongoose"

const connectDatabase = async () => {
    try{
        // mongoose.connection.on("connected", () => console.log("Database connected"));
        await mongoose.connect(process.env.DB_URI).then((data) => {
            console.log(`mongodb connected with server: ${data.connection.host}`)
        })

    }catch(error){
        console.log(error.message)
    }
}

export default connectDatabase
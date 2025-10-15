import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already Connected to database");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
          
        // ek bar db ko console log kreke dekhna h
        // aur ek bar db.connections ko bi console log kakre dekhna h

        connection.isConnected = db.connections[0].readyState

        console.log("succelyfully connected to db");
    } catch (error) {
        console.log("database connection failed", error);
        process.exit(1);
    }

}

export default dbConnect;
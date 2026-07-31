import mongoose from 'mongoose';

export async function connect() {
    try {
        // Check if a connection already exists
        if (mongoose.connections && mongoose.connections[0].readyState !== 1) {
            // If not connected, create a new connection
            await mongoose.connect(process.env.MONGO_URI);
            const connection = mongoose.connection;

            connection.on('connected', () => {
                console.log('MongoDB connected successfully');
            });

            connection.on('error', (err) => {
                console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
                process.exit();
            });
        } else {
            console.log('MongoDB is already connected');
        }

    } catch (error) {
        console.log('Something went wrong!');
        console.log(error);
    }
}


export const BASE_URL = '';

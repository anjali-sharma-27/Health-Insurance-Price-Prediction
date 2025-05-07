import axios from 'axios';
import { PredictionSchema } from '../modals/prediction.model.js';
import User from '../modals/user.models.js';

export const prediction = async (req, res) => {
    try {
        const userInput = req.body;
        const userId = req?.params?.userId;

        console.log(userId,"userIDDDDDD")

        const existingUser = await User.findById(userId).select("-password");
        console.log(existingUser,"existingUserrrrrrrrrrrrrrr")
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Call the Flask prediction API
        const flaskResponse = await axios.post("http://localhost:5001/", userInput);
        // make sure Flask runs on 5001 or change accordingly

        console.log(flaskResponse.data,"flaskResponseeeee");
        if (!flaskResponse.data.predicted_price) {
            return res.status(500).json({ error: "Failed to get valid prediction from Flask" });
        }

        const predicted_price = flaskResponse.data.predicted_price;

        console.log({
            userId: userId,
            username: existingUser.username,
            email: existingUser.email,
            ...userInput,
            predicted_price,
        },"recordddddddddddddd")
        // Save to MongoDB
        const record = new PredictionSchema({
            userId: userId,
            username: existingUser.username,
            email: existingUser.email,
            ...userInput,
            predicted_price,
        });
        await record.save();

        res.status(200).json({ predicted_price });
    } catch (error) {
        console.error("Error in /predict:", error.message);
        res.status(500).json({ error: error.message|| "Prediction failed" });
    }
}

export const getPredictionsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const predictions = await PredictionSchema.find({ userId }).sort({ createdAt: -1 });

        if (!predictions.length) {
            return res.status(404).json({ message: "No predictions found for this user." });
        }

        res.status(200).json(predictions);
    } catch (error) {
        console.error("Error fetching predictions by userId:", error.message);
        res.status(500).json({ error: "Failed to fetch user predictions" });
    }
};
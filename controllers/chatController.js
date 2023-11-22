// Import the necessary modules
const Chat = require("../models/chatModel");
const mongoose = require("mongoose");
const CustomError = require("../utils/customError");
const generateResponse = require("../utils/generateResponse");

// Define a function to get players in chat
exports.getPlayersInChat = async (req, res, next) => {
    // Get the current user ID from the request query string
    const userId = req.query.userId;
    try {
        // Get the player list from the database
        const players = await Chat.aggregate([
            {
                // Stage 1: Filter out chat messages where either the sender or receiver is the current user
                $match: {
                    $or: [
                        {
                            sender: new mongoose.Types.ObjectId(userId),
                        },
                        {
                            receiver: new mongoose.Types.ObjectId(userId),
                        },
                    ],
                },
            },
            {
                // Stage 2: Sort the messages by timestamp in descending order to let the $first operator in the $group stage know which message is the most recent one
                $sort: {
                    timestamp: -1,
                },
            },
            {
                // Stage 3: Group the messages by the other user in each chat to get a list of all "players" that the user has chatted with, along with their latest message and its timestamp
                $group: {
                    _id: {
                        // Use the first non-current-user ID in each group as the group ID
                        // Note: The $$i variable represents each element in the input array during the $filter operation. In this case, it represents either the sender or receiver field in each document
                        $first: {
                            $filter: {
                                input: ["$sender", "$receiver"],
                                as: "i",
                                cond: {
                                    // Condition for filtering: ID is not equal to current user's ID
                                    $ne: ["$$i", new mongoose.Types.ObjectId(userId)],
                                },
                            },
                        },
                    },
                    // Include the most recent message and its timestamp in each group
                    latestMessage: {
                        $first: "$message",
                    },
                    timestamp: {
                        $first: "$timestamp",
                    },
                },
            },
            {
                // Stage 4: Sort the groups by the timestamp of their latest message in descending order to output list of "players" to be ordered by the recency of chats
                $sort: {
                    timestamp: -1,
                },
            },
            {
                // Stage 5: Perform a left outer join with the "users" collection to get user data for each group to retrieve information about each "player" from the "users" collection
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            // Only include necessary fields from user documents
                            $project: {
                                name: 1,
                                email: 1,
                                online: 1,
                            },
                        },
                    ],
                },
            },
            {
                // Stage 6: Deconstruct the "user" array field in each document to output a document for each element (replacing the "user" array with a single user document)
                $unwind: {
                    path: "$user",
                },
            },
            {
                // Stage 7: Get the output documents with a flat structure with these fields as top-level fields
                $project: {
                    _id: 1,
                    latestMessage: 1,
                    timestamp: 1,
                    name: "$user.name",
                    email: "$user.email",
                    online: "$user.online",
                },
            },
        ]);
        // Use generateResponse to send a success response with the players array
        generateResponse(res, 200, "Players retrieved successfully.", players);
    } catch (error) {
        console.error("Error getting player list:", error);
        // Pass the error to the error handling middleware
        next(new CustomError("Internal server error", 500));
    }
};

// Define a function to get chat history
exports.getChatHistory = async (req, res, next) => {
    // Get the sender ID and receiver ID and skip value from the request query string
    const { senderId, receiverId, skip } = req.query;

    const limit = 10;
    try {
        // Get the messages from the database
        const messages = await Chat.aggregate([
            {
                $match: {
                    $or: [
                        {
                            sender: new mongoose.Types.ObjectId(senderId),
                            receiver: new mongoose.Types.ObjectId(receiverId),
                        },
                        {
                            sender: new mongoose.Types.ObjectId(receiverId),
                            receiver: new mongoose.Types.ObjectId(senderId),
                        },
                    ],
                },
            },
            {
                $sort: {
                    timestamp: -1,
                },
            },
            {
                $skip: Number(skip),
            },
            {
                $limit: limit,
            },
            {
                $sort: {
                    timestamp: 1,
                },
            },
        ]);
        // Use generateResponse to send a success response with the messages array
        generateResponse(res, 200, "Messages retrieved successfully.", messages);
    } catch (error) {
        console.error("Error getting chat history:", error);
        // Pass the error to the error handling middleware
        next(new CustomError("Internal server error", 500));
    }
};

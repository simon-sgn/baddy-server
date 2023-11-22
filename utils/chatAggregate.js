// Import necessary modules
const Chat = require("../models/chatModel");
const mongoose = require("mongoose");

// Define a function to get a list of _ids of the players that the user has chatted with
const chatAggregate = async (userId) => {
    try {
        // Use MongoDB's aggregation framework to group chat messages
        return Chat.aggregate([
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
                // Stage 2: Group the messages by the other user in each chat
                $group: {
                    _id: {
                        // Use the first non-current-user ID in each group as the group ID
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
                },
            },
        ]);
    } catch (error) {
        console.error("Error occurred while aggregating chats:", error);
    }
};

module.exports = chatAggregate;

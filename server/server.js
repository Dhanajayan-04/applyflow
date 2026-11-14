require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`ApplyFlow server running on port ${PORT}`);
    });
};

startServer();
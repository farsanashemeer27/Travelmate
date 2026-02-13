const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// API to handle trip planning
app.post("/plan-trip", (req, res) => {

    const { destination, startDate, endDate, travelers, budget, style } = req.body;

    if (!destination || !startDate || !endDate || !travelers || !budget) {
        return res.json({ message: "Please fill all fields." });
    }

    let suggestion = "";

    if (style === "Adventure") {
        suggestion = `Explore trekking and outdoor activities in ${destination}.`;
    } else if (style === "Relaxation") {
        suggestion = `Enjoy peaceful and scenic places in ${destination}.`;
    } else if (style === "Family") {
        suggestion = `Visit family-friendly attractions in ${destination}.`;
    } else {
        suggestion = `Discover amazing spots in ${destination}.`;
    }

    const tripRecord = {
        destination,
        startDate,
        endDate,
        travelers,
        budget,
        style,
        createdAt: new Date()
    };

    const filePath = path.join(__dirname, "trips.json");

    let trips = [];

    if (fs.existsSync(filePath)) {
        trips = JSON.parse(fs.readFileSync(filePath));
    }

    trips.push(tripRecord);

    fs.writeFileSync(filePath, JSON.stringify(trips, null, 2));

    res.json({
        message: `Trip planned successfully! ${suggestion}`
    });

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
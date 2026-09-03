require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./Config/db'); // adjust path if needed
const userRoutes = require('./Routes/userroutes'); // adjust path if needed
const loginRoutes = require('./Routes/loginroutes'); // adjust path if needed
const teamRoutes = require('./Routes/teamroutes'); // adjust path if needed
const playerRoutes = require('./Routes/playerroutes'); // adjust path if needed

const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/users/reg", userRoutes); // Use the user routes
app.use("/users/log", loginRoutes); // Use the login routes
app.use("/teams", teamRoutes); // Use the team routes
app.use("/players", playerRoutes); // Use the player routes

// Connect to DB first, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    
  });
});

// routes
app.get('/', (req, res) => {
  res.send('API is running');
});
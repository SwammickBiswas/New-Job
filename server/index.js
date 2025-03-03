const express = require('express');
const cors = require('cors');
const app = express();

// Use CORS middleware
app.use(cors({
  origin: 'https://job-portal-new-ruddy.vercel.app', // Allow this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
}));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

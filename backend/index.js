const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
const rootPath = path.resolve()

mongoose.connect(process.env.MONGO_URI, {

})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.use(express.static(path.join(rootPath, 'everststar', 'dist')));

// Fallback route — catch anything not handled above
app.use((req, res, next) => {
  res.sendFile(path.join(rootPath, 'everststar', 'dist', 'index.html'));
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

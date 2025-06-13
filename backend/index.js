const express = require('express')
const cors = require('cors')
const app = express()

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes')
const groupRoutes = require('./routes/groupRoutes');
const liabilityRoutes = require('./routes/liabilityRoutes');

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/liabilities', liabilityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
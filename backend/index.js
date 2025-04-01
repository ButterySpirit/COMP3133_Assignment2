const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const uploadRoutes = require('./routes/upload'); // 👈 import your new upload route

const app = express();

// 🌐 Middleware
app.use(cors()); // 👈 fix CORS issues like image upload
app.use(express.json());

// 📂 Serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🛣️ Mount upload routes
app.use(uploadRoutes); // 👈 this handles /upload POST

// 🛢️ Connect to MongoDB
connectDB();

// 🚀 Start Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.start().then(() => {
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
});

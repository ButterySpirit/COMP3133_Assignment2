const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const resolvers = {
  Query: {
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          console.error(`❌ No user found with email: ${email}`);
          throw new Error("Invalid credentials");
        }

        console.log(`✅ User found: ${user.email}`);
        console.log(`🔍 Stored Password Hash: ${user.password}`);
        console.log(`🔑 Entered Password: ${password}`);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`🔍 Password Match Result: ${isMatch}`);

        if (!isMatch) {
          console.error(`❌ Incorrect password for ${email}`);
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          token: generateToken(user),
        };
      } catch (error) {
        console.error("❌ Login error:", error.message);
        throw new Error("Login failed. Please check your email and password.");
      }
    },

    getEmployees: async () => {
      try {
        return await Employee.find();
      } catch (error) {
        console.error("❌ Error fetching employees:", error.message);
        throw new Error("Failed to fetch employees.");
      }
    },

    getEmployeeById: async (_, { id }) => {
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          console.error(`❌ Employee with ID ${id} not found.`);
          throw new Error("Employee not found");
        }
        return employee;
      } catch (error) {
        console.error("❌ Error fetching employee:", error.message);
        throw new Error("Failed to fetch employee.");
      }
    },

    searchEmployeesByDesignationOrDepartment: async (_, { designation, department }) => {
      try {
        return await Employee.find({
          $or: [{ designation }, { department }]
        });
      } catch (error) {
        console.error("❌ Error searching employees:", error.message);
        throw new Error("Failed to search employees.");
      }
    }
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      console.log("🚀 Signup mutation triggered");
      console.log("📨 Payload received:", { username, email, password });

      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.error(`❌ Signup failed: Email ${email} already exists`);
          throw new Error("User already exists");
        }

        console.log("🔧 Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔐 Password hashed:", hashedPassword);

        const newUser = new User({
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: hashedPassword,
        });

        console.log("📦 New user object created:", newUser);

        const savedUser = await newUser.save();
        console.log("✅ User saved to DB:", savedUser.email);

        const token = generateToken(savedUser);
        console.log("🔓 JWT token generated");

        return {
          id: savedUser._id.toString(),
          username: savedUser.username,
          email: savedUser.email,
          token,
        };
      } catch (error) {
        console.error("❌ Signup error (object):", error);
        console.error("❌ Signup error (message):", error.message);
        throw new Error("Signup failed. Please try again.");
      }
    },

    addEmployee: async (_, employeeData) => {
      try {
        const newEmployee = new Employee(employeeData);
        const savedEmployee = await newEmployee.save();
        console.log(`✅ Employee added: ${savedEmployee.first_name} ${savedEmployee.last_name}`);
        return savedEmployee;
      } catch (error) {
        console.error("❌ Error adding employee:", error.message);
        throw new Error("Failed to add employee.");
      }
    },

    updateEmployee: async (_, { id, ...updates }) => {
      try {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedEmployee) {
          console.error(`❌ Employee with ID ${id} not found.`);
          throw new Error("Employee not found");
        }

        console.log(`✅ Employee updated: ${updatedEmployee.first_name} ${updatedEmployee.last_name}`);
        return updatedEmployee;
      } catch (error) {
        console.error("❌ Error updating employee:", error.message);
        throw new Error("Failed to update employee.");
      }
    },

    deleteEmployee: async (_, { id }) => {
      try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
          console.error(`❌ Employee with ID ${id} not found.`);
          throw new Error("Employee not found");
        }

        console.log(`✅ Employee deleted: ${deletedEmployee.first_name} ${deletedEmployee.last_name}`);
        return "Employee deleted successfully!";
      } catch (error) {
        console.error("❌ Error deleting employee:", error.message);
        throw new Error("Failed to delete employee.");
      }
    }
  }
};

module.exports = resolvers;

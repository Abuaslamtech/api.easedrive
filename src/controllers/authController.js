import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const register = async (req, res) => {
  try {
    // extract details from request ody
    const { firstName, lastName, email, password } = req.body;
    // check existing user

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save the user to the database
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // create a token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    // send token to the user;
    res.status(201).json({ message: "User created", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error " });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check if user exist
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    // generate token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    // send token to the user
    res.status(200).json({ message: "User logged in", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { register, login };

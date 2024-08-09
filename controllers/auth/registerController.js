import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import { JwtService } from "../../services/JwtService.js";

export const registerController = {
  async register(req, res, next) {
    // Validation schema
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      confirm_password: Joi.ref("password"),
    });

    // Validate request body
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error); // Stop further execution if validation fails
    }

    try {
      // Check if user already exists
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("This email is already taken")
        ); // Stop further execution if user exists
      }

      // Hash the password
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Prepare the model
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      // Save the user to the database
      const result = await user.save();

      // Log the result for debugging
      console.log(result);

      // Generate JWT token
      const access_token = JwtService.sign({
        _id: result._id,
        role: result.role,
      });

      // Send the response
      return res.status(201).json({ access_token });
    } catch (error) {
      // Handle any other errors
      return next(error); // Stop further execution if an error occurs
    }
  },
};

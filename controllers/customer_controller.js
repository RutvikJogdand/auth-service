const dotenv = require("dotenv")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Customers = require("../models/customer_model");

dotenv.config()

const accountSid = process.env.TwilioAccountSID;
const authToken = process.env.TwilioToken;

const client = require('twilio')(accountSid, authToken); //Twilio client that will sent otp to user

let otpStore = {};

const registerCustomer = async (req, res) => {
    const { username, name, email, password, confirmPassword, phoneNumber, country } = req.body;

    try {
        // Check if username already exists
        let customer = await Customers.findOne({ username });
        if (customer) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Check if email already exists
        customer = await Customers.findOne({ email });
        if (customer) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Create a new customer
        customer = new Customers({
            username,
            name,
            email,
            password, // Password will be hashed in the pre-save hook in the Customers model
            phoneNumber,
            country
        });

        await customer.save();

        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const sendOtp = async (req, res) => {
    const { phoneNumber } = req.body;
  
    try {
    
      const user = await Customers.findOne({phoneNumber})

      if(!user){
        return res.status(404).send("This user does not exist");
      }
      // Generating a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
  
      // Storing OTP in a object  
      otpStore.otp = otp;
  
      // Send OTP via SMS
      const message = await client.messages.create({
        body: `Your verification code is: ${otp}`,
        from: "+17865743876",
        to: `+91${phoneNumber}`
      });
  
      return res.status(200).json({success_message: 'OTP sent successfully', message: message.body});
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error sending OTP');
    }
};

const verifyEmail = async (req, res) => {
    const {otp} = req.body;

    try {
        if(otpStore && otpStore.otp === Number(otp)){
            delete otpStore.otp;
            return res.status(200).json({ message: 'Email verified successfully' });
        }
        if(Object.keys(otpStore).length === 0){
            return res.status(400).json({message: "Please generate OTP again"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error verifying email');
    }
}

const login = async(req, res) => {
    const {username, password} = req.body;

    console.log('username', username, 'password', password)
    try {
        const user = await Customers.findOne({username})
        console.log('user', user)
        if(!user){
            return res.status(404).send("User not found");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('valid pass', validPassword)
        if (!validPassword) return res.status(400).send("Invalid Password");

        const payload = {
            user: {
                id: user.username // Unique identifier for the user
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expiration time
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ message: 'Successful login', token });
            }
        );
    } catch (error) {
        res.status(500).send("Server error while logging in");
    }
}

const updateUser = async (req, res) => {
    const { username } = req.query;
    const { name, email, password, country, phoneNumber } = req.body;

    try {
        let customer = await Customers.findOne({username});
        if (!customer) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if they are provided in the request
        if (name) customer.name = name;
        if (email) customer.email = email;
        if (country) customer.country = country;
        if (phoneNumber) customer.phoneNumber = phoneNumber;

        // Not hashing the password here as it being hashed while saving into db
        if (password) {
            customer.password = password;
        }

        await customer.save();

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    registerCustomer,
    sendOtp,
    verifyEmail,
    login,
    updateUser
};
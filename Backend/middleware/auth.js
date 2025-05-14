import jwt from 'jsonwebtoken';

//Middleware function to check the JWT
const auth = (req, res, next) => {
    //get the token from headers
    const token = req.headers.authorization;
    //decode the token data with secret key
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    //Modify req and set userId with decoded user id
    req.userId = decodedData.id;
    req.password = decodedData.password;
    //Modify req and set email with decoded user email
    req.email = decodedData.email;
    //proceed to the next function
    next();
}

export default auth;
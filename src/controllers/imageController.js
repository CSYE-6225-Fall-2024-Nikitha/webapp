const imageService = require('../services/imageService');
const { authenticateUser } = require('../services/userService'); 
const { validateRequest } = require('../services/healthCheckService');
const { v4: uuidv4 } = require('uuid');

// GET IMAGE CONTROLLER
const getImage = async (req, res) => {
    const { email, password } = req.auth; 

    try {
        validateRequest(req);
        const user = await authenticateUser(email, password);
        
        if (!user) {
            return res.status(401).send(); 
        }

        const userId = user.id; 
        const imageData = await imageService.getImage(userId);

        return res.status(200).json(imageData);
    } catch (error) {
        return res.status(404).json();
    }
};

// DELETE IMAGE CONTROLLER
const deleteImage = async (req, res) => {
    const { email, password } = req.auth; 

    try {
        validateRequest(req);
        const user = await authenticateUser(email, password);
        
        if (!user) {
            return res.status(401).send(); 
        }

        const userId = user.id; 
        const result = await imageService.deleteImage(userId);
        if (!result) {
            return res.status(404).send(); 
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(404).send();
    }
};


// POST IMAGE CONTROLLER
const postImage = async (req, res) => {
    const { email, password } = req.auth; 

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            return res.status(401).send(); 
        }

        const userId = user.id; 

        if (!req.file) {
            return res.status(400).json();
        }

        const supportedFormats = ['image/png', 'image/jpg', 'image/jpeg'];
        if (!supportedFormats.includes(req.file.mimetype)) {
          return res.status(400).json();
        }

        const imageMetadata = {
            file_name: req.file.originalname,
            id: uuidv4(),
            user_id: userId,
            upload_date: new Date().toISOString().split('T')[0],
        };
      
        const responseData = await imageService.postImage(imageMetadata,req.file);
        return res.status(201).json(responseData); 
    } catch (error) {
        console.error(error);
        return res.status(400).json();
    }
};




module.exports = {
    getImage,
    deleteImage,
    postImage
};

const Image = require('../models/imageModel');
const cloudinary = require('cloudinary').v2;

// Get all images
exports.getImages = async (req, res) => {
  const images = await Image.findOne();
  res.render('index', { images: images ? images.urls : [] });
};

// Add or update images
exports.updateImages = async (req, res) => {
  const { selectedImages } = req.body;
  const urls = JSON.parse(selectedImages);

  const imageDoc = await Image.findOne();

  if (imageDoc) {
    // Identify images to delete
    const toDelete = imageDoc.urls.filter((url) => !urls.includes(url));

    // Delete images from Cloudinary
    for (const url of toDelete) {
      const publicId = extractPublicId(url);
      try {
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted from Cloudinary: ${publicId}`);
        }
      } catch (error) {
        console.error(`Error deleting ${publicId} from Cloudinary:`, error);
      }
    }

    // Update MongoDB
    imageDoc.urls = urls;
    await imageDoc.save();
  } else {
    await Image.create({ urls });
  }

  res.redirect('/noteHomePage');
};

// Upload images to Cloudinary
exports.uploadImages = async (req, res) => {
  const files = req.files;
  const uploadedUrls = files.map((file) => file.path);

  const imageDoc = await Image.findOne();
  if (imageDoc) {
    imageDoc.urls.push(...uploadedUrls);
    await imageDoc.save();
  } else {
    await Image.create({ urls: uploadedUrls });
  }

  res.redirect('/noteHomePage');
};

// Utility: Extract public ID from Cloudinary URL
const extractPublicId = (url) => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  const publicId = fileName.split('.')[0];
  const folder = parts[parts.length - 2];
  const fullId = `${folder}/${publicId}`;
  console.log(`Extracted public_id: ${fullId}`);
  return fullId;
};

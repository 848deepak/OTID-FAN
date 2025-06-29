const fs = require('fs');
const path = require('path');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');

// Patch the faceapi environment to work with nodejs
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

let modelsLoaded = false;

// Function to load all required models
async function loadModels() {
  if (modelsLoaded) return;
  
  // Define the models directory
  const MODELS_URL = path.join(__dirname, '../models/face-api');
  
  // Check if models exist, if not download them
  if (!fs.existsSync(MODELS_URL) || !fs.existsSync(path.join(MODELS_URL, 'ssd_mobilenetv1_model-weights_manifest.json'))) {
    console.log('Face-API models not found locally. Please download models manually.');
    console.log('Visit: https://github.com/justadudewhohacks/face-api.js/tree/master/weights');
    console.log('And place them in:', MODELS_URL);
    // For demo purposes, we'll still use the mock verification in this case
    return false;
  }
  
  try {
    // Load required models for face detection and recognition
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_URL);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_URL);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_URL);
    
    modelsLoaded = true;
    console.log('Face-API models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face-api models:', error);
    return false;
  }
}

// Function to check if an image contains useful content (not just a white/blank page)
async function isBlankImage(imgPath) {
  try {
    // Directly check file size - extremely small files are likely blank or corrupt
    const stats = fs.statSync(imgPath);
    if (stats.size < 5000) { // Less than 5KB is suspicious
      console.log(`Image file size too small (${stats.size} bytes), likely blank or corrupt`);
      return true;
    }
    
    // Read the image as a buffer
    const imgBuffer = fs.readFileSync(imgPath);
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imgBuffer;
    });
    
    // Create a canvas and draw the image
    const canvas = new Canvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;
    
    // Count white/blank pixels
    let whitePixels = 0;
    let totalPixels = data.length / 4; // RGBA values
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Check if pixel is nearly white (very high RGB values)
      if (r > 240 && g > 240 && b > 240) {
        whitePixels++;
      }
    }
    
    // Calculate white pixel percentage
    const whitePercentage = (whitePixels / totalPixels) * 100;
    console.log(`White pixel percentage: ${whitePercentage.toFixed(2)}%`);
    
    // If more than 95% of pixels are white, consider it blank
    return whitePercentage > 95;
  } catch (error) {
    console.error('Error checking blank image:', error);
    return true; // Assume blank if we can't analyze
  }
}

// The main verification function
async function verifyFaces(photoPath, idDocumentPath) {
  // First, check if either image is blank or doesn't contain useful content
  const photoIsBlank = await isBlankImage(photoPath);
  const idDocumentIsBlank = await isBlankImage(idDocumentPath);
  
  if (photoIsBlank) {
    return { 
      success: false, 
      confidence: 0, 
      message: 'The selfie photo appears to be blank or doesn\'t contain visible content' 
    };
  }
  
  if (idDocumentIsBlank) {
    return { 
      success: false, 
      confidence: 0, 
      message: 'The ID document appears to be blank or doesn\'t contain visible content' 
    };
  }
  
  // Try to load models
  const modelsAvailable = await loadModels();
  
  // If models not available, fail rather than mock
  if (!modelsAvailable) {
    return { 
      success: false, 
      confidence: 0, 
      message: 'Face verification models could not be loaded. Please contact support.' 
    };
  }
  
  try {
    // Load the images
    const photo = await loadImage(photoPath);
    const idDocument = await loadImage(idDocumentPath);
    
    if (!photo || !idDocument) {
      return { 
        success: false, 
        confidence: 0, 
        message: 'Could not load one or both images' 
      };
    }
    
    console.log(`Processing images: photo (${photo.width}x${photo.height}), ID (${idDocument.width}x${idDocument.height})`);
    
    // Detect faces in both images - use higher confidence threshold
    const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.7 });
    
    // Get full face description (detection, landmarks, and descriptor) for the photo
    const photoFaceDetections = await faceapi.detectAllFaces(photo, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptors();
    
    // Get full face description for the ID document
    const idFaceDetections = await faceapi.detectAllFaces(idDocument, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptors();
    
    console.log(`Detected ${photoFaceDetections.length} faces in photo and ${idFaceDetections.length} faces in ID document`);
    
    // Check if exactly one face was detected in each image
    if (photoFaceDetections.length === 0) {
      return { 
        success: false, 
        confidence: 0,
        message: 'No face detected in the selfie photo. Please upload a clear photo of your face.' 
      };
    }
    
    if (photoFaceDetections.length > 1) {
      return { 
        success: false, 
        confidence: 0,
        message: 'Multiple faces detected in the selfie photo. Please upload a photo with only your face.' 
      };
    }
    
    if (idFaceDetections.length === 0) {
      return { 
        success: false, 
        confidence: 0,
        message: 'No face detected in the ID document. Please upload a clear image of your ID.' 
      };
    }
    
    if (idFaceDetections.length > 1) {
      return { 
        success: false, 
        confidence: 0,
        message: 'Multiple faces detected in the ID document. Please ensure only the ID owner\'s face is visible.' 
      };
    }
    
    const photoFaceDetection = photoFaceDetections[0];
    const idFaceDetection = idFaceDetections[0];
    
    // Calculate the face similarity (Euclidean distance between face descriptors)
    const distance = faceapi.euclideanDistance(photoFaceDetection.descriptor, idFaceDetection.descriptor);
    
    // Make threshold more strict (0.5 instead of 0.6)
    const threshold = 0.5;
    const isMatch = distance < threshold;
    const confidence = Math.max(0, Math.min(1, 1 - distance));
    
    console.log(`Face verification result: distance=${distance.toFixed(2)}, confidence=${confidence.toFixed(2)}, isMatch=${isMatch}`);
    
    // More detailed feedback
    let message;
    if (isMatch) {
      if (confidence > 0.8) {
        message = `Face matched with high confidence (${(confidence * 100).toFixed(0)}%)`;
      } else {
        message = `Face matched with moderate confidence (${(confidence * 100).toFixed(0)}%)`;
      }
    } else {
      if (confidence < 0.3) {
        message = `Faces do not match (very low similarity: ${(confidence * 100).toFixed(0)}%)`;
      } else {
        message = `Faces appear different (${(confidence * 100).toFixed(0)}% similarity, below threshold)`;
      }
    }
    
    return {
      success: isMatch,
      confidence: confidence,
      message: message
    };
  } catch (error) {
    console.error('Error during face verification:', error);
    return {
      success: false,
      confidence: 0,
      message: 'Error during face verification process: ' + error.message
    };
  }
}

// Helper function to load images
async function loadImage(imgPath) {
  try {
    if (!fs.existsSync(imgPath)) {
      console.error(`Image not found: ${imgPath}`);
      return null;
    }
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = fs.readFileSync(imgPath);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    return null;
  }
}

module.exports = { verifyFaces }; 
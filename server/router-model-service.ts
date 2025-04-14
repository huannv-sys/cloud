import * as fs from 'fs';
import * as path from 'path';
import { Router } from '../shared/schema';

// Base directory for all model-related files
const MODEL_BASE_DIR = path.join(process.cwd(), 'public', 'router-models');

interface RouterModelInfo {
  modelName: string;
  imageUrl: string | null;
  dataPath: string | null;
  hasVsdxFile: boolean;
}

// Ensure the model directory exists
function ensureModelDirExists() {
  if (!fs.existsSync(MODEL_BASE_DIR)) {
    fs.mkdirSync(MODEL_BASE_DIR, { recursive: true });
  }
}

// Get information about available router models
export function getAvailableModels(): RouterModelInfo[] {
  ensureModelDirExists();
  
  try {
    const models: RouterModelInfo[] = [];
    const modelDirs = fs.readdirSync(MODEL_BASE_DIR);
    
    for (const modelDir of modelDirs) {
      const modelPath = path.join(MODEL_BASE_DIR, modelDir);
      
      if (fs.statSync(modelPath).isDirectory()) {
        // Check for image and data files
        const files = fs.readdirSync(modelPath);
        const imageFile = files.find(f => /\.(png|jpg|jpeg|svg)$/i.test(f));
        const dataFile = files.find(f => f.endsWith('.json'));
        const vsdxFile = files.find(f => f.endsWith('.vsdx'));
        
        models.push({
          modelName: modelDir,
          imageUrl: imageFile ? `/router-models/${modelDir}/${imageFile}` : null,
          dataPath: dataFile ? `/router-models/${modelDir}/${dataFile}` : null,
          hasVsdxFile: !!vsdxFile
        });
      }
    }
    
    return models;
  } catch (err) {
    console.error('Error reading model directory:', err);
    return [];
  }
}

// Map a Mikrotik model name to a model directory
export function mapModelNameToDirectory(modelName: string): string | null {
  if (!modelName) return null;
  
  // Normalize model name: remove spaces, convert to lowercase
  const normalizedName = modelName.replace(/\s+/g, '').toLowerCase();
  
  // Check all available model directories for a match
  const models = getAvailableModels();
  
  // Try to find an exact match first
  const exactMatch = models.find(m => 
    m.modelName.replace(/\s+/g, '').toLowerCase() === normalizedName
  );
  
  if (exactMatch) {
    return exactMatch.modelName;
  }
  
  // If no exact match, try to find a partial match
  const partialMatch = models.find(m => 
    normalizedName.includes(m.modelName.replace(/\s+/g, '').toLowerCase()) ||
    m.modelName.replace(/\s+/g, '').toLowerCase().includes(normalizedName)
  );
  
  return partialMatch ? partialMatch.modelName : null;
}

// Get model information for a specific router
export function getRouterModelInfo(router: Router): RouterModelInfo | null {
  if (!router || !router.model) return null;
  
  const modelDir = router.modelDataPath || mapModelNameToDirectory(router.model);
  
  if (!modelDir) return null;
  
  try {
    const modelPath = path.join(MODEL_BASE_DIR, modelDir);
    
    if (fs.existsSync(modelPath) && fs.statSync(modelPath).isDirectory()) {
      const files = fs.readdirSync(modelPath);
      const imageFile = files.find(f => /\.(png|jpg|jpeg|svg)$/i.test(f));
      const dataFile = files.find(f => f.endsWith('.json'));
      const vsdxFile = files.find(f => f.endsWith('.vsdx'));
      
      return {
        modelName: modelDir,
        imageUrl: imageFile ? `/router-models/${modelDir}/${imageFile}` : null,
        dataPath: dataFile ? `/router-models/${modelDir}/${dataFile}` : null,
        hasVsdxFile: !!vsdxFile
      };
    }
  } catch (err) {
    console.error(`Error getting router model info for ${router.model}:`, err);
  }
  
  return null;
}

// Store a router model image
export async function storeRouterModelImage(
  modelName: string, 
  imageData: Buffer,
  fileName: string
): Promise<string | null> {
  ensureModelDirExists();
  
  try {
    // Create a directory for the model if it doesn't exist
    const modelDir = path.join(MODEL_BASE_DIR, modelName);
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }
    
    // Store the image
    const imagePath = path.join(modelDir, fileName);
    await fs.promises.writeFile(imagePath, imageData);
    
    // Return the relative path
    return `/router-models/${modelName}/${fileName}`;
  } catch (err) {
    console.error(`Error storing model image for ${modelName}:`, err);
    return null;
  }
}

// Store router model data
export async function storeRouterModelData(
  modelName: string,
  modelData: object
): Promise<string | null> {
  ensureModelDirExists();
  
  try {
    // Create a directory for the model if it doesn't exist
    const modelDir = path.join(MODEL_BASE_DIR, modelName);
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }
    
    // Store the data
    const dataPath = path.join(modelDir, 'model-data.json');
    await fs.promises.writeFile(dataPath, JSON.stringify(modelData, null, 2));
    
    // Return the relative path
    return `/router-models/${modelName}/model-data.json`;
  } catch (err) {
    console.error(`Error storing model data for ${modelName}:`, err);
    return null;
  }
}

// Store Visio VSDX file
export async function storeVsdxFile(
  modelName: string,
  vsdxData: Buffer,
  fileName: string
): Promise<string | null> {
  ensureModelDirExists();
  
  try {
    // Create a directory for the model if it doesn't exist
    const modelDir = path.join(MODEL_BASE_DIR, modelName);
    if (!fs.existsSync(modelDir)) {
      fs.mkdirSync(modelDir, { recursive: true });
    }
    
    // Store the VSDX file
    const vsdxPath = path.join(modelDir, fileName);
    await fs.promises.writeFile(vsdxPath, vsdxData);
    
    // Return the relative path
    return `/router-models/${modelName}/${fileName}`;
  } catch (err) {
    console.error(`Error storing VSDX file for ${modelName}:`, err);
    return null;
  }
}
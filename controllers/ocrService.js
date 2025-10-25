// controllers/ocrController.js
import { processImageWithOCR } from '../services/ocrService.js';

export const handleOCRRequest = async (req, res) => {
    try {
        const { imagePath } = req.body;

        if (!imagePath) {
            return res.status(400).json({
                success: false,
                message: 'Image path is required'
            });
        }

        const ocrResult = await processImageWithOCR(imagePath);

        res.json({
            success: true,
            data: ocrResult
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
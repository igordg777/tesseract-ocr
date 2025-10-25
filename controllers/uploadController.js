import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { processImageWithOCR } from '../services/ocrService.js';

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        fs.ensureDirSync(uploadDir);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB лимит для изображений
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|bmp|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Поддерживаются только изображения (JPEG, PNG, GIF, BMP, WebP)'));
        }
    }
});

export const handleFileUpload = async (req, res) => {
    try {
        // Используем multer для обработки загрузки
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Файл не был загружен'
                });
            }

            const imagePath = req.file.path;
            console.log(`📸 Изображение загружено: ${imagePath}`);

            try {
                // Обрабатываем изображение через OCR
                const ocrResult = await processImageWithOCR(imagePath);

                res.json({
                    success: true,
                    message: 'Изображение успешно обработано',
                    data: {
                        filename: req.file.originalname,
                        path: imagePath,
                        ocrResult: ocrResult
                    }
                });
            } catch (ocrError) {
                console.error('Ошибка OCR:', ocrError);
                res.status(500).json({
                    success: false,
                    message: 'Ошибка при обработке изображения: ' + ocrError.message
                });
            }
        });
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка сервера при загрузке файла'
        });
    }
};

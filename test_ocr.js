// test_ocr.js - Простой тест OCR API
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testOCR() {
    try {
        console.log('🧪 Тестирование OCR API...');

        // Ищем тестовое изображение
        const testImagePath = 'docs_images/2025-10-25_13-40-49.png';
        if (!fs.existsSync(testImagePath)) {
            console.log('❌ Тестовое изображение не найдено');
            return;
        }

        console.log(`📸 Найдено тестовое изображение: ${testImagePath}`);

        // Создаем FormData
        const formData = new FormData();
        formData.append('image', fs.createReadStream(testImagePath), {
            filename: path.basename(testImagePath),
            contentType: 'image/png'
        });

        console.log('🚀 Отправка запроса на /api/upload...');

        // Отправляем запрос
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ Ошибка сервера:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            console.log('✅ OCR обработка успешна!');
            console.log('📄 Результат:');
            console.log('─'.repeat(50));
            console.log(result.text || result.message || 'Результат получен');
            console.log('─'.repeat(50));
        } else {
            console.log('❌ OCR обработка не удалась:', result.error || result.message);
        }

    } catch (error) {
        console.log('❌ Ошибка тестирования:', error.message);
    }
}

// Запускаем тест
testOCR();

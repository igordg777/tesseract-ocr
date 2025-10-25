# Tesseract OCR Web Service

Веб-сервис для тестирования технологии оптического распознавания символов с использованием Tesseract OCR.

## 🚀 Возможности

- **Современный веб-интерфейс** с drag & drop загрузкой файлов
- **Поддержка изображений** (JPEG, PNG, GIF, BMP, WebP)
- **Реальное OCR распознавание** с помощью Tesseract
- **Автоматическое сохранение** результатов в файлы
- **Простой и чистый код** без лишних зависимостей

## 📋 Требования

- Node.js 18+
- Tesseract OCR (требуется ручная установка)
- Windows 10/11

## 🛠️ Установка

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd tesseract_ocr
```

2. **Установите Tesseract OCR:**
```bash
winget install --id UB-Mannheim.TesseractOCR
```

3. **Установите зависимости:**
```bash
npm install
```

4. **Запустите сервер:**
```bash
npm start
```

5. **Откройте браузер:**
```
http://localhost:3000
```

## 🎯 Использование

1. Откройте веб-интерфейс в браузере
2. Перетащите изображение в область загрузки или нажмите "Выбрать файл"
3. Дождитесь обработки OCR
4. Скопируйте распознанный текст или скачайте результат

## 📁 Структура проекта

```
├── controllers/          # Контроллеры
│   ├── ocrService.js    # OCR сервис
│   └── uploadController.js # Контроллер загрузки
├── services/            # Сервисы
│   ├── cleanOcrService.js # Чистый OCR сервис
│   └── ocrService.js    # Основной OCR сервис
├── public/              # Веб-интерфейс
│   ├── index.html       # Главная страница
│   ├── script.js        # JavaScript
│   └── styles.css       # Стили
├── results/             # Результаты OCR
├── uploads/             # Загруженные файлы
├── server.js            # Основной сервер
└── package.json         # Зависимости
```

## 🔧 Технические детали

- **Backend**: Node.js + Express
- **OCR Engine**: Tesseract OCR
- **Frontend**: Vanilla JavaScript + HTML/CSS
- **File Upload**: Multer
- **File System**: fs-extra

## 📊 Результаты

- Результаты сохраняются в папку `results/` с временными метками
- Последний результат сохраняется в `result.txt`
- Поддержка копирования текста в буфер обмена

## 🚀 Запуск

```bash
# Обычный запуск
npm start

# Запуск с автоперезагрузкой
npm run dev
```

## 🧪 Тестирование

```bash
# Тест OCR API
node test_ocr.js
```

## 📝 Лицензия

MIT License - свободное использование и модификация.

---

**Создано для тестирования Tesseract OCR технологий** 🎯
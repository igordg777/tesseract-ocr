// Основные элементы DOM
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const processingSection = document.getElementById('processingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');

// Элементы для отображения информации
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const textOutput = document.getElementById('textOutput');
const errorMessage = document.getElementById('errorMessage');

// Обработчики событий для drag & drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

// Обработчик клика по области загрузки (только если не кликнули по кнопке)
uploadArea.addEventListener('click', (e) => {
    // Проверяем, что клик не по кнопке
    if (!e.target.closest('.upload-btn')) {
        fileInput.click();
    }
});

// Обработчик выбора файла
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// Функция обработки выбранного файла
function handleFileSelect(file) {
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
        showError('Пожалуйста, выберите изображение');
        return;
    }

    // Проверка размера файла (10MB для изображений)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showError('Размер файла не должен превышать 10MB');
        return;
    }

    // Отображение информации о файле
    showFileInfo(file);

    // Запуск обработки
    processFile(file);
}

// Отображение информации о файле
function showFileInfo(file) {
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    // Предварительный просмотр для изображений
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // Показать информацию о файле
    fileInfo.style.display = 'block';
    fileInfo.classList.add('fade-in');
}

// Форматирование размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Обработка файла
async function processFile(file) {
    try {
        // Скрыть предыдущие секции
        hideAllSections();

        // Показать секцию обработки
        processingSection.style.display = 'block';
        processingSection.classList.add('fade-in');

        // Создать FormData для отправки файла
        const formData = new FormData();
        formData.append('image', file);

        // Отправить запрос на сервер
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showResults(result.data.ocrResult);
        } else {
            showError(result.message || 'Ошибка обработки изображения');
        }

    } catch (error) {
        console.error('Ошибка:', error);
        showError('Ошибка соединения с сервером: ' + error.message);
    }
}

// Отображение результатов
function showResults(ocrResult) {
    hideAllSections();

    if (ocrResult.success) {
        textOutput.textContent = ocrResult.text || 'Текст не найден';
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');
    } else {
        showError(ocrResult.error || 'Не удалось распознать текст');
    }
}

// Отображение ошибки
function showError(message) {
    hideAllSections();

    errorMessage.textContent = message;
    errorSection.style.display = 'block';
    errorSection.classList.add('fade-in');
}

// Скрытие всех секций
function hideAllSections() {
    processingSection.style.display = 'none';
    resultsSection.style.display = 'none';
    errorSection.style.display = 'none';
}

// Копирование текста в буфер обмена
async function copyToClipboard() {
    const text = textOutput.textContent;

    try {
        await navigator.clipboard.writeText(text);

        // Показать уведомление
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
        copyBtn.style.background = '#4CAF50';

        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '#4CAF50';
        }, 2000);

    } catch (error) {
        console.error('Ошибка копирования:', error);
        alert('Не удалось скопировать текст');
    }
}

// Сброс формы
function resetForm() {
    hideAllSections();
    fileInfo.style.display = 'none';
    fileInput.value = '';
    uploadArea.classList.remove('dragover');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DeepSeek-OCR Тестер загружен');

    // Добавить обработчики для улучшения UX
    uploadArea.addEventListener('mouseenter', () => {
        uploadArea.style.transform = 'translateY(-2px)';
    });

    uploadArea.addEventListener('mouseleave', () => {
        uploadArea.style.transform = 'translateY(0)';
    });
});

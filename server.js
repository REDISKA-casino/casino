const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// Файл где хранятся данные
const DATA_FILE = '/tmp/accounts.json';

// Если файла нет — создаём пустой
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '{}');
}

// Чтение данных
app.get('/', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch(e) {
    res.json({});
  }
});

// Запись данных
app.put('/', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body));
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: 'Ошибка сохранения' });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Сервер запущен на порту ' + PORT);
});

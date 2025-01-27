const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const upload = multer({ dest: 'LawrencesFiles/files/' });

app.use(express.static('LawrencesFiles/public'));

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const targetPath = path.join(__dirname, 'files', file.originalname);

  fs.rename(file.path, targetPath, err => {
    if (err) return res.sendStatus(500);
    res.redirect('/');
  });
});

app.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, 'files');
  fs.readdir(directoryPath, (err, files) => {
    if (err) return res.sendStatus(500);

    const fileLinks = files.map(file => {
      const filePath = path.join(directoryPath, file);
      const fileStat = fs.statSync(filePath);
      if (fileStat.isDirectory()) {
        return `<a href="/files/${file}">${file}</a>`;
      } else {
        const fileExt = path.extname(file).toLowerCase();
        if (['.pdf', '.txt', '.doc', '.docx'].includes(fileExt)) {
          return `<a href="/files/${file}" target="_blank">${file}</a>`;
        } else {
          return `<a href="/files/${file}" download>${file}</a>`;
        }
      }
    }).join('<br>');

    res.send(fileLinks);
  });
});

app.use('/files', express.static(path.join(__dirname, 'files')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

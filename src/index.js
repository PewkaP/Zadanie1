const express = require('express');
const app = express();
const port = process.env.NODE_PORT;
const autor = process.env.NODE_AUTOR;

app.get('/', (req, res) => {
  const clientIp = req.ip; //pobieram adres ip klienta
  const clientTime = new Date(); //pobieram czas połączemoa klienta
    
  const response = `
    <html>
      <head>
        <title>Informacje o kliencie</title></head>
      <body>
        <h1>Informacje o kliencie</h1>
        <p>Adres IP: ${clientIp}</p>
        <p>Data i godzina: ${clientTime}</p>
      </body>
    </html>
  `;//strona do wyświetlenia

  res.send(response);//wyświetlam stronę
});

app.listen(port, () => {
    const startTime = new Date(); //pobieram czas uruchomienia serwera

    console.log(`Serwer uruchomiono o ${startTime}, autor serwera: ${autor}, port TCP: ${port}`); //wyświetlam na konsoli informację o uruchomianiu
});

# 1. Proszę napisać program serwera 

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


# 2. Opracować plik Dockerfile

FROM scratch
# użycie obrazu alpine
ADD alpine-minirootfs-3.19.1-aarch64.tar /
#ustawienie katalogu domyślnego
WORKDIR /app
# instalacja nodejs, npm i curl
RUN apk add --no-cache nodejs npm curl
# kopiowanie aplikacji serwerowej
COPY package.json ./
COPY src ./src
COPY node_modules ./node_modules
# ustawienie zmiennych
ARG AUTOR 
ARG PORT=3000
# otagowanie autora
LABEL org.opencontainers.image.authors="$AUTOR"
# ustawienie zmiennych dla aplikacji serwerowej
ENV NODE_AUTOR=${AUTOR}
ENV NODE_PORT=${PORT}
# instalacja aplikacji serwerowej
RUN npm install
# otworzenie portu
EXPOSE ${PORT}
# healthcheck działa tylko przy domyślnym portem 3000
HEALTHCHECK --interval=10s --timeout=1s \
 CMD curl -f http://localhost:3000/ || exit 1
# uruchomienie aplikacji serwerowej
CMD ["node", "src/index.js"]






# 3. Należy podać polecenia 

# Aby utworzyć kontener należy użyt tego polecenia. Można zmienić autora serwera oraz numer portu na którym będzie uruchomiony serwer (domyślnie ustawiony jest port 3000)
docker build --build-arg AUTOR="Piotr Plewka" --build-arg PORT=3456 -f DOCKERFILE -t zadanie1:v1 .

# Aby uruchomić kontener z tym obrazem należy użyć tego polecenia. Należy pamiętać o przekierowaniu portów 
docker run -d -p 3333:3456 --name ZADANIE1 zadanie1:v1   # nie wyświetli się komunikat o uruchomieniu serwera  
docker run -it -p 3333:3000 --name ZADANIE1 zadanie1:v1  # wyświetli się komunikat o uruchomieniu serwera

# Aby sprawdzić autora obrazu należy użyć komendy 
docker image inspect zadanie1:v1 --format='{{index .Config.Labels "org.opencontainers.image.authors"}}'

# Aby sprawdzić działanie healthcheck (działa tylko przy porcie 3000) użyć tej komendy
docker inspect ZADANIE1 --format='{{json .State.Health}}'   

# Aby sprawdzić liczbę warsstw serwera należy użyć tego polecenia
docker history zadanie1:v1

# StudyShip

Dies ist das Projekt StudyShip erstellt durch:

* Tim Dorozynski
* Lennart Esch
* Barnabas Steiner
* Jannis Weber

[Unser Github Repository](https://github.com/Herotech1105/StudiShip)

# Idee

# Umsetzung

## Backend - (javascript)

### Technologien

#### Node.js:

Node.js wird als Engine verwendet

#### Express:

Express ist ein Webframework für Node.js.

#### Handlebars:

Handlebars Dateien (.hbs) sind templates für Webseiten. Diese nutzt das Backend um Webseiten zu rendern, bevor sie an
den Client geschickt werden.
`.hbs`-Dateien bestehen aus html Syntax und javascript Injektionen (wie z.B Objekte) in doppelt geschweiften
Klammern {{}}.

#### Dotenv:

Dotenv wird genutzt, um Code und Laufzeitvariablen zu trennen. In diesem Projekt nutzen wir eine `.env`-Datei um die
Parameter zur Verbindungsaufnahme für die Datenbank zu hinterlegen.

#### MySQL:

Wir nutzen für dieses Projekt `MySQL` als Datenbank und das npm Modul `mysql2` für die Node MySQL Schnittstelle. Zu
Nutzung
und Setup später mehr.

#### Cookie-Parser:

Wir nutzen `cookie-parser` um mit Cookies zu arbeiten. Besonders nützlich ist hierbei die Möglichkeit ein signiertes
Cookie zu erstellen, dass durch einen hash, der im backend gespeichert wird, genügend Sicherheit bietet, sodass wir
einen Cookie zur Authentifizierung des Nutzers nach der Anmeldung nutzen können.

#### Socket.io:

Wir nuzen `socket.io` um unseren Server um Websockets zu ergänzen. Websockets können vom Client angesprochen werden,
wodurch es zu einem Handshake kommt, in dem die Daten für einen beidseitigen Verbindungsaufbau übergeben werden. Nach
dem Handshake können Client und Server dann über das Senden von Events miteinander kommunizieren. Socket.io bietet auch
die
Möglichkeit, dass der Server Clients in Gruppen einteilen kann und dann Events gleich an ganze Gruppen schicken kann.

#### socket.io-cookie-parser:

Spezielle Schnittstelle für Cookie-Parser und Socket.io, damit der Websocketserver auf die signierten Cookies der
Clients zugreifen kann.

#### Nodemon:

Nodemon ist ein Entwicklungstool, das Dateiänderungen automatisch in das laufende Programm geladen werden. Es dient nur
dem Komfort bei der Entwicklung

### Struktur

Das backend lässt sich in 3 Teile aufteilen:

* Model
* Views
* Controller

#### Model:

Im Model steckt die Logik des Backends. Die zentrale Komponente hier ist der Service.
Der Service stellt zuerst mit Hilfe einer externen Funktion eine Vernindung zur Datenbank her.
Danach ist der Service ist der Server vom Controller ansprechbar und nutzt dann die Methoden, die in die manager
unterteilt sind, um eine Antwort zu generieren.

#### Views:

Views bezeichnet eine Liste von `.hbs` templates. Aus diesen wird dann die Webseite gerendert, indem Variablen und Werte
in die Template injiziert werden. Der Client erhält dann die fertige Seite, ohne dass er die Werte clientseitig selbst
einsetzen muss.

#### Controller:

Der Controller bietet sowohl Endpunkte für http POST- und GET-requests, als auch einen Websocketserver. Die http
Endpunkte können dann vom Nutzer erreicht werden, um Webseiten anzufordern oder Formulare (wie z.B der Login)
einzureichen.
Der Websocket Server bietet die Möglichkeit, dass Server und Client in beide Richtungen miteinander über das Zusenden
von Events kommunizieren können.


<img src="./images/backendStructure.svg">

### Datenbank

Die Datenbank ist auf folgende Weise definiert:

`CREATE SCHEMA webapp;`

`USE webapp;`

Die Datenbank für das Projekt befindet sich im Schema webapp

| users.id                          | users.name              | users.email             | users.password          |
|-----------------------------------|-------------------------|-------------------------|-------------------------|
| (INT AUTO_ INCREMENT PRIMARY KEY) | (VARCHAR(255) NOT NULL) | (VARCHAR(255) NOT NULL) | (VARCHAR(255) NOT NULL) |
| 1                                 | 'name'                  | 'email'                 | 'password'              |
| 2                                 | 'name'                  | 'email'                 | 'password'              |

In `users` sind die Daten der einzelnen Nutzer mit Nutzername, Email und Passwort gespeichert.

| rooms.id                          | rooms.name              | rooms.description       | rooms.owner_id | rooms.subject           | rooms.privacy                                    |
|-----------------------------------|-------------------------|-------------------------|----------------|-------------------------|--------------------------------------------------|
| (INT AUTO_ INCREMENT PRIMARY KEY) | (VARCHAR(255) NOT NULL) | (VARCHAR(255) NOT NULL) | (INT NOT NULL) | (VARCHAR(255) NOT NULL) | (enum ('public', 'invited', 'private') NOT NULL) |
| 1                                 | 'name'                  | 'description'           | 2              | 'Mathematik 1'          | 'public'                                         |
| 2                                 | 'name'                  | 'description'           | 1              | 'Web-Engineering 1'     | 'private'                                        |

`rooms` enthält die Informationen über die einzelnen Räume. Dazu gehören Name, Beschreibung, die Nutzer Id des
Besitzers, das zugehörige Fach, und, ob der Raum bei der Suche erscheinen soll (public), man nur durch einen Link auf
ihn zugreifen kann (invited), oder man diesem im Moment nicht beitreten kann (private).

| messages.id                       | messages.user_id | messages.room_id | messages.content        | messages.timestamp                                                 |
|-----------------------------------|------------------|------------------|-------------------------|--------------------------------------------------------------------|
| (INT AUTO_ INCREMENT PRIMARY KEY) | (INT NOT NULL)   | (INT NOT NULL)   | (VARCHAR(255) NOT NULL) | (TIMESTAMP NOT NULL)                                               |
| 1                                 | 3                | 4                | 'message'               | 'Tue Feb 24 2026 09:59:35 GMT+0100 (Mitteleuropäische Normalzeit)' |
| 2                                 | 2                | 2                | 'message'               | 'Tue Feb 24 2026 09:59:35 GMT+0100 (Mitteleuropäische Normalzeit)' |

In `messages` werden die Nachrichten der Nutzer in den Räumen gespeichert. Enthalten sind die Ids von Nutzer und Raum,
sowie Inhalt und Zeitpunkt der Nachricht.

| roommembers.id                    | roommembers.user_id | roommembers.room_id |
|-----------------------------------|---------------------|---------------------|
| (INT AUTO_ INCREMENT PRIMARY KEY) | (INT NOT NULL)      | (INT NOT NULL)      |
| 1                                 | 4                   | 1                   |
| 2                                 | 2                   | 3                   |

`roommembers` wird benutzt, um Räume und die enthaltenen Mitglieder zu verknüpfen. Dementsprechend sind hier nur Nutzer-
und Raum-Id gespeichert.

### Endpoints

| Pfad           | Request Typ | Beschreibung                                            | Response                                                                                                                                                             |
|----------------|-------------|---------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| /              | GET         | Main Page                                               | Wenn der Nutzer nicht angemeldet ist wird der Index geladen, ansonsten das Dashboard                                                                                 |
| /login         | GET         | Login Seite                                             | Lädt die Login Seite                                                                                                                                                 |
| /register      | GET         | Registrierungs Seite                                    | Lädt die Resgistrierungs Seite                                                                                                                                       |
| /rooms         | GET         | Chat Raum                                               | Lädt den Raum mit der mitgegebenen Id, falls der Zugriff erlaubt ist. Ansonsten Weiterleitung an '/'                                                                 |
| /rooms/create  | GET         | Raum Ersteller Seite                                    | Läadt die Seite zur Erstellung eines neuen Raums, falls der Nutzer angemeldet ist. Ansonsten Weiterleitung zu '/login'                                               |
| /search        | GET         | Raum Suchseite                                          | Lädt die Raumsuchseite, falls der Nutzer angemeldet ist. Ansonsten Weiterleitung zu '/login'                                                                         |
| /auth/login    | POST        | Authentifizierung der Nutzerdaten beim Login            | Überprüft die Anmeldedaten. Bei Erfolg wird der Cookie für die Anmeldung gesetzt und zu '/' weitergeleitet, ansonsten wieder zu '/login'                             |
| /auth/register | POST        | Authentifizierung der Nutzerdaten bei der Registrierung | Überprüft, ob die Anmeldedaten valide und frei sind. Bei Erfolg wird der Cookie für die Anmeldung gesetzt und zu '/' weitergeleitet, ansonsten wieder zu '/register' |
| /logout        | POST        | Abmeldung des Nutzers                                   | Entfernt den Cookie für die Anmeldung und leitet zu '/' weiter                                                                                                       |
| /rooms/create  | POST        | Erstellung eines neuen Raums                            | Prüft die Angaben und erstellt aus ihnen bei Erfolg einen neuen Raum und leitet zu diesem weiter. Ansonsten wird wieder zu '/rooms/create' weitergeleitet.           |
| /search        | POST        | Suche nach Räumen                                       | Sucht Räume nach gegebenen Parametern. Rendert eine Liste mit Ergebnissen.                                                                                           |

### Socketevents

| Empfangenes Event | Parameter     | Beschreibung                                                                                                                              | Gesendetes Event                     | Parameter           |
|-------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|---------------------|
| open              | roomId        | erster Verbindungsaufbau des Clients, der server fügt den client zur broadcasting Grupper für den Raum und einer Nutzerspezifischen hinzu | keine                                | keine               |
| giveSubjects      | keine         | Client fragt eine Liste aller zulässiger Fächer ab, Server schickt die Liste                                                              | subjects                             | subjectList         |
| delete            | roomId        | Client bittet um Löschung des Raums, wenn er die Rechte dazu hat wird der Raum gelöscht und alle Raummitglieder erhalten die ent          |                                      |                     |
| updateRoom        | room          | Client fordert Änderung des Raums an, Raum wird geändert, wenn die Rechte dafür da sind                                                   | updateRoom                           | room                |
| changeOwner       | owner, roomId | Client überträgt Besitz des Raums an neueun Nutzer, wenn er selbst Besitzer ist                                                           | changeOwner                          | owner               |
| removeUser        | user, roomId  | Nutzer wird aus dem Raum geworden, wenn Event vom Besitzer geschickt wird                                                                 |                                      |                     |
| leaveRoom         | roomId        | Nutzer verlässt den Raum, Änderung wird in Datenbank übernommen und Information an den Raum Socket weitergegeben                          | left (an Nutzer), leftUser (an Raum) | user (bei leftUser) |
| message           | message       | Nutzer schickt Nachricht in den Chat, der Server speichert sie und schickt sie dann an alle in dem Raum zum Anzeigen                      | message                              | messageObject       |
| disconnecting     | keine         | Nutzer trennt Verbindung zum Socket und Socket gibt Information an Raum weiter                                                            | disconnection                        | user                |

## Frontend - (html)

## Frontend (css)

## Frontend (javascript)

## Deployment

Der Server kann mittels Docker oder Podman deployed werden. Hierbei reicht es im Projektverzeichnis `docker-compose up`
auszuführen, solange eine Internetverbindung besteht.

Dies funktioniert mittels zwei Dateien:

* Dockerfile
* docker-compose.yaml

### Dockerfile

In der Dockerfile wird aus dem Projekt ein Image gebaut. Dieses Image kann dann unabhängig von Betriebssystem und
installierter Software in einem Container genutzt werden.

Die Dockerfile ist auf folgende Weise aufgebaut:

`FROM node:latest`  
Das Image wird auf Basis des neuesten node.js Imagages gebaut.

`WORKDIR /user/src/app`  
Der Bau nutzt dann das angegebene Verzeichnis

`COPY package.json ./`  
Es werden die Node Module kopiert und unter gleichen Namen abgelegt

`RUN npm install`  
Nun werden die kopierten Module im Image installiert

`ENV DATABASE="webapp"`  
`ENV DATABASE_HOST="localhost"`  
`ENV DATABASE_USER="webapp"`  
`ENV DATABASE_PASSWORD="webapp"`

`COPY . .`  
Kopiert jetzt alle Projektdateien

`EXPOSE 5000`  
Öffnet den Port 5000 nach außen

`CMD [ "node", "controller.js"]`
Der Befehl zum Starten wird auf `node controller.js` gesetzt

### docker-compose.yaml

Mit der docker-compose.yaml wird angegeben, wie der Container aus den Images gebaut und konfiguriert wird.

In einer docker-compose werden Services und Volumes definiert. Services sind die einzelnen Images, die im Container
genutzt werden udn Volumes definiert einen persistenten Speicher, der also beim Beenden des Containers nicht automatisch
gelöscht wird.

    services:
      node:
        //node configuration
      mysql:
        //mysql confguration

    volumes:
      db_data:

Der node Service wird folgendermaßen definiert:

    build: .

Es wird mit einer Dockerfile im gleichen Verzeihnis ein Image gebaut

    ports:
        - "5000:5000"

Der Container nutzt dann den internen Port 5000 und bildet ihn auf den Host Port 5000 ab

    depends_on:
        mysql:
            condition: service_healthy

Hierdurch wird der node service erst gestartet, nachdem der mysql service 'healthy' gestartet ist (wird im mysql service
definiert)

    environment:
        DATABASE: webapp
        DATABASE_HOST: mysql
        DATABASE_USER: webapp
        DATABASE_PASSWORD: webapp

Hier werden noch Umgebungsvariablen mitgegeben. Für die gewerbliche Nutzung sollten diese anders gesetzt werden.

Der mysql Service wird dann folgendermaßen konfiguriert:

    image: mysql:8.0

Es wird das mysql Image 8.0 vom öffentlichen Docker Hub verwendet.

    container_name: mysql

Dem Container wird der Name mysql gegeben.

    restart: always

Wenn der Container abstürzen sollte fährt er automatisch wieder hoch.

    volumes:
        - db_data:/var/lib/mysql
        - ./dbMigration.sql:/docker-entrypoint-initdb.d/init.sql:ro

Der Service nutzt den persistenten Speicher, der in Volumes definiert ist und führt beim ersten Start die
dbMigration.sql Datei aus.

    environment:
        MYSQL_USER: webapp
        MYSQL_PASSWORD: webapp
        MYSQL_ROOT_PASSWORD: webapp
        MYSQL_DATABASE: webapp
    ports:
      - "3306:3306"

Dasselbe, wie bei node.

    healthcheck:
        test: [ "CMD", "mysqladmin", "ping", "-h", "localhost" ]
        timeout: 5s
        retries: 10

Hier wird dann noch der healthcheck definiert. Es wird zum testen der Befehl mysqladmin ausgeführt und wenn kein Fehler
auftritt gilt der service als 'healthy'

# Glossar

* Backend: Serverseitige Anwendungen eines Webauftritts (z.B. node)
* Frontend: Clientseitige Anwendungen eines Webauftritts (html, css, js)
*

# Literaturverzeichnis

# Abbildungen
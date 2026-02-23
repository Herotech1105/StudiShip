# StudyShip

## Backend - (javascript)

### Struktur

<img src="./images/backendStructure.svg">

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

Dotenv wird genutzt um Code und Laufzeitvariablen zu trennen. In diesem Projekt nutzen wir eine `.env`-Datei um die
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

## Frontend - (html)

## Frontend (css)

## Frontend (javascript)
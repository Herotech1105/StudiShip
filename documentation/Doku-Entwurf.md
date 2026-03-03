# StudyShip

Dies ist das Projekt StudyShip erstellt durch:

* Tim Dorozynski
* Lennart Esch
* Barnabas Steiner
* Jannis Weber

[Unser Github Repository](https://github.com/Herotech1105/StudiShip)

# Platzhalter Inhaltsverzeichnis

# Idee

Die Intention hinter diesem Projekt ist es, eine Platform bereitzustellen, auf der sich Lerngruppen bilden können.  
Es soll Räume geben, die einem Fach/Kurs zugeordnet sind, in denen man sich kurz austauschen kann.  
Die primäre Aufgabe der Plattform ist es Gruppen zu helfen sich zu finden und auf einfachem Weg eine erste Kommunikation
zu ermöglichen.  
Hier der erste Sketch der Anwendung:  
<img src="./Fist draft for StudiShip.jpeg">

## Architekturelle Entscheidungen

Von Beginn des Projekts an stand fest, dass wir eine Datenbank benötigen, um sowohl Nutzer-Daten, als auch die Chaträume
zu speichern.  
Hier haben wir uns für MySQL entschieden, weil diese einfach zu bedienen ist und manche von uns bereits Vorerfahrung mit
ihr hatten.  
Durch die Arbeit an den Laboren kamen wir zu dem Schluss, dass wir das Backend mit Node aufsetzen sollten und nahmen
auch express als middleware.    
Es war zwischenzeitlich auch geplant eine REST-API zu implementieren, aber wir fanden diese für einen Live-Chat nicht
optimal. Deswegen haben wir uns dann entschieden einen Websocket-Server mit socket.io zu verwenden, um beidseitige
Kommunikation zwischen Server und Client nutzen zu können, anstatt dass nur der Client Ressourcen beim Server anfragen
kann.  
Gegen Ende des Projekts haben wir uns dann noch entschieden den Server mit Docker bzw. Podman zu deployen. Die Idee
dahinter war, dass aufwändigere Installationsanleitungen dadurch vermieden werden können.

# Umsetzung

## Backend - (javascript)

### Technologien

#### Node.js:

Node.js wird als Laufzeitumgebung verwendet, um den Server zu betreiben.
Es dient als Basis für alle andere Software, die auf den Server betrieben wird.

#### Express:

Express ist ein Webframework für Node.js. Hier wird es verwendet, um auf eine request eine Webseite als response zu
rendern.

#### Handlebars:

Handlebars Dateien (.hbs) sind templates für Webseiten. Diese nutzt das Backend um Webseiten zu rendern, bevor sie an
den Client geschickt werden.
`.hbs`-Dateien bestehen aus html Syntax und javascript Injektionen (wie z.B Objekte) in doppelt geschweiften
Klammern {{}}.

#### Dotenv:

Dotenv wird genutzt, um Code und Laufzeitvariablen zu trennen, in diesem Projekt wird eine `.env`-Datei verwendet, um
die
Parameter zur Verbindungsaufnahme für die Datenbank zu hinterlegen.

#### MySQL:

Für dieses Projekt wird `MySQL` als Datenbank und das npm Modul `mysql2` für die Node MySQL Schnittstelle verwendet. Zu
Nutzung und Setup später mehr.

#### Cookie-Parser:

`cookie-parser` wird verwendet, um mit Cookies zu arbeiten. Besonders nützlich ist hierbei die Möglichkeit ein
signiertes
Cookie zu erstellen, dass durch einen hash, der im backend gespeichert wird, genügend Sicherheit bietet, sodass
ein Cookie zur Authentifizierung des Nutzers nach der Anmeldung genutzt werden kann.

#### Socket.io:

`socket.io` wird verwendet, um den Server um Websockets zu ergänzen. Websockets können vom Client angesprochen werden,
wodurch es zu einem Handshake kommt, in dem die Daten für einen beidseitigen Verbindungsaufbau übergeben werden. Nach
dem Handshake können Client und Server dann über das Senden von Events miteinander kommunizieren. Socket.io bietet auch
die
Möglichkeit, dass der Server Clients in Gruppen einteilen kann und dann Events gleich an ganze Gruppen schicken kann (
broadcasting).

#### socket.io-cookie-parser:

Spezielle Schnittstelle für Cookie-Parser und Socket.io, damit der Websocketserver auf die signierten Cookies der
Clients zugreifen kann.

#### Nodemon:

Nodemon ist ein Entwicklungstool, das Dateiänderungen automatisch in das laufende Programm geladen werden. Es dient nur
dem Komfort bei der Entwicklung.

### Struktur

Das backend lässt sich in 3 Teile aufteilen:

* Model
* Views
* Controller

#### Model:

Im Model steckt die Logik des Backends. Die zentrale Komponente hier ist der Service, der vom Controller instanziert
wird.
Der Service stellt bei Instanzierung mit Hilfe der externen Funktion in `createDBConnection.js` eine Verbindung zur
Datenbank her.
Danach ist der Service vom Controller ansprechbar und nutzt dann die Methoden, die in die manager
unterteilt sind, um eine Antwort zu generieren.

##### Model-Dateien (javascript):

Im Ordner `model` befinden sich folgende JavaScript-Dateien:

* `service.js`  
  Zentrale Schnittstelle zwischen Controller und Logik. Kapselt die Aufrufe der einzelnen Manager-Dateien und
  übergibt die Datenbankverbindung.

* `authentication.js`  
  Prüft Login- und Registrierungsdaten, setzt bei Erfolg den signierten Login-Cookie und rendert bei Fehlern passende
  Rückmeldungen.

* `roomManager.js`  
  Enthält die komplette Raumlogik und Validierung: Dashboard-Liste, Raum laden, Raum erstellen, Raumdaten ändern, Owner
  wechseln,
  Mitglieder entfernen, Raum verlassen, Raum löschen sowie Hilfsfunktionen für Owner-/Mitgliedsprüfungen und
  Valiedierung der Nutzereingaben.

* `messageManager.js`  
  Speichert Chatnachrichten in der Datenbank, wenn diese kürzer als 255 Zeichen sind. Wirft sonst Fehler "Message is too
  long"

* `searchManager.js`  
  Implementiert die Raumsuche nach Namen und/oder Fach. Es werden nur Räume ausgegeben, denen man noch nicht beigetreten
  ist.

* `subjects.js`  
  Liefert die gültige Fächerliste, die in den Frontend-Formularen für Erstellung, Bearbeitung und Suche verwendet
  wird. Nimmt die Daten aus  `subjectList.txt`.

#### Views:

Views bezeichnet eine Liste von `.hbs` templates. Aus diesen wird dann die Webseite gerendert, indem Variablen und Werte
in die Template injiziert werden. Der Client erhält dann die fertige Seite, ohne dass er die Werte clientseitig selbst
einsetzen muss.

#### Controller:

Der Controller bietet sowohl Endpunkte für http POST- und GET-requests, als auch einen Websocketserver. Die http
Endpunkte können dann vom Nutzer erreicht werden, um Webseiten anzufordern oder Formulare (wie z.B den Login)
einzureichen.  
Der Websocket Server bietet die Möglichkeit, dass Server und Client in beide Richtungen miteinander über das Zusenden
von Events kommunizieren können.


<img src="./images/backendStructure.svg">

### Datenbank

Die Datenbank ist auf folgende Weise definiert:

`CREATE DATABASE IF NOT EXISTS webapp;`

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
| open              | roomId        | erster Verbindungsaufbau des Clients, der server fügt den client zur broadcasting Grupper für den Raum und einer Nutzerspezifischen hinzu |                                      |                     |
| giveSubjects      | keine         | Client fragt eine Liste aller zulässiger Fächer ab, Server schickt die Liste                                                              | subjects                             | subjectList         |
| delete            | roomId        | Client bittet um Löschung des Raums, wenn er die Rechte dazu hat wird der Raum gelöscht und alle Raummitglieder erhalten die ent          |                                      |                     |
| updateRoom        | room          | Client fordert Änderung des Raums an, Raum wird geändert, wenn die Rechte dafür da sind                                                   | updateRoom                           | room                |
| changeOwner       | owner, roomId | Client überträgt Besitz des Raums an neuen Nutzer, wenn er selbst Besitzer ist                                                            | changeOwner                          | owner               |
| removeUser        | user, roomId  | Nutzer wird aus dem Raum geworden, wenn Event vom Besitzer geschickt wird                                                                 |                                      |                     |
| leaveRoom         | roomId        | Nutzer verlässt den Raum, Änderung wird in Datenbank übernommen und Information an den Raum Socket weitergegeben                          | left (an Nutzer), leftUser (an Raum) | user (bei leftUser) |
| message           | message       | Nutzer schickt Nachricht in den Chat, der Server speichert sie und schickt sie dann an alle in dem Raum zum Anzeigen                      | message                              | messageObject       |
| disconnecting     | keine         | Nutzer trennt Verbindung zum Socket und Socket gibt Information an Raum weiter                                                            | disconnection                        | user                |

## Frontend - (html)


### 1. Öffentliche Seiten

#### `index.hbs` (Landing Page)

Die Startseite für nicht eingeloggte Nutzer.

- **Funktion:** Begrüßung und Vorstellung der Features (Kostenlos, Zielorientiert, Schnell).
- **Navigation:** Links zu Login und Registrierung.

#### `login.hbs` & `register.hbs` (Authentifizierung)

Formulare für den Zugang zur Plattform.

- **Login:** Fragt `Name` und `Password` ab. Zeigt Fehlermeldungen (z. B. "Falsches Passwort") dynamisch an, wenn die
  Variable `{{message}}` übergeben wird.
- **Register:** Erfordert Name, E-Mail und doppelte Passworteingabe zur Bestätigung.

### 2. Internerbereich (Eingeloggt)

#### `dashboard.hbs` (Startseite)

Die zentrale Anlaufstelle nach dem Login.

- **Header:** Zeigt "Willkommen, {{user}}!".
- **Suche:** Ermöglicht Eingabe des Namen der gesuchten Gruppe oder das Öffnen der Suche mit Filter
- **Lerngruppen-Liste:** Iteriert mit `{{#each rooms}}` über alle Gruppen, in denen der Nutzer Mitglied ist, und zeigt
  diese als Karten an.
- **Fallback:** Zeigt "Du bist in keiner Gruppe", falls die Liste leer ist.

#### `search.hbs` & `searchResult.hbs` (Suche)

Ermöglicht das Finden von Lerngruppen.

- **Filter:** Suche nach Text (Name) und Dropdown-Filter für die "Kursart" (Subjects).
- **Ergebnisse:** `searchResult.hbs` zeigt die Trefferliste an oder die Meldung "Keine passende Lerngruppe gefunden".

#### `roomAdder.hbs` (Erstellung)

Formular zum Anlegen einer neuen Gruppe.

- **Felder:** Name, Beschreibung, Kursart (Dropdown) und Privatsphäre (Public/Invitation only).

### 3. Kerndienstleistung: `room.hbs` (Lerngruppen-Raum)

Dies ist die komplexeste View der Anwendung. Sie unterscheidet stark zwischen **Owner** (Ersteller) und normalem *
*Mitglied**.

**Features:**

- **Rechte-Management (`isOwner`):**
    - Nur der Owner sieht Buttons zum Bearbeiten, Speichern und Löschen des Raums.
    - Nur der Owner kann Mitglieder kicken (`x`) oder zum Admin befördern (`Zum Admin`).
    - Mitglieder sehen nur den "Verlassen"-Button.
- **Chat-System:**
    - Linke Seite: Chat-Verlauf (`{{#each messages}}`) und Eingabefeld.
- **Mitglieder-Liste:** Links (Desktop) oder unten (Mobile) werden alle Teilnehmer angezeigt.
- **Modals (Popups):** Versteckte Warnfenster für kritische Aktionen (Kick, Admin-Wechsel, Löschen), die per JavaScript
  eingeblendet werden.

## Frontend (CSS)

### CSS Struktur

Das Design der Webseite wird über mehrere CSS dateien erstellt alle html/hbs seiten haben die Allgemeiene `styles.css` datei
eingebunden und eine eigene Datei die den gleichen namen hat wie die html datei auf welche sie sich bezieht z.B.
`dashboard.hbs` & `dashboard.css`.
Dabei ist es wichtig, dass die `styles.css` datei vor den speziellen CSS Dateien im html eingebunden wird, da die untere
css datei eine Höhere prioität hat. Desweiteren gibt es für spezielle fälle noch zusätzliche CSS Dateien z.B.
`roomConfirmation.css`.

### Dynamisches Design / Responsive Design 
Die Webseite ist grudsätzlich so Designed, dass sie sowohl auf den Desktop im Querformat so wie im Hochformat bzw. auf Mobielen Endgeräten funktioniet dies wird durch das Dynamische Design der webseit erreicht unteranderem mit folgendem Hilfsmitteln: 
#### Media Queries
Media Queries sind CSS-Regeln, die nur unter bestimmten Bedingungen wie der Bildschirmbreite angewendet werden. Sie ermöglichen es, das Design für verschiedene Geräte anzupassen.

z.B.: Werden Media Queries benutzt um auf unserer `room.hbs` seite die anordnung der Lerhrngruppen von Nebeneinander im Querformat zu Untereinander Im Hochvormat bzw. wenn die breite kleiner als `768px` ist.: 
``` css
@media (max-width: 768px) {
            ul {
                flex-direction: column; 
              }
        }
```
#### Flexboxen
Flexboxen werden fast in der gesamten Anwendung verwendet, um flexible und responsive Layouts zu erstellen. Hier ist ein Beispiel für die Verwendung von Flexbox:
```css
.search-container {
  display: flex;               
  justify-content: center;    
  align-items: center;
} 
```

### StudyShip "Corporate Design"

#### Allgemeines
- Die Hauptfarben von StudyShip sind Rot & Weiß sowie Weiß-Grau und schwarz Beispielsweise: Buttons sind in der Regel rot mit weißer Schrift
- Die Schriftart die wir verwenden ist `Segoe UI` falls der browser diese nicht kennt haben wir follgende schriftarten als ersatz definiert: `Tahoma` & `sans-seri`.
- Standardmäßig ist der zeilenabstand `1.6`:
``` css 
    line-height: 1.6;
```
- Der Hintergrund von StudyShip ist Grau-Weiß, es wird oft ein Hintergrundbild verwendet.
``` css
    background: linear-gradient(white, lightgray);
    background-repeat: no-repeat;
    background-attachment: fixed; 
```
- Die Buttons von unserer Webseit sind Rot mit Weißer schrift, die Ecken sind standardmäßig abgerundet mit einem Radius
  von 8px

Standard Buttons:
``` css
button {
    background-color: red; 
    border: none;
    border-radius: 8px;
    padding: 0.5rem 2rem; 
    color: white; 
    cursor: pointer;
}

button:hover {
    background-color: darkred;
    color: darkgray;
}
```

## Frontend (javascript)

### Technologien

#### Vanilla JavaScript:

Im Frontend wird bewusst ohne zusätzliches Framework gearbeitet. Die Interaktionen erfolgen direkt über DOM-APIs.

#### Socket.io Client:

In den Raumseiten wird der Socket.io Client verwendet, um Echtzeitkommunikation mit dem Websocket-Server umzusetzen.

### Struktur

Die clientseitige JavaScript-Logik ist in folgende Dateien aufgeteilt:

* `public/scripts/room.js`
* `public/scripts/searchBar.js`

#### room.js

`room.js` steuert alle Interaktionen innerhalb eines Raums:

* Aufbau der Websocket-Verbindung (`open` Event)
* Senden und Anzeigen von Chat-Nachrichten
* Bearbeiten von Raumdaten (Titel, Beschreibung, Fach)
* Rollen- und Mitgliederaktionen (Nutzer entfernen, Besitzer wechseln, Raum löschen)
* Share-Funktion (Raumlink in Zwischenablage kopieren)
* Ein-/Ausblenden von Owner-Funktionen im Edit-Modus
* Anzeige und Verarbeitung von Bestätigungs-Popups

Die Datei arbeitet stark eventbasiert: Nutzeraktionen in der UI lösen Socketevents aus, eingehende Socketevents
aktualisieren die Seite.

#### searchBar.js

`searchBar.js` verarbeitet die Eingabe der Suchleiste:

* Bei Enter wird dynamisch ein Formular erzeugt
* Das Formular sendet einen POST-Request an `/search`
* Das gewählte Fach wird dabei auf `any` gesetzt, wenn nur über die Suchleiste gesucht wird

### Wichtige Client-Funktionen in room.js

* `sendMessage()`: Sendet Chat-Nachrichten per Socket an den Server
* `updateRoom()`: übermittelt geänderte Raumdaten an den Server
* `changeOwner(owner)`: Startet die Besitzerübertragung (mit Popup-Bestätigung)
* `removeUser(user)`: Entfernt ein Mitglied (mit Popup-Bestätigung)
* `deleteRoom()`: Löscht den Raum (mit Popup-Bestätigung)
* `copyRoomLink()`: Kopiert den Raumlink in die Zwischenablage
* `setEditMode(enabled)`: Schaltet den Bearbeitungsmodus

### Clientseitige Socketevents

| Event vom Client | Beschreibung                         |
|------------------|--------------------------------------|
| `open`           | Nutzer tritt einem Raumchannel bei   |
| `message`        | Nutzer sendet Chat-Nachricht         |
| `updateRoom`     | Nutzer speichert geänderte Raumdaten |
| `changeOwner`    | Besitzerrechte werden übertragen     |
| `removeUser`     | Mitglied wird aus dem Raum entfernt  |
| `delete`         | Raum wird gelöscht                   |
| `leaveRoom`      | Nutzer verlässt den Raum             |

| Event vom Server | Beschreibung                                             |
|------------------|----------------------------------------------------------|
| `message`        | Neue Nachricht wird angezeigt                            |
| `updateRoom`     | Raumtitel wird clientseitig aktualisiert                 |
| `changeOwner`    | Owner-Anzeige wird aktualisiert                          |
| `kickedUser`     | Entferntes Mitglied wird aus der Liste entfernt          |
| `kick`           | Gekickter Nutzer wird auf die Startseite umgeleitet      |
| `left`           | Nutzer wird nach Verlassen auf die Startseite umgeleitet |
| `deleteRoom`     | Alle Mitglieder werden nach Raumlöschung umgeleitet      |
| `invalid`        | Fehlermeldung vom Server wird ausgegeben                 |

### Owner Funktionen

* Owner-Funktionen werden nur für Besitzer eingeblendet.
* Der Owner sieht den `Verlassen`-Button nicht. Kann dafür den Raum Löschen.
* Im Edit-Modus kann der Owner sich selbst nicht als Ziel für `Zum Admin` oder `x` auswählen.

## Deployment

Der Server kann mittels Docker oder Podman deployed werden. Hierbei reicht es im Projektverzeichnis `docker-compose up`
auszuführen, solange eine Internetverbindung besteht.  
Der Server startet dann auf Port 5000.

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
* REST: Representational State Transfer
* MVC-Architektur: Aufteilung des backends eines Webauftritts in einen Controller, der die Anfragen entgegen nimmt, das
  Model, in welchem die Logik des Servers steckt, und ein View-Segment, in dem die graphische Ausgabe erzeugt wird.
* Websocket: Kommunikationstool zwischen client und Server, bei dem beidseitig durch das Zusenden von Events
  kommuniziert wird

# Literaturverzeichnis

Für alle aufgeführten Webseiten gilt der letzte Zugriff am 02.03.2026 18:00 Uhr

## Backend

* [Node.js Tutorial](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
* [Express Tutorial](https://expressjs.com/en/starter/hello-world.html)
* [MySQL2 Modul](https://www.npmjs.com/package/mysql2)
* [MySQL2 Doku](https://sidorares.github.io/node-mysql2/docs)
* [Cookie-Parser Modul](https://www.npmjs.com/package/cookie-parser)
* [Handlebars (hbs) Modul](https://www.npmjs.com/package/hbs)
* [Handlebars Doku](https://handlebarsjs.com/guide/)
* [Dotenv für Node - Modul und Guide](https://www.npmjs.com/package/dotenv)
* [Socket.io Tutorial](https://socket.io/docs/v4/tutorial/introduction)

## View

### HTML
* [Markdownguide](https://www.markdownguide.org/basic-syntax/)
* [HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference)
* [Google Suche mit Features](https://www.google.com/)
* [Kulturbanause Tutorial](https://kulturbanause.de/blog/svg-grafiken-in-websiteshtml-seiten-einbinden/)
* [Handelbars Tuorial](https://guides.emberjs.com/v2.6.0/templates/)
* 
### CSS
* [w3schools CSS](https://www.w3schools.com/css/)
* [SelfHTML Turoial](https://wiki.selfhtml.org/wiki/CSS/Tutorials/Ausrichtung/position)
* [Sidemust Tuorial](https://sitemust.com/blog/padding-vs-border-vs-margin-difference-css/)
* [CSS Reference](https://developer.mozilla.org/de/docs/Web/CSS)
### Java Script
* [Socket.io](https://socket.io/docs/v4/emitting-events/)
* [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
* [Co-Pilot](https://copilot.microsoft.com/)
* [Chat-GPT](https://chatgpt.com/)
# Abbildungen

Sofern nicht anders angegeben sind alle Abbildungen selbst erstellt.
Zur Erstellung wurden unter anderem folgende Software und Webseiten verwendet:

* [Draw.io](https://app.diagrams.net/)
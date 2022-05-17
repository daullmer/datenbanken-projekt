# Programm ausführen
1. npm Modules installieren
`npm install`
1. Server starten
`npm run start`
1. `http://localhost:6001`im Browser öffnen

# Zugriff auf die Datenbank
Die Datenbank ist in MongoDB Atlas gehostet. Zugreifen können Sie gerne über MongoDB Compass mit dem Connection String aus der `.env`-Datei. In der Datenbank `bikes` gibt es die Tabelle `bikes`, welche die Daten enthält. Die Views `bike_locations_by_datehour` und `bikeid_locations` sortieren die Daten um, um einen einfachen Zugriff auf die benötigten Daten zu erhalten.

# GymRats

Εργασία Εξαμήνου για το μάθημα των Δικτυοκεντρικών Πληροφοριακών Συστημάτων

Μέλη:

- Ορέστης Καραπιπέρης (ΑΜ: Ε20063)
- Παναγίωτης Μάρκος Κλωνής (ΑΜ: Ε20071)
- Δημήτρης Μαρτίνος (ΑΜ: Ε20094)
- Παναγιώτης Τσαγκουρής (ΑΜ: Ε20164)

### Documentation

Το documentation υπάρχει στο zip (`gymrats_documentation.html`) αλλά μπορείτε να το βρείτε και στο http://83.212.75.182:6875/books/gymrats-documentation (προτείνεται)

>  Τρέχει στην open-source πλατφόρμα BookStack σε δικό μας server, στον okeanos-knossos της GRNET

### Codebase

Υπάρχει και στο zip της εργασίας αλλά και στο GitHub repo μας: https://github.com/JustDankas/dyktiokedrika

### Εκτέλεση της εφαρμογής

Η εφαρμογή είναι ήδη ανεβασμένη σε δικό μας server, στις διευθύνσεις: 

- Front-End: [http://83.212.75.182:4242/](http://83.212.75.182:4242/)
- Back-End: [http://83.212.75.182:8420/](http://83.212.75.182:8420/)
- MySQL: 83.212.75.182:3385
- phpMyAdmin: [http://83.212.75.182:9292](http://83.212.75.182:9292)
    - Username: `root`
    - Password: `d1kti0k3ntrik@` (και για την MySQL και για το phpMyAdmin)

Αν ωστόσο θέλετε να τρέξετε την εφαρμογή locally, ***υπάρχουν 3 τρόποι***:

#### 1) docker-run (προτείνεται)

Για να να τρέξετε το front-end και το back-end με Docker, αρκεί να έχετε εγκατεστημένο το docker-engine και να τρέξετε απλά αυτές τις δύο εντολές στο terminal:

- Front-end:  
    ```bash
    docker run -d \
      --name gymrats_frontend \
      --restart always \
      -p 4242:4200 \
      -e TZ=Europe/Athens \
      orestiskarap/dyktiokedrika_frontend
    ```
- Back-end:  
    ```bash
    docker run -d \
      --name gymrats_backend \
      --restart always \
      -p 8420:8000 \
      -e TZ=Europe/Athens \
      orestiskarap/dyktiokedrika_backend
    ```
    
    Το front-end θα τρέχει στην διεύθυνση [http://localhost:4242](http://localhost:4200) και το back-end στην διεύθυνση [http://localhost:8420](http://localhost:8000)

#### 2) docker-compose

Αν θέλετε να έχετε ένα πιο ομαδοποιημένο bundle των υπηρεσιών, μπορείτε να τρέξετε την εφαρμογή με docker-compose με τα ακόλουθα βήματα:

1. Δημιουργήστε έναν νέο φάκελο (πx GymRats)
2. Μέσα σε αυτόν τον φάκελο, δημιουργείστε ένα αρχείο ονόματι `docker-compose.yml` και κάντε copy-paste τον ακόλουθο κώδικα:  
    ```yaml
    version: '3'
    services:
      frontend:
        image: orestiskarap/dyktiokedrika_frontend
        container_name: gymrats_frontend
        restart: always
        ports:
          - "4242:4200"
        environment:
          TZ: Europe/Athens
      backend:
        image: orestiskarap/dyktiokedrika_backend
        container_name: gymrats_backend
        restart: always
        ports:
          - "8420:8000"
        environment:
          TZ: Europe/Athens
    ```
3. Κάντε cd μέσα στον φάκελο αν δεν είστε ήδη και τρέξτε την εντολή `docker-compose up -d`

Το front-end θα τρέχει στην διεύθυνση [http://localhost:4242](http://localhost:4200) και το back-end στην διεύθυνση [http://localhost:8420](http://localhost:8000)

#### 3) Τρέχοντας manually τις υπηρεσίες με Node.JS

Αυτός είναι ένας ελάχιστα πιο δύσκολος τρόπος

<p class="callout warning">Πρέπει να έχετε εγκατεστημένη την NodeJS (έκδοση 16 για λόγους συμβατότητας με το front-end)</p>

- Frontend: 
    1. Ανοίξτε ένα terminal και κάντε cd μέσα στον φάκελο `gymrats-frontend`
    2. Τρέξτε τις εντολές `npm install` και έπειτα `npm start`
- Backend: 
    - 1. Ανοίξτε ένα άλλο terminal και κάντε cd μέσα στον φάκελο `gymrats-backend`
    - 2. Τρέξτε τις εντολές `npm install` και έπειτα `npm start`

Το front-end θα τρέχει στην διεύθυνση [http://localhost:4200](http://localhost:4200) και το back-end στην διεύθυνση [http://localhost:8000](http://localhost:8000)

> Αν κλείσετε κάποιο από τα δύο terminal, τότε θα πέσει το εκάστοτε service.

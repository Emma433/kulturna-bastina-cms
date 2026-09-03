# Baština Punta

Web aplikacija za digitalno očuvanje i prezentaciju nematerijalne kulturne baštine mjesta Punat.

Aplikacija je razvijena kao praktični dio završnog rada na stručnom prijediplomskom studiju Informatika Veleučilišta u Rijeci.

## Opis projekta

Cilj projekta je razviti web aplikaciju koja na jednom mjestu objedinjuje informacije o nematerijalnoj kulturnoj baštini mjesta Punat.

Aplikacija omogućuje predstavljanje lokalnih običaja kroz tekstualne sadržaje i fotografije te pregled budućih kulturnih događanja i termina njihova održavanja.

Sustav se sastoji od javnog dijela namijenjenog posjetiteljima i zaštićenog administratorskog dijela za upravljanje sadržajem.

## Glavne funkcionalnosti

### Javni dio

- prikaz početne stranice
- pregled objavljenih običaja
- pretraživanje običaja
- prikaz detalja pojedinog običaja
- prikaz fotografija povezanih s običajima
- pregled budućih događanja
- pregled prethodnih događanja
- prikaz detalja pojedinog događanja
- prikaz naslovne fotografije događanja
- galerija fotografija pojedinog događanja
- stranica „O projektu“
- prilagođena stranica za grešku 404
- responzivan prikaz prilagođen računalima, tabletima i mobilnim uređajima

### Administratorski dio

- prijava i odjava administratora
- zaštita administratorskih ruta
- administratorska nadzorna ploča
- dodavanje, uređivanje i brisanje običaja
- upravljanje statusom objave običaja
- dodavanje naslovnih fotografija
- upravljanje galerijom fotografija običaja
- dodavanje, uređivanje i brisanje događanja
- povezivanje događanja s običajima
- upravljanje statusom objave događanja
- dodavanje naslovne fotografije događanja
- dodavanje i brisanje fotografija pojedinog događanja
- dodavanje opisa fotografijama
- prikaz poruka o uspješno izvršenim administratorskim radnjama

## Korištene tehnologije

Aplikacija je razvijena korištenjem sljedećih tehnologija i alata:

- Node.js
- Express
- EJS
- MySQL
- Bootstrap
- JavaScript
- HTML
- CSS
- Git
- GitHub
- HeidiSQL
- Visual Studio Code

## Arhitektura aplikacije

Projekt je organiziran prema MVC pristupu uz odvajanje pojedinih odgovornosti aplikacije.

- `controllers` sadrži logiku za obradu korisničkih zahtjeva i komunikaciju s bazom podataka
- `views` sadrži EJS predloške za prikaz javnog i administratorskog korisničkog sučelja
- `routes` definira dostupne rute aplikacije
- `middlewares` sadrži middleware za zaštitu administratorskih ruta i prijenos fotografija
- `config` sadrži konfiguraciju potrebnu za povezivanje s bazom podataka
- `public` sadrži statičke datoteke, uključujući CSS, JavaScript i fotografije
- `scripts` sadrži pomoćne skripte, uključujući skriptu za kreiranje administratorskog računa

## Struktura projekta

```text
kulturna-bastina-cms/
├── config/
├── controllers/
├── middlewares/
├── models/
├── public/
│   ├── css/
│   ├── images/
│   └── js/
├── routes/
├── scripts/
├── views/
│   ├── admin/
│   └── partials/
├── .env.example
├── .gitignore
├── app.js
├── bastina_punta_baza.sql
├── package.json
├── package-lock.json
└── README.md
```

## Baza podataka

Za pohranu podataka koristi se relacijska baza podataka MySQL.

SQL datoteka potrebna za izradu tablica i uvoz podataka nalazi se u korijenskoj mapi projekta:

```text
bastina_punta_baza.sql
```

Baza sadrži tablice za:

- administratore
- običaje
- događanja
- fotografije običaja
- fotografije događanja

Iz sigurnosnih razloga SQL datoteka ne sadrži stvarni administratorski korisnički račun korišten tijekom razvoja aplikacije.

## Instalacija projekta

Za lokalno pokretanje aplikacije potrebno je imati instalirane:

- Node.js
- npm
- MySQL

Nakon preuzimanja repozitorija potrebno je otvoriti terminal u glavnoj mapi projekta i instalirati potrebne pakete:

```bash
npm install
```

## Postavljanje baze podataka

Potrebno je kreirati MySQL bazu podataka te u nju uvesti datoteku:

```text
bastina_punta_baza.sql
```

SQL datoteka sadrži strukturu tablica i podatke potrebne za prikaz sadržaja aplikacije.

## Konfiguracija okruženja

Projekt koristi varijable okruženja za podatke koji se ne smiju spremati u javni GitHub repozitorij.

Primjer potrebne konfiguracije nalazi se u datoteci:

```text
.env.example
```

Na temelju datoteke `.env.example` potrebno je u korijenskoj mapi projekta kreirati vlastitu `.env` datoteku.

Primjer:

```env
DB_HOST=adresa-posluzitelja
DB_PORT=3306
DB_USER=korisnicko-ime
DB_PASSWORD=lozinka
DB_NAME=naziv-baze

SESSION_SECRET=unesite-dugu-nasumicnu-vrijednost

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=unesite-sigurnu-lozinku
```

Vrijednosti je potrebno prilagoditi vlastitom MySQL okruženju.

Datoteka `.env` navedena je u `.gitignore` datoteci i ne šalje se u javni GitHub repozitorij.

## Kreiranje administratorskog računa

Administratorski dio aplikacije zaštićen je autentifikacijom i sesijom.

Iz sigurnosnih razloga pristupni podaci stvarnog administratorskog računa korištenog tijekom razvoja nisu objavljeni u GitHub repozitoriju niti u SQL datoteci.

Za kreiranje vlastitog administratorskog računa potrebno je u `.env` datoteci postaviti:

```env
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=unesite-sigurnu-lozinku
```

Nakon postavljanja podataka administratorski račun kreira se naredbom:

```bash
node scripts/createAdmin.js
```

Skripta hashira unesenu lozinku pomoću biblioteke `bcrypt` prije spremanja administratorskog računa u bazu podataka.

Nakon uspješnog kreiranja računa moguće je prijaviti se u administratorski dio aplikacije pomoću postavljenog korisničkog imena i lozinke.

## Pokretanje aplikacije

Nakon instalacije paketa, postavljanja baze podataka i konfiguracije `.env` datoteke aplikacija se pokreće naredbom:

```bash
npm start
```

Naredba pokreće glavnu datoteku `app.js` pomoću Node.js okruženja.

## Sigurnost

Osjetljivi podaci poput pristupnih podataka MySQL baze, administratorske lozinke i tajne vrijednosti sesije nisu pohranjeni u javnom repozitoriju.

Datoteka `.env` isključena je iz verzioniranja pomoću `.gitignore` datoteke.

Administratorske lozinke ne spremaju se u bazu podataka kao običan tekst, nego u hashiranom obliku pomoću biblioteke `bcrypt`.

Prijenos fotografija ograničen je na podržane slikovne formate JPG, PNG i WEBP, uz ograničenje veličine datoteke.

Administratorske rute dostupne su samo autentificiranom administratoru.

## Autor

Emma Žnidarić

Stručni prijediplomski studij Informatika  
Veleučilište u Rijeci

Projekt je izrađen kao praktični dio završnog rada:

**„Razvoj web aplikacije za digitalno očuvanje i prezentaciju nematerijalne kulturne baštine na primjeru mjesta Punat“**

Rijeka, 2026.
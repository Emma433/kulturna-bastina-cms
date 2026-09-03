# Baština Punta

Web aplikacija za digitalno očuvanje i prezentaciju nematerijalne kulturne baštine mjesta Punat.

Aplikacija je razvijena kao praktični dio završnog rada na stručnom prijediplomskom studiju Informatika Veleučilišta u Rijeci.

## Opis projekta

Cilj aplikacije je objediniti informacije o puntarskim običajima, tradicijama i njihovim održavanjima na jednom mjestu.

Sustav istodobno služi kao:

- digitalni arhiv običaja
- kalendar budućih događanja
- arhiva prethodnih održavanja
- sustav za upravljanje sadržajem

Javni dio aplikacije dostupan je svim posjetiteljima, dok administratorski dio omogućuje upravljanje običajima, događanjima i fotografijama.

## Glavne funkcionalnosti

### Javni dio

- prikaz početne stranice
- pregled objavljenih običaja
- pretraživanje običaja
- prikaz detalja pojedinog običaja
- galerija fotografija
- pregled budućih događanja
- arhiva prethodnih održavanja
- stranica o projektu
- prilagođena stranica za grešku 404

### Administratorski dio

- prijava i odjava administratora
- zaštita administratorskih ruta
- nadzorna ploča sa statistikama
- dodavanje, uređivanje i brisanje običaja
- upload naslovne slike
- upravljanje galerijom fotografija
- dodavanje, uređivanje i brisanje događanja
- status skice i objavljenog sadržaja
- poruke o uspješno izvršenim radnjama

## Korištene tehnologije

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

Aplikacija je organizirana prema MVC pristupu:

- `models` i SQL upiti predstavljaju podatkovni sloj
- `views` sadrži EJS predloške
- `controllers` obrađuje zahtjeve i poslovnu logiku
- `routes` definira dostupne URL rute
- `middlewares` sadrži autentifikaciju i upload datoteka
- `public` sadrži CSS, JavaScript i slike

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
├── package.json
└── README.md
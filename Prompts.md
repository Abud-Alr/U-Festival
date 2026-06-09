# ❤️U Festival PWA — Prompt Log

Hieronder staan alle 46 prompts die ik aan de AI-assistent (Antigravity) heb gesteld tijdens het ontwikkelen van de ❤️U Festival PWA.

---

### Prompt 1 — 24 april 2026, 11:40
> Ik moet een Progressive Web App (PWA) bouwen voor het ❤️U festival in Utrecht. Het is een tweedaags festival voor studenten op 15 en 16 augustus 2026. Kun je me helpen met het opzetten van de projectstructuur? Ik wil Vite gebruiken als build tool.

### Prompt 2 — 24 april 2026, 11:55
> Kun je een Vite project initialiseren met vanilla JavaScript (geen framework), en meteen de mappenstructuur aanmaken voor: `src/js/`, `src/css/`, `src/data/`, `assets/`, `public/`, en `scripts/`? Voeg ook een basis `index.html` toe.

### Prompt 3 — 24 april 2026, 12:05
> Ik heb documentatie over de opdracht in een Word-bestand. Kun je me helpen om een `Docs/` map aan te maken en de bestanden te organiseren? Ik heb een Tech Stack document en een PWA onderzoek nodig.

### Prompt 4 — 24 april 2026, 12:15
> Maak een `README.md` aan voor het project met de naam "U-Festival" en een korte beschrijving.

### Prompt 5 — 19 mei 2026, 10:00
> Ik heb nu alle content voor het festival: artiestenfoto's (PNG), een floorplan (SVG) met losse markers, een blokkenschema (PDF), en het Sansation-lettertype als zip. Kun je me helpen om alles netjes in de `assets/` map te organiseren? De artiesten zijn: Armin van Buuren, Chef'Special, De Staat, Dotan, Eefje de Visser, Froukje, Kensington, Martin Garrix, Navarone, Spinvis, en Within Temptation.

### Prompt 6 — 19 mei 2026, 10:30
> Ik heb ook foto's van de vier podia: Proton (hoofdpodium), The Lake (bij het water), The Club (indoor), en Hangar (industrieel). Plus een wit en zwart logo als SVG en PNG. Zet die ook in `assets/Content/`.

### Prompt 7 — 19 mei 2026, 11:00
> De floorplan SVG heeft losse marker-iconen voor: bar, entrance/exit, first aid, food, ice cream, locker, merchandise, stages (ponton, lake, club, hangar), en toilet. Organiseer die in `assets/FloorPlan/`.

### Prompt 8 — 19 mei 2026, 11:30
> Ik heb wireframe-voorbeelden en iPhone mockups als referentie. Maak een `Examples/` map en zet daar de wireframe, mockups en de kaart met markers-voorbeeld SVG.

### Prompt 9 — 19 mei 2026, 13:00
> Kun je een `acts.json` databestand aanmaken in `src/data/` met alle 11 artiesten? Elk artiest moet een id, naam, genre, beschrijving (NL en EN), afbeeldingspad, en een YouTube video-ID hebben.

### Prompt 10 — 19 mei 2026, 13:30
> Maak nu een `schedule.json` aan met het blokkenschema. Er zijn 4 podia en 2 dagen (zaterdag 15 aug en zondag 16 aug). Elk blok heeft een actId, stageId, startTime, endTime, en day.

### Prompt 11 — 19 mei 2026, 14:00
> Maak een `stages.json` aan met de 4 podia: Proton Stage, The Lake, The Club, en Hangar. Elk podium moet een id, naam, beschrijving (NL/EN), coördinaten (x, y) voor op de kaart, en een icoonpad hebben.

### Prompt 12 — 19 mei 2026, 14:20
> Ik heb ook een `info.json` nodig met festivalinformatie georganiseerd in secties: Algemeen, Bereikbaarheid, Regels, Eten & Drinken, en Duurzaamheid. Alles tweetalig (NL/EN) en met een accordion-structuur.

### Prompt 13 — 19 mei 2026, 14:40
> Maak een `translations.json` met alle UI-strings in het Nederlands en Engels. Denk aan navigatie-labels, knoppen, meldingen, PWA-installatie teksten, kaart-labels, en sociale feed strings.

### Prompt 14 — 19 mei 2026, 15:00
> Ik wil ook een `news.json` met dummy nieuwsberichten voor de live feed op de homepagina. Maak 3-4 voorbeeldberichten met een titel, body, timestamp, en type (info/alert/update).

### Prompt 15 — 19 mei 2026, 15:15
> Maak een lege `Prompts.md` aan zodat ik later kan bijhouden welke prompts ik heb gebruikt.

### Prompt 16 — 2 juni 2026, 09:00
> Nu ga ik beginnen met de echte code. Pak het Sansation-lettertype uit de zip en maak een `src/css/fonts.css` met @font-face declaraties voor Regular, Bold, BoldItalic, Italic, Light, en LightItalic varianten.

### Prompt 17 — 2 juni 2026, 09:30
> Maak een design system in `src/css/variables.css` met CSS custom properties. Het accent is vermiljoen rood (#F03228), met een licht en donker thema. Definieer variabelen voor kleuren, spacing, border-radius, schaduwen en typografie.

### Prompt 18 — 2 juni 2026, 10:00
> Maak een `src/css/base.css` met een CSS reset en basis-styling: box-sizing, smooth scrolling, body styling met Sansation font, en een `.no-scrollbar` utility class.

### Prompt 19 — 2 juni 2026, 10:30
> Maak `src/css/components.css` met herbruikbare component-stijlen: knoppen (primary, ghost, sm), kaarten, badges, accordion items, en de PWA-installatie banner.

### Prompt 20 — 2 juni 2026, 11:00
> Maak `src/css/pages.css` met pagina-specifieke stijlen. Ik heb secties nodig voor: de homepagina (social feed, shake-to-discover), info-pagina (accordions), schedule-pagina (tijdlijn grid), en map-pagina (leaflet container, markers).

### Prompt 21 — 2 juni 2026, 12:00
> Maak een `src/style.css` die alle CSS-bestanden importeert in de juiste volgorde: fonts, variables, base, components, pages.

### Prompt 22 — 2 juni 2026, 13:00
> Bouw een `ThemeManager` class in `src/js/theme.js` die een donker/licht thema kan wisselen. Sla de voorkeur op in localStorage en pas een `data-theme` attribuut toe op de `<html>` tag.

### Prompt 23 — 2 juni 2026, 13:20
> Maak een `LanguageManager` in `src/js/language.js` die NL/EN kan wisselen. Laad de translations.json, sla de taalvoorkeur op in localStorage, en bied een `t(key)` methode aan. Voeg ook een `applyLanguage()` methode toe die alle `[data-i18n]` elementen in de DOM bijwerkt.

### Prompt 24 — 2 juni 2026, 13:40
> Maak een `FavoritesManager` in `src/js/favorites.js` die artiesten kan opslaan als favoriet in localStorage. Methoden: `toggle(id)`, `isFavorite(id)`, `getFavorites()`.

### Prompt 25 — 2 juni 2026, 14:00
> Bouw een `NotificationManager` in `src/js/notifications.js`. Deze moet push-notificaties kunnen simuleren (aangezien er geen backend is). Gebruik setTimeout om herinneringen te plannen wanneer een favoriet artiest bijna begint. Voeg ook een `requestPermission()` methode toe.

### Prompt 26 — 2 juni 2026, 14:30
> Maak een hash-based `Router` in `src/js/router.js`. De router moet pagina's tonen/verbergen op basis van `window.location.hash`. Ondersteun de routes: home, info, schedule, map. Dispatch een custom `navchange` event bij routewijzigingen.

### Prompt 27 — 2 juni 2026, 14:50
> Maak animatie-helpers in `src/js/animations.js` met animejs. Ik wil functies voor: fade-in, slide-up, staggered entrance, en pulse animaties die ik op verschillende pagina's kan hergebruiken.

### Prompt 28 — 2 juni 2026, 15:10
> Bouw een `Header` component in `src/js/components/header.js`. De header toont het ❤️U logo (SVG), de titel "FESTIVAL", en twee toggle-knoppen: één voor dark/light mode (zon/maan icoon) en één voor taal (NL/EN). De header moet fixed bovenaan staan.

### Prompt 29 — 2 juni 2026, 15:30
> Maak een `Navbar` component in `src/js/components/navbar.js`. Een bottom navigation bar met 4 tabs: Home, Info, Programma, Kaart. Gebruik SVG-iconen en highlight de actieve tab met de accent kleur. De navbar moet fixed onderaan staan.

### Prompt 30 — 2 juni 2026, 15:45
> Bouw een `Popup` component in `src/js/components/popup.js`. Een modale bottom-sheet popup met een overlay, drag-to-close functionaliteit, en een sluitknop. De popup moet dynamische content kunnen tonen (HTML inject).

### Prompt 31 — 2 juni 2026, 16:00
> Maak een `icons.js` module in `src/js/components/` die SVG-iconen exporteert als strings voor de navbar tabs: home, info, schedule, en map iconen.

### Prompt 32 — 2 juni 2026, 16:30
> Bouw de `HomePage` in `src/js/pages/home.js`. Deze pagina moet drie secties hebben: (1) een "Shake to Discover" feature die bij schudden een willekeurige artiest toont, (2) een Live Social Feed waar bezoekers tekst, foto's en voice notes kunnen delen, en (3) een nieuws/meldingen sectie die items uit news.json toont.

### Prompt 33 — 2 juni 2026, 17:00
> De social feed op de homepagina moet een camera-knop hebben die de devicecamera opent via `navigator.mediaDevices.getUserMedia()`, een voice note knop die audio opneemt met de MediaRecorder API, en een tekstveld om berichten te typen. Berichten worden lokaal opgeslagen en getoond in een feed met timestamps.

### Prompt 34 — 2 juni 2026, 17:30
> De shake-to-discover feature moet de DeviceMotion API gebruiken om schudden te detecteren. Bij detectie toont het een willekeurige artiest met foto, naam en genre, plus knoppen om naar het programma of de kaart te navigeren. Voeg ook een fallback-knop toe voor desktop gebruikers.

### Prompt 35 — 2 juni 2026, 18:00
> Bouw de `InfoPage` in `src/js/pages/info.js`. Toon de festival-informatie uit info.json in een accordion-layout. Elke sectie kan worden uitgeklapt/ingeklapt met een soepele CSS-transitie. Toon ook een sponsoren-sectie onderaan.

### Prompt 36 — 2 juni 2026, 18:30
> Bouw de `SchedulePage` in `src/js/pages/schedule.js`. Toon een tijdlijn-grid met alle optredens per dag (Zaterdag/Zondag toggle). Elke act-kaart toont de artiestnaam, tijd, podium, en een favoriet-hartje. Bij tap op een kaart opent de popup met artiest-details, foto, beschrijving, en een embedded YouTube video.

### Prompt 37 — 2 juni 2026, 19:00
> De schedule pagina moet ook een "Toon Favorieten" filter toggle hebben die alleen gefavoriseerde artiesten toont. En als je een artiest favoriet maakt, moet de NotificationManager automatisch een herinnering plannen.

### Prompt 38 — 2 juni 2026, 19:30
> Bouw de `MapPage` in `src/js/pages/map.js` met Leaflet. Gebruik de festival floorplan SVG als image overlay op de kaart. Voeg custom SVG markers toe voor alle podia en faciliteiten. De coördinaten staan in stages.json.

### Prompt 39 — 2 juni 2026, 20:00
> Voeg GPS-localisatie toe aan de kaart met `navigator.geolocation.watchPosition()`. Toon de positie van de gebruiker als een pulserende blauwe stip op de kaart. Voeg ook een "Mijn Locatie" knop toe die naar de gebruiker pant.

### Prompt 40 — 2 juni 2026, 20:30
> Als je op een podium-marker tapt op de kaart, toon dan een popup met: podiumnaam, beschrijving, huidige act (op basis van het schema en de huidige tijd), en een knop om naar het programma te navigeren.

### Prompt 41 — 2 juni 2026, 21:00
> Maak de hoofdapp-class in `src/js/app.js` die alles samenvoegt: initialiseer alle managers, mount de header/navbar/popup componenten, maak alle pagina's aan, en configureer de router. Voeg ook de PWA-installatie banner logica toe.

### Prompt 42 — 2 juni 2026, 21:30
> Configureer `vite.config.js` met de vite-plugin-pwa. Stel de manifest in met de juiste naam, kleuren, iconen (192x192 en 512x512), en een service worker met runtime caching voor de assets.

### Prompt 43 — 2 juni 2026, 21:45
> Maak een `public/manifest.json`, een `public/favicon.svg`, en een `public/qr-landing.html` pagina. De QR-landing moet een mooie installatie-pagina zijn die bezoekers zien wanneer ze de QR-code op het festival scannen.

### Prompt 44 — 3 juni 2026, 16:00
> De SVG markers op de kaart worden niet goed gepositioneerd. Kun je een script maken (`scripts/inspect_svg_coords.cjs`) dat de SVG-coördinaten uit de floorplan SVG extraheert zodat ik de juiste posities kan bepalen? Update daarna de stages.json en mapMarkers.json met de correcte coördinaten.

### Prompt 45 — 3 juni 2026, 21:00
> De artiestenfoto's moeten ook als SVG beschikbaar zijn naast de PNG's. Converteer alle artiestenfoto's en maak trace-SVGs aan in `assets/Acts/`. Update ook de acts.json zodat het de SVG-paden bevat. Verbeter daarnaast de kaart-styling in pages.css met betere popup-stijlen en marker-hover effecten.

### Prompt 46 — 5 juni 2026, 13:00
> De vite.config.js geeft een build-fout met de animejs import. Fix de configuratie door de juiste `optimizeDeps` en `build.commonjsOptions` instellingen toe te voegen zodat animejs correct wordt gebundeld als ES-module.

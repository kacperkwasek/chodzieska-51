/*
 * Wszystkie dane strony Chodzieska 51.
 * Zasady:
 * - wartość null = brak danych; strona pokazuje wtedy placeholder [DO UZUPEŁNIENIA: …],
 * - komentarz // POGLĄDOWE = wartość wymyślona na potrzeby draftu, do podmiany
 *   (lista w CLAUDE.md, „Dane poglądowe do podmiany”). Na stronie nie jest oznaczana.
 */
window.CH51_DATA = {
  spolka: {
    nazwa: 'Sanit Investments',
    adres: 'ul. Żerzeńska 31, Warszawa',
    telefon: '+48 690 888 849',
    email: 'kontakt@sanitinvestments.pl', // POGLĄDOWE
    krs: '0000000000', // POGLĄDOWE
    nip: '111-111-11-11', // POGLĄDOWE
  },

  kontakt: {
    osoba: 'Marta Nowak', // POGLĄDOWE
    telefon: '+48 690 888 849',
    email: 'kontakt@sanitinvestments.pl', // POGLĄDOWE
  },

  inwestycja: {
    nazwa: 'Chodzieska 51',
    adres: 'ul. Chodzieska 51, Warszawa',
    dzielnica: 'Wawer',
    budynki: 2,
    lokaleLiczba: 4,
    terminOddania: 'IV kwartał 2027', // POGLĄDOWE
  },

  /*
   * Lokale. Litery A–D jak na drzwiach na wizualizacjach 4 (A, B) i 7 (C, D).
   *
   * ZAŁOŻENIE DO POTWIERDZENIA: każdy budynek dzieli się w pionie na dwa lokale.
   * Budynek 1 (bliżej parkingu, z przodu renderu 1): A i B.
   * Budynek 2 (dalej): C i D. W każdym budynku pierwsza litera to połowa bliżej parkingu.
   * Powód: na renderze 4 drzwi A są bliżej parkingu niż B, na renderze 7 drzwi C bliżej niż D.
   *
   * obszar: wielokąt na renderze 1 we współrzędnych pikseli oryginału docs/wizualizacja-1.png
   * (1737×1134). Strona pokazuje kadr x 170–1570, y 180–1134 (patrz render1.kadr).
   */
  lokale: [
    {
      id: 'A',
      budynek: 1,
      powierzchnia: 100, // m², potwierdzone
      poziomy: 3, // potwierdzone
      pokoje: 4, // POGLĄDOWE: liczba pokoi
      ogrodTaras: 'ogród 60 m²', // POGLĄDOWE: ogród / taras
      cenaM2: 13500, // POGLĄDOWE: PLN za m²
      cenaCalkowita: 1350000, // POGLĄDOWE: PLN
      postojKomorka: '2 naziemne, w cenie', // POGLĄDOWE: miejsca postojowe / komórka
      status: 'dostępny', // POGLĄDOWE: dostępny | rezerwacja | sprzedany
      historiaCen: [ // POGLĄDOWE
        { data: '2026-04-01', cenaM2: 12900, cenaCalkowita: 1290000 },
        { data: '2026-09-01', cenaM2: 13500, cenaCalkowita: 1350000 },
      ],
      kartaPdf: null, // TODO: PDF karty lokalu (do tego czasu przycisk „Pobierz kartę lokalu (PDF)” jest nieaktywny)
      // Karta lokalu: poziomy, rzuty i pomieszczenia. POGLĄDOWE: takie same dla wszystkich lokali, suma 100 m².
      poziomyLokalu: [ // POGLĄDOWE
        {
          nazwa: 'Parter',
          podpisRzutu: 'Rzut parteru',
          rzut: null, // TODO: plik z rzutem parteru
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Salon z aneksem kuchennym', m2: 26 },
            { nazwa: 'WC', m2: 3 },
            { nazwa: 'Hol', m2: 4 },
          ],
        },
        {
          nazwa: 'Piętro 1',
          podpisRzutu: 'Rzut piętra 1',
          rzut: null, // TODO: plik z rzutem piętra 1
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Sypialnia', m2: 13 },
            { nazwa: 'Sypialnia', m2: 11 },
            { nazwa: 'Łazienka', m2: 6 },
            { nazwa: 'Komunikacja', m2: 3 },
          ],
        },
        {
          nazwa: 'Piętro 2',
          podpisRzutu: 'Rzut piętra 2',
          rzut: null, // TODO: plik z rzutem piętra 2
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Sypialnia główna', m2: 16 },
            { nazwa: 'Garderoba', m2: 6 },
            { nazwa: 'Łazienka', m2: 8 },
            { nazwa: 'Komunikacja', m2: 4 },
          ],
        },
      ],
      obszar: [[640, 637], [720, 615], [873, 656], [874, 845], [800, 886], [655, 840]],
    },
    {
      id: 'B',
      budynek: 1,
      powierzchnia: 100, // m², potwierdzone
      poziomy: 3, // potwierdzone
      pokoje: 4, // POGLĄDOWE
      ogrodTaras: 'ogród 55 m²', // POGLĄDOWE
      cenaM2: 13500, // POGLĄDOWE
      cenaCalkowita: 1350000, // POGLĄDOWE
      postojKomorka: '2 naziemne, w cenie', // POGLĄDOWE
      status: 'dostępny', // POGLĄDOWE
      historiaCen: [ // POGLĄDOWE
        { data: '2026-04-01', cenaM2: 12900, cenaCalkowita: 1290000 },
        { data: '2026-09-01', cenaM2: 13500, cenaCalkowita: 1350000 },
      ],
      kartaPdf: null, // TODO: PDF karty lokalu (do tego czasu przycisk „Pobierz kartę lokalu (PDF)” jest nieaktywny)
      // Karta lokalu: poziomy, rzuty i pomieszczenia. POGLĄDOWE: takie same dla wszystkich lokali, suma 100 m².
      poziomyLokalu: [ // POGLĄDOWE
        {
          nazwa: 'Parter',
          podpisRzutu: 'Rzut parteru',
          rzut: null, // TODO: plik z rzutem parteru
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Salon z aneksem kuchennym', m2: 26 },
            { nazwa: 'WC', m2: 3 },
            { nazwa: 'Hol', m2: 4 },
          ],
        },
        {
          nazwa: 'Piętro 1',
          podpisRzutu: 'Rzut piętra 1',
          rzut: null, // TODO: plik z rzutem piętra 1
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Sypialnia', m2: 13 },
            { nazwa: 'Sypialnia', m2: 11 },
            { nazwa: 'Łazienka', m2: 6 },
            { nazwa: 'Komunikacja', m2: 3 },
          ],
        },
        {
          nazwa: 'Piętro 2',
          podpisRzutu: 'Rzut piętra 2',
          rzut: null, // TODO: plik z rzutem piętra 2
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Sypialnia główna', m2: 16 },
            { nazwa: 'Garderoba', m2: 6 },
            { nazwa: 'Łazienka', m2: 8 },
            { nazwa: 'Komunikacja', m2: 4 },
          ],
        },
      ],
      obszar: [[720, 615], [800, 594], [947, 627], [948, 805], [874, 845], [873, 656]],
    },
    {
      id: 'C',
      budynek: 2,
      powierzchnia: 100, // m², potwierdzone
      poziomy: 3, // potwierdzone
      pokoje: 4, // POGLĄDOWE
      ogrodTaras: 'ogród 58 m²', // POGLĄDOWE
      cenaM2: 13500, // POGLĄDOWE
      cenaCalkowita: 1350000, // POGLĄDOWE
      postojKomorka: '2 naziemne, w cenie', // POGLĄDOWE
      status: 'dostępny', // POGLĄDOWE
      historiaCen: [ // POGLĄDOWE
        { data: '2026-04-01', cenaM2: 12900, cenaCalkowita: 1290000 },
        { data: '2026-09-01', cenaM2: 13500, cenaCalkowita: 1350000 },
      ],
      kartaPdf: null, // TODO: PDF karty lokalu (do tego czasu przycisk „Pobierz kartę lokalu (PDF)” jest nieaktywny)
      // Karta lokalu: poziomy, rzuty i pomieszczenia. POGLĄDOWE: takie same dla wszystkich lokali, suma 100 m².
      poziomyLokalu: [ // POGLĄDOWE
        {
          nazwa: 'Parter',
          podpisRzutu: 'Rzut parteru',
          rzut: null, // TODO: plik z rzutem parteru
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Salon z aneksem kuchennym', m2: 26 },
            { nazwa: 'WC', m2: 3 },
            { nazwa: 'Hol', m2: 4 },
          ],
        },
        {
          nazwa: 'Piętro 1',
          podpisRzutu: 'Rzut piętra 1',
          rzut: null, // TODO: plik z rzutem piętra 1
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Sypialnia', m2: 13 },
            { nazwa: 'Sypialnia', m2: 11 },
            { nazwa: 'Łazienka', m2: 6 },
            { nazwa: 'Komunikacja', m2: 3 },
          ],
        },
        {
          nazwa: 'Piętro 2',
          podpisRzutu: 'Rzut piętra 2',
          rzut: null, // TODO: plik z rzutem piętra 2
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Sypialnia główna', m2: 16 },
            { nazwa: 'Garderoba', m2: 6 },
            { nazwa: 'Łazienka', m2: 8 },
            { nazwa: 'Komunikacja', m2: 4 },
          ],
        },
      ],
      obszar: [[866, 572], [919, 559], [1053, 583], [1053, 744], [1005, 772], [948, 762], [947, 627], [866, 609]],
    },
    {
      id: 'D',
      budynek: 2,
      powierzchnia: 100, // m², potwierdzone
      poziomy: 3, // potwierdzone
      pokoje: 4, // POGLĄDOWE
      ogrodTaras: 'ogród 62 m²', // POGLĄDOWE
      cenaM2: 13500, // POGLĄDOWE
      cenaCalkowita: 1350000, // POGLĄDOWE
      postojKomorka: '2 naziemne, w cenie', // POGLĄDOWE
      status: 'dostępny', // POGLĄDOWE
      historiaCen: [ // POGLĄDOWE: D bez osobnej historii w uwagach, przyjęta ta sama co A–C
        { data: '2026-04-01', cenaM2: 12900, cenaCalkowita: 1290000 },
        { data: '2026-09-01', cenaM2: 13500, cenaCalkowita: 1350000 },
      ],
      kartaPdf: null, // TODO: PDF karty lokalu (do tego czasu przycisk „Pobierz kartę lokalu (PDF)” jest nieaktywny)
      // Karta lokalu: poziomy, rzuty i pomieszczenia. POGLĄDOWE: takie same dla wszystkich lokali, suma 100 m².
      poziomyLokalu: [ // POGLĄDOWE
        {
          nazwa: 'Parter',
          podpisRzutu: 'Rzut parteru',
          rzut: null, // TODO: plik z rzutem parteru
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Salon z aneksem kuchennym', m2: 26 },
            { nazwa: 'WC', m2: 3 },
            { nazwa: 'Hol', m2: 4 },
          ],
        },
        {
          nazwa: 'Piętro 1',
          podpisRzutu: 'Rzut piętra 1',
          rzut: null, // TODO: plik z rzutem piętra 1
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Sypialnia', m2: 13 },
            { nazwa: 'Sypialnia', m2: 11 },
            { nazwa: 'Łazienka', m2: 6 },
            { nazwa: 'Komunikacja', m2: 3 },
          ],
        },
        {
          nazwa: 'Piętro 2',
          podpisRzutu: 'Rzut piętra 2',
          rzut: null, // TODO: plik z rzutem piętra 2
          pomieszczenia: [ // POGLĄDOWE
            { nazwa: 'Sypialnia główna', m2: 16 },
            { nazwa: 'Garderoba', m2: 6 },
            { nazwa: 'Łazienka', m2: 8 },
            { nazwa: 'Komunikacja', m2: 4 },
          ],
        },
      ],
      obszar: [[919, 559], [972, 546], [1102, 567], [1102, 715], [1053, 744], [1053, 583]],
    },
  ],

  render1: {
    // kadr wizualizacji 1 użyty na stronie (public/assets/img/wizualizacja-1-lokale-*), w pikselach oryginału
    kadr: { x: 170, y: 180, szerokosc: 1400, wysokosc: 954 },
  },

  kosztyDodatkowe: 'Cena obejmuje lokal i 2 miejsca postojowe. Koszty notarialne i opłaty sądowe ponosi kupujący.', // POGLĄDOWE

  mapa: {
    /*
     * Numer 51 nie istnieje (stan 2026-10-16) ani w OpenStreetMap, ani w rejestrze adresów GUGiK/PRG.
     * Nominatim (zapytania „Chodzieska 51, Warszawa” i street=51 Chodzieska) zwraca tylko ulicę:
     * OSM way 61242296, środek ulicy. Używamy tego punktu jako współrzędnych adresu.
     */
    wspolrzedne: [52.1906796, 21.1331886], // POGLĄDOWE: środek ulicy z Nominatim, nie numer 51
    zoom: 15,
    /*
     * Punkty POI: tylko obiekty z OpenStreetMap. Jedno zapytanie Overpass przy budowie
     * (tools/dane/overpass-zapytanie.txt), odpowiedź zapisana w tools/dane/overpass-2026-10-16.json,
     * stan danych OSM 2026-10-16T17:57:48Z, promień 1,5 km (stacje kolejowe 3 km).
     * Przystanki: jeden punkt na nazwę (najbliższy słupek). Do weryfikacji przez klienta.
     */
    poi: {
      szkoly: [
        { nazwa: 'Przedszkole nr 437', wspolrzedne: [52.187428, 21.141472], zrodlo: 'OSM node 8308635762' },
        { nazwa: 'Szkoła Podstawowa nr 109 im. Batalionów Chłopskich', wspolrzedne: [52.197941, 21.133773], zrodlo: 'OSM way 289920210' },
        { nazwa: 'Szkoła Podstawowa nr 404 im. Wielkiej Orkiestry Świątecznej Pomocy', wspolrzedne: [52.184763, 21.143476], zrodlo: 'OSM way 843243851' },
        { nazwa: 'Niepubliczne Przedszkole „Przedszkole Leśne”', wspolrzedne: [52.198294, 21.126354], zrodlo: 'OSM way 1033349769' },
        { nazwa: 'Integracyjna Podstawowa Szkoła Montessori Wawer', wspolrzedne: [52.191897, 21.149051], zrodlo: 'OSM node 9522580908' },
        { nazwa: 'Integracyjne Przedszkole Montessori Wawer', wspolrzedne: [52.192007, 21.149031], zrodlo: 'OSM node 9522580909' },
        { nazwa: 'Przedszkole Niepubliczne „Karuzela”', wspolrzedne: [52.198136, 21.121122], zrodlo: 'OSM way 899408472' },
        { nazwa: 'Przedszkole „Ala Ma Kota”', wspolrzedne: [52.200826, 21.126221], zrodlo: 'OSM node 9522611341' },
        { nazwa: 'Szkoła Podstawowa Niepubliczna Przy Fundacji Pomocy Ludziom z Niepełnosprawnościami', wspolrzedne: [52.200375, 21.124527], zrodlo: 'OSM way 1033344490' },
      ],
      sklepy: [
        { nazwa: 'Biedronka', wspolrzedne: [52.192007, 21.13863], zrodlo: 'OSM node 10651796507' },
        { nazwa: 'Wygodny Warzywniak', wspolrzedne: [52.196596, 21.135825], zrodlo: 'OSM node 8244969725' },
        { nazwa: 'Lidl', wspolrzedne: [52.183981, 21.135507], zrodlo: 'OSM node 13502365677' },
        { nazwa: 'Sklep Borków', wspolrzedne: [52.190588, 21.145485], zrodlo: 'OSM node 8914602010' },
        { nazwa: 'Żabka', wspolrzedne: [52.183962, 21.146042], zrodlo: 'OSM node 14244128401' },
        { nazwa: 'Sklep przy rondzie', wspolrzedne: [52.183003, 21.1468], zrodlo: 'OSM way 893941543' },
        { nazwa: 'Delikatesy Blask', wspolrzedne: [52.200165, 21.143398], zrodlo: 'OSM node 4553919378' },
        { nazwa: 'Żabka', wspolrzedne: [52.199496, 21.120091], zrodlo: 'OSM node 4745832239' },
        { nazwa: 'Biedronka', wspolrzedne: [52.200209, 21.120969], zrodlo: 'OSM way 298000830' },
      ],
      komunikacja: [
        { nazwa: 'Przystanek autobusowy Cylichowska', wspolrzedne: [52.193289, 21.138329], zrodlo: 'OSM node 2453019579' },
        { nazwa: 'Przystanek autobusowy Peonii', wspolrzedne: [52.187874, 21.127868], zrodlo: 'OSM node 765400936' },
        { nazwa: 'Przystanek autobusowy Borków', wspolrzedne: [52.19074, 21.140342], zrodlo: 'OSM node 2453019577' },
        { nazwa: 'Przystanek autobusowy Zwoleńska', wspolrzedne: [52.196241, 21.136201], zrodlo: 'OSM node 2453019599' },
        { nazwa: 'Przystanek autobusowy Skalnicowa', wspolrzedne: [52.184585, 21.13204], zrodlo: 'OSM node 765401078' },
        { nazwa: 'Przystanek autobusowy Jeziorowa', wspolrzedne: [52.191353, 21.123209], zrodlo: 'OSM node 765401564' },
        { nazwa: 'Przystanek autobusowy Ośrodek Szkoleniowy', wspolrzedne: [52.186693, 21.142957], zrodlo: 'OSM node 2453019591' },
        { nazwa: 'Przystanek autobusowy Zerzeń', wspolrzedne: [52.198936, 21.134721], zrodlo: 'OSM node 1980975018' },
        { nazwa: 'Przystanek autobusowy Wiązana', wspolrzedne: [52.198343, 21.141553], zrodlo: 'OSM node 1980975014' },
        { nazwa: 'Przystanek autobusowy Zabłudowska', wspolrzedne: [52.190447, 21.149046], zrodlo: 'OSM node 3031046968' },
        { nazwa: 'Przystanek autobusowy Wodniaków', wspolrzedne: [52.201632, 21.12966], zrodlo: 'OSM node 1980975017' },
        { nazwa: 'Przystanek autobusowy Kombajnistów', wspolrzedne: [52.202158, 21.134483], zrodlo: 'OSM node 1982019223' },
        { nazwa: 'Przystanek autobusowy Bronowska', wspolrzedne: [52.198538, 21.118699], zrodlo: 'OSM node 11283180504' },
        { nazwa: 'Przystanek autobusowy Malowana', wspolrzedne: [52.186357, 21.152313], zrodlo: 'OSM node 11066247783' },
        { nazwa: 'Przystanek autobusowy Cyklamenów', wspolrzedne: [52.178818, 21.139863], zrodlo: 'OSM node 765401884' },
        { nazwa: 'Stacja kolejowa Warszawa Międzylesie', wspolrzedne: [52.203922, 21.168978], zrodlo: 'OSM node 3404080631' },
      ],
      zielen: [
        { nazwa: 'Ogrody działkowe „Wiślany Brzeg”', wspolrzedne: [52.185387, 21.137428], zrodlo: 'OSM way 27625560' },
        { nazwa: 'Plac zabaw', wspolrzedne: [52.187222, 21.141378], zrodlo: 'OSM way 907330546' },
        { nazwa: 'Plac zabaw', wspolrzedne: [52.197887, 21.134248], zrodlo: 'OSM way 289920213' },
        { nazwa: 'Plac zabaw', wspolrzedne: [52.188933, 21.145304], zrodlo: 'OSM way 1193126754' },
        { nazwa: 'Ogrody działkowe „Wodniak”', wspolrzedne: [52.182833, 21.139497], zrodlo: 'OSM way 61242553' },
        { nazwa: 'Plac zabaw', wspolrzedne: [52.1846, 21.144207], zrodlo: 'OSM way 424950972' },
        { nazwa: 'Plac zabaw', wspolrzedne: [52.200447, 21.13372], zrodlo: 'OSM way 1317716780' },
        { nazwa: 'Ogrody działkowe „Cyklamen”', wspolrzedne: [52.182175, 21.143874], zrodlo: 'OSM way 61242469' },
        { nazwa: 'Plac zabaw', wspolrzedne: [52.199531, 21.146149], zrodlo: 'OSM way 1409289624' },
        { nazwa: 'Rezerwat przyrody Morysin', wspolrzedne: [52.17374, 21.09767], zrodlo: 'OSM way 158703175 (Overpass 2026-10-16T15:55Z)' },
      ],
    },
  },

  dojazdy: [ // nagłówek na stronie: „Czas dojazdu autem”
    { cel: 'Centrum Warszawy', czas: '25 min' }, // POGLĄDOWE
    { cel: 'Lotnisko Chopina', czas: '17 min' }, // POGLĄDOWE
    { cel: 'Szkoła podstawowa', czas: '3 min' }, // POGLĄDOWE
    { cel: 'Supermarket', czas: '2 min' }, // POGLĄDOWE
  ],
};

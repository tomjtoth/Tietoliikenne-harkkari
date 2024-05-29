# SSH tunneloinnin tuottama lisäliikennettä

_tekijä Tamás Tóth_

<div style="page-break-after: always;"></div>

## Tutkimusprosessin kuvaus

Tutkimuksessa käytin 2kpl tietokonetta, jotkut sijaitsevat samassa aliverkossa. Alkuperaisesta suunnitelmasta poiketen, en ole käyttänyt 1kpl verkkokaapelia yhteyden luontiin, vaan käytin oman langattoman kotiverkoston DHCP palvelua, joten **palvelin** roolissa osallistuvan **koneen #P** osoite oli `192.168.0.13` ja **asiakas** roolissa osallistuvan **koneen #A** osoite oli `192.168.0.66`.

**Koneessa #P**:

- valmiiksi pyöri `openssh` palvelu joka mahdollistaa koneesta #A tunnelin rakentamisen
  - tutkimuksen aikana käytin sekä SSH:n vakioportin 22, että toisen 55522
- loin tyhjän kansion minun kotihakemistossa `mkdir asdf && cd asdf`
- loin testeissä siirrettävän datan komennolla `dd if=/dev/urandom of=resurssi bs=1k count=5120`
- käynnistin `python` tulkin ja copy-paste:asin alla skriptin siihen

```python
import http.server
import socketserver
import socket

PORT = 8080
ADDR = socket.gethostbyname(socket.gethostname())

with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    print(f"Avaa http://{ADDR}:{PORT}/resurssi koneesta #A")
    httpd.serve_forever()
```

- tässä vaiheessa **koneessa #P** portilla 8080 oli saatavilla:
  - sekä yllä mainitun _asdf_ hakemiston listaus (polulla `/`),
  - että testitiedosto _resurssi_ (polulla `/resurssi`)

**Koneessa #A**:

- referenssisiirto (pelkästään HTTP:n kautta **koneen #P** IP osoitteen käyttäen)

  - käynnistetin kaappauksen kurssin _tcpdump tehtävän_ mukaisesti ja siirretään kaappausprosessi taustaan komentoa `N=1 sudo tcpdump -Z $USER -w plain-$N.pcap &` käyttäen
    - jossa _N_ oli kasvatettu jokaisella nauhoituksella
    - loput vivut oli käsiteltyjä aiemman palautettavan tehtävän yhteydessä
    - `&` merkki lopussa käynnistää prosessi taustalla
  - latasin tiedoston **koneesta #P** komentoa `N=1 curl http://192.168.0.13:8080/resurssi --output plain-$N.dat` käyttäen
    - jossa taas _N_ oli kasvatettu jokaisella nauhoituksella
  - nostetin kaappauksen prosessi foreground:iin `fg` komentoa käyttäen, sitten keskeytin sitä _CTRL-C_ painelleen

- siirto SSH tunnelin kautta

  - käynnistin liikenteen kaappauksen, mutta tallensin tuloksia eri tiedostoon: `... tunneled-$N.pcap &`
  - rakensin tunnelin **koneesta #A** **koneeseen #P** komennolla `ssh -p 55522 -N -L 8080:localhost:8080 192.168.0.13 &`,

    - jossa `-p 55522` tarvitsin siinä tapauksessa kun palvelimessa pyörivä SSH daemon kuunteli portilla 55522, muuten sitä ei tarvita (portti 22)
    - käytännössä kytkin **koneen #A** portti _8080_ (`192.168.0.66:8080`) **koneen #P** porttiin _8080_ (`192.168.0.13:8080`)
    - **koneessa #P** _~/.ssh/authorized_keys_ oli valmiiksi sisälletty **koneen #A** _~/.ssh/id.pub_, ei tarvinnut käsin kirjautua

  - siirsin tiedoston komennon `N=1 curl http://localhost:8080/resurssi --output tunneled-$N.dat` avulla
    - _N_ oli kasvatettu jokaisella nauhoituksella
    - muistutuksena SSH tunnneli on kytkenyt **koneen #A** portin _8080_ **koneen #P** porttiin _8080_, eli kaikki sinne saapuva pyyntö _automaagisesti_ ohjautuu tämän kytkennän mukaisesti
    - python tulkki **koneessa #P** tulosti jokaisen saapuvan pyynnön lähteen osoitteen, (aiempi pyyntö saapui osoitteesta _192.168.0.66_) ja tämä tuli osoitteesta _127.0.0.1_`, eli skriptin näkökulmasta tämä pyyntö syntyi **koneessa #P** itsessään
  - suljin SSH tunnelin
    - `jobs` komentoa käyttäen katsoin mitkä prosessit pyöri taustalla
    - valitsin ensin SSH tunnelin, minun tapauksessa `fg 2`
    - sammutin _CTRL-C_ painellen
  - lopetin myös liikenteen kaappausta

## Posteritilaisuuden raportti

Tässä 27.5 järjestetyn posteritilaisuuden raportit 5 eri minun opiskelijatoverin tekemistä.

### Shein vs Zalando sivustojen vertailu

_tekijä Mari Lehtikari_

Tosi hienot pie chartit, jotka näyttävät palvelimien maantieteellistä jakautumaa.
Mielenkiintoinen että se eurooppalaisille tarkoitettu Shein domain ottaa ylivoimaisesti Yhdysvaltalaisiin palvelimiin yhteyttä. Toisin Zalandon suomalaisille domain odotusten mukaan kyselee Suomessa sijaitsevia IP osoitteita (Y). Jännä miten monta kertaa enempää Shein tallentaa evästeitä, mitäköhan noissa säilytetään? hmm...

### Twitch vs Youtube live - streamauspalveluiden vertailu

_tekijä Helinä Lähteenmäki_

Ihana nähdä, että kyberjättiläinen firma Google käyttää ylivoimaisesti IPv6 verkostoa, ja oletettavasti pienempi (en seuraa uutisia tällä tasolla) firma Twitch ilmeisesti pyörittää palvelujansa vielä IPv4 verkostossa. Tosi kivoja nuo sarakevertailukaaviot ja ne 2 isoja logoja alussa! Yllättävä, että Twitch toteuttaa striimauspalvelunsa TCP:ta käyttäen. Myös mielenkiintoinen, että Twitch on siirtänyt noin 3x enempää dataa, kävikö ehkä silleen mittauksen aikana, että käytätty bandwidth vaan loppui kesken ja YouTube vaihtoi automaagisesti (ja nopeammin) surkeampaan kuvalaatuun, esim 1080p -> 720p (niin Twitch ei huomannut ongelmaa ja striimasi paremman kuvalaadun)?

### Suoratoistosivustojen tietoliikenteen vertailu

_tekijä Venla Rantanen_

Tässä tutkimuksessakin on hieno nähdä että isompi firma Netflix käyttää paljon enempää IPv6, mielenkiintoista myös, että Netflix pystyy hoitaa samaa asiaa 35+6=41 palvelimen avulla, jota Aniwave 56+78=134 kautta, toki jos ymmärsin oikein Aniwave säilyttää näitä sisältöjä monessa eri paikassa, joten käykin järkeväksi noi numerot. Kommunikaation vaikuttaa Aniwave:n puolelta tasaisemmalta, ehkä käyttäjän näkökulmasta kuitenkin ois parempi ne isot piikit jossa olettaisin, että puskuroidaan kerralla enempää, niin jos kenttä heikkenee, ei käyttäjä huomaa sitä heti (?).

### Uutissivustojen tietoliikenteen vertailu

_tekijä Sandra Sillanpää_

Hieno vertailun näkökulma, ja ei tullut yllätyksiä, mainosten lataaminen/hallinta aiheuttaakin lisäliikennettä :P Samoin kuin tässä 2 toisessa arvostelussani, se isompi/vakavampi osapuoli (Yle) käyttää parempaa teknologiaa (QUIC vs Iltalehden kunnon vanha TCP), se on järkevä! Pakettien siirtymisen jakautuma näyttää periaateltaan samalta, molemmassa näkyy alun jälkeenkin piikkejä, toki jos Iltalehden mainoksia vaihtuivat, niin se käy täysin järkeväksi.

### Puheluiden kaappaus Telegramin ja Discordin kautta sekä niiden vertailu

_tekijä Elisa Mero_

Tutkimusmenetelmä on hyvin kuvattu, tosi mielenkiintoinen pohdinta tuossa alussa, että voisi saada äänirataa noista kaappauksista, varmasti olisi hyvin vaativa työ! Ja jälleen en osaa sanoa kumpi firma on isompi/vakavampi, siitä protokollien vertailusta vetäisisin johtopäätöksen, että Discord olisi voittaja :)

## Tuntikirjanpito

Siirretty [tänne](https://docs.google.com/spreadsheets/d/1iMdz-mzAZvqoU0inuUuqJ8uMR2AHD7dTKB8icnSVH94/edit?usp=sharing)

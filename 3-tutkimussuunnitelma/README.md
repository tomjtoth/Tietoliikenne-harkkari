# SSH tunneloinnin generoima ylikuorma

_tekijä Tamás Tóth_

## Tutkimuksen tavoite

Haluan saada selväksi paljonko enemmän paketin/viestin vaihdon aiheuttaa SSH tunnelin käyttö.

## Hypoteesi

Tutkimukselta odotan, että siirretyn datan määrä kasvaisisi SSH:n salauksen takia, muttei enemmällä kuin 10%.

## Tutkimuksen menetelmä

Tutkimuksessa käytetään 2kpl tietokonetta, jotkut sijaitsevat samassa aliverkossa. Yksinkertaisin topologia olisi 1kpl verkkokaapelin kautta yhteenkytkeminen, jossa tapauksessa määritellään käsin molemmalle koneelle omat staattiset IP osoitteet, esim `10.0.0.1` (jatkossa kone **#1**) ja `10.0.0.2` (jatkossa kone **#2**) aliverkon peitteellä `255.255.255.0`. Tätä voi saada aikaiseksi esim. Network Manager:in `nmtui-edit` cli sovelluksellaan.

Koneessa **#1**:

- käynnistetään `openssh` joka mahdollistaa koneesta #2 tunnelin rakentamisen
- luodaan testeissä siirrettävän datan komennolla `dd if=/dev/urandom of=resurssi bs=1k count=5120`
- käynnistetään alla python skriptin samasta hakemistosta jossa äsken luotiin _resurssi_

```python
import http.server
import socketserver
import socket

PORT = 8080
ADDR = socket.gethostbyname(socket.gethostname())

with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    print(f"Avaa http://{ADDR}:{PORT}/resurssi koneesta #2")
    httpd.serve_forever()
```

Koneessa **#2**:

- siirto pelkästään HTTP:n kautta

  - käynnistetään kaappauksen kurssin _tcpdump tehtävän_ mukaisesti ja siirretään kaappausprosessi taustaan komentoa `sudo tcpdump -Z $USER -w plain.pcap &` käyttäen
  - siirretään tiedosto koneesta #1 `curl http://10.0.0.1:8080/resurssi --output plain.dat` käyttäen
  - nostetaan kaappauksen prosessi foreground:iin `fg` komentoa käyttäen, sitten keskeytetään sitä _CTRL-C_ painelellen

- siirron tunneloidaan SSH:n kautta

  - samoin, kuin ennen eka siirtoa, käynnistetään liikenteen kaappauksen, mutta tallennetaan tuloksia eri tiedostoon `... tunneled.pcap &`
  - ensin rakennetaan tunnelin koneesta #1 koneeseen #2 komennolla `ssh -N -L 8080:localhost:8080 10.0.0.1`, joka käytännössä kytkee koneen #2 portti _8080_ (`localhost:8080`) koneen #1 porttiin _8080_ (`10.0.0.1:8080`)

    - kirjaudutaan koneeseen #1 tunnuksillamme
    - sitten keskeytetään aktiivisen prosessin hetkeksi _CTRL-Z_ painellen
    - ja jatketaan sen suorituksen taustalla `bg` komennnolla

  - sitten siirretään `curl http://localhost:8080/resurssi --output tunneled.dat`
    - tämä pyyntö koneen **#1** näkökulmasta saapuu siis osoitteesta `127.0.0.1`, samoin kuin minkä tahasna web sovelluksen kehityksen aikanakin on nähty
  - tunnelia suljetaan
    - `jobs` komentoa käyttäen katsotaan mitkä prosessit pyörii taustalla
    - valitaan ensin SSH tunnelin, luultavasti `fg 2`
    - ja painetaan _CTRL-C_
  - samoin, kuin eka siirron jälkeen, lopetetaan liikenteen kaappausta

Sitten Wireshark:ssa vertaillaan `ip.addr == 10.0.0.1` filtterin avulla molemmassa tapauksessa montako kappaletta pakettia on vaihtunut, ja mikä oli pakettien yhteenlaskettu koko.

## Tunnit

- 16.5 ~ 6t

  - tehtävänannon lukeminen
  - tutkimuksen menetelmän kuvaus
  - nginx.conf

- 17.5 ~ 2t

  - luovutin nginx:sta, sortuin yksinkertaisen python skriptin käyttöön
  - hioin sanoitusta + laitoin enemmän yksityiskohtaa, kuten prosessin taustalle siirto, yms

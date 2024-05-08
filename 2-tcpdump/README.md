# `tcpdump` tehtävä

Kun tein tän kotinetistä, kirjauduin ensin Melkkiin: 

```sh
AD_TUNNUS=käyttäjätunnus ssh AD_TUNNUS@melkki.cs.helsinki.fi
```

Jossa `AD_TUNNUS` on minun oma Active Directory tunnus, jota piti määritellä, koska kotikoneessa mulla on eri käyttäjätunnus, ja SSH ois käyttänyt sitä oletuksena. Melkistä kirjauduin 

```sh
ssh svm-11.cs.helsinki.fi
```

virtuaalikoneeseen, tässä en enää tarvinnut määritellä käyttäjätunnusta erikseen, koska molemmassa host:ssa mulla on sama käyttäjätunnus. Ohjetta noudattaen kokeilin `chdir /tmp`, mutta kun `chdir` ei ole saatavilla, menin `cd /tmp` mukaan. Kokeilin tuon `tcpdump` komennon, josta ohjeesta sanotaankin, että vaatii superuser oikeudet. `sudo tcpdump` toimi, mutta tulokset meni `stdout`:iin, `man tcpdump` :sta katsoin että `-w filename` antaa tallentaa tuloksia tiedostoon. Ikävä kyllä tiedoston omistaja on nyt tcpdump:tcpdump eikä pääse ees avaamaan lukemiseen/kopsaamaan sitä:

```sh
$ stat /tmp/$USER.capture
  File: /tmp/$USER.capture
  Size: 7004      	Blocks: 16         IO Block: 4096   regular file
Device: fc00h/64512d	Inode: 1704926     Links: 1
Access: (0600/-rw-------)  Uid: (  109/ tcpdump)   Gid: (  117/ tcpdump)
Access: 2024-05-07 21:13:07.692769061 +0300
Modify: 2024-05-07 21:13:16.504781355 +0300
Change: 2024-05-07 21:13:16.504781355 +0300
 Birth: 2024-05-07 21:13:07.692769061 +0300
```

Googlaamisen jälkeen löytyy `-Z $USER` vipu joka aiheuttaa tcpdump:in *to drop priviliges* eli lopputulos tiedosto onkin mun käyttäjän nimessä. 

## SVM-11:ssa

- lopullinen käyttämäni komento oli `sudo tcpdump -Z $USER -w $USER.pcap &` jossa vika `&` merkki aiheuttaa komennon taustalla käynnistymistä, 
- täten pystyin generoida liikenteen ajamalla komentoa `curl ttj.hu`
  - joka avasi mun nettisivun
- `fg` komennon ajamalla sain mun taustalla käynnistetyn komennon *foreground* :iin siiretyksi
- jonka jälkeen keskeytin kaappauksen painaten **CTRL-C**
- nyt mulla oli `$USER.pcap` tiedosto mun kotihakemistossa
- jota sain siirretyksi ensin Melkkiin 
  - ajamalla komentoa `scp ./$USER.pcap melkki.cs.helsinki.fi:/home/$USER`
- tän jälkeen kirjauduin ulos SVM-11:sta painamalla **CTRL-D**


## Melkissä

- tarkastin vain, että tiedosto on siirtynyt kotihakemistooni komennolla `ls`
- sitten kirjauduin ulos

## kotikoneesta
- siirsin ton tiedoston melkistä alla komennolla
  - `scp $USER@melkki.cs.helsinki.fi:/home/$USER/$USER.pcap ~`
- avasin wireshark
  - jossa avasin tiedoston file/open (**CTRL-O**)
  - valitsin `$USER.pcap` tiedoston


## Tunnit

- 7.5 ~ 1t
  - 2 kaappauskokeilua
- 8.5 ~ 2t
  - onnistuin kaappaamaan VM:ssa SVM-11 luettavan/siirrettävän tiedoston + kirjasin tän raportin

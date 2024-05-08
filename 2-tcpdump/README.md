# `tcpdump` tehtävä

Kun tein tän kotinetistä, kirjauduin ensin SSH:n kautta hostiin `melkki.cs.helsinki.fi`

## Tunnit

- 7.5 ~ 1t
  - 2 kaappauskokeilua
- 8.5 ~ 1t
  - kaappasin SVM-11:ssa:
    - `sudo tcpdump -Z $USER -w $USER.pcap &`
      - `tcpdump` ei suostu käynnistymään ilman sudo:ta
      - ja ilman `-Z $USER` kappaus tallentuu tcpdump:in käyttäjänä luotuun tiedostoon johon mun oma `$USER` käyttäjä ei pääse käsiksi, edes lukemaan (kopioimaan)
      - `-w $USER.pcap` on tiedosto johon tallentuu tulokset

    - generoin liikenteen `curl ttj.hu`
    - `fg`
    - **CTRL+C**
    - `scp ./$USER.pcap melkki.cs.helsinki.fi:/home/$USER`
    - kirjauduin ulos svm-11:sta
  - melkissä:
    - tarkastin, että tiedosto on siirtynyt kotihakemistoon komennolla `ls`
    - kirjauduin ulos
  - kotikoneesta:
    - siirsin ton tiedoston melkistä:
      - `scp $USER@melkki.cs.helsinki.fi:/home/$USER/$USER.pcap ~`
    - avasin wireshark
      - **CTRL+O**
      - valitsin `$USER.pcap` tiedoston

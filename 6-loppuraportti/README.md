# SSH tunneloinnin tuottama lisäliikennettä

_tekijä Tamás Tóth_
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

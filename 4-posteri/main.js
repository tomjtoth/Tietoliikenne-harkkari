const byId = (id) => document.getElementById(id);

const content = {
  authors: ["Tamás Tóth"],
  title: "SSH tunneloinnin tuottama lisäliikenne",
  blocks: [
    {
      h2: "mitä SSH tunnelointi?",
      p: "Vähän samoin, kuin VPN:än toiminta, muun tietoliikenteen ohjaamista SSH kanavan kautta. Helppointa luoda tunnelia on ehkä local port forward, jossa koneen paikallisen porttiin saapuvaa liikennettä ohjataan eteenpäin toisen koneen tiettyyn porttiin. Käyttämäni komennot kytkee 2 tietokoneen portitt 8080 yhteen, eli kun tunneli on yllä, niin kone#2 pääsee käsiksi koneen#1 8080 porttiin osoitteesta http://localhost:8080",
    },
    {
      h2: "tutkimuksen tavoite",
      p: "Yritetään saada selväksi, paljonko enempää liikennettä tuottaa 5Mt kokoisen datan siirto em. SSH tunnelin kautta vs. sitä kayttämättä. Molemmassa tapauksessa tiedostoa tarjoaa ladattavaksi lyhyt python scripti koneen#1 portilla 8080.",
    },
  ],
};

const [eka, toka, ...rest] = content.title.split(" ");

const title_h1 = document.getElementById("title");

content.blocks.forEach(([h2, ...rest]) => {
  const new_thing = document.createElement("div");
  new_thing.textContent = "asdf";
  document.body.appendChild(new_thing);
});

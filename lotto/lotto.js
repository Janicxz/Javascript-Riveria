const TarkistaRivit = async () => {
    const aikaAlku = performance.now();
    // Haetaan .txt tiedostosta arvotut lottorivit
    let rivit = await aukaiseTiedosto();
    // Kuinka monta oikein yhteensä 0-7 väliltä
    let osumat = [0, 0, 0, 0, 0, 0, 0, 0];
    // Haetaan käyttäjän antama rivi
    const kayttajanRivi =  haeKayttajanRivi()
    // Paloitellaan se valmiiksi pilkulla
    const kayttajaRiviOsat = kayttajanRivi.split(',');
    // Tarkistetaan syötteet
    if (!rivit) {
        alert("Valitse ensin tiedosto!");
        return;
    }
    // Tarkistetaan ettei syötteet ole tyhjiä
    if (kayttajanRivi === "") {
        alert("Syötä tarkistettava lottorivi");
        return;
    }
    // Nollataan edistymispalkki
    PaivitaEdistymisPalkki(0);
    //  Käännetään rivi merkkijono taulukoksi
    rivit = rivit.split("\r\n");
    // Muuttuja edistymisen seuraamiselle
    for (let i = 0; i < rivit.length; i++) {
        let rivi = rivit[i];
               // Jos tyhjä rivi ei tehdä mitään
        if (rivi === "") continue;

        // Kuinka monta numeroa oikein tälle riville
        let osumatKpl = 0;
        kayttajaRiviOsat.forEach((numero) => {
            // Tarkistetaan montako numeroa oikein
            const riviOsat = rivi.split(',');
            riviOsat.forEach((riviNumero) => {
                if (numero === riviNumero) osumatKpl++;
            })
        });
        osumat[osumatKpl]++;
        // Päivitetään edistymispalkki
        if (i % 1000 === 0 || (i+1) === rivit.length) {
            await PaivitaEdistymisPalkki (Math.ceil((i+1) / rivit.length * 100), 0.1);
        }
    }
    PaivitaEdistymisPalkki (100);
    const aikaLoppu = performance.now();
    // Näytetään käyttäjälle tilastot
    let tulos = "";
    for (let i = 0; i < osumat.length; i++) {
        tulos += `${i} oikein <b>${osumat[i]}</b> kpl <br>`;
        console.log(`${i} oikein ${osumat[i]} kpl`)
    }
    tulos += `<br> Aikaa tarkistukseen kului: ${Math.floor((aikaLoppu - aikaAlku) * 100)/100} ms`;
    document.getElementById("tarkistaTulos").innerHTML = tulos;
    // tarkistaTulos
    }
// Hakee käyttäjän antaman lottorivin ja palauttaa sen merkkijonon
const haeKayttajanRivi = () => {
    return document.getElementById("tarkistettavaRivi").value;
}
// Aukaisee käyttäjän valitseman tiedoston ja palauttaa sen sisältämän merkkijonon
const aukaiseTiedosto = async () => {
    const tiedosto = document.getElementById("tarkistaRivitCheck").files[0];
    if (!tiedosto) {
        return;
    }
    const teksti = await tiedosto.text();
    return teksti;
}
// Tallentaa arvotut rivit lottorivit.txt tiedostoon
const tallennaRivit = (rivit) => {
    const tallennaCsv = document.getElementById("tallennaRivitCsv").checked;
    const tiedostoMuoto =  tallennaCsv ? ".csv" : ".txt";
    const blobType = tallennaCsv ? "data:text/csv;charset=utf-8" : "text/plain;charset=utf-8";
    var blob = new Blob([rivit], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "LottoRivit" + tiedostoMuoto);
}

// Arpoo lottorivit annetuilla arvoilla ja tallentaa ne .txt tiedostoon jos käyttäjä valitsi tallennuksen
const ArvoRivit = async(rivienPituus, alinLuku, ylinLuku) => {
    // Nollataan edistyminen
    PaivitaEdistymisPalkki(0);
    const riviMaara = parseInt(document.getElementById("lottoRiviMaara").value);
    const tallennaTiedosto = document.getElementById("tallennaRivit").checked;
    // Tarkistetaan onko numeroita
    if (isNaN(riviMaara)) {
        console.log("Virhe! Rivien määrä ei ole numero!");
        window.alert("Virhe! Rivien määrä ei ole numero!");
        return;
    }
    // Arvottavat rivit
    let arvotutRivitStr = "";

    for (let i = 1; i <= riviMaara; i++) {
        let lottoRivi = ArvoRivi(rivienPituus, alinLuku, ylinLuku);
        arvotutRivitStr += lottoRivi.toString() + "\r\n";
        // Luo taulukko arvotulle riville jos käyttäjä on valinnut taulukot näytettäväksi
        if (document.getElementById("naytaRivit").checked) LuoTaulukko(lottoRivi, alinLuku, ylinLuku);

        // Päivitetään edistymispalkki joka 10. rivillä tai viimeisellä rivillä
        if (i % 30 === 0 || i === riviMaara) {
            //Käytetään setTimeout:ia, jotta käyttöliittymä päivittyy
            await PaivitaEdistymisPalkki(Math.floor(i / riviMaara * 100), 0.1);
        }
    }
    
    if (tallennaTiedosto) {
        tallennaRivit(arvotutRivitStr);
    }
}

// 0-100 väliltä edistyminen, päivittää käyttöliittymän
const PaivitaEdistymisPalkki = (leveys, odotaMs = 0) => {
    const elem = document.getElementById("myBar");
    elem.style.width = leveys + "%";
    elem.innerHTML = leveys + "%";
    if (odotaMs === 0) return;
    return new Promise(resolve => setTimeout(resolve, odotaMs));
    //console.log("Leveys", leveys);
}

// Arpoo yhden lottorivin annetuilla arvoilla ja palauttaa sen  taulukkona
const ArvoRivi = (rivienMaara, alinLuku, ylinLuku) => {
    // Arvottava rivi
    let lottoRivi = [];
    // Tarkistetaan luku virheiden varalta
    if (ylinLuku - alinLuku < rivienMaara) {
        console.log("Virhe! Arvottavien rivien määrä on suurempi kuin arvottavien lukujen väli");
        return;
    }
    // Arvotaan lottorivi ja tarkistetaan ettei riville tule samoja numeroita
    for (let i = 0; i < rivienMaara; i++) {
        var luku = Math.floor(Math.random() * ylinLuku) + 1;
        // Jos arvottu luku löytyy riviltä, arvotaan se uudelleen
        while (lottoRivi.includes(luku) || luku < alinLuku) {
            luku = Math.floor(Math.random() * ylinLuku) + 1;
        }
        lottoRivi.push(luku);
    }
    // Järjestetään pienimmästä suurimpaan
    let ylinNumero = 0;
    for (let i = 0; i < lottoRivi.length; i++) {
        for (let ii = i + 1; ii < lottoRivi.length; ii++){
            if (lottoRivi[ii] < lottoRivi[i]) {
                ylinNumero = lottoRivi[i];
                lottoRivi[i] = lottoRivi[ii];
                lottoRivi[ii] = ylinNumero;
            }
        }
    }
    return lottoRivi;
}

// Muuttujat id:lle
let taulukkoMaara = 0;
let soluMaara = 0;
// Luo uuden taulukon johon lisätään kaikki arvottavat numerot sekä voittorivin korostus
const LuoTaulukko = (voittoRivit, alinLuku, ylinLuku) => {
    // Luodaan taulukon yläpuolelle seloste rivistä
    let rivitStr = "Voittava rivi on: <b>";
    for (let i = 0; i < voittoRivit.length; i++) {
        if (i === voittoRivit.length-1) {
            rivitStr += voittoRivit[i];
        } else  {
            rivitStr += voittoRivit[i] + " - ";
        }
    }
    rivitStr += "</b>"
    const voittoRiviElem = document.createElement("p");
    voittoRiviElem.id = "lottoRiviTeksti" + taulukkoMaara;
    voittoRiviElem.innerHTML = rivitStr;
    // Luodaan uusi taulukko elementti lottoriveille
    const taulukko = document.createElement("table");
    taulukko.className = "lottoTaulukko";
    taulukko.id = "lottoTaulukko" + taulukkoMaara;
    taulukkoMaara++;
    // Haetaan lottoTaulukot div mihin rivit lisätään
    const taulukkoDiv = document.getElementById("lottoTaulukot")
    if (!taulukkoDiv) {
        console.log("Virhe! Lottotaulukot elementtiä ei löytynyt.");
        return;
    }
    // Lisätään taulukko sekä arvottu rivi lottoTaulukot diviin, ensimmäiseksi
    taulukkoDiv.insertBefore(taulukko, taulukkoDiv.firstChild)
    taulukkoDiv.insertBefore(voittoRiviElem, taulukkoDiv.firstChild)
    let riviElem = document.createElement("tr");

    // Haetaan käyttäjän valitsema korostusväri
    const korostusVari = document.getElementById("lottoVari").value;

    // Lisätään kaikki numerot taulukkoon
    let lisatytRivit = 0;
    for (let riviNum = alinLuku; riviNum <= ylinLuku; riviNum++) {
        const solu = document.createElement("td");
        solu.id = "lottoSolu" + soluMaara;
        // Lisätään korostusväri voittonumeroille
        if (voittoRivit.includes(riviNum)) {
            solu.style.backgroundColor = korostusVari;
        }
        solu.innerHTML = riviNum;
        riviElem.appendChild(solu);
        soluMaara++;
        lisatytRivit++;
        // Uusi rivi joka 6 solua kohtaan
        if (lisatytRivit % 6 === 0 || riviNum === ylinLuku) {
            if (riviNum === ylinLuku) {
                // Lisätään tyhjät solut
                for (let i = 0; i < lisatytRivit%6; i++) {
                    const solu2 = document.createElement("td");
                    solu2.id = "lottoSolu" + soluMaara;
                    riviElem.appendChild(solu2);
                    soluMaara++;
                }
            }
            taulukko.appendChild(riviElem);
            riviElem =  document.createElement("tr");
        }
    }
}
const TarkistaRivit = async () => {
    let rivit = await aukaiseTiedosto();
    const kayttajanRivi =  haeKayttajanRivi()
    // Tarkistetaan syötteet
    if (!rivit) {
        alert("Valitse ensin tiedosto!");
        return;
    }
    if (kayttajanRivi === "") {
        alert("Syötä tarkistettava lottorivi");
        return;
    }
    rivit = rivit.split("\r\n");
    rivit.forEach((rivi) => {
        console.log("rivi:",rivi);
    });
}

const haeKayttajanRivi = () => {
    return document.getElementById("tarkistettavaRivi").value;
}

const aukaiseTiedosto = async () => {
    const tiedosto = document.getElementById("tarkistaRivitCheck").files[0];
    if (!tiedosto) {
        return;
    }
    const teksti = await tiedosto.text();
    return teksti;
}

const tallennaRivit = (rivit) => {
    var blob = new Blob([rivit], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "LottoRivit.txt");
}

// Arpoo lottorivit annetuilla arvoilla ja tallentaa ne .txt tiedostoon jos käyttäjä valitsi tallennuksen
const ArvoRivit = (rivienPituus, alinLuku, ylinLuku) => {
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
    let i = 1;
    let arvotutRivitStr = "";
    const suoritaRivi = () => {
        if(i <= riviMaara) {
            // Arpoo uuden lottorivin
            let lottoRivi= ArvoRivi(rivienPituus, alinLuku,ylinLuku);
            arvotutRivitStr += lottoRivi.toString() + "\r\n";
            // Luo uuden taulukon lottoriville
            LuoTaulukko(lottoRivi, alinLuku, ylinLuku);
            // Päivitetään edistyminen käyttöliittymään
            PaivitaEdistymisPalkki(Math.floor(i / riviMaara * 100));
            i++;
            // Silmukka toteutettu setTimeout avulla ettei käyttöliittymä hyydy suorituksen ajaksi
            // Suoraan toteutettuna progressBar ei päivittyisi
            setTimeout(suoritaRivi, 0);
        } else {
            // Tallennetaan tulokset .txt tiedostona
            if(tallennaTiedosto) {
                tallennaRivit(arvotutRivitStr);
            }
        }
    }
    // Aloitetaan rivien arvonta
    suoritaRivi();
}

// 0-100 väliltä edistyminen, päivittää käyttöliittymän
const PaivitaEdistymisPalkki = (leveys) => {
    const elem = document.getElementById("myBar");
    elem.style.width = leveys + "%";
    elem.innerHTML = leveys + "%";
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
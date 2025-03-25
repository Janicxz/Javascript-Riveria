// Arpoo lottorivin ja luo sille taulukon
const ArvoRivit = (rivienMaara, alinLuku, ylinLuku) => {
    // Arvottavat rivit
    let lottoRivi = [];
    if (ylinLuku - alinLuku < rivienMaara) {
        console.log("Virhe! Arvottavien rivien määrä on suurempi kuin arvottavien lukujen väli");
        return;
    }

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
    LuoTaulukko(lottoRivi, alinLuku, ylinLuku);
}

let taulukkoMaara = 0;
let soluMaara = 0;
// Luo uuden taulukon johon lisätään kaikki arvottavat numerot sekä voittorivin korostus
const LuoTaulukko = (voittoRivit, alinLuku, ylinLuku) => {

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
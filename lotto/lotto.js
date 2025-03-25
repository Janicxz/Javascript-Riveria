const RIVIT_MAARA = 7;
const RIVIT_YLIN = 39;

// Arpoo lottorivin ja luo sille taulukon
const ArvoRivit = () => {
    // Arvottavat rivit
    let lottoRivi = [];

    for (let i = 0; i < RIVIT_MAARA; i++) {
        var luku = Math.floor(Math.random() * RIVIT_YLIN) + 1;
        // Jos arvottu luku löytyy riviltä, arvotaan se uudelleen
        while (lottoRivi.includes(luku)) {
            luku = Math.floor(Math.random() * RIVIT_YLIN) + 1;
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
    LuoTaulukko(lottoRivi);
}

let taulukkoMaara = 0;
// Luo uuden taulukon johon lisätään kaikki arvottavat numerot sekä voittorivin korostus
const LuoTaulukko = (voittoRivit) => {

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
    voittoRiviElem.innerHTML = rivitStr;
    // Luodaan uusi taulukko elementti lottoriveille
    const taulukko = document.createElement("table");
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
    for (let riviNum = 1; riviNum <= RIVIT_YLIN; riviNum++) {
        const solu = document.createElement("td");
        // Lisätään korostusväri voittonumeroille
        if (voittoRivit.includes(riviNum)) {
            solu.style.backgroundColor = korostusVari;
        }
        solu.innerHTML = riviNum;
        riviElem.appendChild(solu);
        // Uusi rivi joka 6 solua kohtaan
        if (riviNum % 6 === 0 || riviNum === RIVIT_YLIN) {
            taulukko.appendChild(riviElem);
            riviElem =  document.createElement("tr");
        }
    }
}
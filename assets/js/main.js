function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res
}

function showHideElement(idHtml) {
    if (document.getElementById(idHtml).style.visibility == 'visible') {
        document.getElementById(idHtml).style.visibility = 'hidden';
    } else {
        document.getElementById(idHtml).style.visibility = 'visible';
    }
}

function ajouterAuPanier(idProduit) {
}

function supprimerDuPanier(idProduit) {
}

function viderPanier() {
    document.cookie = "panier=; expires=" + Date() + "; path=/;";
}
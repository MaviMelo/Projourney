"use strict";
function check(n, m) {
    let x = "";
    let y = "";
    if (n % 2 == 0) {
        x = `${n} e par.`;
    }
    else {
        x = `${n} nao e par.`;
    }
    if (m.length % 2 == 0) {
        y = `${m} e palavra de tamanho par.`;
    }
    else {
        y = `${m} nao e palavra de tamanho par.`;
    }
    console.log(x, '\n', y);
}
check(1254, 'paralelepipado');
const x = 'Bahia';
console.log(x);

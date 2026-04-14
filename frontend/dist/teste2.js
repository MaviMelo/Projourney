"use strict";
/**
 *  Código teste.
 *
 *  Teste de primalidade.
 *
 */
function primo(x) {
    let a = `Sim! ${x} é um número primo.`;
    if ((x < 2) || (x % 2 == 0 && x !== 2)) {
        a = `${x} não é primo.`;
    }
    else if (x > 5) {
        for (let i = 3; i <= Math.sqrt(x); i += 2) {
            if (x % i == 0) {
                a = `${x} não é número primo.`;
                break;
            }
        }
        //      else {
        //        a = `Sim! ${x} é um número primo.`
        //      }
    }
    console.log(a);
}
primo(1684321689);
const nu = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23]
];
primo(nu[1][6]);
let teste = 100;
for (let i = 0; i <= teste; i++) {
    primo(i);
}

const rand = (min, max) => {
  min *= 1000;
  max *= 1000;
  return Math.floor(Math.random * (max - min) + min);
};
// uma promise pode ser 'aceita' ou 'rejeitada'

// Utilizar promises permite que certas porções do código sejam realizadas apenas depois de algo acontecer, ou seja, mesmo que o código seja lido de cima para baixo de forma síncrona, o bloco que utiliza promises não será  necessariamente executado de forma imediata.

function esperar(msg, tempo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof msg !== "string") {
        reject("fui para o catch por causa do erro");
        return;
      }
      resolve(msg.toUpperCase() + " - Passei pela Promise");
    }, tempo);
  });
}

async function execute() {
  try {
    const fase1 = await esperar("Fase 1", rand());
    console.log(fase1);

    const fase2 = await esperar("Fase 2", rand());
    console.log(fase2);

    const fase3 = await esperar(3, rand());
    console.log(fase3);

    console.log("Terminamos na fase:", fase3);
  } catch (error) {
    console.log(error);
  }
}

execute();

// métodos para Promisses : Promise.all, Promise.race, Promise.resolve, Promise.reject
// Promise.all = resolve todas as promises que estão presentes no código
//Promise.race = resolve e retorna o primeiro valor
// const promises = [
// 	esperar('Promise 1', 3000),
// 	esperar('Promise 2', 500),
// 	esperar('Promise 3', 1000),
// 	esperar(1000, 1000),
// ];

// Promise.race(promises)
// 	.then((valor) => {
// 		console.log(valor);
// 	})
// 	.catch((erro) => {
// 		console.log(erro)
// 	})

// esperar('Frase 1', rand(1, 3))
// 	.then(resposta => {
// 		console.log(resposta);
// 		return esperar('Frase 2', rand(1, 3));
// 	})
// 	.then(resposta => {
// 		console.log(resposta);
// 	})
// 	.catch(); // o catch sempre vai ser utilizado para capturar erros

// downloadPage = () => {
// 	const inCache = true;
// 	if (inCache) {
// 		return Promise.resolve('Página em cache');
// 	} else {
// 		return esperar('Baixei a página', 3000);
// 	}
// }

// downloadPage()
// 	.then((downloadPage) => {
// 		console.log(downloadPage)
// 	})
// 	.catch(erro => console.log(erro));

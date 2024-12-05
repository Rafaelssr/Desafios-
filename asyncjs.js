// codigo abaixo não utilizado, logo não deveira está aqui

const rand = (min, max) => {
  min *= 1000;
  max *= 1000;
  return Math.floor(Math.random * (max - min) + min);
};


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

const green = document.getElementById("verde");
const red = document.getElementById("vermelha");
const yellow = document.getElementById("amarela");
const display = document.querySelector(".contagem");
const lightsDisplay = document.querySelector(".contagem2");

let alredyClicked = false;
let tempo = 60;
let contador;

let yellowLightTimer = 3;
let greenLightTimer = 10;
let redLightTimer = 15;

function turnGreen() {
  green.style.backgroundColor = "green";
  red.style.backgroundColor = "black";
  yellow.style.backgroundColor = "black";
  setTimeout(turnYellow, 10000);
}

turnGreen();

function turnRedOff() {
  red.style.backgroundColor = "black";
}

function turnYellowOff() {
  yellow.style.backgroundColor = "black";
}

function turnGreenOff() {
  green.style.backgroundColor = "black";
}

function turnYellow() {
  yellow.style.backgroundColor = "yellow";
  red.style.backgroundColor = "black";
  green.style.backgroundColor = "black";
  setTimeout(turnRed, 3000);
}

function turnRed() {
  red.style.backgroundColor = "red";
  yellow.style.backgroundColor = "black";
  green.style.backgroundColor = "black";
  setTimeout(turnGreen, 15000);
}

function countDown() {
  tempo = 60;
  display.textContent = `${tempo}`;

  contador = setInterval(() => {
    tempo--;
    display.textContent = `${tempo}`;

    if (tempo <= 0) {
      clearInterval(contador);
      alredyClicked = false;
    }
  }, 1000);
}

const botaoPedestre = document.querySelector(".botao");
botaoPedestre.addEventListener("click", () => {
  if (!alredyClicked) {
    countDown();

    setTimeout(() => {
      turnYellow();

      setTimeout(() => {
        turnYellowOff();
        turnRed();
      }, 3000);
    }, 3000);
    setTimeout(() => {
      turnGreenOff();
    }, 3000);
    alredyClicked = true;
    alert("aguarde para poder pressionar novamente!");
  }
});

const mainDisplayEl = document.querySelector('.display__main');
const subDisplayEl = document.querySelector('.display__sub');
const numberButtonEls = document.querySelectorAll('.button__number');
const numberOperatorEls = document.querySelectorAll('.button__operator');

const evalRegex = /([-\d.]+)\s*([+\-*\/%])\s*([-\d.]+)/;

let result = null;

let tempNumber1 = null;
let tempNumber2 = null;

let strTempNumber1 = '';
let strTempNumber2 = '';

let tempOperator = null;

let mainDisplayText = '';
let subDisplayText = '';

document.addEventListener('DOMContentLoaded', () => {
  numberButtonEls.forEach((btn) => {
    btn.addEventListener('click', onNumberClick);
  });

  numberOperatorEls.forEach((btn) => {
    btn.addEventListener('click', onOperatorClick);
  });
});

function onNumberClick(event) {
  const numberText = event.target.innerText;
  if (!strTempNumber2 && !tempOperator) {
    tempNumber1 = numberText;
    if (tempNumber1 == 0 && !strTempNumber1) {
      displayToMain(tempNumber1);
    } else {
      strTempNumber1 += tempNumber1;
      mainDisplayText += tempNumber1;
      displayToMain(mainDisplayText);
    }
  } else if (strTempNumber1 && tempOperator) {
    tempNumber2 = numberText;
    if (tempNumber2 == 0 && !strTempNumber2) {
      displayToMain(tempNumber2);
    } else {
      strTempNumber2 += tempNumber2;
      displayToMain(strTempNumber2);
    }
  }

  console.log('n1', strTempNumber1);
  console.log('op', tempOperator);
  console.log('n2', strTempNumber2);
}

function onOperatorClick(event) {
  const operatorText = event.target.innerText;
  if (
    strTempNumber1 &&
    !strTempNumber2 &&
    tempOperator === null &&
    operatorText !== '='
  ) {
    tempOperator = operatorText;
    mainDisplayText += tempOperator;
    subDisplayText = mainDisplayText;
    displayToSub(subDisplayText);
    displayToMain();
  } else if (strTempNumber1 && strTempNumber2 && tempOperator) {
    operate();
  }
}

function operate() {
  console.log(strTempNumber1, tempOperator, strTempNumber2);
  switch (tempOperator) {
    case '*':
      result = parseInt(strTempNumber1) * parseInt(strTempNumber2);
      break;
    case '/':
      result = parseInt(strTempNumber1) / parseInt(strTempNumber2);
      break;
    case '+':
      result = parseInt(strTempNumber1) + parseInt(strTempNumber2);
      break;
    case '-':
      result = parseInt(strTempNumber1) - parseInt(strTempNumber2);
      break;
    default:
      result = NaN;
      break;
  }
  displayToSub(strTempNumber1 + tempOperator + strTempNumber2);
  displayToMain(result);
}

function displayToSub(text = '') {
  subDisplayEl.innerText = text;
}

function displayToMain(text = '') {
  mainDisplayEl.innerText = text;
}

function resetCalculator() {
  displayToMain();
  displayToSub();
}

const mainDisplayEl = document.querySelector('.display__main');
const subDisplayEl = document.querySelector('.display__sub');
const numberButtonEls = document.querySelectorAll('.button__number');
const numberOperatorEls = document.querySelectorAll('.button__operator');
const clearButtonEl = document.querySelector('.button__clear');
const negativeButtonEl = document.querySelector('.button__negative');

// const evalRegex = /([-\d.]+)\s*([+\-*\/%])\s*([-\d.]+)/;

let result = null;

let tempNumber1 = null;
let tempNumber2 = null;

let strTempNumber1 = '';
let strTempNumber2 = '';

let tempOperator = null;

document.addEventListener('DOMContentLoaded', () => {
  numberButtonEls.forEach((btn) => {
    btn.addEventListener('click', onNumberClick);
  });

  numberOperatorEls.forEach((btn) => {
    btn.addEventListener('click', onOperatorClick);
  });

  clearButtonEl.addEventListener('click', onResetCalculator);

  negativeButtonEl.addEventListener('click', onSwitchNegativePositive);
});

function onNumberClick(event) {
  const numberText = event.target.innerText;
  if (!strTempNumber2 && !tempOperator) {
    if ((numberText == 0 && !strTempNumber1) || (result && !strTempNumber1)) {
      if (result) {
        clearResult();
        clearTemps();
      }
      strTempNumber1 = numberText;
      displayToMain(strTempNumber1);
    } else {
      strTempNumber1 += numberText;
      displayToMain(strTempNumber1);
    }
  } else if (strTempNumber1 && tempOperator) {
    if (numberText == 0 && !strTempNumber2) {
      strTempNumber2 = numberText;
      displayToMain(strTempNumber2);
    } else {
      strTempNumber2 += numberText;
      displayToMain(strTempNumber2);
    }
  }
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
    const displayText = strTempNumber1 + tempOperator;
    displayToSub(displayText);
    displayToMain();
  } else if (
    !isNaN(result) &&
    !strTempNumber1 &&
    !strTempNumber2 &&
    tempOperator === null &&
    operatorText !== '='
  ) {
    strTempNumber1 += result;
    tempOperator = operatorText;
    const displayText = strTempNumber1 + tempOperator;

    displayToSub(displayText);
    displayToMain();
  } else if (strTempNumber1 && strTempNumber2 && tempOperator) {
    operate();
  }
}

function operate() {
  switch (tempOperator) {
    case '*':
      result = parseInt(strTempNumber1) * parseInt(strTempNumber2);
      break;
    case '/':
      if (strTempNumber2 == 0) {
        result = 'Error Divide by Zero!!';
        break;
      }
      result = parseInt(strTempNumber1) / parseInt(strTempNumber2);
      break;
    case '+':
      result = parseInt(strTempNumber1) + parseInt(strTempNumber2);
      break;
    case '-':
      result = parseInt(strTempNumber1) - parseInt(strTempNumber2);
      break;
    default:
      result = 'Invalid Operator';
      break;
  }
  displayToSub();
  displayToMain(result);
  clearTemps();
}

function onSwitchNegativePositive() {
  if (strTempNumber1 && tempOperator === null && !strTempNumber2) {
    if (strTempNumber1.includes('-')) {
      strTempNumber1 = toPositiveNumberString(strTempNumber1);
    } else {
      strTempNumber1 = toNegativeNumberString(strTempNumber1);
    }
    displayToMain(strTempNumber1);
  } else if (strTempNumber1 && tempOperator && strTempNumber2) {
    if (strTempNumber2.includes('-')) {
      strTempNumber2 = toPositiveNumberString(strTempNumber2);
    } else {
      strTempNumber2 = toNegativeNumberString(strTempNumber2);
    }
    displayToMain(strTempNumber2);
  } else if (!isNaN(result)) {
    result = result.toString();
    if (result.includes('-')) {
      result = toPositiveNumberString(result);
    } else {
      result = toNegativeNumberString(result);
    }
    displayToMain(result);
  }
}

function toNegativeNumberString(numberString) {
  return `-${numberString}`;
}

function toPositiveNumberString(numberString) {
  return numberString.replace('-', '');
}

function displayToSub(text = '') {
  subDisplayEl.innerText = text;
}

function displayToMain(text = '') {
  mainDisplayEl.innerText = text;
}

function logActivity() {
  console.log('===================');
  console.log(new Date().toUTCString());
  console.log('===================');
  console.log('n1', strTempNumber1);
  console.log('op', tempOperator);
  console.log('n2', strTempNumber2);
  console.log('===================');
}

function clearTemps() {
  strTempNumber1 = '';
  strTempNumber2 = '';

  tempOperator = null;
}

function clearDisplay() {
  displayToMain();
  displayToSub();
}

function clearResult() {
  result = null;
}

function onResetCalculator() {
  clearTemps();
  clearDisplay();
  clearResult();
}

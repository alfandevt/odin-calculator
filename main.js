const calculatorEl = document.querySelector('.calculator');
const mainDisplayEl = document.querySelector('.display__main');
const subDisplayEl = document.querySelector('.display__sub');
const numberButtonEls = document.querySelectorAll('.button__number');
const numberOperatorEls = document.querySelectorAll('.button__operator');
const clearButtonEl = document.querySelector('.button__clear');
const negativeButtonEl = document.querySelector('.button__negative');
const percentButtonEl = document.querySelector('.button__percent');
const dotButtonEl = document.querySelector('.button__dot');
const backspaceButtonEl = document.querySelector('.button__backspace');
const guideSectionEl = document.querySelector('.guide');
const guideButtonEl = document.querySelector('.guide__button');

let result = null;

let strTempNumber1 = '';
let strTempNumber2 = '';

let tempOperator = null;

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

document.addEventListener('DOMContentLoaded', () => {
  numberButtonEls.forEach((btn) => {
    btn.addEventListener('click', onNumberClick);
  });

  numberOperatorEls.forEach((btn) => {
    btn.addEventListener('click', onOperatorClick);
  });

  clearButtonEl.addEventListener('click', onResetCalculator);

  negativeButtonEl.addEventListener('click', onSwitchNegativePositive);

  percentButtonEl.addEventListener('click', onPercent);

  dotButtonEl.addEventListener('click', onDotClick);

  backspaceButtonEl.addEventListener('click', onBackspace);

  guideButtonEl.addEventListener('click', onGuideButtonClick);

  document.addEventListener('keydown', onKeydown);
});

function onGuideButtonClick() {
  guideSectionEl.classList.add('guide--hide');
}

function onKeydown(event) {
  onNumberClick(event);
  onOperatorClick(event);
  onDotClick(event);
  onKeydownUtilOps(event);
  event.target.blur();
}

function onKeydownUtilOps(event) {
  switch (event.key) {
    case 'Escape':
      onResetCalculator();
      break;
    case '%':
      onPercent();
      break;
    case 'Backspace':
      onBackspace();
      break;
    case 'm':
      onSwitchNegativePositive();
      break;

    default:
      return false;
  }
}

function onBackspace() {
  if (strTempNumber1 && !tempOperator) {
    strTempNumber1 = strTempNumber1.slice(0, strTempNumber1.length - 1);
    displayToMain(strTempNumber1);
  } else if (strTempNumber1 && tempOperator) {
    if (strTempNumber2) {
      strTempNumber2 = strTempNumber2.slice(0, strTempNumber2.length - 1);
      displayToMain(strTempNumber2);
    } else {
      tempOperator = null;
      displayToSub();
      displayToMain(strTempNumber1);
    }
  }

  if (result) {
    onResetCalculator();
  }
}

function onDotClick(event) {
  let dotText = '';
  if (event.type === 'click') {
    dotText = event.target.innerText;
  } else if (event.type === 'keydown') {
    if (event.key === '.') {
      dotText = '.';
    } else {
      return false;
    }
  }

  if (!strTempNumber2 && !tempOperator) {
    if (result && !strTempNumber1) {
      clearResult();
      clearTemps();
      strTempNumber1 = '0' + dotText;
      displayToMain(strTempNumber1);
    } else {
      if (strTempNumber1.includes('.')) {
        return;
      }

      if (!strTempNumber1) {
        strTempNumber1 = '0' + dotText;
      } else {
        strTempNumber1 += dotText;
      }
      displayToMain(strTempNumber1);
    }
  } else if (strTempNumber1 && tempOperator) {
    if (strTempNumber2.includes('.')) {
      return;
    }
    if (!strTempNumber2) {
      strTempNumber2 = '0' + dotText;
    } else {
      strTempNumber2 += dotText;
    }

    displayToMain(strTempNumber2);
  }
}

function onNumberClick(event) {
  let numberText = '';
  if (event.type === 'click') {
    numberText = event.target.innerText;
  } else if (event.type === 'keydown') {
    numberText = numberKeyMap(event);
    if (!numberText) return;
  }
  if (!strTempNumber2 && !tempOperator) {
    if (result && !strTempNumber1) {
      clearResult();
      clearTemps();
      strTempNumber1 = numberText;
      displayToMain(strTempNumber1);
    } else {
      strTempNumber1 += numberText;

      if (!strTempNumber1.includes('.') && strTempNumber1[0] == 0) {
        strTempNumber1 = numberText;
      }
      displayToMain(strTempNumber1);
    }
  } else if (strTempNumber1 && tempOperator) {
    strTempNumber2 += numberText;

    if (!strTempNumber2.includes('.') && strTempNumber2[0] == 0) {
      strTempNumber2 = numberText;
    }
    displayToMain(strTempNumber2);
  }
}

function onOperatorClick(event) {
  let operatorText = '';
  if (event.type === 'click') {
    operatorText = event.target.innerText;
  } else if (event.type === 'keydown') {
    operatorText = operatorKeyMap(event);
    if (!operatorText) return;
  }
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
    result &&
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
    clearResult();
  } else if (strTempNumber1 && strTempNumber2 && tempOperator) {
    operate();
  }
}

function numberKeyMap(event) {
  switch (event.key) {
    case '1':
      return '1';
    case '2':
      return '2';
    case '3':
      return '3';
    case '4':
      return '4';
    case '5':
      return '5';
    case '6':
      return '6';
    case '7':
      return '7';
    case '8':
      return '8';
    case '9':
      return '9';
    case '0':
      return '0';
    default:
      return false;
  }
}

function operatorKeyMap(event) {
  switch (event.key) {
    case '/':
      return '/';
    case '*':
      return '*';
    case '-':
      return '-';
    case '+':
      return '+';
    case '=':
    case 'Enter':
      return '=';
    default:
      return false;
  }
}

function operate() {
  switch (tempOperator) {
    case '*':
      result = parseFloat(strTempNumber1) * parseFloat(strTempNumber2);
      break;
    case '/':
      if (strTempNumber2 == 0) {
        result = 'Error Divide by Zero!!';
        break;
      }
      result = parseFloat(strTempNumber1) / parseFloat(strTempNumber2);
      break;
    case '+':
      result = parseFloat(strTempNumber1) + parseFloat(strTempNumber2);
      break;
    case '-':
      result = parseFloat(strTempNumber1) - parseInt(strTempNumber2);
      break;
    default:
      result = 'Invalid Operator';
      break;
  }

  if (!Number.isSafeInteger(result) && !isNaN(result)) {
    let resultNumLength = result.toString().split('.')[0].length;
    if (resultNumLength < 3) {
      result = result.toPrecision(4);
    } else {
      result = result.toPrecision(6);
    }
  }

  result = result.toString();
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
  } else if (result && !isNaN(result)) {
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

function toPercent(numberString) {
  return parseFloat(numberString) / 100;
}

function onPercent() {
  if (strTempNumber1 && tempOperator === null && !strTempNumber2) {
    strTempNumber1 = toPercent(strTempNumber1);
    displayToMain(strTempNumber1);
  } else if (strTempNumber1 && tempOperator && strTempNumber2) {
    strTempNumber2 = toPercent(strTempNumber2);
    displayToMain(strTempNumber2);
  } else if (result && !isNaN(result)) {
    result = result.toString();
    result = toPercent(result);
    displayToMain(result);
  }
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
  console.log('result', result);
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

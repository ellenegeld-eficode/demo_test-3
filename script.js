"use strict";

const MAX_DIGITS = 15;
const SYMBOLS = { "+": "+", "-": "\u2212", "*": "\u00d7", "/": "\u00f7", "%": "%" };

const state = {
  current: "0",
  previous: "",
  operator: null,
  overwrite: false, // next digit replaces the current value
  error: false,
};

const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");

function formatNumber(value) {
  if (value === "Error") return value;
  const [intPart, decPart] = value.split(".");
  const negative = intPart.startsWith("-");
  const digits = negative ? intPart.slice(1) : intPart;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const result = (negative ? "-" : "") + grouped;
  return decPart !== undefined ? `${result}.${decPart}` : result;
}

function updateDisplay() {
  currentEl.textContent = formatNumber(state.current);
  currentEl.classList.toggle("long", state.current.length > 10);
  previousEl.textContent = state.operator
    ? `${formatNumber(state.previous)} ${SYMBOLS[state.operator]}`
    : "";
}

function resetIfError() {
  if (state.error) clear();
}

function clear() {
  state.current = "0";
  state.previous = "";
  state.operator = null;
  state.overwrite = false;
  state.error = false;
  updateDisplay();
}

function setError() {
  state.current = "Error";
  state.previous = "";
  state.operator = null;
  state.overwrite = true;
  state.error = true;
  updateDisplay();
}

function appendDigit(digit) {
  resetIfError();
  if (state.overwrite) {
    state.current = digit;
    state.overwrite = false;
  } else if (state.current === "0") {
    state.current = digit;
  } else if (state.current.replace(/[-.]/g, "").length < MAX_DIGITS) {
    state.current += digit;
  }
  updateDisplay();
}

function appendDecimal() {
  resetIfError();
  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
  } else if (!state.current.includes(".")) {
    state.current += ".";
  }
  updateDisplay();
}

function insertPi() {
  resetIfError();
  state.current = String(parseFloat(Math.PI.toPrecision(MAX_DIGITS)));
  state.overwrite = true; // next digit starts a new number
  updateDisplay();
}

function backspace() {
  if (state.error) return clear();
  if (state.overwrite) return; // don't edit a computed result
  state.current = state.current.length > 1 && state.current !== "-0"
    ? state.current.slice(0, -1)
    : "0";
  if (state.current === "-") state.current = "0";
  updateDisplay();
}

function calculate(a, b, operator) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  let result;
  switch (operator) {
    case "+": result = x + y; break;
    case "-": result = x - y; break;
    case "*": result = x * y; break;
    case "/":
      if (y === 0) return null;
      result = x / y;
      break;
    case "%":
      if (y === 0) return null;
      result = x % y;
      break;
    default: return null;
  }
  if (!Number.isFinite(result)) return null;
  // Remove floating-point noise (e.g. 0.1 + 0.2)
  const cleaned = parseFloat(result.toPrecision(12));
  return String(cleaned);
}

function chooseOperator(operator) {
  resetIfError();
  if (state.operator && !state.overwrite) {
    const result = calculate(state.previous, state.current, state.operator);
    if (result === null) return setError();
    state.previous = result;
  } else if (!state.operator) {
    state.previous = state.current;
  }
  state.operator = operator;
  state.current = state.previous;
  state.overwrite = true;
  updateDisplay();
}

function equals() {
  if (state.error || !state.operator) return;
  const result = calculate(state.previous, state.current, state.operator);
  if (result === null) return setError();
  state.current = result;
  state.previous = "";
  state.operator = null;
  state.overwrite = true;
  updateDisplay();
}

function handleAction(action) {
  switch (action) {
    case "clear": return clear();
    case "backspace": return backspace();
    case "decimal": return appendDecimal();
    case "pi": return insertPi();
    case "equals": return equals();
  }
}

document.querySelector(".keys").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.digit !== undefined) appendDigit(button.dataset.digit);
  else if (button.dataset.op !== undefined) chooseOperator(button.dataset.op);
  else if (button.dataset.action !== undefined) handleAction(button.dataset.action);
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  const key = event.key;
  if (/^[0-9]$/.test(key)) {
    appendDigit(key);
  } else if (key === ".") {
    appendDecimal();
  } else if (key === "p" || key === "P") {
    insertPi();
  } else if (key in SYMBOLS) {
    event.preventDefault(); // avoid browser quick-find on "/"
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault(); // avoid re-triggering a focused button
    equals();
  } else if (key === "Backspace") {
    backspace();
  } else if (key === "Escape" || key === "Delete") {
    clear();
  }
});

updateDisplay();

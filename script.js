const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
// const output = document.getElementById('output');
const calorieResult = document.getElementById('calorie-result');
const calorieCloseBtn = document.getElementById('calorie-close');
const overlay = document.querySelector('.overlay');
const displayBudgetCalories = document.getElementById('budgeted-calories');
const displayConsumedCalories = document.getElementById('consumed-calories');
const displayBurnedCalories = document.getElementById('burned-calories');
const calorieStatus = document.getElementById('calorie-status');
let isError = false;

/*NOTE: Values from an HTML input field are received as strings in JavaScript.
 You'll need to convert these strings into numbers before performing any calculations.
*/

function cleanInputString(str) {
  // const regex = /\+-\s/;       //   Note that you need to use the backslash \ character to escape the + symbol because it has a special meaning in regular expressions.
  const regex = /[+-\s]/g;
  return str.replace(regex, "");
}

// The + modifier in a regex allows you to match a pattern that occurs one or more times.To match your digit pattern one or more times, 

function isInvalidInput(str) {
  // const regex = /[0-9]+e[0-9]+/i;
  // shorthand character class to match any digit: \d.
  const regex = /\d+e\d+/i;
  return str.match(regex);
}
// console.log(isInvalidInput("1e3"));
// the above will print
// [ '1e3', index: 0, input: '1e3', groups: undefined ]

const entryCounters = {
  breakfast: 0,
  lunch: 0,
  dinner: 0,
  snacks: 0,
  exercise: 0
};

function addEntry() {
  const currentCategory = entryDropdown.value;
  const targetInputContainer = document.querySelector(`#${currentCategory} .input-container`);
  // const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length +1;

  entryCounters[currentCategory] = entryCounters[currentCategory] + 1;
  const entryNumber = entryCounters[currentCategory];
  const HTMLString = `
    <div class="entry-row">
    <label for="${currentCategory}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type="text" id="${currentCategory}-${entryNumber}-name" placeholder="Name" />
    <label for="${currentCategory}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" id="${currentCategory}-${entryNumber}-calories" placeholder="Calories" />
    <button type="button" id="${currentCategory}-button-${entryNumber}" class="delete-entry">❌</button>
  </div>
  `;
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
  // deleteEntryfun(currentCategory,entryNumber);
}

// add evenet listener on button unique id

/* function deleteEntryfun(currentCategory,entryNumber) {
  const deleteButton = document.getElementById(`${currentCategory}-button-${entryNumber}`);
  if (deleteButton) {
    deleteButton.addEventListener('click', function eventHandler(e) {
      console.log(e);
      const entryRow = e.target.closest('.entry-row');
      if (entryRow) {
        const confirmed = confirm("Delete this entry? It will be not restored");
        if (confirmed) {
          entryRow.remove();
          deleteButton.removeEventListener('click', eventHandler);
          console.log('Event is removed now');
        }
      }
    });
}
} */


// event delegation 
const inputContainers = document.querySelectorAll('.input-container');

inputContainers.forEach(container => {
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-entry')) {
      const entryRow = e.target.closest('.entry-row');
      if (entryRow) {
        showConfirm("Delete this entry? It will not be restored.", function (confirm) {
          if (confirm) {
            entryRow.remove();
          } 

        });
      }
    }
  });
});

addEntryButton.addEventListener('click', addEntry);

function calculateCalories(e) {
  e.preventDefault();
  isError = false;
  const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
  const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
  const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
  const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
  const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
  if (isError) {
    return
  }
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";

  // output.innerHTML = `<span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  // <hr>
  //  <p>${budgetCalories} Calories Budgeted</p>
  //  <p>${consumedCalories} Calories Consumed</p>
  //   <p>${exerciseCalories} Calories Burned</p>
  // `;
  // output.classList.remove('hide');

  calorieResult.classList.remove('hidden');
  overlay.classList.remove('hidden');
  displayBudgetCalories.textContent = budgetCalories;
  displayConsumedCalories.textContent = consumedCalories;
  displayBurnedCalories.textContent = exerciseCalories;
  calorieStatus.classList.add(surplusOrDeficit.toLowerCase());
  calorieStatus.textContent = `${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}`;
  confetti();
}
calorieCounter.addEventListener('submit', calculateCalories);

function hideCalorieModal() {
  calorieResult.classList.add('hidden');
  overlay.classList.add('hidden');
  calorieStatus.textContent = "";
  calorieStatus.classList.remove("surplus", "deficit");
}
calorieCloseBtn.addEventListener('click', hideCalorieModal);



/*The list parameter is going to be the result of a query selector, which will return a NodeList.A NodeList is a list of elements
 like an array.It contains the elements that match the query selector.You will need to loop through these elements in the list.*/

function getCaloriesFromInputs(list) {
  let calories = 0;
  for (const item of list) {
    const currVal = cleanInputString(item.value);
    const invalidInputMatch = isInvalidInput(currVal);
    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    calories += Number(currVal);
  }
  return calories;
}

function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));
  for (const container of inputContainers) {
    container.innerHTML = "";
  }
  budgetNumberInput.value = "";
  output.innerText = "";
  output.classList.add('hide');
}
clearButton.addEventListener('click', clearForm);

let confirmCallback = null;
function showConfirm(message, callback) {
  document.getElementById("confirm-message").textContent = message;
  document.getElementById("custom-confirm").classList.remove("hidden");
  confirmCallback = callback;
}

document.getElementById("confirm-yes").addEventListener("click", function () {
  document.getElementById("custom-confirm").classList.add("hidden");
  if (typeof confirmCallback === "function") {
    confirmCallback(true);
  }
});

document.getElementById("confirm-no").addEventListener("click", function () {
  document.getElementById("custom-confirm").classList.add("hidden");
  if (typeof confirmCallback === "function") {
    confirmCallback(false);
  }

});


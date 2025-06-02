const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

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

function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
   <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories" />

  `;
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

addEntryButton.addEventListener('click', addEntry);


function calculateCalories(e) {
  e.preventDefault();
  isError = false;
  const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
  console.log(breakfastNumberInputs);
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

  output.innerHTML = `<span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
   <p>${budgetCalories} Calories Budgeted</p>
   <p>${consumedCalories} Calories Consumed</p>
    <p>${exerciseCalories} Calories Burned</p>
  `;
  output.classList.remove('hide');

}

calorieCounter.addEventListener('submit', calculateCalories);



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

function clearForm (){
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));
  for(const container of inputContainers){
    container.innerHTML = "";
  }
budgetNumberInput.value = "";
output.innerText = "";
output.classList.add('hide');
}
clearButton.addEventListener('click', clearForm);
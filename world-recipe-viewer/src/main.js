document.addEventListener('DOMContentLoaded', () => {
  fetchRandomMeal();
  populateCountrySelector();
});

const fetchMeal = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchRandomMeal = async () => {
  const meals = await fetchMeal('https://www.themealdb.com/api/json/v1/1/random.php');
  displayMeals(meals);
};

const fetchMealsByCountry = async (country) => {
  const meals = await fetchMeal(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`);
  displayMeals(meals);
};

const displayMeals = (meals) => {
  const container = document.getElementById('meal-container');
  container.innerHTML = ''; // Clear existing meals
  meals.forEach(meal => {
    const mealDiv = document.createElement('div');
    mealDiv.className = 'meal';
    mealDiv.innerHTML = `
      <h3>${meal.strMeal}</h3>
      <img src="${meal.strMealThumb}/preview" alt="${meal.strMeal}">
    `;
    mealDiv.addEventListener('click', () => fetchMealDetails(meal.idMeal));
    container.appendChild(mealDiv);
  });
};

const fetchMealDetails = async (mealId) => {
  const details = await fetchMeal(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  if (details) {
    displayMealDetails(details[0]);
  }
};

const displayMealDetails = (meal) => {
  const container = document.getElementById('meal-container');
  container.innerHTML = `
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
    <p><strong>Ingredients:</strong></p>
    <ul>${getIngredientsList(meal)}</ul>
  `;
};

const getIngredientsList = (meal) => {
  let ingredientsList = '';
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredientsList += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
    }
  }
  return ingredientsList;
};

const populateCountrySelector = async () => {
  const countries = await fetchMeal('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  const selector = document.getElementById('country-selector');
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.strArea;
    option.textContent = country.strArea;
    selector.appendChild(option);
  });
};

document.getElementById('random-meal-btn').addEventListener('click', fetchRandomMeal);
document.getElementById('country-selector').addEventListener('change', (event) => {
  fetchMealsByCountry(event.target.value);
});

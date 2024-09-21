document.getElementById("button").addEventListener('click', searchMeals);

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting
    searchMeals();
});

document.getElementById('inputName').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission on Enter key
        searchMeals();
    }
});

function searchMeals() {
    let inputValue = document.getElementById('inputName').value.trim();
    let details = document.getElementById("details");
    details.innerHTML = "";

    if (!inputValue) {
        alert("Please enter a meal name.");
        return;
    }

    const apiKey = 'c9d653ea06f648e7b31ad22867d10997'; // Replace with your Spoonacular API key
    fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${inputValue}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const items = document.getElementById("items");
            items.innerHTML = "";
            if (data.results.length === 0) {
                document.getElementById("msg").style.display = "block";
            } else {
                document.getElementById("msg").style.display = "none";
                data.results.forEach(meal => {
                    let itemDiv = document.createElement("div");
                    itemDiv.className = "m-2 singleItem";
                    itemDiv.setAttribute('onclick', `details(${meal.id})`); // Use meal.id

                    let itemInfo = `
                        <div class="card" style="width: 18rem;">
                            <img src="${meal.image}" class="card-img-top" alt="${meal.title}">
                            <div class="card-body">
                                <h5 class="card-text">${meal.title}</h5>
                            </div>
                        </div>
                    `;
                    itemDiv.innerHTML = itemInfo;
                    items.appendChild(itemDiv);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('There was an error fetching data. Please try again.');
        });
}

function details(id) {
    const apiKey = 'c9d653ea06f648e7b31ad22867d10997'; // Replace with your Spoonacular API key
    fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`)
        .then(res => res.json())
        .then(detail => {
            let meal = detail;
            let details = document.getElementById("details");
            details.innerHTML = "";
            let detailsDiv = document.createElement("div");
            let detailsInfo = `
                <div class="card" style="width: 19rem;">
                    <img src="${meal.image}" class="card-img-top" alt="${meal.title}">
                    <div class="card-body">
                        <h3 class="card-text">${meal.title}</h3>
                        <h6>Ingredients</h6>
                        <ul>
                            ${meal.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            detailsDiv.innerHTML = detailsInfo;
            details.appendChild(detailsDiv);

            // Scoll to the top of the page smoothlhy
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
}
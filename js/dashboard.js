// ========================================
// Crypto Converter Dashboard
// Author: Tanvi
// ========================================

// -------------------------------
// Check Login
// -------------------------------

const loggedInUser = localStorage.getItem("loggedInUser");

if (!loggedInUser) {
    window.location.href = "index.html";
}

// -------------------------------
// Welcome Message
// -------------------------------

document.getElementById("welcomeUser").innerHTML =
    "👋 Welcome, " + loggedInUser;

// -------------------------------
// DOM Elements
// -------------------------------

const coin = document.getElementById("coin");
const currency = document.getElementById("currency");
const amount = document.getElementById("amount");

const convertBtn = document.getElementById("convertBtn");
const favoriteBtn = document.getElementById("favoriteBtn");

const result = document.getElementById("result");
const loading = document.getElementById("loading");

const favoriteList = document.getElementById("favoriteList");

const logoutBtn = document.getElementById("logoutBtn");

let chart;

// -------------------------------
// Convert Button
// -------------------------------

convertBtn.addEventListener("click", convertCrypto);

// -------------------------------
// Favorite Button
// -------------------------------

favoriteBtn.addEventListener("click", saveFavorite);

// -------------------------------
// Logout
// -------------------------------

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("loggedInUser");

    window.location.href = "index.html";

});

// -------------------------------
// Convert Crypto
// -------------------------------

async function convertCrypto() {

    loading.innerHTML = "Loading...";

    result.innerHTML = "";

    try {

        const api =
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin.value}&vs_currencies=${currency.value}`;

        const response = await fetch(api);

        if (!response.ok) {

            throw new Error("API Error");

        }

        const data = await response.json();

        const price = data[coin.value][currency.value];

        const total = (price * Number(amount.value)).toFixed(2);

        result.innerHTML =
        `${amount.value} ${coin.value.toUpperCase()} = ${total} ${currency.value.toUpperCase()}`;

        loading.innerHTML = "";

        drawChart();

    }

    catch(error){

        loading.innerHTML="";

        result.innerHTML="Unable to fetch data.";

        console.log(error);

    }

}

// -------------------------------
// Historical Chart
// -------------------------------

async function drawChart(){

    try{

        const api =
`https://api.coingecko.com/api/v3/coins/${coin.value}/market_chart?vs_currency=${currency.value}&days=7`;

        const response = await fetch(api);

        const data = await response.json();

        const labels = data.prices.map(item => {

            return new Date(item[0]).toLocaleDateString();

        });

        const prices = data.prices.map(item => item[1]);

        if(chart){

            chart.destroy();

        }

        chart = new Chart(

            document.getElementById("priceChart"),

            {

                type:"line",

                data:{

                    labels:labels,

                    datasets:[{

                        label:coin.value.toUpperCase(),

                        data:prices,

                        borderWidth:3,

                        fill:false,

                        tension:.3

                    }]

                },

                options:{

                    responsive:true,

                    plugins:{

                        legend:{

                            display:true

                        }

                    }

                }

            }

        );

    }

    catch(error){

        console.log(error);

    }

}

// -------------------------------
// Save Favorite
// -------------------------------

function saveFavorite(){

    let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

    let pair = `${coin.value} → ${currency.value}`;

    if(!favorites.includes(pair)){

        favorites.push(pair);

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

    }

    loadFavorites();

}

// -------------------------------
// Load Favorites
// -------------------------------

function loadFavorites(){

    favoriteList.innerHTML="";

    let favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.forEach(pair=>{

        let li=document.createElement("li");

        li.innerHTML=pair;

        favoriteList.appendChild(li);

    });

}

// -------------------------------
// Initial Load
// -------------------------------

loadFavorites();

convertCrypto();
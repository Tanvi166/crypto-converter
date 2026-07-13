var loggedInUser = localStorage.getItem("loggedInUser");
if (!loggedInUser) {
    window.location.href = "index.html";
}
document.getElementById("welcomeUser").innerHTML =
"👋 Welcome, " + loggedInUser;

var coin = document.getElementById("coin");
var currency = document.getElementById("currency");
var amount = document.getElementById("amount");
var convertBtn = document.getElementById("convertBtn");
var favoriteBtn = document.getElementById("favoriteBtn");
var result = document.getElementById("result");
var loading = document.getElementById("loading");
var favoriteList = document.getElementById("favoriteList");
var logoutBtn = document.getElementById("logoutBtn");
var chart;
convertBtn.addEventListener("click", convertCrypto);
favoriteBtn.addEventListener("click", saveFavorite);
logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
});
function convertCrypto() {
    loading.innerHTML = "Fetching latest prices...";
    result.innerHTML = "";
    var api = "https://api.coingecko.com/api/v3/simple/price?ids=" +
        coin.value +
        "&vs_currencies=" +
        currency.value;
    fetch(api)
    .then(function(response){
        if(!response.ok){
            throw new Error("API Error");
        }
        return response.json();
    })
    .then(function(data){
        var price = data[coin.value][currency.value];
        var total = (price * amount.value).toFixed(2);
        result.innerHTML =
        amount.value + " " +
        coin.value.toUpperCase() +
        " = " +
        total +
        " " +
        currency.value.toUpperCase();
        loading.innerHTML = "";
        drawChart();
    })
    .catch(function(error){
        loading.innerHTML = "";
        result.innerHTML = "Unable to fetch data.";
        console.log(error);
    });
}
function drawChart(){
    var api = "https://api.coingecko.com/api/v3/coins/" +
        coin.value +
        "/market_chart?vs_currency=" +
        currency.value +
        "&days=7";
    fetch(api)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        var labels = [];
        var prices = [];
        for(var i=0;i<data.prices.length;i++){
            labels.push(
                new Date(data.prices[i][0]).toLocaleDateString()
            );
            prices.push(
                data.prices[i][1]
            );
        }
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
                        tension:0.3
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
    })
    .catch(function(error){
        console.log(error);
    });
}
function saveFavorite(){
    var favorites =
    JSON.parse(localStorage.getItem("favorites"));
    if(favorites == null){
        favorites = [];
    }
    var pair = coin.value + " → " + currency.value;
    var found = false;
    for(var i=0;i<favorites.length;i++){
        if(favorites[i] == pair){
            found = true;
            break;
        }
    }
    if(found == false){
        favorites.push(pair);
        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );
    }
    loadFavorites();
}
function loadFavorites(){
    favoriteList.innerHTML = "";
    var favorites =
    JSON.parse(localStorage.getItem("favorites"));
    if(favorites == null){
        favorites = [];
    }
    for(var i=0;i<favorites.length;i++){
        var li = document.createElement("li");
        li.innerHTML = favorites[i];
        favoriteList.appendChild(li);
    }
}
loadFavorites();
convertCrypto();
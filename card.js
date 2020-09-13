
let cardContainer = document.getElementById('card-container')
cardContainer.innerHTML = "<div class='loading-message'>Loading <img class='loading-img' src='https://rebekahlang.files.wordpress.com/2015/08/pokemon-egg-gif.gif'/></div>"

let namesWithDashes = ["ho-oh"]
let subNameReplacements = {
    m: "male",
    f: "female",
    attack: "attack form",
    defense: "defense form"
}


let getRandomPokemon = () => {
    let maxValue = 1050;
    let retrivalLimit = 50;
    let offset = Math.floor(Math.random() * (maxValue - retrivalLimit)) + 1
    let url = "https://pokeapi.co/api/v2/pokemon/?limit=" + retrivalLimit + "&offset=" + offset

    let selectedPokemon;
    console.log("URL: ", url);
    return fetch(url)
    .then((response) => response.json())
    .then(data => {
        let index = "" + Math.floor(Math.random() * retrivalLimit)
        selectedPokemon = data.results[index]
        return fetch(selectedPokemon.url)
        .then(response => response.json())
        .then(data => {
            if(data.sprites.front_default){
                return data
            }else {
                return getRandomPokemon()
            }
        })
    })
}

let pokemonCount = 10;
let pokemon = []
for(let i = 0; i < pokemonCount; i++){
    pokemon.push(getRandomPokemon())
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

 function getStats(statsObject){
     let getStatValue = (name) => {
        return Object.values(statsObject).find(stat => stat.stat.name === name).base_stat
     }
     if(Object.keys(statsObject).length > 0){
         let hp = getStatValue("hp")
         let attack = getStatValue("attack")
         let defense = getStatValue("defense")
         return {hp, attack, defense}
     }
 }

Promise.all(pokemon).then(res => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    let pokemonList = res.map(pokemon => {
        let name = namesWithDashes.indexOf(pokemon.name) === -1 && pokemon.name.indexOf("-") === -1 ? pokemon.name : pokemon.name.split("-")[0]
        name = titleCase(name)
        let subNames = pokemon.name.indexOf("-") === -1 ? "" : pokemon.name.split("-")
        if(subNames.length > 1){
            subNames.shift()
        }
        let subName = subNames.length > 0 ? subNames.reduce((acc, cur) => {
            if(subNameReplacements[cur]){
                console.log("REPLACING: ", cur);
                cur = subNameReplacements[cur]
            }
            return acc + " " + cur
        }) : ""
        subName = titleCase(subName)
        let sprite = pokemon.sprites.front_default
        let stats = getStats(pokemon.stats)
        return `<article class="card">
        <header class="card-header">
          <h2>${name}</h2>
          <h5>${subName}</h5>
        </header>
        <div class="sprite">
        <a href=https://bulbapedia.bulbagarden.net/wiki/${name}_(Pok%C3%A9mon) target="_blank">
        <img src='${sprite}'/>
        </a>
        </div>
        <div class="stat-container">
        <div class="stat" id="stat-hp">
        HP: ${stats.hp}
        </div>
        <div class="stat" id="stat-attack">
        Attack: ${stats.attack}
        </div>
        <div class="stat" id="stat-defense">
        Defense: ${stats.defense}
        </div>
        </div>
        </article>`
    }).reduce(reducer)

    cardContainer.innerHTML = pokemonList
})


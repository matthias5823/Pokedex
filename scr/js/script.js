function init() {
    loadPokemons();
    
}

async function loadPokemons() {
    for (let i = 1; i <= 20; i++) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let responseToJson = await response.json();
        pokemons.push(responseToJson);
    };
    addMiniCard ();  
}

function addMiniCard (){
    for (let indexPokemons = 0; indexPokemons < pokemons.length; indexPokemons++) {
        const addMiniCardRef = document.getElementById('contnet_card');
        let name = pokemons[indexPokemons].name;
        let scrPic = addedScrPic(indexPokemons);
        addMiniCardRef.innerHTML += renderMiniCard(indexPokemons, name, scrPic);        
    }
}

function addedScrPic(indexPokemons){
    return pokemons[indexPokemons].sprites.other.dream_world.front_default;
}


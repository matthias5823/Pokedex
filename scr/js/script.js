function init() {
    loadPokemons();
    // pokemons = [];
    // startUpload ();    
}

function startUpload () {
    let start = 1;
    let end = 20;
    if (pokemons.length < 1){
        loadPokemons(start , end)
    }else{
        start = pokemons.length - 1;
        end = pokemons.length + 19;
        loadPokemons(start , end);
    };
}

async function loadPokemons() {
    for (let i = 1; i <= 20; i++) {
        let responseBasic = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let responseSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
        let responseBasicToJson = await responseBasic.json();
        let responseSpeciesToJson = await responseSpecies.json();
        pokemonsBasic.push(responseBasicToJson);
        pokemonSpecies.push(responseSpeciesToJson);
    };
    addMiniCard ();  
}

function addMiniCard (){
    for (let indexPokemons = 0; indexPokemons < pokemonsBasic.length; indexPokemons++) {
        const addMiniCardRef = document.getElementById('contnet_card');
        let name = pokemonSpecies[indexPokemons].names[5].name;
        let scrPic = addedScrPic(indexPokemons);
        addMiniCardRef.innerHTML += renderMiniCard(indexPokemons, name, scrPic);
        addedType(indexPokemons);    
    }
}

function addedScrPic(indexPokemons){
    return pokemonsBasic[indexPokemons].sprites.other.dream_world.front_default;
}

function addedType(indexPokemons) {
    const typeMiniCardRef = document.getElementById(`type_mini_card${indexPokemons}`);
    let typeLength = pokemonsBasic[indexPokemons].types.length;
    for (let indexType = 0; indexType < typeLength; indexType++) {
        let typeName = pokemonsBasic[indexPokemons].types[indexType].type.name;
        typeMiniCardRef.innerHTML += renderTypes(typeName);         
    }   
}

function showO(params) {
    
}


function init() {
    // loadPokemons();
    // pokemons = [];
    startUpload();
    loadPokemonsTypes();
    loadEvuloutions();
}

function startUpload() {
    let start = 1;
    let end = 20;
    if (pokemonsBasic.length < 1) {
        loadPokemons(start, end)
    } else {
        start = pokemonsBasic.length + 1;
        end = pokemonsBasic.length + 20;
        loadPokemons(start, end);
    };
}

async function loadPokemons(start, end) {
    for (let i = start; i <= end; i++) {
        let responseBasic = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        let responseSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
        let responseBasicToJson = await responseBasic.json();
        let responseSpeciesToJson = await responseSpecies.json();
        pokemonsBasic.push(responseBasicToJson);
        pokemonSpecies.push(responseSpeciesToJson);
    };
    addMiniCard();
}

async function loadPokemonsTypes() {
    for (let i = 1; i < 20; i++) {
        let responsTypes = await fetch(`https://pokeapi.co/api/v2/type/${i}`);
        let responsTypesToJson = await responsTypes.json();
        pokemonsTypes.push(responsTypesToJson);
    };
    console.log(pokemonsTypes);
}

function addedEvuloutionsChain() {

    for (let iPokemonSpecies = 0; iPokemonSpecies < pokemonSpecies.length; iPokemonSpecies++) {
        let path = pokemonSpecies[iPokemonSpecies]['evolution_chain'];
        let ipokemonsEvuloutionsChain = pokemonsEvuloutionsChain.findIndex(pokemonsEvuloutionsChain => pokemonsEvuloutionsChain.url === path.url);
        if (ipokemonsEvuloutionsChain === -1) {
            pokemonsEvuloutionsChain.push(path);
        };

    };
    console.log(pokemonsEvuloutionsChain);
}

function addMiniCard() {
    const addMiniCardRef = document.getElementById('contnet_card');
    addMiniCardRef.innerHTML = "";
    for (let indexPokemons = 0; indexPokemons < pokemonsBasic.length; indexPokemons++) {
        let name = pokemonSpecies[indexPokemons].names[5].name;
        let scrPic = addedScrPic(indexPokemons);
        let typeName = pokemonsBasic[indexPokemons].types[0].type.name;
        addMiniCardRef.innerHTML += renderMiniCard(indexPokemons, name, scrPic, typeName);
        addedType(indexPokemons);
    }
}

function addedScrPic(indexPokemons) {
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

function initDialogTabs() {
    const tabs = document.querySelectorAll(".tab");
    const tabContent = document.querySelectorAll(".content-card-section");
    for (let iTabs = 0; iTabs < tabs.length; iTabs++) {
        const actuellTab = tabs[iTabs];
        actuellTab.addEventListener("click", function () {
            for (let a = 0; a > tabs.length; a++) {
                tabs[a].classList.remove("activ");
            };
            for (let b = 0; b < tabContent.length; b++) {
                tabContent[b].classList.remove("activ");
            };
            actuellTab.classList.add("activ");
            const zielId = actuellTab.dataset.ziel;
            const zielElement = document.getElementById(zielId);
            zielElement.classList.add("activ")
        });
    };
}

function openDialog(indexPokemons, scrPic) {
    const dialog = document.getElementById('dialog_card');    
    dialog.innerHTML = renderOverlayCard();
    dialog.showModal();
    initDialogTabs();
}




pokemonsTypes[0].sprites['generation-viii']['legends-arceus'].name_icon // Type icon by 

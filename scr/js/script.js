// Merkt sich, ob gerade Pokémon geladen werden. So starten wir nicht mehrere Ladevorgänge zugleich.
let pokemonsLoading = false;

// Wird beim Laden der Seite durch onload im HTML aufgerufen.
// Startet das Laden der Pokémon und ihrer Typen. Beide Ladevorgänge laufen unabhängig.
function init() {
    // loadPokemons();
    // pokemons = [];
    startUpload();
    loadPokemonsTypes();
}

// Legt fest, welche 20 Pokémon als Nächstes geladen werden sollen.
function startUpload() {
    let start = 1;
    let end = 20;
    // length ist die Anzahl der Einträge. Eine leere Liste startet bei ID 1.
    if (pokemonsBasic.length < 1) {
        loadPokemons(start, end)
    } else {
        // Sind schon 20 Pokémon geladen, werden hier die IDs 21 bis 40 ausgewählt.
        start = pokemonsBasic.length + 1;
        end = pokemonsBasic.length + 20;
        loadPokemons(start, end);
    };
}

// Lädt für jede ID die Grunddaten und die zusätzlichen Daten der Pokémon-Art.
// async erlaubt await: Damit wartet die Funktion auf die jeweilige Antwort.
async function loadPokemons(start, end) {
    // Ein weiterer Aufruf während des Ladens wird mit return sofort beendet.
    if (pokemonsLoading) {
        return;
    };
    pokemonsLoading = true;
    showLoadingSpinner(true);
    // In try steht der Code, bei dem zum Beispiel ein Netzwerkfehler auftreten kann.
    try {
        for (let i = start; i <= end; i++) {
            // fetch fragt die Daten im Internet ab. ${i} setzt die aktuelle ID in die URL ein.
            let responseBasic = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            let responseSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
            // ok ist false, wenn die API zum Beispiel mit einer Fehlerseite antwortet.
            if (!responseBasic.ok || !responseSpecies.ok) {
                throw new Error("Pokémon konnten nicht geladen werden.");
            };
            // json() macht aus den Antworten JavaScript-Objekte, deren Eigenschaften wir lesen können.
            let responseBasicToJson = await responseBasic.json();
            let responseSpeciesToJson = await responseSpecies.json();
            // push hängt die Daten hinten an die Listen an. Beide Listen haben dieselbe Reihenfolge.
            pokemonsBasic.push(responseBasicToJson);
            pokemonSpecies.push(responseSpeciesToJson);
        };
        // Zeigt die Karten an und berücksichtigt dabei eine bereits eingegebene Suche.
        searchPokemon();
    } catch (error) {
        // catch fängt den Fehler ab. Bereits geladene Pokémon können trotzdem angezeigt werden.
        searchPokemon();
        console.error(error);
        const searchMessageRef = document.getElementById('search_message');
        if (searchMessageRef) {
            searchMessageRef.textContent = "Pokémon konnten nicht vollständig geladen werden. Bitte versuche es erneut.";
            searchMessageRef.hidden = false;
        };
    } finally {
        // finally läuft bei Erfolg und bei einem Fehler: Die Ladeanzeige verschwindet immer.
        pokemonsLoading = false;
        showLoadingSpinner(false);
    }
}

// Bekommt true zum Anzeigen oder false zum Ausblenden der Ladeanzeige.
function showLoadingSpinner(isLoading) {
    const loadingSpinnerRef = document.getElementById('loading_spinner');
    const loadPokemonsButtonRef = document.getElementById('load_pokemons_button');
    const contentCardRef = document.getElementById('contnet_card');
    // ! kehrt den Wert um: Beim Laden wird hidden auf false gesetzt, also sichtbar.
    if (loadingSpinnerRef) {
        loadingSpinnerRef.hidden = !isLoading;
    };
    // Während des Ladens kann der Button nicht erneut angeklickt werden.
    if (loadPokemonsButtonRef) {
        loadPokemonsButtonRef.disabled = isLoading;
    };
    // Teilt auch Hilfsprogrammen wie Screenreadern mit, dass der Kartenbereich gerade lädt.
    if (contentCardRef) {
        contentCardRef.setAttribute('aria-busy', String(isLoading));
    };
}

// Lädt die Typen mit den IDs 1 bis 19 und speichert sie in pokemonsTypes.
async function loadPokemonsTypes() {
    for (let i = 1; i < 20; i++) {
        let responsTypes = await fetch(`https://pokeapi.co/api/v2/type/${i}`);
        let responsTypesToJson = await responsTypes.json();
        pokemonsTypes.push(responsTypesToJson);
    };
    // Gibt die geladenen Daten zur Kontrolle in der Browser-Konsole aus.
    console.log(pokemonsTypes);
}

// Lädt die Entwicklungsdaten von allen zuvor gesammelten URLs.
// Achtung: Bei jedem Aufruf werden die Antworten erneut an die Liste angehängt.
async function loadEvuloutions() {
    for (let i = 0; i < pokemonsEvuloutionsChain.length; i++) {
        let path = pokemonsEvuloutionsChain[i].url;
        let responseEvulotion = await fetch(path);
        let responseEvulotionToJson = await responseEvulotion.json();
        pokemonsEvuloutions.push(responseEvulotionToJson);
    };
}

function getDescriptionHeight(indexPokemons) {
    let height = pokemonsBasic[indexPokemons].height;
    height = height / 10;
    return height;  
}

function getDescriptionWeight(indexPokemons) {
    let weight = pokemonsBasic[indexPokemons].weight;
    weight = weight / 10;
    return weight;  
}

// Gibt die Pokémon-ID zurück. indexPokemons ist die Position in der Liste, nicht die ID selbst.
function addedPokemonId(indexPokemons) {
    return pokemonsBasic[indexPokemons]['id'];
}

// Gibt den englischen Namen des Pokémon an dieser Listenposition zurück.
function addedPokemonNameEn(indexPokemons) {
    return pokemonsBasic[indexPokemons]['name'];
}

// Liest den Namen aus dem sechsten Eintrag der Namensliste (Arrays beginnen bei 0).
// Hier wird vorausgesetzt, dass names[5] den deutschen Namen enthält.
function addedPokemonNameDe(indexPokemons) {
    return pokemonSpecies[indexPokemons].names[5].name;
}

// Liest den Namen des ersten Typs aus. Dieser wird zum Beispiel für die Kartenfarbe benutzt.
function addedFirstTyp(indexPokemons) {
    return pokemonsBasic[indexPokemons].types[0].type.name;
}

// Gibt die Bild-URL aus dem Bereich dream_world der Pokémon-Daten zurück.
function addedScrPic(indexPokemons) {
    return pokemonsBasic[indexPokemons].sprites.other.dream_world.front_default;
}

// Sammelt die Entwicklungs-URLs der geladenen Pokémon, ohne dieselbe URL doppelt einzutragen.
function addedEvuloutionsChain() {
    for (let iPokemonSpecies = 0; iPokemonSpecies < pokemonSpecies.length; iPokemonSpecies++) {
        let path = pokemonSpecies[iPokemonSpecies]['evolution_chain'];
        // findIndex sucht die Position eines passenden Eintrags. Verglichen werden beide URL-Strings.
        let ipokemonsEvuloutionsChain = pokemonsEvuloutionsChain.findIndex(pokemonsEvuloutionsChain => pokemonsEvuloutionsChain.url === path.url);
        // -1 bedeutet: nicht gefunden. Nur dann speichern wir das Objekt mit der URL.
        if (ipokemonsEvuloutionsChain === -1) {
            pokemonsEvuloutionsChain.push(path);
        };
    };
}

// Liest die Eingabe, holt die passenden Pokémon und zeigt die Karten und die Meldung an.
// Wird durch oninput bei jeder Änderung im Suchfeld aufgerufen.
function searchPokemon() {
    // getElementById holt das passende HTML-Element anhand seiner ID.
    const searchPokemonRef = document.getElementById('search_pokemon');
    const searchMessageRef = document.getElementById('search_message');
    // Fehlt eines der Elemente, zeigen wir alle Karten und beenden die Suche mit return.
    if (!searchPokemonRef || !searchMessageRef) {
        addMiniCard();
        return;
    };
    // value liest die Eingabe. trim entfernt äußere Leerzeichen, toLowerCase macht alles klein.
    let searchTerm = searchPokemonRef.value.trim().toLowerCase();
    // Übergibt den Suchtext. Die zurückgegebene Liste speichern wir in pokemonsSearch.
    let pokemonsSearch = filterPokemons(searchTerm);
    addMiniCard(pokemonsSearch);
    // Übergibt das HTML-Element für die Meldung und die Anzahl der Treffer.
    showSearchMessage(searchMessageRef, pokemonsSearch.length);
}

// Bekommt den Suchtext als Parameter und gibt die passende Pokémon-Liste zurück.
// Durchsucht nur die bereits geladenen Pokémon nach dem englischen Namen oder der genauen ID.
function filterPokemons(searchTerm) {
    // Dieses Suchmuster prüft, ob die gesamte Eingabe nur aus Ziffern besteht.
    let isId = /^\d+$/.test(searchTerm);
    // Namen suchen wir erst ab drei Zeichen. Zahlen dürfen auch kürzer sein.
    // Eine leere Eingabe zeigt ebenfalls wieder alle Karten.
    if (!isId && searchTerm.length < 3) {
        return pokemonsBasic;
    };
    // filter erstellt eine neue Liste. Ein Pokémon bleibt darin, wenn die Prüfung true ergibt.
    // Die ursprüngliche Liste pokemonsBasic wird dabei nicht verändert.
    return pokemonsBasic.filter(pokemon => {
        if (isId) {
            // Number macht aus dem eingegebenen Text eine Zahl. === prüft auf genaue Gleichheit.
            return pokemon.id === Number(searchTerm);
        };
        // includes prüft auf einen Teilnamen: Zum Beispiel passt 'bul' zu 'bulbasaur'.
        return pokemon.name.toLowerCase().includes(searchTerm);
    });
}

// Bekommt das Meldungselement und die Anzahl der Treffer als Parameter.
// Zeigt nur dann eine Meldung an, wenn keine Pokémon gefunden wurden.
function showSearchMessage(searchMessageRef, numberOfResults) {
    // Eine Meldung aus der vorherigen Suche wird zuerst geleert und versteckt.
    searchMessageRef.textContent = "";
    searchMessageRef.hidden = true;
    // Bei null Treffern zeigen wir eine Meldung statt Karten.
    if (numberOfResults === 0) {
        searchMessageRef.textContent = "Keine passenden Pokémon unter den bereits geladenen Pokémon gefunden.";
        searchMessageRef.hidden = false;
    };
}

// Baut die kleinen Pokémon-Karten im Hauptbereich der Seite auf.
// Ohne übergebene Liste wird automatisch pokemonsBasic verwendet, also alle geladenen Pokémon.
function addMiniCard(pokemonsSearch = pokemonsBasic) {
    const addMiniCardRef = document.getElementById('contnet_card');
    // Entfernt die alten Karten, damit sie beim erneuten Anzeigen nicht doppelt erscheinen.
    addMiniCardRef.innerHTML = "";
    for (let indexPokemons = 0; indexPokemons < pokemonsBasic.length; indexPokemons++) {
        // Wir durchlaufen die ursprüngliche Liste, damit die Dialog-Indizes richtig bleiben.
        // continue überspringt Pokémon, die nicht in der gewünschten Ergebnisliste stehen.
        if (!pokemonsSearch.includes(pokemonsBasic[indexPokemons])) {
            continue;
        };
        // Die kleinen Hilfsfunktionen lesen die Daten für diese Karte aus.
        let nameDe = addedPokemonNameDe(indexPokemons);
        let nameEn = addedPokemonNameEn(indexPokemons);
        let scrPic = addedScrPic(indexPokemons);
        let typeName = addedFirstTyp(indexPokemons);
        // renderMiniCard liefert HTML als Text. += hängt dieses HTML an die bisherigen Karten an.
        addMiniCardRef.innerHTML += renderMiniCard(indexPokemons, nameDe, nameEn, scrPic, typeName);
        addedType(indexPokemons);
        addedEvuloutionsChain();
    }
}



// Fügt für jeden Typ eines Pokémon ein Typenbild in seine Karte ein.
function addedType(indexPokemons) {
    // Der Index in der ID sorgt dafür, dass wir den Typenbereich der richtigen Karte finden.
    const typeMiniCardRef = document.getElementById(`type_mini_card${indexPokemons}`);
    let typeLength = pokemonsBasic[indexPokemons].types.length;
    for (let indexType = 0; indexType < typeLength; indexType++) {
        let typeName = pokemonsBasic[indexPokemons].types[indexType].type.name;
        typeMiniCardRef.innerHTML += renderTypes(typeName);
    }
}

// Richtet die Klicks auf die Reiter im Dialog ein. Der Dialoginhalt muss dafür schon im HTML stehen.
function initDialogTabs() {
    // querySelectorAll sammelt alle Elemente mit der jeweiligen CSS-Klasse.
    const tabs = document.querySelectorAll(".tab");
    const tabContent = document.querySelectorAll(".content-card-section");
    for (let iTabs = 0; iTabs < tabs.length; iTabs++) {
        const actuellTab = tabs[iTabs];
        // Der Code innerhalb dieses Listeners läuft erst, wenn der Reiter angeklickt wird.
        actuellTab.addEventListener("click", function () {
            // Entfernt die Markierung und meldet Screenreadern, dass die anderen Reiter nicht ausgewählt sind.
            for (let a = 0; a < tabs.length; a++) {
                tabs[a].classList.remove("activ");
                tabs[a].setAttribute("aria-selected", "false");
            };
            // Versteckt alle Inhaltsbereiche, indem die Klasse activ entfernt wird.
            for (let b = 0; b < tabContent.length; b++) {
                tabContent[b].classList.remove("activ");
            };
            actuellTab.classList.add("activ");
            actuellTab.setAttribute("aria-selected", "true");
            // dataset.ziel liest data-ziel aus dem Button, zum Beispiel 'basic_values'.
            const zielId = actuellTab.dataset.ziel;
            const zielElement = document.getElementById(zielId);
            // Die CSS-Klasse activ macht den ausgewählten Inhaltsbereich sichtbar.
            zielElement.classList.add("activ")
        });
    };
}

// Öffnet die große Detailkarte für das Pokémon an der übergebenen Listenposition.
function openDialog(indexPokemons) {
    const dialog = document.getElementById('dialog_card');
    // Startet das Laden der Entwicklungsdaten. Hier wird nicht auf deren Abschluss gewartet.
    loadEvuloutions();
    let id = addedPokemonId(indexPokemons);
    let nameDe = addedPokemonNameDe(indexPokemons);
    let nameEn = addedPokemonNameEn(indexPokemons);
    let scrPic = addedScrPic(indexPokemons);
    let lastName = lastPokemonName(indexPokemons);
    let nextName = nextPokemonName(indexPokemons);
    let typeName = addedFirstTyp(indexPokemons);
    let height = getDescriptionHeight(indexPokemons);
    let weight = getDescriptionWeight(indexPokemons);
    // Erst den Dialoginhalt erstellen, dann öffnen und die neuen Reiter mit Klick-Listenern versehen.
    dialog.innerHTML = renderOverlayCard(indexPokemons, id, nameDe, nameEn, scrPic, lastName, nextName, typeName, height, weight);
    // Benennt den Dialog für Screenreader mit dem aktuell geöffneten Pokémon.
    dialog.setAttribute("aria-label", `Details zu ${nameEn} (${nameDe})`);
    dialog.showModal();
    initDialogTabs();
    getStats(indexPokemons);
    showPokemonEvolution(indexPokemons);
}

// Gibt die Namen und Zahlenwerte der Basiswerte in der Konsole aus.
function getStats(indexPokemons) {
    const statsSectionRef = document.getElementById('basicvalues_card_section');
    for (let iStats = 0; iStats < pokemonsBasic[indexPokemons]['stats'].length; iStats++) {
        let statName = pokemonsBasic[indexPokemons]['stats'][iStats]['stat'].name;
        let statPoint = pokemonsBasic[indexPokemons]['stats'][iStats].base_stat;
        statsSectionRef.innerHTML += renderStats(statName, statPoint );
    }
}

// Öffnet das vorherige Pokémon. Vom ersten Eintrag geht es zurück zum letzten Eintrag.
function lastPokemon(indexPokemons) {
    // indexPokemons-- verwendet zuerst den alten Wert und verringert ihn danach um 1.
    // Beim Aufruf unten wird deshalb bereits die vorherige Listenposition übergeben.
    if ((indexPokemons--) > 0) {
        openDialog(indexPokemons--);
    } else {
        openDialog(pokemonsBasic.length - 1);
    }
}

// Öffnet das nächste Pokémon. Nach dem letzten Eintrag geht es wieder zum ersten Eintrag.
function nextPokemon(indexPokemons) {
    // indexPokemons++ verwendet zuerst den alten Wert und erhöht ihn danach um 1.
    if ((indexPokemons++) < (pokemonsBasic.length - 1)) {
        openDialog(indexPokemons++);
    } else {
        openDialog(0);
    }
}

// Holt den englischen Namen des vorherigen Pokémon für die Navigation im Dialog.
// Beim ersten Pokémon wird der Name des letzten geladenen Pokémon verwendet.
function lastPokemonName(indexPokemons) {
    let lastName = "";
    if ((indexPokemons--) > 0) {
        lastName = addedPokemonNameEn(indexPokemons--);
    } else {
        lastName = addedPokemonNameEn(pokemonsBasic.length - 1);
    };
    return lastName;
}

// Holt den englischen Namen des nächsten Pokémon für die Navigation im Dialog.
// Beim letzten Pokémon wird wieder der Name des ersten Pokémon verwendet.
function nextPokemonName(indexPokemons) {
    let nextName = "";
    if ((indexPokemons++) < (pokemonsBasic.length - 1)) {
        nextName = addedPokemonNameEn(indexPokemons++);
    } else {
        nextName = addedPokemonNameEn(0);
    };
    return nextName;
}

// Liest die Entwicklungs-ID aus der URL des ersten geladenen Pokémon.
function getEvuloutionsId(indexPokemons){
    let path = pokemonSpecies[0]['evolution_chain'].url;
    // split teilt die URL an jedem /. Wegen des letzten / steht die ID im vorletzten Teil.
    // at(-2) holt diesen Teil. Number wandelt ihn von Text in eine Zahl um.
    let indexEvulouten = Number(path.split("/").at(-2));
    // Zieht 1 ab, weil Array-Positionen bei 0 beginnen.
    // Achtung: Eine Entwicklungs-ID minus 1 ist nicht automatisch ihre Position in unserer Liste.
    return indexEvulouten -1;
}

// Gibt die passende Entwicklungskette für das ausgewählte Pokémon zurück.
async function getPokemonEvolution(indexPokemons) {
    // Wichtig: indexPokemons verwenden, damit nicht immer das erste Pokémon gewählt wird.
    let path = pokemonSpecies[indexPokemons].evolution_chain.url;

    // Beispiel: Aus ".../evolution-chain/1/" wird die Zahl 1.
    let evolutionId = Number(path.split("/").at(-2));

    // Sucht die Kette anhand ihrer ID in den bereits geladenen Daten.
    let evolution = pokemonsEvuloutions.find(evolution =>
        evolution.id === evolutionId
    );

    // Falls sie noch fehlt, laden wir genau diese Kette nach.
    if (!evolution) {
        let response = await fetch(path);

        if (!response.ok) {
            throw new Error("Entwicklung konnte nicht geladen werden.");
        }

        evolution = await response.json();
        pokemonsEvuloutions.push(evolution);
    }

    return evolution;
}

// Gibt die Bild-URL für einen englischen Pokémon-Namen zurück.
async function getEvolutionPicture(name) {
    let pokemon = pokemonsBasic.find(pokemon => pokemon.name === name);

    if (!pokemon) {
        let response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${name}`
        );

        if (!response.ok) {
            throw new Error("Entwicklungsbild konnte nicht geladen werden.");
        }

        pokemon = await response.json();
    }

    return pokemon.sprites.other.dream_world.front_default
        || pokemon.sprites.front_default
        || "./scr/assets/icons/pokemon1.svg";
}

// Lädt die Entwicklung und zeigt das fertige HTML im Dialog an.
async function showPokemonEvolution(indexPokemons) {
    const evolutionStepsRef = document.getElementById('evolution_steps');
    evolutionStepsRef.textContent = "Entwicklung wird geladen …";

    try {
        let evolution = await getPokemonEvolution(indexPokemons);
        let html = await getEvolutionHtml(evolution.chain);

        // Nur einfügen, wenn dieser Dialoginhalt noch auf der Seite ist.
        if (evolutionStepsRef.isConnected) {
            evolutionStepsRef.innerHTML = html;
        }
    } catch (error) {
        if (evolutionStepsRef.isConnected) {
            evolutionStepsRef.textContent =
                "Entwicklung konnte nicht geladen werden.";
        }

        console.error(error);
    }
}

// Bekommt die erste Stufe und gibt das HTML für die gesamte Kette zurück.
async function getEvolutionHtml(chain) {
    let currentStep = chain;
    let html = "";
    let indexStep = 0;

    while (currentStep) {
        let name = currentStep.species.name;
        let picture = await getEvolutionPicture(name);
        let levelText = getEvolutionLevelText(currentStep, indexStep);

        html += renderEvolutionCard(name, picture, levelText);

        // Wenn keine nächste Stufe vorhanden ist, endet die Schleife.
        currentStep = currentStep.evolves_to[0];
        indexStep++;
    }

    return html;
}

// Bekommt eine Entwicklungsstufe und ihre Position innerhalb der Kette.
function getEvolutionLevelText(step, indexStep) {
    if (indexStep === 0) {
        return "Grundform";
    }

    let level = step.evolution_details[0]?.min_level;

    if (level != null) {
        return `Level ${level}`;
    }

    return "Besondere Bedingung";
}

function renderMiniCard(indexPokemons, name, scrPic, typeName) {
    return `
        <article id="landing_card" class="landing-card bg-card-${typeName}" onclick="openDialog(${indexPokemons})">
        <img class="test" src="${scrPic}" alt="Pokemonbild von ${name}">
        <header class="landing-card-header">
            <H2>${name}</H2>
        </header>
        <section id="type_mini_card${indexPokemons}" class="type-mini-card">
        </section>
    </article>
    `
}

function renderTypes(typeName) {
    return `
    <img class="pic-types" src="./scr/assets/icons/${typeName}.svg" alt="icon des Typ ${typeName}">
    `
}


function renderMiniCard(indexPokemons, nameDe, nameEn, scrPic, typeName) {
    return `
        <article id="landing_card" class="landing-card bg-card-${typeName}" onclick="openDialog(${indexPokemons})">
        <img class="test" src="${scrPic}" alt="Pokemonbild von ${nameDe} / ${nameEn}" onerror="this.onerror=null; this.scr='./scr/assets/icons/pokemon1.svg'">
        <header class="landing-card-header">
            <h2>${nameEn}</h2>
            <h3>${nameDe}</h3>
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


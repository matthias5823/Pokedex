function renderMiniCard(indexPokemons, name, scrPic) {
    return `
        <article id="landing_card" class="landing-card" onclick="${indexPokemons}">
        <img class="test" src="${scrPic}" alt="">
        <header class="landing-card-header">
            <H2>${name}</H2>
        </header>
        <section>


        </section>
    </article>
    `
}
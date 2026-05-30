const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');
const detailPage = document.getElementById('detail-page');

if (pokemonId) {
    loadPokemonDetails(pokemonId);
} else {
    detailPage.innerHTML = '<p style="text-align: center; margin-top: 50px; color: white;">Nenhum Pokémon selecionado.</p>';
}

function loadPokemonDetails(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    
    fetch(url)
        .then(response => response.json())
        .then(pokemon => {
            const types = pokemon.types.map((typeSlot) => typeSlot.type.name);
            const primaryType = types[0];
            const name = pokemon.name;
            const number = pokemon.id.toString().padStart(3, '0');
            const image = pokemon.sprites.other.dream_world.front_default || pokemon.sprites.front_default;
            
            const heightCm = pokemon.height * 10;
            const heightInchesTotal = heightCm * 0.393701;
            const heightFeet = Math.floor(heightInchesTotal / 12);
            const heightInches = (heightInchesTotal % 12).toFixed(1);
            const heightStr = `${heightFeet}'${heightInches}" (${heightCm / 100} m)`;

            const weightKg = pokemon.weight / 10;
            const weightLbs = (weightKg * 2.20462).toFixed(1);
            const weightStr = `${weightLbs} lbs (${weightKg} kg)`;

            const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');

            detailPage.className = `detail-page ${primaryType}`;
            
            detailPage.innerHTML = `
                <div class="pokemon-header">
                    <div class="top-bar">
                        <a href="index.html" class="back-button">&larr;</a>
                        <span class="heart-icon">&hearts;</span>
                    </div>
                    <div class="header-info">
                        <div class="name-row">
                            <h1 class="name">${name}</h1>
                            <span class="id">#${number}</span>
                        </div>
                        <div class="types-row">
                            <ul class="types">
                                ${types.map(t => `<li class="${t}">${t}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="image-container">
                        <img src="${image}" alt="${name}">
                    </div>
                </div>
                <div class="pokemon-body">
                    <div class="tabs">
                        <span class="tab active">About</span>
                        <span class="tab">Base Stats</span>
                        <span class="tab">Evolution</span>
                        <span class="tab">Moves</span>
                    </div>
                    <div class="tab-content">
                        <div class="info-row" id="species-row" style="display: none;">
                            <span class="label">Species</span>
                            <span class="value" id="species-value"></span>
                        </div>
                        <div class="info-row">
                            <span class="label">Height</span>
                            <span class="value">${heightStr}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Weight</span>
                            <span class="value">${weightStr}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Abilities</span>
                            <span class="value">${abilities}</span>
                        </div>
                    </div>
                </div>
            `;

            fetch(pokemon.species.url)
                .then(res => res.json())
                .then(speciesData => {
                    const genusEntry = speciesData.genera.find(g => g.language.name === 'en');
                    if(genusEntry) {
                        const genus = genusEntry.genus.replace(' Pokémon', '');
                        document.getElementById('species-value').innerText = genus;
                        document.getElementById('species-row').style.display = 'flex';
                    }
                });
        });
}

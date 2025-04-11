const API_URL = "https://pokeapi.co/api/v2";

export const getRegions = async () => {
  try {
    const response = await fetch(`${API_URL}/region`);
    const data = await response.json();
    return data.results; // Array de regiones
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};
export const getPokemonsByRegion = async (regionName) => {
    try {
      const response = await fetch(`${API_URL}/region/${regionName}`);
      const data = await response.json();
  
      
      const pokedexUrl = data.pokedexes[0].url;
      const pokedexRes = await fetch(pokedexUrl);
      const pokedexData = await pokedexRes.json();
  
      return pokedexData.pokemon_entries; // Array de pokemones
    } catch (error) {
      console.error("Error fetching pokemons:", error);
      return [];
    }
  };

  export const getPokemonDetails = async (name) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await res.json();
  
      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();
  
      // Buscar descripción en español
      const description = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "es"
      )?.flavor_text || "Descripción no disponible.";
  
      return {
        id: data.id,
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map((type) => type.type.name),
        description,
      };
    } catch (error) {
      console.error("Error fetching pokemon details:", error);
      return null;
    }
  };
  
  
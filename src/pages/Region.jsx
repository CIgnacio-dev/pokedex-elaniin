import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPokemonsByRegion } from "../services/pokeapi";
import { getTeam, saveTeam } from "../utils/teams";

function Region() {
  const { regionName } = useParams();
  const [pokemons, setPokemons] = useState([]);
  const [addedPokemonIds, setAddedPokemonIds] = useState([]);
  const [warning, setWarning] = useState("");

  const getPokemonId = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 2];
  };

  const handleAddToTeam = (pokemon) => {
    const team = getTeam();
  
    if (team.length >= 6) {
      setWarning("⚠️ No puedes agregar más de 6 Pokémon.");
      return;
    }
  
    if (team.length > 0 && team[0].region !== regionName) {
      setWarning(
        `⚠️ Solo puedes agregar Pokémon de una sola generación (${team[0].region.toUpperCase()}).`
      );
      return;
    }
  
    const newPokemon = {
      id: getPokemonId(pokemon.pokemon_species.url),
      name: pokemon.pokemon_species.name,
      region: regionName,
    };
  
    saveTeam([...team, newPokemon]);
    setAddedPokemonIds([...addedPokemonIds, newPokemon.id]);
    setWarning(""); 
  };
  
  

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPokemonsByRegion(regionName);
      setPokemons(data);
      setAddedPokemonIds(getTeam().map((poke) => poke.id)); 
    };

    fetchData();
  }, [regionName]);

  return (
    <div className="min-h-screen p-4">
      {warning && (
  <div className="bg-red-800 text-red-300 text-sm px-4 py-2 rounded mb-4 flex items-center gap-2">
    <span>⚠️</span>
    <p>{warning}</p>
  </div>
)}
      <h2 className="text-3xl font-bold text-yellow-400 mb-4">
        Región: {regionName.toUpperCase()}
      </h2>

      

      {pokemons.length === 0 ? (
        <p className="text-white">Cargando pokemones...</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pokemons.map((poke, idx) => (
            <li
              key={idx}
              className="bg-gray-800 p-2 rounded text-white text-center flex flex-col items-center"
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${getPokemonId(
                  poke.pokemon_species.url
                )}.png`}
                alt={poke.pokemon_species.name}
                className="w-24 h-24 object-contain"
              />

              {addedPokemonIds.includes(getPokemonId(poke.pokemon_species.url)) ? (
                <p className="text-green-400 text-sm mt-1">Agregado</p>
              ) : (
                <button
                  onClick={() => handleAddToTeam(poke)}
                  className="bg-yellow-500 text-gray-900 px-2 py-1 rounded text-sm mt-2 hover:bg-yellow-400"
                >
                  Agregar al equipo
                </button>
              )}

              <p className="mt-1">{poke.pokemon_species.name.toUpperCase()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Region;

import { useEffect, useState, useContext } from "react";
import { getTeam, saveTeam, clearTeam } from "../utils/teams";
import { saveTeamToFirebase } from "../services/firebase";
import { getPokemonDetails } from "../services/pokeapi";
import { AuthContext } from "../context/AuthContext";

const typeBgColors = {
    normal: "from-gray-700 to-gray-800",
    fire: "from-red-700 to-red-800",
    water: "from-blue-700 to-blue-800",
    electric: "from-yellow-500 to-yellow-600 text-gray-900",
    grass: "from-green-700 to-green-800",
    ice: "from-blue-200 to-blue-300 text-gray-900",
    fighting: "from-red-800 to-red-900",
    poison: "from-purple-700 to-purple-800",
    ground: "from-yellow-800 to-yellow-900",
    flying: "from-indigo-700 to-indigo-800",
    psychic: "from-pink-600 to-pink-700",
    bug: "from-lime-700 to-lime-800",
    rock: "from-yellow-900 to-yellow-950",
    ghost: "from-indigo-800 to-indigo-900",
    dragon: "from-purple-900 to-purple-950",
    dark: "from-gray-800 to-gray-900",
    steel: "from-gray-500 to-gray-600",
    fairy: "from-pink-300 to-pink-400 text-gray-900",
  };
  
const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400 text-gray-900",
  grass: "bg-green-500",
  ice: "bg-blue-200 text-gray-900",
  fighting: "bg-red-700",
  poison: "bg-purple-600",
  ground: "bg-yellow-700",
  flying: "bg-indigo-400",
  psychic: "bg-pink-500",
  bug: "bg-lime-600",
  rock: "bg-yellow-800",
  ghost: "bg-indigo-700",
  dragon: "bg-purple-800",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300 text-gray-900",
};

function Team() {
  const [team, setTeam] = useState([]);
  const [saved, setSaved] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchTeamWithDetails = async () => {
      const localTeam = getTeam();

      const teamWithDetails = await Promise.all(
        localTeam.map(async (poke) => {
          const details = await getPokemonDetails(poke.name);
          return {
            ...poke,
            details,
          };
        })
      );

      setTeam(teamWithDetails);
    };

    fetchTeamWithDetails();
  }, []);

  const handleRemove = (id) => {
    const newTeam = team.filter((poke) => poke.id !== id);
    saveTeam(newTeam);
    setTeam(newTeam);
  };

  const handleClear = () => {
    clearTeam();
    setTeam([]);
  };

  const handleSaveTeam = async () => {
    if (team.length < 3) {
      alert("Debes tener al menos 3 pokémon para guardar el equipo");
      return;
    }

    const region = team[0].region;

    try {
      await saveTeamToFirebase(team, currentUser.displayName, region);
      alert("Equipo guardado exitosamente!");
      clearTeam();
      setSaved(true);
      setTeam([]);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar el equipo");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-center text-xl">
          Debes iniciar sesión para ver tu equipo.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {saved && (
        <p className="text-green-400 text-center mb-4">
          ¡Equipo guardado correctamente!
        </p>
      )}

      <h2 className="text-3xl font-bold text-yellow-400 mb-4">
        Mi equipo ({team.length}/6)
      </h2>

      {currentUser && team.length >= 3 && (
        <button
          onClick={handleSaveTeam}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4 hover:bg-green-500"
        >
          Guardar equipo en Firebase
        </button>
      )}

      {team.length === 0 ? (
        <p className="text-white">Tu equipo está vacío.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {team.map((poke) => (
            <li
            key={poke.id}
            className={`bg-gradient-to-b ${typeBgColors[poke.details?.types[0]] || "from-gray-800 to-gray-900"} 
                        border border-gray-600 p-4 rounded-xl text-white text-center shadow-lg flex flex-col items-center gap-3 
                        hover:brightness-110 transition duration-300`}
          >
          
              <img
                src={poke.details?.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`}
                alt={poke.name}
                className="w-28 h-28 object-contain"
              />
              <h3 className="uppercase text-xl font-bold">{poke.name}</h3>

              <div className="flex flex-wrap justify-center gap-1">
                {poke.details.types.map((type, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${typeColors[type] || "bg-gray-700"}`}
                  >
                    {type}
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-400">{poke.details.description}</p>

              <button
                onClick={() => handleRemove(poke.id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm mt-2 hover:bg-red-400"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}

      {team.length > 0 && (
        <button
          onClick={handleClear}
          className="bg-red-700 text-white px-4 py-2 rounded mt-8 hover:bg-red-600"
        >
          Eliminar todo el equipo
        </button>
      )}
    </div>
  );
}

export default Team;

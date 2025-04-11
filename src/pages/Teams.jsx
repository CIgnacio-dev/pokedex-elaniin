import { useEffect, useState, useContext } from "react";
import { getTeamsFromFirebase } from "../services/firebase";
import { getPokemonDetails } from "../services/pokeapi";
import { AuthContext } from "../context/AuthContext";
import { deleteTeamFromFirebase } from "../services/firebase";

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

function Teams() {
  const [teams, setTeams] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchTeams = async () => {
      const firebaseTeams = await getTeamsFromFirebase();

      const teamsWithDetails = await Promise.all(
        firebaseTeams.map(async (team) => {
          const sourceTeam = team.pokemons || team.team || [];

          const pokemonsWithDetails = sourceTeam.length > 0
            ? await Promise.all(
                sourceTeam.map(async (poke) => {
                  const details = await getPokemonDetails(poke.name);
                  return {
                    ...poke,
                    details,
                  };
                })
              )
            : [];

          return {
            ...team,
            team: pokemonsWithDetails,
          };
        })
      );

      setTeams(teamsWithDetails);
    };

    fetchTeams();
  }, []);
  const handleDeleteTeam = async (id) => {
    const confirm = window.confirm("¿Estás seguro de eliminar este equipo?");
  
    if (!confirm) return;
  
    await deleteTeamFromFirebase(id);
  

    setTeams(teams.filter(team => team.id !== id));
  };
  
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-center text-xl">
          Debes iniciar sesión para ver los equipos guardados.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
        Equipos Guardados
      </h2>

      {teams.length === 0 ? (
        <p className="text-white text-center">No hay equipos guardados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-4 shadow-lg flex flex-col gap-4"
            >
              <h3 className="text-xl text-yellow-400 font-bold text-center">
                Región: {team.region ? team.region.toUpperCase() : "Sin región"}
              </h3>

              <p className="text-sm text-center text-gray-300 mb-4">
                Creado por: {team.user}
              </p>

              {team.team && team.team.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">
                  {team.team.map((poke) => (
                    <div
                      key={poke.id}
                      className={`bg-gradient-to-b ${typeColors[poke.details?.types[0]] || "from-gray-800 to-gray-900"} 
                      border border-gray-600 p-2 rounded-lg flex flex-col items-center gap-1 hover:brightness-110 transition duration-300`}
                    >
                      <img
                        src={poke.details?.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`}
                        alt={poke.name}
                        className="w-20 h-20 object-contain"
                      />
                      <p className="text-sm capitalize text-white">{poke.name}</p>

                      <div className="flex flex-wrap gap-1 justify-center">
                        {poke.details?.types?.map((type, idx) => (
                          <span
                            key={idx}
                            className={`text-xs px-2 py-1 rounded ${typeColors[type] || "bg-gray-700"}`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                 <div className="w-full flex justify-center mt-4">
  <button
    onClick={() => handleDeleteTeam(team.id)}
    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-500 transition duration-300"
  >
    Eliminar equipo
  </button>
</div>






                </div>
              ) : (
                <p className="text-gray-400 text-center text-sm">
                  No hay pokémon en este equipo.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Teams;

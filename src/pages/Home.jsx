import { useEffect, useState, useContext } from "react";
import { getRegions } from "../services/pokeapi";
import { Link } from "react-router-dom";
import regionsImages from "../utils/regionImages";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const [regions, setRegions] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchRegions = async () => {
      const data = await getRegions();
      setRegions(data);
    };

    fetchRegions();
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white text-center text-xl">
          Debes iniciar sesión para ver las regiones disponibles.
        </p>
      </div>
    );
  }

  const filteredRegions = regions.filter((region) => regionsImages[region.name]);

  return (
    <div className="min-h-screen px-4 py-8 flex justify-center">
  <div className="w-full max-w-7xl">
    <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">
      Regiones Pokémon
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-14">
      {filteredRegions.map((region, index) => (
        <Link
          key={index}
          to={`/region/${region.name}`}
          className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
        >
          <div className="overflow-hidden p-5 flex justify-center items-center">
            <img
              src={regionsImages[region.name].img}
              alt={regionsImages[region.name].game}
              title={regionsImages[region.name].game}
              className="h-24 object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="bg-gray-900 py-2 text-center">
            <span className="text-white font-bold text-lg tracking-wider">
              {region.name.toUpperCase()}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
</div>





  );
}

export default Home;

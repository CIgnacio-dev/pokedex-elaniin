const TEAM_KEY = "pokemon_team";

export const getTeam = () => {
  return JSON.parse(localStorage.getItem(TEAM_KEY)) || [];
};

export const saveTeam = (team) => {
  localStorage.setItem(TEAM_KEY, JSON.stringify(team));
};

export const clearTeam = () => {
  localStorage.removeItem(TEAM_KEY);
};

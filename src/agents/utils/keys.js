// src/agents/utils/keys.js
// Normaliza strings y arma las claves de guardado por paso/hogar/periodo
export const slug = (s = "") =>
  s.toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\W+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

export const pasoKey = (n, { hogar, mes, periodo }) => {
  // En la app se usa hogar+mes para la key. Respetamos ese formato (mes o periodo)
  const per = Array.isArray(periodo) ? periodo.join("-") : (mes || periodo || "");
  return `paso${n}_${slug(hogar)}_${slug(per)}`;
};

/**
 * Nome de consultório pode vir como "Clínica;Sala 3" — o card mostra só a parte
 * depois do ";". Mesmo comportamento do util homônimo do marketplace, aqui no
 * submódulo para que os dois apps usem a mesma regra.
 */
export const splitRoomName = (roomName?: string | null): string => {
  if (!roomName) {
    return "";
  }

  const parts = roomName.split(";");

  return parts.length > 1 ? parts[1] : parts[0];
};

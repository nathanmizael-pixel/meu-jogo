// Estilo do arquivo: Gótico de Pergaminho Vivo — cada ameaça carrega uma escola de violência que pode ser estudada e contrariada.
import type { Enemy } from "@/lib/gameData";

export type EnemyDoctrineId = "cultist" | "undead" | "beast" | "mage" | "knight" | "raider";

export type EnemyDoctrine = {
  id: EnemyDoctrineId;
  marker: string;
  title: string;
  fieldSignal: string;
  behavior: string;
  counterplay: string;
  bestiaryReward: string;
};

export const enemyDoctrines: Record<EnemyDoctrineId, EnemyDoctrine> = {
  cultist: {
    id: "cultist",
    marker: "CORO",
    title: "Coro de Sangue",
    fieldSignal: "Fortalecem o rito enquanto outro cultista permanece de pé.",
    behavior: "Cultistas repartem a própria dor, reforçam o sacerdote e convertem a superioridade numérica em pressão ritual.",
    counterplay: "Interrompa o sacerdote ou derrube um membro do coro antes de gastar mana em alvos protegidos.",
    bestiaryReward: "Coro identificado: ataques de cultistas reunidos causam mais pressão.",
  },
  undead: {
    id: "undead",
    marker: "MURALHA",
    title: "Muralha dos Retornados",
    fieldSignal: "Ossos se fecham em parede quando mais de um morto permanece.",
    behavior: "Mortos-vivos ocupam a linha de frente, amortecem golpes em conjunto e voltam a se erguer onde a região permite.",
    counterplay: "Quebre a formação com dano de postura, elimine a linha de frente e use fogo ou sagrado para impedir retomadas.",
    bestiaryReward: "Muralha identificada: a formação reduz dano recebido por mortos-vivos aliados.",
  },
  beast: {
    id: "beast",
    marker: "CAÇADA",
    title: "Caçada da Fissura",
    fieldSignal: "Bestas perseguem a abertura e amplificam o ataque sobre o alvo marcado.",
    behavior: "Bestas não negociam terreno: cercam, perseguem e concentram a mordida sobre a fraqueza exposta da formação.",
    counterplay: "Use bloqueio ou esquiva após marcar uma besta; congelamento quebra a perseguição e cria uma brecha segura.",
    bestiaryReward: "Caçada identificada: a besta marcada concentra dano acima do restante do bando.",
  },
  mage: {
    id: "mage",
    marker: "CÍRCULO",
    title: "Círculo de Contenção",
    fieldSignal: "Conjuradores mantêm distância e procuram controlar o próximo turno.",
    behavior: "Magos evitam a lâmina direta, selam o campo com estados e aproveitam cada instante em que sua postura permanece intacta.",
    counterplay: "Ataque a postura de canalização, use dano físico após congelamento e guarde defesa para estados de controle.",
    bestiaryReward: "Círculo identificado: conjuradores tornam estados de controle mais prováveis.",
  },
  knight: {
    id: "knight",
    marker: "BULWARKE",
    title: "Bulwark Juramentado",
    fieldSignal: "Um cavaleiro cobre aliados mais frágeis e devolve pressão ao primeiro erro.",
    behavior: "Cavaleiros bloqueiam o acesso aos aliados, sustentam uma postura defensiva e fazem de cada golpe mal calculado uma abertura.",
    counterplay: "Quebre a postura do cavaleiro primeiro; enquanto ele estiver de pé, os aliados recebem cobertura parcial.",
    bestiaryReward: "Bulwark identificado: cavaleiros protegem aliados contra dano direto.",
  },
  raider: {
    id: "raider",
    marker: "PRESSÃO",
    title: "Pressão de Estrada",
    fieldSignal: "Saqueadores alternam avanços rápidos para testar a defesa de Veyra.",
    behavior: "Ameaças dispersas pressionam com golpes oportunistas, buscando uma resposta apressada em vez de uma troca longa.",
    counterplay: "Mantenha o foco no alvo marcado e explore fraquezas antes que a pressão se acumule.",
    bestiaryReward: "Pressão identificada: inimigos dispersos dividem atenção, mas caem rápido sob foco coordenado.",
  },
};

export function enemyDoctrineFor(enemy: Pick<Enemy, "kind" | "name" | "boss">): EnemyDoctrine {
  const signature = `${enemy.kind} ${enemy.name}`.toLocaleLowerCase("pt-BR");
  if (/cultista|sacerdote|hierofante|acólito/.test(signature)) return enemyDoctrines.cultist;
  if (/cavaleiro|paladino|guarda|sentinela/.test(signature)) return enemyDoctrines.knight;
  if (/esqueleto|morto|ossuário|guardião|cadáver/.test(signature)) return enemyDoctrines.undead;
  if (/lobo|fera|besta|cão|aranha|matilha/.test(signature)) return enemyDoctrines.beast;
  if (/mago|bruxa|astrônomo|espectro|oráculo|conjur/.test(signature)) return enemyDoctrines.mage;
  return enemyDoctrines.raider;
}

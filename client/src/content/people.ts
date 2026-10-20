/**
 * Autores e revisores dos artigos.
 * Troque os perfis de exemplo pelos dados confirmados pela própria pessoa
 * (nome, CRM-PE, RQE e bio). Não inventar registro.
 */

export type Person = {
  id: string;
  name: string;
  role: string;
  /** CRM-PE, RQE ou texto honesto de que o registro ainda não foi informado. */
  credential: string;
  bio: string;
};

export const people: Record<string, Person> = {
  "placeholder-autor": {
    id: "placeholder-autor",
    name: "Nome do autor (preencher)",
    role: "Autor — perfil de exemplo",
    credential: "CRM-PE e RQE ainda não confirmados. Este perfil não é uma pessoa real.",
    bio: "Substitua este perfil quando a equipe confirmar quem assina o texto.",
  },
  "placeholder-revisor": {
    id: "placeholder-revisor",
    name: "Neurologista revisor (preencher)",
    role: "Revisão médica — perfil de exemplo",
    credential: "CRM-PE e RQE a confirmar pela equipe. Este perfil não é uma pessoa real.",
    bio: "Substitua este perfil pelo neurologista da Métis que revisar o artigo, com nome, CRM-PE e RQE confirmados.",
  },
};

export function getPerson(id: string): Person | undefined {
  return people[id];
}

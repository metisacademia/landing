import { NAP_NAME, SITE_URL } from "@/lib/site";

/**
 * Autores e revisores dos artigos.
 * Equipe Métis assina como organização, sem CRM.
 * Um revisor pessoa só entra com nome, CRM-PE e RQE confirmados. Não inventar registro.
 */

export type AuthorKind = "person" | "organization";

export type Person = {
  id: string;
  name: string;
  kind: AuthorKind;
  role: string;
  /** CRM-PE e RQE, só para pessoa. Organização fica sem registro. */
  credential: string;
  bio: string;
  /** Nome no JSON-LD quando o nome visível é outro. */
  schemaName?: string;
  url?: string;
};

export const people: Record<string, Person> = {
  "equipe-metis": {
    id: "equipe-metis",
    name: "Equipe Métis",
    kind: "organization",
    role: "Equipe da Métis Academia da Mente",
    credential: "",
    bio: "Textos assinados pela equipe. O neurologista revisor entra quando nome, CRM-PE e RQE estiverem confirmados.",
    schemaName: NAP_NAME,
    url: SITE_URL,
  },
  "placeholder-autor": {
    id: "placeholder-autor",
    name: "Nome do autor (preencher)",
    kind: "person",
    role: "Autor — perfil de exemplo",
    credential: "CRM-PE e RQE ainda não confirmados. Este perfil não é uma pessoa real.",
    bio: "Substitua este perfil quando a equipe confirmar quem assina o texto.",
  },
  "placeholder-revisor": {
    id: "placeholder-revisor",
    name: "Neurologista revisor (preencher)",
    kind: "person",
    role: "Revisão médica — perfil de exemplo",
    credential: "CRM-PE e RQE a confirmar pela equipe. Este perfil não é uma pessoa real.",
    bio: "Substitua este perfil pelo neurologista da Métis que revisar o artigo, com nome, CRM-PE e RQE confirmados.",
  },
};

export function getPerson(id: string): Person | undefined {
  return people[id];
}

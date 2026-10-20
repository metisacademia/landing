export type YamlValue = string | number | boolean | YamlValue[] | { [key: string]: YamlValue };

function parseScalar(raw: string): string | number | boolean {
  const value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
    (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
  ) {
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+$/.test(value)) return Number(value);
  return value;
}

/**
 * Subconjunto de YAML usado no frontmatter dos artigos:
 * escalares numa linha, listas de escalares e listas de objetos com campos numa linha.
 */
export function parseYamlSubset(text: string): Record<string, YamlValue> {
  const lines = text.split(/\r?\n/);
  const root: Record<string, YamlValue> = {};
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (!line.trim() || line.trim().startsWith("#")) {
      index += 1;
      continue;
    }
    if (line.startsWith(" ") || line.startsWith("\t")) {
      throw new Error(`Linha fora de lugar no frontmatter: ${line}`);
    }
    const keyMatch = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!keyMatch?.[1]) {
      throw new Error(`Linha de frontmatter inválida: ${line}`);
    }
    const key = keyMatch[1];
    const rest = keyMatch[2] ?? "";
    if (rest !== "") {
      root[key] = parseScalar(rest);
      index += 1;
      continue;
    }

    const list: YamlValue[] = [];
    index += 1;
    while (index < lines.length) {
      const next = lines[index] ?? "";
      if (!next.trim() || next.trim().startsWith("#")) {
        index += 1;
        continue;
      }
      if (!next.startsWith("  ")) break;
      const item = /^  - (.*)$/.exec(next);
      if (!item) {
        throw new Error(`Item de lista inválido: ${next}`);
      }
      const inline = item[1] ?? "";
      const objKey = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(inline);
      if (!objKey?.[1]) {
        list.push(parseScalar(inline));
        index += 1;
        continue;
      }
      const obj: Record<string, YamlValue> = {
        [objKey[1]]: parseScalar(objKey[2] ?? ""),
      };
      index += 1;
      while (index < lines.length && /^    [A-Za-z]/.test(lines[index] ?? "")) {
        const field = /^    ([A-Za-z][\w-]*):\s*(.*)$/.exec(lines[index] ?? "");
        if (!field?.[1]) {
          throw new Error(`Campo inválido: ${lines[index]}`);
        }
        obj[field[1]] = parseScalar(field[2] ?? "");
        index += 1;
      }
      list.push(obj);
    }
    root[key] = list;
  }

  return root;
}

export function splitFrontmatter(raw: string): { data: Record<string, YamlValue>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match?.[1]) {
    throw new Error("Artigo sem frontmatter entre ---");
  }
  return {
    data: parseYamlSubset(match[1]),
    body: raw.slice(match[0].length),
  };
}

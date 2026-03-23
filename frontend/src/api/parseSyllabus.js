function cleanText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeSyllabus(text) {
  return text
    .replace(/\r/g, "")
    .replace(/[\u2013\u2014\u2212]/g, "-")
    .replace(/[\u2022\u25cf]/g, "\n");
}

function chunkFragments(fragments) {
  const chunks = [];
  let current = [];

  fragments.forEach((fragment) => {
    const nextChunk = [...current, fragment].join(", ");

    if (current.length > 0 && nextChunk.length > 100) {
      chunks.push(current.join(", "));
      current = [fragment];
      return;
    }

    current.push(fragment);

    if (current.length >= 2) {
      chunks.push(current.join(", "));
      current = [];
    }
  });

  if (current.length > 0) {
    chunks.push(current.join(", "));
  }

  return chunks;
}

function splitTopicText(text) {
  const lines = text
    .split(/\n+/)
    .map((line) => cleanText(line))
    .filter(Boolean);

  const topics = [];

  lines.forEach((line) => {
    const fragments = line
      .split(/\s*[;,]\s*/)
      .map((fragment) => cleanText(fragment))
      .filter(Boolean);

    if (fragments.length <= 1) {
      topics.push(line);
      return;
    }

    topics.push(...chunkFragments(fragments));
  });

  return topics;
}

function extractUnitTitle(unitLabel, body) {
  const firstLine = body.split("\n")[0]?.trim() || "";
  const colonIndex = firstLine.indexOf(":");

  if (colonIndex <= 0) {
    return { unit: unitLabel, remainingBody: body };
  }

  const title = cleanText(firstLine.slice(0, colonIndex));

  if (!title || title.length > 80) {
    return { unit: unitLabel, remainingBody: body };
  }

  const restOfFirstLine = cleanText(firstLine.slice(colonIndex + 1));
  const remainingLines = body.split("\n").slice(1).join("\n");
  const remainingBody = [restOfFirstLine, remainingLines].filter(Boolean).join("\n");

  return {
    unit: `${unitLabel}: ${title}`,
    remainingBody,
  };
}

// Parses syllabus text into units and topic chunks.
export function parseSyllabus(syllabusText) {
  const normalized = normalizeSyllabus(syllabusText);
  const unitRegex = /UNIT\s*(?:-\s*)?[A-Z0-9IVX]+/gi;
  const matches = [...normalized.matchAll(unitRegex)];

  if (matches.length === 0) {
    const fallbackTopics = splitTopicText(normalized);
    return fallbackTopics.length > 0
      ? [{ unit: "General", topics: fallbackTopics }]
      : [];
  }

  return matches.map((match, index) => {
    const start = match.index;
    const end = index + 1 < matches.length ? matches[index + 1].index : normalized.length;
    const section = normalized.slice(start, end).trim();
    const rawUnit = cleanText(match[0].replace(/\s*-\s*/g, " - "));
    const rawBody = cleanText(section.slice(match[0].length).replace(/^[:.\-\s]+/, ""));
    const { unit, remainingBody } = extractUnitTitle(rawUnit, rawBody);
    const topics = splitTopicText(remainingBody);

    return {
      unit,
      topics: topics.length > 0 ? topics : [remainingBody || unit],
    };
  });
}

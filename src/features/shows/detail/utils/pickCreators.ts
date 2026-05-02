import type { CrewMember } from "@generated";

const priority = ["Creator", "Executive Producer", "Producer"];

export function pickCreators(crew: CrewMember[], limit = 4): CrewMember[] {
	const seen = new Set<number>();
	const ranked: CrewMember[] = [];
	for (const role of priority) {
		for (const member of crew) {
			if (member.type === role && !seen.has(member.person.id)) {
				seen.add(member.person.id);
				ranked.push(member);
				if (ranked.length >= limit) return ranked;
			}
		}
	}
	return ranked;
}

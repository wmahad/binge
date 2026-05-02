import type { CrewMember } from "@generated";
import { describe, expect, it } from "vitest";
import { pickCreators } from "../pickCreators";

function crewMember(
	id: number,
	type: string,
	name = `Person ${id}`,
): CrewMember {
	return {
		type,
		person: { id, name, image: undefined },
	} as CrewMember;
}

describe("pickCreators", () => {
	it("prefers Creator, then Executive Producer, then Producer", () => {
		const crew = [
			crewMember(1, "Producer"),
			crewMember(2, "Creator"),
			crewMember(3, "Executive Producer"),
		];
		expect(pickCreators(crew).map((member) => member.person.id)).toEqual([
			2, 3, 1,
		]);
	});

	it("dedupes by person id within priority passes", () => {
		const crew = [
			crewMember(10, "Creator"),
			crewMember(10, "Writer"),
			crewMember(11, "Creator"),
		];
		const ids = pickCreators(crew).map((member) => member.person.id);
		expect(ids).toEqual([10, 11]);
	});

	it("respects limit", () => {
		const crew = [
			crewMember(1, "Creator"),
			crewMember(2, "Creator"),
			crewMember(3, "Creator"),
			crewMember(4, "Creator"),
		];
		expect(pickCreators(crew, 2)).toHaveLength(2);
	});
});

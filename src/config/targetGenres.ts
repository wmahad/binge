export const TARGET_GENRES = [
	"Drama",
	"Comedy",
	"Science-Fiction",
	"Romance",
	"Thriller",
	"Crime",
	"Animation",
	"Documentary",
	"Horror",
	"Action",
] as const;

export type TargetGenre = (typeof TARGET_GENRES)[number];

export const TARGET_GENRES = [
	"Drama",
	"Comedy",
	"Action",
	"Crime",
	"Science-Fiction",
	"Thriller",
	"Romance",
	"Fantasy",
	"Horror",
	"Mystery",
	"Family",
	"Adventure",
	"Sports",
] as const;

export type TargetGenre = (typeof TARGET_GENRES)[number];

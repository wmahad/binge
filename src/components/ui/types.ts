export type UiElementTag = keyof HTMLElementTagNameMap;

export type AppHeadingVariant =
	| "hero"
	| "heroFeature"
	| "section"
	| "subsection"
	| "genreHero"
	| "searchHero"
	| "rowTitle"
	| "cardTitle"
	| "posterTitle"
	| "emptyStateTitle";

export type AppTextVariant =
	| "body"
	| "muted"
	| "mutedResponsive"
	| "mutedXs"
	| "muted-inline"
	| "caption"
	| "overline"
	| "eyebrow"
	| "heroLead"
	| "destructive"
	| "destructiveMuted"
	| "heroFeatureSummary";

export type AppKickerVariant = "sectionMeta" | "eyebrowPrimary" | "fieldLabel";

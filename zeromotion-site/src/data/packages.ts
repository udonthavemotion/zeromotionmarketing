export type PackageTier = {
	id: string;
	title: string;
	priceCents: number; // per month
	blurb: string;
	includes: string[];
};

export const packages: PackageTier[] = [
	{
		id: "starter",
		title: "Starter",
		priceCents: 35000,
		blurb: "Site care, GBP, monthly report.",
		includes: [
			"1-page site + hosting",
			"Google Business Profile", 
			"Monthly performance report",
			"Basic uptime & security",
			"Contact form + email routing",
			"Local tracking numbers (optional)",
		],
	},
	{
		id: "growth",
		title: "Growth",
		priceCents: 50000,
		blurb: "+ 2 campaigns, review requests, basic SEO.",
		includes: [
			"Everything in Starter",
			"2 lead-gen campaigns",
			"Review request automations",
			"Basic on-page SEO",
			"GBP posts + photo updates",
			"Quarterly check-in",
		],
	},
	{
		id: "pro",
		title: "Pro",
		priceCents: 80000,
		blurb: "+ GHL pipeline, SMS follow-ups, quarterly strategy.",
		includes: [
			"Everything in Growth",
			"GHL pipeline setup",
			"SMS follow-ups",
			"Quarterly strategy call",
			"3 campaigns active",
			"CRM + call tracking",
		],
	},
]; 
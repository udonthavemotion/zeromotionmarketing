import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

export async function sendLeadEmail(payload: {
	name: string;
	email: string;
	business: string;
	niche: "Contractor" | "Real Estate" | string;
	message?: string;
}) {
	if (!resend) return { skipped: true } as const;
	const subject = `New Lead — ${payload.niche}: ${payload.name} (${payload.business})`;
	const to = process.env.LEADS_TO || "zeromotionmarketing@gmail.com";
	await resend.emails.send({ to, from: process.env.LEADS_FROM || "leads@zeromotion.ai", subject, text: JSON.stringify(payload, null, 2) });
	return { sent: true } as const;
} 
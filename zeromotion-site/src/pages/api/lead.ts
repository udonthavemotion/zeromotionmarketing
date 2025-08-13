import type { APIRoute } from 'astro';
import { sendLeadEmail } from '../../server/email';
import { writeFile, mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

export const POST: APIRoute = async ({ request }) => {
	try {
		const data = await request.json();
		const payload = {
			name: String(data.name || '').trim(),
			email: String(data.email || '').trim(),
			business: String(data.business || 'N/A').trim() || 'N/A',
			niche: String(data.niche || 'General').trim() || 'General',
			message: String(data.message || '').trim(),
		};
		if (!payload.name || !payload.email) {
			return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
		}
		const res = await sendLeadEmail(payload);
		if (process.env.NODE_ENV !== 'production') {
			const dir = new URL('../../data/leads/', import.meta.url);
			await mkdir(dir, { recursive: true });
			const file = new URL(`${Date.now()}-${randomUUID()}.json`, dir);
			await writeFile(file, JSON.stringify({ ...payload, createdAt: new Date().toISOString(), email: res }, null, 2));
		}
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	} catch (e) {
		return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
	}
}; 
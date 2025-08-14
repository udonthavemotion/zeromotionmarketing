export async function run(): Promise<void> {
	// Heavy logic intentionally lazy-loaded to keep initial bundle small
	const prefersReduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
	if (prefersReduced) return;

	// Simulate a heavy workflow (e.g., dynamic import of analytics or 3D)
	await new Promise((r) => setTimeout(r, 150));
	console.info('[HeroInteractive] Heavy logic executed.');
}



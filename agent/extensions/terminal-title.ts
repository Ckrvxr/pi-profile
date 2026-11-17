import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI): void {
	let pending: ReturnType<typeof setTimeout> | null = null;

	// pi core rewrites the title (`π - {name} - {cwd}`) right after the extension
	// handlers on startup (rebindCurrentSession → updateTerminalTitle), so a
	// synchronous write loses. Defer one tick to land last. The ui context object
	// is captured up front: reading ctx.ui after a session replacement throws.
	function setTitleSoon(ctx: ExtensionContext, title: string | undefined): void {
		if (pending) clearTimeout(pending);
		if (!title) return;

		const ui = ctx.ui;
		pending = setTimeout(() => {
			pending = null;
			ui.setTitle(title);
		}, 0);
	}

	pi.on("session_start", (_event, ctx) => setTitleSoon(ctx, pi.getSessionName()));
	pi.on("session_info_changed", (event, ctx) => setTitleSoon(ctx, event.name));
}

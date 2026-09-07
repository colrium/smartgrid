"use client";

import { useEffect } from "react";

/**
 * Global media-protection layer.
 *
 * Deters casual image downloads site-wide by disabling the browser affordances
 * that make saving an image one click away:
 *  - right-click context menu on images ("Save image as…", "Copy image",
 *    "Open image in new tab");
 *  - drag-and-drop of images to the desktop;
 *  - copying an image on its own (keyboard/text copy still works).
 *
 * Listeners are delegated on `document` in the capture phase, so images mounted
 * later (lazy sections, drawers, dynamic content) are covered automatically.
 * Existing images are also force-marked `draggable = false` because Firefox
 * ignores the CSS `-webkit-user-drag` property.
 *
 * NOTE: deterrence, not DRM — a determined visitor can still recover any image
 * the browser renders (DevTools → Network, `curl`, screenshots).
 */
export default function MediaProtection(): null {
	useEffect(() => {
		const isImage = (target: EventTarget | null): target is HTMLImageElement =>
			target instanceof HTMLImageElement;

		const handleContextMenu = (event: MouseEvent) => {
			if (!isImage(event.target)) {
				return;
			}
			event.preventDefault();
		};

		const handleDragStart = (event: DragEvent) => {
			if (!isImage(event.target)) {
				return;
			}
			event.preventDefault();
		};

		const handleCopy = (event: ClipboardEvent) => {
			if (!isImage(event.target)) {
				return;
			}
			// Allow normal text selection — only block when the selection is
			// anchored inside an image (i.e. an image itself is selected).
			const anchor = window.getSelection()?.anchorNode;
			if (anchor instanceof Element && anchor.closest("img")) {
				event.preventDefault();
			}
		};

		// Firefox ignores the CSS -webkit-user-drag property; force it on the
		// images already in the DOM when the effect runs.
		document.querySelectorAll("img").forEach((img) => {
			img.draggable = false;
		});

		document.addEventListener("contextmenu", handleContextMenu, true);
		document.addEventListener("dragstart", handleDragStart, true);
		document.addEventListener("copy", handleCopy, true);
		return () => {
			document.removeEventListener("contextmenu", handleContextMenu, true);
			document.removeEventListener("dragstart", handleDragStart, true);
			document.removeEventListener("copy", handleCopy, true);
		};
	}, []);

	return null;
}
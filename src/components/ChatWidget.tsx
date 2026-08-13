import Script from "next/script";

const getTawkUrl = () => {
	const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
	const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "default";

	if (!propertyId) return null;

	return `https://embed.tawk.to/${encodeURIComponent(propertyId)}/${encodeURIComponent(widgetId)}`;
};

const ChatWidget = () => {
	const tawkUrl = getTawkUrl();

	if (!tawkUrl || process.env.NODE_ENV === "development") return null;

	return (
		<Script id="tawk-to-widget" strategy="afterInteractive">
			{`
				window.Tawk_API = window.Tawk_API || {};
				window.Tawk_API.customStyle = {
					visibility: {
						desktop: { position: "bl", xOffset: 16, yOffset: 16 },
						mobile: { position: "bl", xOffset: 16, yOffset: 16 }
					}
				};
				window.Tawk_LoadStart = new Date();
				(function () {
					var script = document.createElement("script");
					var firstScript = document.getElementsByTagName("script")[0];
					script.async = true;
					script.src = "${tawkUrl}";
					script.charset = "UTF-8";
					script.setAttribute("crossorigin", "*");
					firstScript.parentNode.insertBefore(script, firstScript);
				})();
			`}
		</Script>
	);
};

export default ChatWidget;

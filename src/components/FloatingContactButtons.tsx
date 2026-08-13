import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Fab, Tooltip } from "@mui/material";
import { useTranslation } from "@/hooks";

const fallbackWhatsAppNumber = "256700000001";

const getWhatsAppNumber = () => {
	const configuredNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || fallbackWhatsAppNumber;
	return configuredNumber.replace(/\D/g, "");
};

const FloatingContactButtons = () => {
	const { t } = useTranslation("common");
	const phoneNumber = getWhatsAppNumber();
	const message = t("common:chat.whatsappMessage", {
		defaultValue: "Hello AfriGold Hub, I would like to speak with your team.",
	});
	const label = t("common:chat.whatsappLabel", {
		defaultValue: "Chat on WhatsApp",
	});

	if (!phoneNumber) return null;

	const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

	return (
		<Tooltip title={label} placement="left">
			<Fab
				component="a"
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={label}
				size="large"
				// className="fixed bottom-4 right-4 z-[9999] text-surface bg-[#25D366] hover:bg-[#1DA851]"
                classes={{
                    
					root: "fixed! bottom-4! right-4! z-[9999] text-surface! bg-[#25D366]! hover:bg-[#1DA851]!",
				}}
			>
				<WhatsAppIcon />
			</Fab>
		</Tooltip>
	);
};

export default FloatingContactButtons;

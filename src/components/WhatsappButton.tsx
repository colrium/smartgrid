import { useTranslation } from "@/hooks";
import { useId } from "react";


const getWhatsAppNumber = () => {
    const configuredNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    if (!configuredNumber || configuredNumber?.trim?.().length < 4) {
        return;
    }
	return configuredNumber.replace(/\D/g, "");
};

const WhatsappButton = ({ className = "", ...rest }: React.ComponentProps<"a">) => {
	const { t } = useTranslation("common");
	const phoneNumber = getWhatsAppNumber();
    const tooltipId = useId()

	if (!phoneNumber) return null;

	const message = t("common:chat.whatsappMessage", {
		defaultValue: "Hello, I would like to speak with your team.",
	});
	const label = t("common:chat.whatsappLabel", {
		defaultValue: "Chat on WhatsApp",
	});
	const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

	/* return (        
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
				<span className="mdi mdi-whatsapp text-2xl" />
			</Fab>
		</Tooltip>
	); */

	return (
		<div className="relative group flex ">
			<a
				{...rest}
				data-ripple-light="true"
				className={` rounded-full bg-whatsapp/90 w-14 max-w-[56px] h-14 max-h-[56px] border border-transparent text-center text-xl text-surface transition-all shadow-sm hover:shadow hover:text-surface focus:bg-whatsapp focus:shadow-none active:bg-whatsapp hover:bg-whatsapp active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none cursor-pointer  ${className} flex items-center justify-center`}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={label}
			>
				<span className="mdi mdi-whatsapp text-inherit leading-0" />
			</a>
			<div className="absolute z-50 top-1/2 -translate-y-1/2 right-full mr-2 hidden group-hover:block whitespace-normal wrap-break-word rounded-lg bg-surface py-1 px-4  text-xs font-normal text-on-surface focus:outline-none">
				{label}
			</div>
		</div>
	);
};

export default WhatsappButton;

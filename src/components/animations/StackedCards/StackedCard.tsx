"use client";
import Image from "next/image";
import { useTransform, motion, useScroll, MotionValue } from "framer-motion";
import { useRef } from "react";
import { Typography } from "@mui/material";

interface StackedCardProps {
	i: number;
	title: string;
	description: string;
	src: string;
	url: string;
	color: string;
	progress: MotionValue<number>;
	range: [number, number];
	targetScale: number;
	className?: string;
    containerRef: React.RefObject<HTMLDivElement|null>;
    
}

const StackedCard = ({
	i,
	title,
	description,
	src,
	url,
	color,
	progress,
	range,
	targetScale,
	className,
	containerRef,
}: StackedCardProps) => {

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "start start"],
	});

	const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
	const scale = useTransform(progress, range, [1, targetScale]);

	return (
		<div
			className={`h-[80vh] flex items-center justify-center sticky top-0 ${className ?? ""}`}
		>
			<motion.div
				style={{ backgroundColor: color, scale, top: `calc( ${i * 10}px)` }}
				className="flex flex-col relative lg:min-h-[70vh] w-full rounded-xl p-8 lg:p-[50px] origin-top"
			>
				<Typography variant="h4" className="text-center text-[28px] m-0">
					{title}
				</Typography>

				<div className="flex flex-col lg:flex-row h-[50vh] mt-[20px] gap-[20px] md:mt-[50px] md:gap-[50px]">
					<div className="lg:w-[40%] relative top-[10%]">
						<p className="text-base">{description}</p>
						{/* <span className="flex items-center gap-[5px]">
							<a
								href={url}
								target="_blank"
								className="text-xs underline cursor-pointer"
							>
								See more
							</a>
							<svg
								width="22"
								height="12"
								viewBox="0 0 22 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
									fill="black"
								/>
							</svg>
						</span> */}
					</div>

                    {src && <div className="relative hidden md:flex md:w-[50vw] h-full rounded-[25px] overflow-hidden">
                        <motion.div className="w-full h-full" style={{ scale: imageScale }}>
                            <Image fill src={`${src}`} alt={title} className="object-cover" />
                        </motion.div>
                    </div>}
				</div>
			</motion.div>
		</div>
	);
};

export default StackedCard;

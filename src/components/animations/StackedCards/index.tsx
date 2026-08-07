import { useRef } from "react";
import { useScroll } from "framer-motion";
import StackedCard from "@/components/animations/StackedCards/StackedCard";

interface Card {
	title: string;
	description: string;
	src: string;
	url: string;
	color: string;
}

interface StackedCardsProps {
	cards: Card[];
	startElement?: React.ReactNode;
	endElement?: React.ReactNode;
}

const StackedCards: React.FC<StackedCardsProps> = ({ cards, startElement, endElement }) => {
	const cardsContainer = useRef<HTMLDivElement | null>(null);
	const { scrollYProgress } = useScroll({
		target: cardsContainer,
        offset: ["start start", "end end"],
	});
	return (
		<div className="relative flex flex-col" ref={cardsContainer}>
			{startElement}
			{cards?.map((card, i) => (
				<StackedCard
					key={`p_${i}`}
					{...card}
					i={i}
					progress={scrollYProgress}
					range={[i * 0.25, 1]}
                    targetScale={1 - (cards.length - i) * 0.05}
                    containerRef={cardsContainer}
				/>
			))}
			{endElement}
		</div>
	);
};

export default StackedCards;

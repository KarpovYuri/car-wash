import React, { useEffect } from "react";
import { cn, Pagination, PaginationItemType } from "@nextui-org/react";
import { ChevronIcon } from "./ChevronIcon";

export default function PaginationUI({ switchPage, currentPage, totalPages }) {
	const renderItem = ({ ref, key, value, isActive, onNext, onPrevious, setPage, className }) => {
		useEffect(() => {
			console.log("currentPage", value);
		}, [value]);

		if (value === PaginationItemType.NEXT) {
			return (
				<button
					key={key}
					className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
					onClick={() => {
						onNext();
						if (currentPage >= totalPages) return;
						switchPage(currentPage + 1);
					}}>
					<ChevronIcon className="rotate-180" />
				</button>
			);
		}

		if (value === PaginationItemType.PREV) {
			return (
				<button
					key={key}
					className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
					onClick={() => {
						onPrevious();
						if (currentPage <= 1) return;
						switchPage(currentPage - 1);
					}}>
					<ChevronIcon />
				</button>
			);
		}

		if (value === PaginationItemType.DOTS) {
			return (
				<button key={key} className={cn(className, "w-7 h-7")}>
					...
				</button>
			);
		}

		// cursor is the default item
		return (
			<button
				key={key}
				ref={ref}
				className={cn(
					className,
					isActive && "bg-black bg-opacity-5 rounded-lg",
					"w-7 h-7 text-zinc-900 text-xs font-normal",
				)}
				onClick={() => {
					setPage(value);
					switchPage(value);
				}}>
				{value}
			</button>
		);
	};

	return (
		<Pagination
			disableCursorAnimation
			showControls
			total={totalPages}
			initialPage={1}
			className="gap-2"
			radius="full"
			renderItem={renderItem}
			variant="light"
		/>
	);
}

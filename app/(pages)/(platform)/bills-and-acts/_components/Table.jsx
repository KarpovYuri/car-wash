import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import Item from "@/app/(pages)/(platform)/bills-and-acts/_components/Item";

export default function Table({ head, content = [], type = "bills" }) {
	const [dataSorted, setDataSorted] = useState("desc");

	const [windowWidth, setWindowWidth] = useState(0);

	useEffect(() => {
		setWindowWidth(window.innerWidth);
	}, []);
	console.log("content", content);

	if (windowWidth > 768) {
		return (
			<div>
				<div className={"flex w-full border-b border-[#cccccc]"}>
					{head.map(({ title, canBeSorted }, index) => (
						<div
							style={{
								flexBasis: `${100 / head.length}%`,
							}}
							className={clsx(`flex items-center gap-1 text-black/40 py-3`, {
								"px-4 border-l-black-low-opacity-gradient": index !== 0,
							})}
							key={index}>
							{canBeSorted && (
								<Image
									onClick={() => setDataSorted(dataSorted === "desc" ? "asc" : "desc")}
									className={clsx("duration-300 cursor-pointer", {
										"[transform:rotateX(180deg)]": dataSorted === "asc",
									})}
									src={"/img/icons/arrow-sorting.svg"}
									alt={"Сортировать"}
									width={16}
									height={16}
								/>
							)}
							<p>{title}</p>
						</div>
					))}
				</div>
				{content.map(({ id, uuid, status, status_name, sum, comment, created_at, document, date, value }) => (
					<Item
						id={id}
						status_name={status_name}
						created_at={created_at}
						key={id}
						uuid={uuid}
						type={type}
						document={document}
						date={date}
						value={value}
					/>
				))}
			</div>
		);
	} else {
		return (
			<Draggable axis={"x"}>
				<div className={head.length <= 4 ? "w-[600px]" : "w-[900px]"}>
					<div className={"flex w-full border-b border-[#cccccc]"}>
						{head.map(({ title, canBeSorted }, index) => (
							<div
								style={{
									flexBasis: `${100 / head.length}%`,
								}}
								className={clsx(`flex items-center gap-1 text-black/40 py-3`, {
									"px-4 border-l-black-low-opacity-gradient": index !== 0,
								})}
								key={index}>
								{canBeSorted && (
									<Image
										onClick={() => setDataSorted(dataSorted === "desc" ? "asc" : "desc")}
										className={clsx("duration-300 cursor-pointer", {
											"[transform:rotateX(180deg)]": dataSorted === "asc",
										})}
										src={"/img/icons/arrow-sorting.svg"}
										alt={"Сортировать"}
										width={16}
										height={16}
									/>
								)}
								<p>{title}</p>
							</div>
						))}
					</div>
					{content.map(({ id, uuid, status, status_name, sum, comment, created_at, document }) => (
						<Item
							id={id}
							status_name={status_name}
							created_at={created_at}
							key={id}
							uuid={uuid}
							type={type}
							document={document}
						/>
					))}
				</div>
			</Draggable>
		);
	}
}

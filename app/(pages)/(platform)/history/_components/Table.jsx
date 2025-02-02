import clsx from "clsx";
import Image from "next/image";
import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import Item from "@/app/(pages)/(platform)/history/_components/Items";

export default function Table({ data = { models: [] } }) {
	const [windowWidth, setWindowWidth] = useState(0);

	useEffect(() => {
		setWindowWidth(window.innerWidth);
	}, []);

	if (windowWidth > 768) {
		return (
			<div>
				<div className={"flex w-full border-b border-[#cccccc]"}>
					{["Номер операции", "Источник", "Тип операции", "Сумма", "Место посещения", "Дата и время"].map(
						(heading, index) => (
							<p
								className={
									"basis-1/6 mt-0 text-black/40 py-3 lg:flex-middle lg:text-center px-4 border-l-black-low-opacity-gradient"
								}
								key={index}>
								{heading}
							</p>
						),
					)}
				</div>
				{data.map(({ id, wash, created_at, value, type, user }) => (
					<Item key={id} number={id} wash={wash} date={created_at} value={value} type={type} user={user} />
				))}
			</div>
		);
	} else {
		return (
			<Draggable axis={"x"}>
				<div className={"w-[1000px]"}>
					<div className={"flex w-full border-b border-[#cccccc]"}>
						{["Номер операции", "Источник", "Тип операции", "Сумма", "Место посещения", "Дата и время"].map(
							(heading, index) => (
								<h6
									className={clsx("basis-1/6 text-black/40 py-3 lg:flex-middle lg:text-center", {
										"px-4 border-l-black-low-opacity-gradient": index !== 0,
									})}
									key={index}>
									{heading}
								</h6>
							),
						)}
					</div>
					{/*{data.map(({ number, address, date, source, sum, type }) => (*/}
					{/*	<Item*/}
					{/*		key={id}*/}
					{/*		number={number}*/}
					{/*		address={address}*/}
					{/*		date={date}*/}
					{/*		source={source}*/}
					{/*		sum={sum}*/}
					{/*		type={type}*/}
					{/*	/>*/}
					{/*))}*/}
					{data.map(({ id, wash, created_at, value, type, user }) => (
						<Item
							key={id}
							number={id}
							wash={wash}
							date={created_at}
							value={value}
							type={type}
							user={user}
						/>
					))}
				</div>
			</Draggable>
		);
	}
}

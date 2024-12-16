"use client";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getInvoices, getInvoicesFile } from "@/app/(pages)/(platform)/bills-and-acts/api";

export default function Item({ id, created_at, status_name, uuid, type, document = "", date = "", value = "" }) {
	return (
		<div className={"flex w-full text-black-100"}>
			<div className={clsx("flex items-center py-2 text-black-100 gap-2")} style={{ flexBasis: "25%" }}>
				<Image width={24} height={24} src={"/img/icons/pdf.svg"} alt={"Иконка PDF"} />
				<p>{type === "bills" ? `Номер счёта №${id}` : `Номер акта №${id}`}</p>
			</div>
			<div className={clsx("flex items-center py-2 text-black-100")} style={{ flexBasis: "25%" }}>
				<Image width={16} height={16} src={"/img/icons/calendar.svg"} alt={"Иконка календаря"} />
				<p>{date ? new Date(date).toLocaleString() : new Date(created_at).toLocaleString()}</p>
			</div>
			{type === "bills" ? (
				<div className={clsx("flex items-center py-2 text-black-100 gap-2")} style={{ flexBasis: "25%" }}>
					<div
						className={clsx("w-[6px] h-[6px] rounded-full", {
							"bg-green--main": status_name === "paid" || status_name === "Оплачен",
							"bg-red--secondary": status_name === "deposited",
							"bg-[#59A8D4]": status_name === "wait_pay",
						})}></div>
					<p
						className={clsx({
							"text-green--main": status_name === "paid" || status_name === "Оплачен",
							"text-red--secondary": status_name === "deposited",
							"text-[#59A8D4]": status_name === "wait_pay",
						})}>
						{(() => {
							switch (status_name) {
								case "deposited":
									return "Не оплачен";
								case "wait_pay":
									return "Ожидание";
								case "paid":
									return "Оплачен";
								default:
									return status_name;
							}
						})()}
					</p>
				</div>
			) : (
				<div className={clsx("flex items-center py-2 text-black-100 gap-2")} style={{ flexBasis: "25%" }}>
					<p>{value}</p>
				</div>
			)}
			<a
				href={document}
				className={clsx("flex items-center py-2 text-black-100 gap-2")}
				style={{ flexBasis: "25%" }}
				download={type === "bills" ? `Счёт №${id}` : `Акт №${id}`}
				target={"_blank"}>
				<Image
					className={"cursor-pointer mx-auto duration-300 hover:scale-125"}
					width={16}
					height={16}
					src={"/img/icons/download.svg"}
					alt={"Иконка загрузки"}
				/>
			</a>
		</div>
	);
}

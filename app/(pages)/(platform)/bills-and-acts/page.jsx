"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import Bills from "@/app/(pages)/(platform)/bills-and-acts/_components/Bills";
import Acts from "@/app/(pages)/(platform)/bills-and-acts/_components/Acts";
import { getActs, getInvoices } from "@/app/(pages)/(platform)/bills-and-acts/api";
import { DatePicker } from "rsuite";
import DropdownUI from "@/app/(pages)/(platform)/_components/Dropdown";
import PaginationUI from "@/app/_components/Pagination";
import "rsuite/dist/rsuite.min.css";
import ZeroContent from "@/app/(pages)/(platform)/_components/ZeroContent";

export default function BillsAndActs() {
	const [subpage, setSubpage] = useState("счета");
	const [isBillsContent, setIsBillsContent] = useState([]);
	const [isActsContent, setIsActsContent] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [status, setStatus] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const statusList = [
		{ id: "", text: "Все" },
		{ id: "wait_pay", text: "Ожидание" },
		{ id: "paid", text: "Оплачен" },
		{ id: "deposited", text: "Не оплачен" },
	];
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	const handleSearch = text => {
		setSearchText(text);
	};
	const handleStatusChange = text => {
		const statusObj = statusList.find(item => item.text === text);
		console.log(statusObj);
		setStatus(statusObj?.id ? statusObj.id : "");
	};
	const handleStartDateChange = date => {
		console.log("date", date);
		console.log("handleSearch", status);
		setStartDate(date);
	};
	const handleEndDateChange = date => {
		console.log("date", date);
		setEndDate(date);
	};
	const switchPage = page => {
		setCurrentPage(page);
	};

	useEffect(() => {
		const fetchData = async () => {
			let data = [];

			if (subpage === "счета") {
				console.log("filter", isBillsContent);
				data = await getInvoices(currentPage);
			} else if (subpage === "акты") {
				console.log("filter", isActsContent);
				data = await getActs(currentPage);
			}

			if (data?.meta?.total_pages) {
				setTotalPages(data.meta.total_pages);
			}

			data = data.models;

			data = data.filter(item => {
				const itemDate = new Date(item.created_at);
				const startDateFilter = startDate ? new Date(startDate) : null;
				const endDateFilter = endDate ? new Date(endDate) : null;

				// console.log(itemDate, startDateFilter, endDateFilter);

				if (startDateFilter && endDateFilter) {
					return itemDate >= startDateFilter && itemDate <= endDateFilter;
				} else if (startDateFilter) {
					return itemDate >= startDateFilter;
				} else if (endDateFilter) {
					return itemDate <= endDateFilter;
				} else {
					return true;
				}
			});

			data = data.filter(item => {
				// console.log("searchtext", item.id, searchText);
				return `${item.id}`.includes(searchText);
			});

			if (status !== undefined && subpage !== "акты") {
				data = data.filter(item => {
					// console.log(item.status, "status", status);
					return item.status_name.includes(status);
				});
			}

			subpage === "счета" ? setIsBillsContent(data) : setIsActsContent(data);
		};
		fetchData();
	}, [subpage, startDate, endDate, searchText, status, currentPage]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getInvoices(currentPage);
				if (data.models) {
					setIsBillsContent(data.models);
				}
				if (data?.meta?.total_pages) {
					console.log("totalPages", data?.meta?.total_pages);
					setTotalPages(data.meta.total_pages);
				}
			} catch (error) {
				console.error("Ошибка при получении данных об организации", error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getActs(currentPage);
				if (data) {
					setIsActsContent(data.models);
				}
				if (data?.meta?.total_pages) {
					console.log("totalPages", data?.meta?.total_pages);
					setTotalPages(data.meta.total_pages);
				}
			} catch (error) {
				console.error("Ошибка при получении данных об организации", error);
			}
		};

		fetchData();
	}, []);

	return (
		<section className={"w-full h-full"}>
			<nav className={"text-black/40 text-sm flex gap-8 ml-2"}>
				<button
					className={clsx(
						"before:transition-all before:duration-300 relative hover:text-black-100 duration-300 before:absolute before:bottom-[-4px] before:h-0.5 before:bg-black-100 before:rounded-lg",
						subpage === "счета"
							? "cursor-default text-black-100 font-semibold before:w-full"
							: "before:w-0",
					)}
					onClick={() => {
						setCurrentPage(1);
						setSubpage("счета");
					}}>
					Счета
				</button>
				<button
					className={clsx(
						"before:transition-all before:duration-300 relative hover:text-black-100 duration-300 before:absolute before:bottom-[-4px] before:h-0.5 before:bg-black-100 before:rounded-lg",
						subpage === "акты" ? "cursor-default text-black-100 font-semibold before:w-full" : "before:w-0",
					)}
					onClick={() => {
						setCurrentPage(1);
						setSubpage("акты");
					}}>
					Акты
				</button>
			</nav>
			<div
				className={
					"mt-6 mb-2 bg-[#F7F9FB] rounded-lg w-full p-2 flex items-center gap-4 md:gap-3.5 md:flex-wrap"
				}>
				<div className={"relative grow w-full"}>
					<Image
						className={"absolute left-1.5 top-1/2 -translate-y-1/2"}
						width={16}
						height={16}
						src={"/img/icons/search.svg"}
						alt={"Поиск"}
					/>
					<input
						className={
							"focus:border-black/20 w-full border border-black/10 bg-white/80 rounded-lg text-sm px-4 py-2 pl-[26px] placeholder:text-black/20 text-black-100"
						}
						placeholder={"Поиск"}
						onChange={e => handleSearch(e.target.value)}
					/>
				</div>
				{subpage !== "акты" && (
					<div className={"relative min-w-[200px] md:w-full"}>
						<DropdownUI
							text={"Тип операции"}
							list={statusList}
							buttonClassName={
								"w-full border border-black/10 bg-white/80 rounded-lg text-sm px-4 py-2 placeholder:text-black/20 text-black-100"
							}
							menuClassName={"w-full border border-black/10 bg-white/80 rounded-lg w-[200px] text-center"}
							itemClassName={
								"w-full flex justify-center items-center py-1 hover:border-[#F7F9FB] hover:bg-[#F7F9FB] rounded-lg hover:border-black/10"
							}
							callback={handleStatusChange}
						/>
						<Image
							className={"absolute right-3 top-1/2 -translate-y-1/2"}
							width={16}
							height={16}
							src={"/img/icons/arrow-range.svg"}
							alt={"Тип операции"}
						/>
					</div>
				)}
				<div className="flex items-center gap-2 md:w-full md:flex-col min-w-[300px]">
					<div className={"relative max-w-[166px] md:w-full md:max-w-full"}>
						<DatePicker
							format="MM/dd/yyyy"
							className={
								"text-center w-full border border-black/10 bg-white/80 rounded-lg text-sm placeholder:text-black/20 text-black-100"
							}
							placeholder={"Дата от"}
							onChange={date => handleStartDateChange(date)}
						/>
					</div>
					<div className={"w-1 h-[1px] bg-black md:hidden"} />
					<div className={"relative max-w-[166px] md:w-full md:max-w-full"}>
						<DatePicker
							format="MM/dd/yyyy"
							className={
								"text-center w-full border border-black/10 bg-white/80 rounded-lg text-sm placeholder:text-black/20 text-black-100"
							}
							placeholder={"Дата до"}
							onChange={date => handleEndDateChange(date)}
						/>
					</div>
				</div>
			</div>
			{(() => {
				if (
					(subpage === "счета" && isBillsContent.length > 0) ||
					(subpage === "акты" && isActsContent.length > 0)
				) {
					return (
						<>
							{subpage === "счета" ? <Bills data={isBillsContent} /> : <Acts data={isActsContent} />}
							{totalPages > 1 && (
								<div className={"w-full flex items-center justify-center"}>
									<PaginationUI
										switchPage={switchPage}
										currentPage={currentPage}
										totalPages={totalPages}
									/>
								</div>
							)}
						</>
					);
				} else {
					return (
						<div className={"flex-middle h-full"}>
							<ZeroContent text={"Тут будут отображаться операции по балансу организации"} />
						</div>
					);
				}
			})()}
		</section>
	);
}

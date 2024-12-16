"use client";

import { useEffect, useState } from "react";
import ZeroContent from "@/app/(pages)/(platform)/_components/ZeroContent";
import Image from "next/image";
import Table from "@/app/(pages)/(platform)/history/_components/Table";
import { getHistory, getUsers } from "@/app/(pages)/(platform)/history/api";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import DropdownUI from "@/app/(pages)/(platform)/_components/Dropdown";
import PaginationUI from "@/app/_components/Pagination";

export default function History() {
	const [isHaveContent, setIsHaveContent] = useState(null);
	const [users, setUsers] = useState(null);
	const [searchText, setSearchText] = useState("");
	const [status, setStatus] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const statusList = [
		{ id: "", text: "Все" },
		{ id: "waste", text: "Списание" },
		{ id: "paid", text: "Пополнение" },
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

			data = await getHistory(currentPage);

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

			if (status !== undefined) {
				data = data.filter(item => {
					// console.log(item.type, "status", status);
					return item.type.includes(status);
				});
			}

			setIsHaveContent(data);
		};
		fetchData();
	}, [startDate, endDate, searchText, status, currentPage]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getHistory(currentPage);
				if (data) {
					setIsHaveContent(data.models);
				}
				if (data?.meta?.total_pages) {
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
				const data = await getUsers();
				if (data) {
					console.log("users", data);
					setUsers(data.data);
				}
			} catch (error) {
				console.error("Ошибка при получении данных об организации", error);
			}
		};
		fetchData();

		if (isHaveContent && users) {
			const result = isHaveContent.map(transaction => {
				transaction.user = users.find(user => user.id === transaction.user_id);

				return transaction;
			});
		}
	}, [isHaveContent]);

	return (
		<section className={"flex flex-col gap-7"}>
			<div className={"bg-[#F7F9FB] rounded-lg w-full p-2 flex items-center gap-4 lg:gap-2 md:flex-wrap"}>
				<div className={"relative w-2/3 md:w-full"}>
					<Image
						className={"absolute left-1.5 top-1/2 -translate-y-1/2"}
						width={16}
						height={16}
						src={"/img/icons/search.svg"}
						alt={"Поиск"}
					/>
					<input
						className={
							"w-full border border-black/10 bg-white/80 rounded-lg text-sm px-4 py-2 pl-[26px] placeholder:text-black/20 text-black-100"
						}
						placeholder={"Поиск по водителю или месту"}
						onChange={e => handleSearch(e.target.value)}
					/>
				</div>
				<div className={"relative grow md:w-full min-w-[200px]"}>
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
					<Image
						className={"absolute right-3 top-1/2 -translate-y-1/2"}
						width={16}
						height={16}
						src={"/img/icons/arrow-range.svg"}
						alt={"Тип операции"}
					/>
				</div>
				{/* TODO: поправить сьезжающие иконки календарей в инпутах (мобилы) */}
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
			{isHaveContent && isHaveContent.length > 0 ? (
				<>
					<Table data={isHaveContent} />
					{totalPages > 1 && (
						<div className={"w-full flex items-center justify-center"}>
							<PaginationUI switchPage={switchPage} currentPage={currentPage} totalPages={totalPages} />
						</div>
					)}
				</>
			) : (
				<div className={"flex-middle h-full"}>
					<ZeroContent text={"Тут будут отображаться операции по балансу организации"} />
				</div>
			)}
		</section>
	);
}

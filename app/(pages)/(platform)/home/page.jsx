"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getCountWash, getDataLineChart, getMoneySpent, getTransactionsMonth } from "@/app/(pages)/(platform)/home/api";
import DropdownUI from "@/app/(pages)/(platform)/_components/Dropdown";
import { getOrganizationData } from "@/app/(pages)/auth/reg";
import { Progress } from "@nextui-org/react";

export default function Home() {
	const [isHaveContent, setIsHaveContent] = useState(true);
	const [moneySpent, setMoneySpent] = useState(0);
	const [countWash, setCountWash] = useState(0);
	const [dataLineChart, setDataLineChart] = useState([]);
	const [organization, setOrganization] = useState({});
	const monthsNamesRu = [
		"Январь",
		"Февраль",
		"Март",
		"Апрель",
		"Май",
		"Июнь",
		"Июль",
		"Август",
		"Сентябрь",
		"Октябрь",
		"Ноябрь",
		"Декабрь",
	]
		.filter((item, index) => index <= new Date().getMonth())
		.map((item, index) => ({ text: item, currentMonth: index === new Date().getMonth() }));
	const [selectedMonthIndex, setSelectedMonthIndex] = useState(monthsNamesRu.findIndex(item => item.currentMonth));
	const [forecastDate, setForecastDate] = useState(new Date());

	const switchMonth = value => setSelectedMonthIndex(monthsNamesRu.findIndex(item => item.text === value));

	useEffect(() => {
		const fetchData = async () => {
			try {
				const transactionMonth = await getTransactionsMonth(
					new Date().getFullYear() + "-" + (selectedMonthIndex + 1),
				);
				setForecastDate(prevState => {
					prevState = new Date();
					prevState.setDate(
						prevState.getDate() +
							(transactionMonth.predicted_day_count ? transactionMonth.predicted_day_count : 0),
					);
					return prevState;
				});

				transactionMonth && setDataLineChart(transactionMonth);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, [selectedMonthIndex]);

	useEffect(() => {
		const fetchData = async () => {
			const organizationData = await getOrganizationData();

			if (organizationData) setOrganization(organizationData);
		};
		fetchData();
	}, []);

	function getCurrentMonthYearString() {
		const currentDate = new Date();
		const month = currentDate.toLocaleString("ru", { month: "long" });
		const year = currentDate.getFullYear();

		return `${month} ${year}`;
	}

	function filterAndMapMonthDays(data) {
		const filteredData = data
			.filter(item => new Date(item.date).getMonth() === selectedMonthIndex)
			.map(item => ({ ...item, day: new Date(item.date).getDate() }));
		const currentDate = new Date();
		const currentMonth = currentDate.getMonth() + 1;
		const currentYear = currentDate.getFullYear();
		const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

		for (let i = 1; i <= daysInMonth; i++) {
			if (filteredData.findIndex(item => item.day === i) !== -1) continue;
			filteredData.push({
				value: 0,
				day: i,
			});
		}

		return filteredData.sort((a, b) => a.day - b.day);
	}

	return (
		<section>
			<div className="flex items-stretch gap-7 lg:gap-4 h-full flex-wrap">
				<div className={"p-6 md:p-3.5 rounded-2xl bg-[#F7F9FB] min-h-full md:w-full"}>
					<div className="flex items-center justify-between">
						<h6 className={"text-black-100 font-semibold text-lg"}>Аналитика счета</h6>
						<div className={"px-2 py-1 rounded-lg bg-black-100 text-sm text-white"}>
							{getCurrentMonthYearString()}
						</div>
					</div>
					<div className={"flex items-center mt-4 gap-7 md:gap-4 text-black-100 text-sm"}>
						<div className={"flex flex-col"}>
							<p>Израсходовано</p>
							<div
								className={
									"text-center rounded-lg bg-black/5 mt-1 w-[160px] relative h-6 overflow-y-hidden"
								}>
								<div
									className={
										"w-full bg-indigo-200 h-full absolute right-full translate-x-0 transition duration-300 ease-in-out"
									}
									style={{
										transform: `translateX(${
											organization.spent_percent_balance ? organization.spent_percent_balance : 0
										}%)`,
									}}></div>
								<span
									className={
										"block text-center text-zinc-900 text-lg font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
									}>
									{organization.spent_percent_balance ? organization.spent_percent_balance : 0}%
								</span>
							</div>
						</div>
						<div className={"w-[1px] h-[52px] bg-black/10"} />
						<div>
							<p>Закончатся</p>
							<p className={"text-lg font-semibold mt-1"}>
								{forecastDate.toLocaleString("ru", { month: "long" }) + " " + forecastDate.getDate()}
							</p>
						</div>
					</div>
				</div>
				<div className={"p-6 rounded-2xl bg-[#E3F5FF] min-h-full min-w-[230px] md:w-full"}>
					<h6 className={"text-sm font-semibold text-black-100 mb-2"}>Всего моек</h6>
					<div className={"flex items-center justify-between"}>
						<p className={"text-2xl font-semibold text-black-100"}>
							{organization.month ? organization.month.operation_count : 0}
						</p>
						{/*{isHaveContent && (
							<div className="flex items-center gap-1">
								<p className={"text-black-100"}>+11.01%</p>
								<Image
									width={16}
									height={16}
									alt={"Возрастание или убывание графика"}
									src={"/img/icons/arrow-rise.svg"}
								/>
							</div>
						)}*/}
					</div>
				</div>
				<div className={"p-6 rounded-2xl bg-[#E5ECF6] min-h-full min-w-[230px] md:w-full"}>
					<h6 className={"text-sm font-semibold text-black-100 mb-2"}>Потрачено средств</h6>
					<div className={"flex items-center justify-between"}>
						<p className={"text-2xl font-semibold text-black-100"}>
							{String(organization.month ? organization.month.spent : 0).replace(".", ",")}
						</p>
						{/*{isHaveContent && (
							<div className="flex items-center gap-1">
								<p className={"text-black-100"}>+11.01%</p>
								<Image
									width={16}
									height={16}
									alt={"Возрастание или убывание графика"}
									src={"/img/icons/arrow-rise.svg"}
								/>
							</div>
						)}*/}
					</div>
				</div>
			</div>
			<div className={"mt-11 px-6 md:px-3.5 py-4 bg-[#F7F9FB] rounded-2xl relative"}>
				<div className={"mb-5 w-full flex items-center justify-between"}>
					<h6 className={"font-semibold text-sm text-black-100"}>Статистика</h6>
					<div className={"w-[200px]"}>
						<DropdownUI
							text={"Выберите дату"}
							list={monthsNamesRu}
							buttonClassName={
								"w-full border border-black/10 bg-white/80 rounded-lg text-sm px-4 py-1 placeholder:text-black/20 text-black-100"
							}
							menuClassName={"w-full border border-black/10 bg-white/80 rounded-lg w-[200px] text-center"}
							itemClassName={
								"w-full flex justify-center items-center py-1 hover:border-[#F7F9FB] hover:bg-[#F7F9FB] rounded-lg hover:border-black/10"
							}
							callback={switchMonth}
							defaultValue={monthsNamesRu.find(item => item.currentMonth)}
						/>
					</div>
				</div>
				{/* TODO: над графиком еще поработать (адаптив + внешний вид с тултипами + вверху штука с выбором даты) */}
				<ResponsiveContainer width="100%" height={260}>
					<LineChart width={"100%"} height={"100%"} data={dataLineChart}>
						<CartesianGrid vertical={false} stroke={"#000"} strokeOpacity={0.05} />
						<Tooltip contentStyle={{ borderRadius: "10px" }} />
						<XAxis dataKey="day" padding={{ left: 35, right: 35 }} />
						<YAxis />
						<Line
							activeDot={{
								width: "30px",
								fill: "#A8C5DA",
								strokeWidth: 3,
								stroke: "#ffffff",
								r: 5,
							}}
							dot={false}
							type={"monotone"}
							dataKey="value"
							name={"Потрачено"}
							stroke="#26AD60"
							strokeWidth={3}
						/>
					</LineChart>
				</ResponsiveContainer>
				{/*{!isHaveContent && (
					<div
						className={
							"absolute top-0 left-0 right-0 bottom-0 flex-middle z-10 text-black/20 font-semibold text-5xl"
						}>
						Нет данных для отображения
					</div>
				)}*/}
			</div>
		</section>
	);
}

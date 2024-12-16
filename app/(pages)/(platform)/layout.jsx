"use client";

import ZeroContent from "@/app/(pages)/(platform)/_components/ZeroContent";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Operation } from "@/app/(pages)/(platform)/_components/Operation";
import Image from "next/image";
import Button from "@/app/_components/Button";
import { usePathname, useRouter } from "next/navigation";
import MenuItem from "@/app/(pages)/(platform)/_components/MenuItem";
import ModalWindow from "@/app/_components/ModalWindow";
import Input from "@/app/_components/Input";
import { createInvoices, getOrganizationData } from "@/app/(pages)/(platform)/platform";
import withAuth from "@/app/utils/withAuth";
import Footer from "@/app/(pages)/auth/_components/Footer";
import { getHistory, getUsers } from "@/app/(pages)/(platform)/history/api";
import toast from "react-hot-toast";

function PlatformLayout({ children }) {
	const pathname = usePathname();
	const router = useRouter();

	const [isHaveContent, setIsHaveContent] = useState(false);
	const [history, setHistory] = useState([]);
	const [users, setUsers] = useState([]);

	const [windowWidth, setWindowWidth] = useState(0);
	const [organizationInfo, setOrganizationInfo] = useState({});
	const [invoices, setInvoices] = useState({});
	const [loadingPage, setLoadingPage] = useState(false);
	const [navItems, setNavItems] = useState([
		{
			id: "home",
			text: "Главная",
			icon: "statistic",
			pathname: "/home",
			active: usePathname() === "/home",
		},
		{
			id: "drivers",
			text: "Водители",
			icon: "car",
			pathname: "/drivers",
			active: usePathname() === "/drivers",
		},
		{
			id: "history",
			text: "История",
			icon: "box",
			pathname: "/history",
			active: usePathname() === "/history",
		},
		{
			id: "bills-and-acts",
			text: "Счета и акты",
			icon: "document",
			pathname: "/bills-and-acts",
			active: usePathname() === "/bills-and-acts",
		},
		{
			id: "settings",
			text: "Настройки",
			icon: "passport",
			pathname: "/settings",
			active: usePathname() === "/settings",
		},
	]);
	const [toastId, setToastId] = useState(null);
	const [intervalId, setIntervalId] = useState(null);

	useEffect(() => {
		setWindowWidth(window.innerWidth);
	}, []);

	useEffect(() => {
		setIsHaveContent(window.location.href.split("#")[1] === "fill");
	}, []);

	const switchLoadingPage = (id, pathname) => {
		console.log("switchLoadingPage", pathname);

		if (toastId !== null) {
			toast.dismiss(toastId);
		}
		if (intervalId !== null) {
			clearInterval(intervalId);
		}
		setToastId(
			toast.loading("Подождите. Загружаем информацию", {
				position: "top-center",
			}),
		);
		setIntervalId(
			setInterval(() => {
				const currentPathname = location && location.pathname;

				console.log(currentPathname, pathname);
				if (currentPathname === pathname) {
					toast.dismiss(toastId);
					setToastId(null);
					clearInterval(intervalId);
				}
			}, 100),
		);

		setNavItems(prevState => {
			prevState.forEach(item => {
				item.active = item.id === id;
			});
			return prevState;
		});
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getOrganizationData();
				// console.log("data", data);
				if (data) {
					setOrganizationInfo(data);
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
				// const data = await getHistory(1, 50);
				/*if (data) {
					setHistory(data.models);
				}*/
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

		if (history) {
			const result = history.map(transaction => {
				transaction.user = users.find(user => user.id === transaction.user_id);

				return transaction;
			});
		}
	}, [history]);

	const [showModalRefill, setShowModalRefill] = useState(false);

	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<>
			<div
				className={clsx(
					"flex w-screen min-h-screen max-h-screen bg-white md:flex-col md:max-h-full md:items-center",
				)}>
				<header
					className={clsx("w-full hidden justify-between items-center p-4 md:flex", {
						"fixed z-50 top-0 left-0 right-0": menuOpen,
						"relative z-50": !menuOpen,
					})}>
					<button
						className="w-[35px] h-[30px] relative focus:outline-none p-2.5 bg-zinc-100 rounded"
						onClick={() => setMenuOpen(!menuOpen)}>
						<div className="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<span
								className={clsx(
									"block absolute h-[2px] w-5 bg-black bg-current transform transition duration-500 ease-in-out rounded",
									{ "rotate-45": menuOpen, "-translate-y-1.5": !menuOpen },
								)}></span>
							<span
								className={clsx(
									"block absolute h-[2px] w-5 bg-black transform transition duration-500 ease-in-out rounded",
									{ "opacity-0": menuOpen },
								)}></span>
							<span
								className={clsx(
									"block absolute h-[2px] w-5 bg-black transform  transition duration-500 ease-in-out rounded",
									{ "-rotate-45": menuOpen, " translate-y-1.5": !menuOpen },
								)}></span>
						</div>
					</button>
					<Image width={"34"} height={"42"} src={"/img/logo.svg"} alt={"Лого"} />
					<div className={"flex flex-col gap-1 items-center"}>
						<span className={"block opacity-60 text-zinc-900 text-[10px] font-semibold leading-tight"}>
							Баланс
						</span>
						<div className={"flex items-center"}>
							<span className={"text-zinc-900 text-2xl font-semibold leading-9"}>
								{organizationInfo?.balance}
							</span>
							<Image width={24} height={24} src={"/img/icons/currency-rub.svg"} alt={"Знак рубля"} />
						</div>
					</div>
				</header>
				<aside
					className={clsx(
						"md:border-none overflow-hidden w-[252px] min-w-[252px] p-4 pt-6 lg:p-2 border-r border-solid border-black/10 md:w-full md:fixed md:min-h-screen md:max-h-screen top-0 left-0 md:bg-white z-30 md:justify-center transition-all duration-300 md:overflow-y-auto md:pt-28",
						{ "translate-x-0": menuOpen, "md:-translate-x-full": !menuOpen },
					)}>
					<div className={"flex flex-col justify-between gap-[10px]"}>
						<div className={"md:px-20"}>
							<div
								className={
									"md:py-4 text-center text-white text-sm font-semibold w-full py-2.5 px-2 bg-green--main rounded-2xl"
								}>
								<p>«{organizationInfo?.name}»</p>
							</div>
							<div className="bg-[#E5ECF6] py-[22px] px-6 w-full mt-4 rounded-2xl text-black-100 font-semibold md:hidden">
								<div className="text-sm flex justify-between items-center">
									<p>Баланс</p>
									<Image
										width={24}
										height={24}
										src={"/img/icons/currency-rub.svg"}
										alt={"Знак рубля"}
									/>
								</div>
								<p className={"text-2xl mt-2 mb-6"}>{organizationInfo?.balance}</p>
								<div className={"md:block mt-4"}>
									<Button type={"success-secondary"} clickHandler={() => setShowModalRefill(true)}>
										Пополнить
									</Button>
								</div>
							</div>
						</div>
						<div
							className="flex flex-col gap-1 md:mb-1 md:mt-4 md:items-center md:px-20"
							onClick={() => setMenuOpen(false)}>
							{navItems.map((item, index) => (
								<MenuItem
									id={item.id}
									text={item.text}
									icon={item.icon}
									path={item.pathname}
									active={item.active}
									switchLoadingPage={switchLoadingPage}
									key={index}
								/>
							))}
							<div className={"mt-3 w-full"}>
								<Button
									type={"danger-secondary"}
									clickHandler={() => {
										document.cookie = "bearer_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
										document.cookie = "phone=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
										document.cookie = "organization_id=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
										router.push("/auth");
									}}>
									Выйти
								</Button>
							</div>
						</div>
						{windowWidth > 768 && (
							<div className={"relative flex-middle flex-col"}>
								<div className={"absolute top-0 h-[1px] left-[-16px] right-[-16px] bg-black/10"} />
								<Image
									className={"my-4"}
									width={36}
									height={42}
									src={"/img/logo.svg"}
									alt={"Логотип"}
								/>
								<p className={"text-black/40 text-center"}>© Car Wash Priority 2023</p>
							</div>
						)}
						{windowWidth < 768 && <Footer />}
					</div>
				</aside>
				<div className={"w-full grow p-6 pb-4 lg:p-3 flex flex-col overflow-y-auto"}>
					<div className={"grow"}>{children}</div>
					{windowWidth > 768 && (
						<div className="flex gap-12 text-black/40 mt-12 lg:flex-col lg:gap-3 lg:items-center">
							<a className={"hover:opacity-75 ml-auto lg:ml-0"} href="mailto:info@carwashpriority.ru">
								Поддержка
							</a>
							<a className={"hover:opacity-75"} href="/political-policy">
								Политика конфиденциальности
							</a>
							<a className={"hover:opacity-75"} href="/service-rules">
								Правила предоставления услуг
							</a>
						</div>
					)}
				</div>
				{pathname !== "/history" && (
					<aside
						className={clsx(
							"md:hidden md:block md:pb-5 md:mt-6 md:w-full md:border-t md:border-black/10 min-w-[252px] lg:px-2 relative w-[280px] border-l border-solid border-black/10 px-6 py-[72px] overflow-y-hidden",
							{
								"": !isHaveContent,
								"flex flex-col gap-2 md:items-center": isHaveContent,
							},
						)}>
						<h6
							className={
								"text-black-100 text-sm font-semibold text-center absolute top-6 left-0 right-0 "
							}>
							История операций
						</h6>
						{history.length > 0 ? (
							<div
								className={
									"w-full flex flex-col gap-2 items-center justify-items-start h-full overflow-y-auto"
								}>
								{history.map(item => (
									<Operation
										type={item.type === "waste" ? "debit" : "refill"}
										value={item.value}
										user={item.user}
										date={item.created_at}
										key={item.id}
									/>
								))}
							</div>
						) : (
							<ZeroContent text={"Тут будут отображаться операции по балансу организации"} />
						)}
					</aside>
				)}
				{windowWidth <= 768 && (
					<>
						<div className={"relative flex-middle flex-col"}>
							<div className={"absolute top-0 h-[1px] left-[-16px] right-[-16px] bg-black/10"} />
							<Image className={"my-4"} width={36} height={42} src={"/img/logo.svg"} alt={"Логотип"} />
							<p className={"text-black/40 text-center"}>© Car Wash Priority 2023</p>
						</div>
						<div className="pb-4 flex gap-12 text-black/40 mt-6 lg:flex-col lg:gap-3 lg:items-center">
							<a className={"hover:opacity-75 ml-auto lg:ml-0"} href="#">
								Поддержка
							</a>
							<a className={"hover:opacity-75"} href="#">
								Политика конфиденциальности
							</a>
							<a className={"hover:opacity-75"} href="/service-rules">
								Правила предоставления услуг
							</a>
						</div>
					</>
				)}
			</div>
			<ModalWindow
				trigger={showModalRefill}
				setTrigger={arg => setShowModalRefill(arg)}
				title={"Пополнить баланс"}>
				<div className={"flex-middle flex-col gap-3"}>
					<span>Укажите сумму пополнения.</span>
					<span>Счет будет отправлен на почту и появится на странице счетов</span>
				</div>
				<Input label={"Сумма пополнения"} setValue={sum => setInvoices({ sum: sum })} />
				<div className={"w-[388px] md:w-full"}>
					<Button
						type={"success"}
						clickHandler={async () => {
							const res = await createInvoices(invoices);

							if (res) {
								setShowModalRefill(false);
								setInvoices({});
							}
						}}>
						Получить счет на оплату
					</Button>
				</div>
			</ModalWindow>
		</>
	);
}

export default withAuth(PlatformLayout);

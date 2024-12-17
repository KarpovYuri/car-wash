"use client";

import Image from "next/image";
import Button from "@/app/_components/Button";
import TitleAndOpinion from "@/app/(pages)/auth/_components/TitleAndOpinion";
import { useState, useEffect } from "react";
import Input from "@/app/_components/Input";
import { createByCalc, getOrganizationData, getPayData, reqContactData, reqPayData, setData, verifyTel } from "../reg";
import { readCookie } from "@/app/utils/cookie";
import { initiateFlashCall, saveOrganizationData, sendAuthCode, verifyCode } from "@/app/(pages)/auth/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Checkbox from "@/app/_components/Checkbox";

function formatPhoneNumber(phoneNumber) {
	if (!phoneNumber) return "";

	const cleaned = phoneNumber.replace(/\D/g, "");

	if (cleaned.length === 11) {
		const countryCode = cleaned[0];
		const rest = cleaned.slice(1);

		const formattedRest = `(***) ***-${rest.slice(6, 8)}-${rest.slice(8, 10)}`;

		return `+${countryCode} ${formattedRest}`;
	} else {
		return phoneNumber;
	}
}

export default function Registration() {
	// step = 1 - подтверждение номера
	// step = 2 - подтверждение данных организации
	// step = 3 - платежные данные
	// step = 4 - информация о представителе
	// step = 5 - расчет расходов и пополнения баланса
	// step = 6 - рекомендуемое пополнение
	const organizationId = readCookie("organization_id");
	const phone = readCookie("phone");

	const [step, setStep] = useState(1);

	const [verificationCode, setVerificationCode] = useState(Array(4).fill(""));

	const [costCalculation, setCostCalculation] = useState(["", ""]);
	const [organizationData, setOrganizationData] = useState({
		inn: "",
		ogrn: "",
		name: "",
		address: "",
	});
	const [payData, setPayData] = useState({
		settlement_number: "",
		name: "",
		bic: "",
		correspondent_account: "",
	});
	const [contactData, setContactData] = useState({
		fio: "",
		email: "",
	});
	const [invalidFields, setInvalidFields] = useState({});
	const [calculatorData, setCalculatorData] = useState({
		car_count: "",
		car_wash_count_by_week: "",
	});
	const [calcSum, setCalcSum] = useState(0);
	const [verifyPhoneErrorMsg, setVerifyPhoneErrorMsg] = useState("");
	const searchParams = useSearchParams();
	const typeAuth = searchParams.get("type");
	const [confirmationForLegalEntity, setConfirmationForLegalEntity] = useState(false);
	const [dataProcessingConsent, setDataProcessingConsent] = useState(false);
	const [serviceTermsConsent, setServiceTermsConsent] = useState(false);
	const [isSmsAuth, setIsSmsAuth] = useState(false);

	const [timeLeft, setTimeLeft] = useState(60);
	const [buttonText, setButtonText] = useState("1:00");
	const [isRegPage, setIsRegPage] = useState(false);

	const router = useRouter();

	const formatTime = seconds => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60; // Секунды
		return `${minutes}:${secs.toString().padStart(2, "0")}`;
	};

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		const typeParam = queryParams.get("type");

		if (typeParam !== "login") {
			setIsRegPage(true);
			setIsSmsAuth(true);
		}
	}, []);

	useEffect(() => {
		if (isSmsAuth) {
			setVerificationCode(Array(6).fill(""));
			if(!isRegPage) sendAuthCode({ phone: phone });
		} else {
			setVerificationCode(Array(4).fill(""));
		}
	}, [isSmsAuth]);

	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setInterval(() => {
				setTimeLeft(prevTime => prevTime - 1);
				setButtonText(formatTime(timeLeft));
			}, 1000);

			return () => clearInterval(timer);
		} else {
			setButtonText("Продолжить");
			setIsSmsAuth(true);
		}
	}, [timeLeft]);

	useEffect(() => {
		if (verificationCode.join("").length === verificationCode.length) {
			typeAuth === "login" ? loginVerify() : handleVerify();
		}
	}, [verificationCode]);

	const handleVerify = async () => {
		const status = await verifyTel({ phone: phone, code: verificationCode.join("") });
		setVerifyPhoneErrorMsg("");
		// console.log("status", status, status !== undefined, !status?.code);

		if (status !== undefined && !status?.code) {
			status && setStep(2);
			setInvalidFields({});

			const orgData = await getOrganizationData();

			if (orgData) {
				setOrganizationData({
					inn: orgData?.inn,
					ogrn: orgData?.ogrn,
					name: orgData?.name,
					address: orgData?.address,
				});
			}
		} else {
			if (status?.code) {
				setVerifyPhoneErrorMsg("Поле code обязательно для заполнения.");
			} else {
				setVerifyPhoneErrorMsg("Неверный код");
			}
		}
	};

	const loginVerify = async () => {
		if (verificationCode.join("").length !== verificationCode.length) {
			setVerifyPhoneErrorMsg("Поле code обязательно для заполнения." + verificationCode.length);
			return;
		}

		const status = await verifyCode({ phone: phone, code: verificationCode.join("") });

		if (status === true) {
			await saveOrganizationData();
			router.push("/home");
		} else {
			setVerifyPhoneErrorMsg("Неверный код");
		}
	};

	const handleSetData = async () => {
		if (organizationData.inn === "") {
			setInvalidFields({
				inn: "Поле ИНН обязательно для заполнения",
			});
			return;
		}

		const data = await setData(organizationData);

		if (data === true) {
			setStep(3);
			setInvalidFields({});

			const payData = await getPayData();

			if (payData) {
				console.log("payData", payData.organization_pay_data);
				setPayData(payData.organization_pay_data);
			}
		} else {
			setInvalidFields(data);
		}
	};

	const handlePayDataAuto = async () => {
		const data = await reqPayData(payData);

		if (data === true) {
			setStep(4);
			setInvalidFields({});
		} else {
			setInvalidFields(data);
		}
	};

	const handleContactData = async () => {
		const data = await reqContactData(contactData);

		if (data === true && confirmationForLegalEntity && dataProcessingConsent && serviceTermsConsent) {
			setStep(5);
			setInvalidFields({});
		} else {
			const checkBoxErros = {};

			if (!confirmationForLegalEntity) checkBoxErros.confirmationForLegalEntity = "Обязательный выбор";
			if (!dataProcessingConsent) checkBoxErros.dataProcessingConsent = "Обязательный выбор";
			if (!serviceTermsConsent) checkBoxErros.serviceTermsConsent = "Обязательный выбор";

			if (data === true) {
				setInvalidFields(checkBoxErros);
			} else {
				setInvalidFields({ ...data, ...checkBoxErros });
			}
		}
	};

	const handleCalc = async () => {
		const invalidData = {};
		let validate = true;

		if (parseFloat(calculatorData.car_count) < 1) {
			invalidData.car_count = "Должно быть больше 1";
			validate = false;
		}
		if (parseFloat(calculatorData.car_wash_count_by_week) === "") {
			invalidData.car_wash_count_by_week = "Должно быть больше 1";
			validate = false;
		}

		if (validate) {
			const res = await createByCalc(calculatorData);

			if (res?.sum) {
				setCalcSum(res.sum);
				setStep(6);
				setInvalidFields({});
			}
		}
	};

	switch (step) {
		case 1: {
			return (
				<>
					<Image width={"80"} height={"80"} src={"/img/icons/phone.svg"} alt={"Иконка телефона"} />
					<TitleAndOpinion title={"Верификация номера"}>
						{isSmsAuth ? (
							"Мы отправили код подтверждения на номер:"
						) : (
							<>
								Вам поступит входящий звонок
								<br />
								Введите последние 4 цифры номера телефона:
							</>
						)}
					</TitleAndOpinion>
					{isSmsAuth && (
						<div className={"text-lg font-semibold text-black-100"}>{formatPhoneNumber(phone)}</div>
					)}
					<div className={"text-center"}>
						<p className={"mb-3 text-sm font-semibold text-black-100"}>
							{isSmsAuth ? "Введите 6 цифр из сообщения" : "Введите 4 цифры номера телефона"}
						</p>
						<div className={"flex gap-2 items-center justify-center"}>
							{verificationCode.map((value, index) => (
								<Input
									dataFocus={`focus-${index + 1}`}
									type={"one-number"}
									value={value}
									setValue={num => {
										const updatedCode = [...verificationCode];
										updatedCode[index] = num;
										setVerificationCode(updatedCode);
										if (num !== "") {
											const nextInput = document.querySelector(
												`[data-focus="focus-${index + 2}"]`,
											);
											if (nextInput) nextInput.focus();
										}
									}}
									onPaste={e => {
										e.preventDefault();
										const pastedData = e.clipboardData.getData("Text"); // Получаем вставленное значение
										const updatedCode = [...verificationCode];

										pastedData.split("").forEach((char, i) => {
											if (i < verificationCode.length) {
												updatedCode[index + i] = char;
											}
										});

										setVerificationCode(updatedCode);
									}}
									key={index}
								/>
							))}
						</div>
						{verifyPhoneErrorMsg && (
							<span className="text-red-500 text-sm mt-6 block">{verifyPhoneErrorMsg}</span>
						)}
					</div>
					<div>
						<div className={"flex gap-4"}>
							<Button clickHandler={() => router.push("/auth")} type={"secondary"} icon="arrow-left">
								Вернуться
							</Button>
							{!isSmsAuth && (
								<Button type={"secondary"} disabled={true}>
									<span className="w-6 h-6 border-4 border-[#d1ee9b] border-b-[#93c13d] rounded-full inline-block animate-spin"></span>
									{buttonText}
								</Button>
							)}
						</div>
						<p
							className={`text-sm text-black/40 text-center mt-4 ${
								!isSmsAuth ? "opacity-0 pointer-events-none" : ""
							}`}>
							Не получили код?{" "}
							<button
								className={"text-purple--main"}
								onClick={async () => {
									if (isSmsAuth) {
										await sendAuthCode({ phone: phone }); // Вызов функции
									} else {
										await initiateFlashCall({ phone: phone });
										setTimeLeft(60);
										setVerifyPhoneErrorMsg("");
										setVerificationCode(Array(4).fill(""));
									}
								}}>
								{isSmsAuth ? "Выслать новый" : "Запросить новый звонок"}
							</button>{" "}
							или{" "}
							<a className={"text-purple--main"} href="mailto:carwashpriority@yandex.ru">
								Напишите нам
							</a>
						</p>
					</div>
				</>
			);
		}
		case 2: {
			return (
				<>
					<TitleAndOpinion title={"Подтверждение данных организации"}>
						Проверьте правильность данных
					</TitleAndOpinion>
					<Input
						label={"ИНН"}
						placeholder={"366310082593"}
						value={organizationData.inn}
						setValue={text => setOrganizationData(prev => ({ ...prev, inn: text }))}
						invalidValue={invalidFields?.inn}
					/>
					<Input
						label={"ОГРН"}
						placeholder={"1085752004535"}
						value={organizationData.ogrn}
						setValue={text => setOrganizationData(prev => ({ ...prev, ogrn: text }))}
						invalidValue={invalidFields?.ogrn}
					/>
					<Input
						label={"Наименование компании"}
						placeholder={'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ТДВ"'}
						value={organizationData.name}
						setValue={text => setOrganizationData(prev => ({ ...prev, name: text }))}
						invalidValue={invalidFields?.name}
					/>
					<Input
						label={"Юридический адрес"}
						placeholder={"302027, Орловская область, г Орёл, Октябрьская ул, д. 211, помещ. 114 офис 4"}
						value={organizationData.address}
						setValue={text => setOrganizationData(prev => ({ ...prev, address: text }))}
						invalidValue={invalidFields?.address}
					/>
					<Button clickHandler={handleSetData} type={"success"} icon={"arrow-right"}>
						Продолжить
					</Button>
				</>
			);
		}
		case 3: {
			return (
				<>
					<TitleAndOpinion title={"Платежные данные"}>
						Укажите реквизиты для получения счетов за обслуживание
					</TitleAndOpinion>
					<Input
						label={"БИК"}
						value={payData.bic}
						setValue={text => setPayData(prev => ({ ...prev, bic: text }))}
						invalidValue={invalidFields?.bic}
					/>
					<Input
						label={"Название банка"}
						value={payData.name}
						setValue={text => setPayData(prev => ({ ...prev, name: text }))}
						invalidValue={invalidFields?.name}
					/>
					<Input
						label={"Корреспондентский счёт"}
						value={payData.correspondent_account}
						setValue={text => setPayData(prev => ({ ...prev, correspondent_account: text }))}
						invalidValue={invalidFields?.correspondent_account}
					/>
					<Input
						label={"Расчётный счёт"}
						value={payData.settlement_number}
						setValue={text => setPayData(prev => ({ ...prev, settlement_number: text }))}
						invalidValue={invalidFields?.settlement_number}
					/>
					<div className={"flex gap-7 w-full max-[800px]:gap-1"}>
						<div className={"w-1/2"}>
							<Button clickHandler={() => setStep(2)} type={"secondary"} icon={"arrow-left"}>
								Вернуться
							</Button>
						</div>
						<div className={"w-1/2"}>
							<Button clickHandler={handlePayDataAuto} type={"success"} icon={"arrow-right"}>
								Продолжить
							</Button>
						</div>
					</div>
				</>
			);
		}
		case 4: {
			return (
				<>
					<TitleAndOpinion title={"Информация о представителе"}>
						<p className={"flex gap-3 flex-col"}>
							<span>
								Укажите информацию о представителе организации, который будет пользоваться личным
								кабинетом.
							</span>
							<span>
								Почта необходима для получения счетов для оплаты, актов выполенных работ и информации о
								изменениях.
							</span>
						</p>
					</TitleAndOpinion>
					<Input
						label={"ФИО представителя"}
						value={contactData.fio}
						setValue={text => setContactData(prev => ({ ...prev, fio: text }))}
						invalidValue={invalidFields?.fio}
					/>
					<Input
						label={"E-mail для информирования "}
						value={contactData.email}
						setValue={text => setContactData(prev => ({ ...prev, email: text }))}
						invalidValue={invalidFields?.email}
					/>
					<div className={"flex gap-3 w-full flex-col"}>
						<Checkbox
							title={
								invalidFields?.confirmationForLegalEntity
									? invalidFields?.confirmationForLegalEntity
									: " "
							}
							opinion={
								'<p class="text-black text-opacity-80 text-sm font-normal">Подтверждаю действия в интересах юр.лица, ИНН которого было внесено ранее</p>'
							}
							isCurrent={confirmationForLegalEntity}
							setIsCurrent={setConfirmationForLegalEntity}
							errorTitle={!!invalidFields?.confirmationForLegalEntity}
						/>
						<Checkbox
							title={invalidFields?.dataProcessingConsent ? invalidFields?.dataProcessingConsent : " "}
							opinion={
								'<p class="text-black text-opacity-80 text-sm font-normal">Соглашаюсь с <a style="color: #95A4FC" href="/political-policy">Правилами обработки персональных данных</a></p>'
							}
							isCurrent={dataProcessingConsent}
							setIsCurrent={setDataProcessingConsent}
							errorTitle={!!invalidFields?.dataProcessingConsent}
						/>
						<Checkbox
							title={invalidFields?.serviceTermsConsent ? invalidFields?.serviceTermsConsent : " "}
							opinion={
								'<p class="text-black text-opacity-80 text-sm font-normal">Соглашаюсь с <a style="color: #95A4FC" href="/service-rules">Правилами предоставления услуг</a></p>'
							}
							isCurrent={serviceTermsConsent}
							setIsCurrent={setServiceTermsConsent}
							errorTitle={!!invalidFields?.serviceTermsConsent}
						/>
					</div>
					<div className={"flex gap-7 w-full max-[800px]:gap-1"}>
						<div className={"w-1/2"}>
							<Button clickHandler={() => setStep(3)} type={"secondary"} icon="arrow-left">
								Вернуться
							</Button>
						</div>
						<div className={"w-1/2"}>
							<Button clickHandler={handleContactData} type={"success"} icon={"arrow-right"}>
								Продолжить
							</Button>
						</div>
					</div>
				</>
			);
		}
		case 5: {
			return (
				<>
					<TitleAndOpinion title={"Расчет расходов и пополнения баланса"}>
						<p className={"flex gap-3 flex-col"}>
							<span>Укажите данные своего автопарка, мы рассчитаем рекомендуему сумму пополнения.</span>
							<span>
								При пополнении баланса на рекомендуюмую сумму, вы получаете возможность{" "}
								<a className={"text-purple--main"} href="#">
									овердрафта
								</a>
								!
							</span>
						</p>
					</TitleAndOpinion>
					<div
						className={
							"w-full rounded-2xl  max-[800px]:px-6 px-12 py-6 bg-[rgba(229,236,246,0.50)] flex flex-col gap-3 items-center"
						}>
						<p className={"text-sm font-semibold text-black-100 text-center"}>
							Сколько машин в организации?
						</p>
						<Input
							type={"number"}
							dataFocus={"focus-1"}
							value={calculatorData.car_count}
							invalidValue={invalidFields?.car_count}
							setValue={num => {
								setCalculatorData(prevState => ({ ...prevState, car_count: num }));
							}}
						/>
						<Image width={32} height={32} src={"/img/icons/close.svg"} alt={"Иконка умножения"} />
						<p className={"text-sm font-semibold text-black-100 text-center"}>
							Сколько моек в неделю будет для каждой машины?
						</p>
						<Input
							type={"number"}
							dataFocus={"focus-2"}
							value={calculatorData.car_wash_count_by_week}
							invalidValue={invalidFields?.car_wash_count_by_week}
							setValue={num => {
								setCalculatorData(prevState => ({ ...prevState, car_wash_count_by_week: num }));
							}}
						/>
						<Image width={32} height={32} src={"/img/icons/close.svg"} alt={"Иконка умножения"} />
						<div className={"flex gap-2 items-center justify-center"}>
							<div className={"text-5xl text-green--main font-semibold max-[800px]:text-3xl"}>150₽</div>
							<div>
								<Image width={19} height={19} src={"/img/icons/question.svg"} alt={"Иконка вопроса"} />
								<p className={"text-sm text-black/40 max-[800px]:text-[12px]"}>/стоимость мойки</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-4 w-full">
						<Button clickHandler={() => handleCalc()} type={"success"} icon={"arrow-right"}>
							Продолжить
						</Button>
						<Button type={"secondary"}>Пропустить</Button>
					</div>
				</>
			);
		}
		case 6: {
			return (
				<>
					<TitleAndOpinion title={"Рекомендуемое пополнение"}>
						Чтобы получить возможность овердрафта пополните баланс на рекомендуему сумму
					</TitleAndOpinion>
					<div
						className={
							"w-full rounded-2xl px-12 py-10 bg-[rgba(229,236,246,0.50)] flex flex-col gap-3 items-center"
						}>
						<p className={"text-sm font-semibold text-black-100 text-center"}>Рекомендуемая сумма</p>
						<p
							className={
								"text-center px-[21px] py-[11px] flex-middle rounded-lg font-semibold text-2xl leading-[150%] border border-solid border-black/20 bg-white"
							}>
							{calcSum}
						</p>
					</div>
					<div className="flex flex-col gap-4 w-full">
						<Button
							clickHandler={() => {
								router.push("/bills-and-acts");
							}}
							type={"success"}>
							Получить счет
						</Button>
						<Button
							clickHandler={() => {
								router.push("/home");
							}}
							type={"secondary"}>
							Пропустить
						</Button>
					</div>
					<p className={"text-center text-sm text-black/40"}>
						Если вы пропустите этот шаг, то для вашего аккаунта возможность овердрафта будет отключена!
					</p>
				</>
			);
		}
	}
}

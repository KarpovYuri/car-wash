"use client";

import Image from "next/image";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { setBalance } from "@/app/(pages)/(platform)/drivers/drivers";
import { formatPhoneNumber } from "@/app/utils/utils";

export default function Item({ phone, balance, races, deleteDriver, editDriver, id, updateDrivers }) {
	const [balanceDriver, setBalanceDriver] = useState(balance);
	const [errorMessage, setErrorMessage] = useState("");

	const changeBalanceUser = async balance => {
		try {
			const data = await setBalance({ balance: balance }, id);

			if (data) {
				await updateDrivers();
				setBalanceDriver(balance);
				setErrorMessage("");
			}
		} catch (error) {
			setErrorMessage(error.response.data.message);
		}
	};

	return (
		<div className={"flex w-full text-black-100"}>
			<div className="flex basis-1/4 items-center px-4 lg:px-1 py-2">{formatPhoneNumber(phone)}</div>
			<div className="flex-middle basis-1/4 px-4 lg:px-1 py-2 flex-col gap-1">
				<input
					className={clsx(
						"text-sm md:text-xs p-1 bg-white border border-black/10 rounded-lg w-full flex-middle text-center",
						{ "text-green--main": balanceDriver > 50, "text-red-600": balanceDriver < 50 },
					)}
					defaultValue={balanceDriver}
					onChange={async e => {
						await changeBalanceUser(e.target.value);
					}}
				/>
				{errorMessage && <span className="text-red-600">{errorMessage}</span>}
			</div>
			<div className="flex-middle basis-1/4 px-4 lg:px-1 py-2">{races}</div>
			<div className="flex-middle basis-1/4 px-4 lg:px-1 py-2 justify-evenly">
				<Image
					className={"cursor-pointer duration-300 hover:scale-125"}
					width={20}
					height={20}
					src={"/img/icons/trash-can.svg"}
					alt={"Удалить"}
					onClick={deleteDriver}
				/>
			</div>
		</div>
	);
}

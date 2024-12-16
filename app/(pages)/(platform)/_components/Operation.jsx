import Image from "next/image";
import { formatDate, formatPhoneNumber } from "@/app/utils/utils";

export function Operation({ type, value, user, date }) {
	return (
		<div className={"flex gap-2 p-1 w-full"}>
			<div className={"flex flex-col justify-between items-center"}>
				<Image
					width={24}
					height={24}
					src={`/img/icons/${type}.svg`}
					alt={type === "refill" ? "Пополнение" : "Списание"}
				/>
				<div className={"bg-black/10 w-[1px] h-[14px] mb-0.5"} />
			</div>
			<div>
				<p className={"text-sm text-black-100"}>
					{(type === "debit" ? "- " : "+ ") + value} <span className={"font-bold"}>₽</span>
				</p>
				<p className={"text-black/40"}>{user ? formatPhoneNumber(user.phone) : ""}</p>
				<p className={"text-black/20"}>{formatDate(date)}</p>
			</div>
		</div>
	);
}

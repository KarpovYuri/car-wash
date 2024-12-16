import Image from "next/image";
import { formatPhoneNumber } from "@/app/utils/utils";
import { formatDate } from "@/app/utils/utils";

export default function Item({ number, wash, date, value, type, user }) {
	return (
		<div className={"border-b border-black/5 flex w-full text-black-100"}>
			<div className={"flex items-center gap-1 basis-1/6 py-3"}>{number}</div>
			<div className={"flex items-center gap-1 basis-1/6 px-4 lg:px-3 py-3"}>
				{user ? formatPhoneNumber(user.phone) : ""}
			</div>
			<div className={"basis-1/6 px-4 lg:px-3 py-3 flex items-center gap-[5px]"}>
				{type === "waste" ? (
					<>
						<div className="w-[6px] h-[6px] bg-red--secondary rounded-full"></div>
						<p className={"text-red--secondary"}>Списание</p>
					</>
				) : (
					<>
						<div className="w-[6px] h-[6px] bg-green--main rounded-full"></div>
						<p className={"text-[#59A8D4]"}>Пополнение</p>
					</>
				)}
			</div>
			<div className={"flex items-center gap-1 basis-1/6 px-4 lg:px-3 py-3"}>
				{value} <span className={"font-bold"}>₽</span>
			</div>
			<div className={"flex items-center gap-1 basis-1/6 px-4 lg:px-3 py-3 text-purple--secondary"}>
				{wash?.city + "," + wash?.address}
			</div>
			<div className={"flex items-center gap-1 basis-1/6 px-4 lg:px-3 py-3"}>
				<Image width={16} height={16} src={"/img/icons/calendar.svg"} alt={"Иконка календаря"} />
				<p>{formatDate(date)}</p>
			</div>
		</div>
	);
}

import Table from "@/app/(pages)/(platform)/bills-and-acts/_components/Table";

export default function Acts({ data }) {
	return (
		<Table
			head={[
				{
					title: "Название",
				},
				{
					title: "Дата формирования",
					canBeSorted: true,
				},
				{
					title: "Значение",
				},
				{
					title: "Скачать",
				},
			]}
			content={data}
			type={"acts"}
		/>
	);
}

import { axiosInstance } from "@/app/utils/axios-instance";
import { readCookie } from "@/app/utils/cookie";

export async function getHistory(page = 1, perPage = 15) {
	try {
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie(
				"organization_id",
			)}/transactions?per_page=${perPage}&page=${page}`,
		);

		if (res.status === 200) {
			return res.data;
		}
		console.error("Ошибка при получении history:", res.status);
		return false;
	} catch (error) {
		console.error("Ошибка при получении history:", error);
		return false;
	}
}

export async function getUsers() {
	try {
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}/users`,
		);

		if (res.status === 200) {
			return res.data;
		}
		console.error("Ошибка при получении users:", res.status);
		return false;
	} catch (error) {
		console.error("Ошибка при получении users:", error);
		return false;
	}
}

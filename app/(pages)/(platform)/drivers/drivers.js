import { axiosInstance } from "@/app/utils/axios-instance";
import { readCookie } from "@/app/utils/cookie";
import { saveOrganizationData } from "@/app/(pages)/auth/auth";

export async function addDrivers(data) {
	await saveOrganizationData();
	const res = await axiosInstance.post(`/api/v2/organizations/${readCookie("organization_id")}/users`, data);

	try {
		if (res.status === 200) {
			return true;
		} else {
			console.log("Неудачное заполнение данных:", res.status);
			return false;
		}
	} catch (error) {
		console.log("Неудачное заполнение данных:", error);
		return false;
	}
}

export async function deleteDriver(userId) {
	await saveOrganizationData();
	const res = await axiosInstance.delete(`/api/v2/organizations/${readCookie("organization_id")}/users/${userId}`);

	try {
		if (res.status === 200) {
			return true;
		} else {
			console.log("Неудачное удаление пользователя:", res.status);
			return false;
		}
	} catch (error) {
		console.log("Неудачное удаление пользователя:", error);
		return false;
	}
}

export async function getDrivers(page = 1, per_page = 15) {
	await saveOrganizationData();
	const res = await axiosInstance.get(
		`/api/v2/organizations/${readCookie("organization_id")}/users?role_id=0&page=${page}&per_page=${per_page}`,
	);

	try {
		if (res.status === 200) {
			return res.data.data;
		} else {
			console.log("Неудачное заполнение данных:", res.status);
			return [];
		}
	} catch (error) {
		console.log("Неудачное заполнение данных:", error);
		return [];
	}
}

export async function setDayAutoBalanceReq(data) {
	await saveOrganizationData();
	const res = await axiosInstance.post(
		`/api/v2/organizations/${readCookie("organization_id")}/set-day-auto-balance`,
		data,
	);

	try {
		if (res.status === 200) {
			return true;
		} else {
			console.log("Неудачное заполнение данных:", res.status);
			return false;
		}
	} catch (error) {
		console.log("Неудачное заполнение данных:", error);
		return false;
	}
}

export async function setBalance(data, userId) {
	await saveOrganizationData();
	const res = await axiosInstance.post(
		`/api/v2/organizations/${readCookie("organization_id")}/users/${userId}/set-balance`,
		data,
	);

	try {
		if (res.status === 200) {
			return true;
		} else {
			console.log("Неудачное заполнение данных:", res.status);
			return false;
		}
	} catch (error) {
		console.log("Неудачное заполнение данных:", error);
		return false;
	}
}

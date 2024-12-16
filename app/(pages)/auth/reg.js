import axios from "axios";
import { axiosInstance } from "@/app/utils/axios-instance";
import { readCookie } from "@/app/utils/readCookie";
import { saveOrganizationData } from "@/app/(pages)/auth/auth";

export async function reg(data) {
	try {
		const res = await axios.post(`${process.env.host}/api/v2/organizations/registration/create`, data);

		document.cookie = "organization_id=; expires=-1;";
		document.cookie = "phone=; expires=-1;";

		if (res.status === 200) {
			document.cookie = "organization_id=" + res.data.organization_id;
			document.cookie = "phone=" + data.phone;
			return true;
		}
		console.log("Произошла ошибка в запросе на авторизацию:", res.status);
		return false;
	} catch (error) {
		console.log("Произошла ошибка в запросе на авторизацию:", error);
		return error.response.data;
	}
}

export async function verifyTel(data) {
	try {
		const res = await axios.post(`${process.env.host}/api/v2/organizations/registration/auth`, data);

		document.cookie = "bearer_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";

		if (res.status === 200) {
			const tokenExpiryTime = new Date(res.data.auth.expires_at).getTime();
			document.cookie =
				"bearer_token=" +
				res.data.auth.bearer_token +
				"; path=/; samesite=lax; expires=" +
				new Date(tokenExpiryTime).toUTCString();

			return true;
		} else {
			console.log("Неудачная проверка номера:", res.status);
			return res;
		}
	} catch (error) {
		console.log("Неудачная проверка номера:", error);
		return error.response.data.errors;
	}
}

export async function setData(data) {
	try {
		const res = await axiosInstance.post(
			`/api/v2/organizations/${readCookie("organization_id")}/registration/set-data`,
			data,
		);

		if (res.status === 200) {
			return true;
		} else {
			console.log("Неудачное заполнение данных:", res.status);
			return false;
		}
	} catch (error) {
		console.log("Неудачное заполнение данных:", error);
		return error.response.data.errors;
	}
}

export async function reqPayData(data) {
	try {
		await saveOrganizationData();
		const res = await axiosInstance.post(
			`/api/v2/organizations/${readCookie("organization_id")}/registration/set-pay-data`,
			data,
		);

		if (res.status === 200) {
			return true;
		} else {
			console.log("Неудачное заполнение данных:", res.status);
			return false;
		}
	} catch (error) {
		console.log("Неудачное заполнение данных:", error);
		return error.response.data.errors;
	}
}

export async function reqContactData(data) {
	try {
		const res = await axiosInstance.post(
			`/api/v2/organizations/${readCookie("organization_id")}/registration/set-contact-data`,
			data,
		);

		if (res.status === 200) {
			return true;
		} else {
			console.log("Неудачное заполнение данных:", res.status);
			return false;
		}
	} catch (error) {
		console.log("Неудачное заполнение данных:", error);
		return error.response.data.errors;
	}
}

export async function getOrganizationData() {
	try {
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}`,
		);

		if (res.status === 200) {
			return res.data.data;
		} else {
			console.log("Неудачная проверка данных:", res.status);
			return false;
		}
	} catch (error) {
		console.log("Неудачная проверка данных:", error);
		return error.response.data.errors;
	}
}

export async function getPayData() {
	try {
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}/registration/get-pay-data`,
		);

		if (res.status === 200) {
			return res.data;
		} else {
			console.log("get-pay-data:", res.status);
			return false;
		}
	} catch (error) {
		console.log("get-pay-data:", error);
		return error.response.data.errors;
	}
}

export async function createByCalc(data) {
	try {
		const res = await axiosInstance.post(
			`/api/v2/organizations/${readCookie("organization_id")}/invoices/create-by-calc`,
			data,
		);

		if (res.status === 200 || res.status === 201) {
			return res.data.organization_invoice;
		} else {
			console.log("Неудачное заполнение данных:", res.status);
			return false;
		}
	} catch (error) {
		console.log("Неудачное заполнение данных:", error);
		return error.response.data.errors;
	}
}

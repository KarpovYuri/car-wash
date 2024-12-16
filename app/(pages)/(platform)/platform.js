import { readCookie } from "@/app/utils/cookie";
import { axiosInstance } from "@/app/utils/axios-instance";
import axios from "axios";
import { saveOrganizationData } from "@/app/(pages)/auth/auth";

export async function getOrganizationData() {
	try {
		await saveOrganizationData();
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}`,
		);

		if (res.status === 200) {
			return res.data.data;
		}
		console.error("Ошибка при получении данных об организации:", res.status);
		return false;
	} catch (error) {
		console.error("Ошибка при получении данных об организации:", error);
		return false;
	}
}

export async function getPayData() {
	try {
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}/registration/get-pay-data`,
		);

		if (res.status === 200) {
			return res.data.organization_pay_data;
		}
		console.error("Ошибка при отправке get-pay-data:", res.status);
		return false;
	} catch (error) {
		console.error("Ошибка при отправке get-pay-data:", error);
		return false;
	}
}

export async function getContactData() {
	try {
		const res = await axiosInstance.get(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}/registration/get-contact-data`,
		);

		if (res.status === 200) {
			return res.data.organization_contact_data;
		}
		console.error("Ошибка при отправке get-pay-data:", res.status);
		return false;
	} catch (error) {
		console.error("Ошибка при отправке get-pay-data:", error);
		return false;
	}
}

export async function createInvoices(data) {
	try {
		const res = await axiosInstance.post(
			`${process.env.host}/api/v2/organizations/${readCookie("organization_id")}/invoices/create`,
			data,
		);

		if (res.status === 200 || res.status === 201) {
			return res.data;
		}
		console.log("res", res);
		alert(res);
		return false;
	} catch (error) {
		alert(error.response.data.message);
		return false;
	}
}

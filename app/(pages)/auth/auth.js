import axios from "axios";
import { redirect } from "next/navigation";
import { axiosInstance } from "@/app/utils/axios-instance";
import { readCookie } from "@/app/utils/cookie";
import toast from "react-hot-toast";

export async function sendAuthCode(data) {
	try {
		const res = await axios.post(`${process.env.host}/api/v2/organizations/send-auth-code`, data);

		if (res.status === 200) {
			toast.success("Код подтверждения отправлен вам на номер");
			return true;
		}
		console.error("Ошибка при отправке send-auth-code:", res.status);
		return res.data;
	} catch (error) {
		toast.error("Подождите 60 секунд");
		console.error("Ошибка при отправке send-auth-code:", error);
		return error;
	}
}

export async function initiateFlashCall(data) {
	try {
		const res = await axios.post(`${process.env.host}/api/v2/flash-call/initiate`, data);

		if (res.status === 200) {
			toast.success("Вам поступит входящий звонок. Введите последние 4 цифры номера.");
			return true;
		}
		return res.data;
	} catch (error) {
		console.error("Ошибка при запросе звонка:", error);
		return error;
	}
}

export async function verifyCode(data) {
	try {
		const res = await axios.post(`${process.env.host}/api/v2/login`, data);

		if (res.status === 200) {
			const tokenExpiryTime = new Date(res.data.data.expires_at).getTime();

			document.cookie =
				"bearer_token=" +
				res.data.data.bearer_token +
				"; path=/; samesite=lax; expires=" +
				new Date(tokenExpiryTime).toUTCString();

			return true;
		}
		return res.data;
	} catch (error) {
		console.error("Ошибка при авторизации:", error);
		return error.response.data;
	}
}

export async function checkPhone(data) {
	try {
		const res = await axios.post(`${process.env.host}/api/v2/check-phone`, data);

		if (res.status === 200) {
			return res.data;
		}
		console.error("Ошибка при авторизации:", res.status);
		return res.data;
	} catch (error) {
		console.error("Ошибка при авторизации:", error);
		return error.response.data;
	}
}

export async function saveOrganizationData() {
	try {
		const res = await axiosInstance.get(`/api/v2/organizations/`);

		if (res.status === 200) {
			document.cookie = "organization_id=" + res.data.data[0].id;
			return true;
		} else {
			alert(res.data.message);
			console.log("Неудачное заполнение данных:", res.status);
			return false;
		}
	} catch (error) {
		console.log("error", error);
		// alert(error.response.data.message);
		// console.log("Неудачное заполнение данных:", error);
		return false;
	}
}

import { loginNeeded } from "../state/actions/app-actions";
import store from "../state/store";
import { throwError } from "./errors";
import getEndpointUrl from "./url";

enum FetchMethod {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	PATCH = "PATCH",
	DELETE = "DELETE"
}

export type QueryParams = {[key: string]: string};

export const getRealPath = (path: string) => {
  return path.startsWith("!") ? path.substring(1) : getEndpointUrl(path);
};

const fetchWithMethod = async <B, R> (
	fetchMethod: FetchMethod,
	path: string,
	expectedHttpStatus: number,
	queryParams?: QueryParams,
	body?: B,
	json = true
) => {
	const realPath = getRealPath(path);
	try {
		const response = await fetch(realPath, {
			method: fetchMethod,
			credentials: "include",
			headers: json ? {
        "Content-Type": "application/json; charset=utf-8"
			} : undefined,
			body: body ? json ? JSON.stringify(body) : body as string : null
		});

		if (response.status === 401) {
			store.dispatch(loginNeeded(true));
			await throwError("Request for " + realPath + " was rejected as Unauthrozied", response);
		}

		if (response.status !== expectedHttpStatus) {
			await throwError("Request for " + realPath + " returned unexpected status: " + response.status, response);
		}

		const responseBody = response.headers.get("content-type")?.startsWith("application/json")
			? await response.json()
			: await response.text();
		return responseBody as R;
	} catch (fetchError) {
		throw fetchError;
	}
};

export const getData = async <B, R> (path: string, expectedHttpStatus: number, queryParams?: QueryParams, body?: B, json?: boolean) => {
	return fetchWithMethod<B, R>(FetchMethod.GET, path, expectedHttpStatus, queryParams, body, json);
};

export const postData = async <B, R> (path: string, expectedHttpStatus: number, queryParams?: QueryParams, body?: B, json?: boolean) => {
	return fetchWithMethod<B, R>(FetchMethod.POST, path, expectedHttpStatus, queryParams, body, json);
};

export const putData = async <B, R> (path: string, expectedHttpStatus: number, queryParams?: QueryParams, body?: B, json?: boolean) => {
	return fetchWithMethod<B, R>(FetchMethod.PUT, path, expectedHttpStatus, queryParams, body, json);
};

export const patchData = async <B, R> (path: string, expectedHttpStatus: number, queryParams?: QueryParams, body?: B, json?: boolean) => {
	return fetchWithMethod<B, R>(FetchMethod.PATCH, path, expectedHttpStatus, queryParams, body, json);
};

export const deleteData = async <B, R> (path: string, expectedHttpStatus: number, queryParams?: QueryParams, body?: B, json?: boolean) => {
	return fetchWithMethod<B, R>(FetchMethod.DELETE, path, expectedHttpStatus, queryParams, body, json);
};

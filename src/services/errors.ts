export class HttpError {
	constructor(
		private message: string,
		private readonly httpStatus: number
	) {}
	public getHttpStatus(): number {
		return this.httpStatus;
	}
}

export const throwError = async (messageIntro: string, response: Response) => {
	const message = response.headers.get("content-type")?.startsWith("application/json")
		? await response.json()
		: await response.text()
	throw new HttpError(message, response.status);
};

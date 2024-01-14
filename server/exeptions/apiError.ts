export default class ApiError extends Error {
    status: number;
    errors: string[] | any[];

    constructor(status: number, message: string, errors: string[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(): ApiError {
        return new ApiError(401, "User not authorized");
    }

    static BadRequest(message: string, errors?: string[]): ApiError {
        return new ApiError(400, message, errors);
    }
}
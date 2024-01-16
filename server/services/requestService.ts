import ApiError from "../exeptions/apiError";

export default new class RequestService {
    checkMissingParams(params: any, neededParams: string[]): void {
        const missingParams: string[] = [];

        for(let i = 0; i < neededParams.length; i++) {
            if(!Object.keys(params).includes(neededParams[i])) {
                missingParams.push(neededParams[i]);
            }
        }

        if(missingParams.length !== 0) {
            throw ApiError.BadRequest("Some parameters missing", missingParams);
        }
    }
}
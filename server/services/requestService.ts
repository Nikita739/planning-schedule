export default new class RequestService {
    checkMissingParams(params: any, neededParams: string[]): null | string[] {
        const missingParams: string[] = [];

        for(let i = 0; i < neededParams.length; i++) {
            if(!Object.keys(params).includes(neededParams[i])) {
                missingParams.push(neededParams[i]);
            }
        }

        return missingParams.length !== 0 ? missingParams : null;
    }
}
import models, {ISettings} from "../models/models";
import ApiError from "../exeptions/apiError";
const {Settings} = models;

export default new class SettingsService {
    async changePriorityColors(userId: number, newColors: string[]): Promise<ISettings> {
        const oldSettings = await Settings.findOne({where: {userId}});
        if(!oldSettings) {
            throw ApiError.BadRequest("Settings object with this userId not found");
        }

        oldSettings.priorityColors = newColors;
        await oldSettings.save();

        return oldSettings;
    }
}
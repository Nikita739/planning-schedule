import {WeekDay} from "./Calendar";

class CalendarService {
    getDayInfoFromDate(date: Date): WeekDay {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return {
            date: date,
            name: weekdays[date.getDay()]
        }
    }

    getWeekdaysWithDate(date: Date): WeekDay[] {
        const result: WeekDay[] = [];

        const dayOfWeek = date.getDay();

        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - dayOfWeek);

        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + (6 - dayOfWeek));

        for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
            const weekDay = this.getDayInfoFromDate(d);
            result.push({ name: weekDay.name, date: new Date(d) });
        }

        return result;
    }
}

export default new CalendarService();
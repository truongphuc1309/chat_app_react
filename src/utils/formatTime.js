const formatTime = (string) => {
    const date = new Date(string);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthStr = convertMonth(date.getMonth() + 1);
    const dayOfMonth = date.getDate();

    const hours = date.getHours();
    const min = date.getMinutes();
    const second = date.getSeconds();

    const now = new Date();
    if (year < now.getFullYear()) return `${dayOfMonth} ${month} ${year}`;

    if (month < now.getMonth() + 1) return `${dayOfMonth} ${monthStr}`;

    if (dayOfMonth < now.getDate()) {
        const hourInfi = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 3600)
        );

        if (hourInfi > 24)
            return `${now.getDate() - dayOfMonth} ${
                now.getDate() - dayOfMonth > 1 ? 'days' : 'day'
            }`;

        const minInfi = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60)
        );

        if (minInfi < 60) return `${minInfi} ${minInfi > 1 ? 'mins' : 'min'}`;
        else return `${hourInfi} ${hourInfi > 1 ? 'hours' : 'hour'}`;
    }

    if (hours < now.getHours()) {
        const minInfi = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60)
        );
        if (minInfi < 60) return `${minInfi} ${minInfi > 1 ? 'mins' : 'min'}`;
        else
            return `${now.getHours() - hours} ${
                now.getHours() - hours > 1 ? 'hours' : 'hour'
            }`;
    }

    if (min < now.getMinutes()) {
        const secondInfi = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (secondInfi < 60) return `1 min`;
        else
            return `${now.getMinutes() - min} ${
                now.getMinutes() - min > 1 ? 'mins' : 'min'
            }`;
    }

    // if (second < now.getSeconds())
    //     return `${Math.ceil(now.getSeconds() - second)} ${
    //         Math.ceil(now.getSeconds() - second) > 1 ? 'seconds' : 'second'
    //     }`;

    return '1 min';
};

const formatLocalTime = (string) => {
    const date = new Date(string);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthStr = convertMonth(date.getMonth() + 1);
    const dayOfMonth = date.getDate();

    const hours = date.getHours();
    const min = date.getMinutes();
    const second = date.getSeconds();

    const now = new Date();
    if (year < now.getFullYear())
        return `${
            dayOfMonth < 10 ? '0' : ''
        }${dayOfMonth} ${monthStr} ${year} ${hours < 10 ? '0' : ''}${hours}:${
            min < 10 ? '0' : ''
        }${min}`;

    if (month < now.getMonth() + 1)
        return `${dayOfMonth < 10 ? '0' : ''}${dayOfMonth} ${monthStr} ${
            hours < 10 ? '0' : ''
        }${hours}:${min < 10 ? '0' : ''}${min}`;

    if (dayOfMonth < now.getDate())
        return `${dayOfMonth < 10 ? '0' : ''}${dayOfMonth} ${monthStr} ${
            hours < 10 ? '0' : ''
        }${hours}:${min < 10 ? '0' : ''}${min}`;

    return `${hours < 10 ? '0' : ''}${hours}:${min < 10 ? '0' : ''}${min}`;
};

const convertMonth = (month) => {
    switch (month) {
        case 1:
            return 'Jan';
        case 2:
            return 'Feb';
        case 3:
            return 'Mar';
        case 4:
            return 'Apr';
        case 5:
            return 'May';
        case 6:
            return 'Jun';
        case 7:
            return 'Jul';
        case 8:
            return 'Aug';
        case 9:
            return 'Sept';
        case 10:
            return 'Oct';
        case 11:
            return 'Nov';
        case 12:
            return 'Dec';
    }
};

const formatTimestamp = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
        2,
        '0'
    )}`;
};

const getHours = (string) => {
    const date = new Date(string);
    const hours = date.getHours();
    const mins = date.getMinutes();
    return `${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`;
};

export { formatTime, formatLocalTime, formatTimestamp, getHours };

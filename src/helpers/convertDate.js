const convertDate = (time) => {
    const newTime = new Date(time);
    const vietnamTime = new Date(newTime.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const formattedDate = vietnamTime.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    return formattedDate;
}
export default convertDate;
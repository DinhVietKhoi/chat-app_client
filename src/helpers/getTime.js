 const getTime = (time) => {
    // Chuyển đổi chuỗi thành đối tượng Date
    const dateObject = new Date(time);

    // Lấy số mili giây
     const dateAsNumber = dateObject.getTime();
    return dateAsNumber%2147483647;
}
export default getTime;
const checkActive = (listOnline,idCheck) => {
    if (listOnline && listOnline.length > 0 && idCheck) {
        const check = listOnline.some(onl => onl === idCheck)
        return check;
    }
}
export default checkActive;
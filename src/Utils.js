// format number
export const FormatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
// check phone
export const checkPhone = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
}
// check email
export const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// check status
export const checkOrderStatus = (status) => {
    if (status === 'open') {
        return "Chờ Thanh Toán"
    } else if (status === 'closed') {
        return "Đã Thanh Toán"
    } else {
        return "Đã Hủy"
    }
}
// format date
export const FormatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);

    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const seconds = dateTime.getSeconds().toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const year = dateTime.getFullYear();

    const formattedDateTime = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;

    return formattedDateTime;
}

// format string
export const FormatString = (str) => {
    if (typeof str !== 'string') {
        return str;
    }
    return str.trim().replace(/\s+/g, ' ');
};
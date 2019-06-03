export const datesEqual=(firstDate,secondDate)=>{
    if (!firstDate||!secondDate)
    return false;
    return firstDate.getFullYear() === secondDate.getFullYear()
    && firstDate.getDate() === secondDate.getDate()
    && firstDate.getMonth() === secondDate.getMonth();
}
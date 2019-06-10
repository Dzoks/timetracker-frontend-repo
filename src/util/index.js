export const datesEqual=(firstDate,secondDate)=>{
    if (!firstDate||!secondDate)
    return false;
    return firstDate.getFullYear() === secondDate.getFullYear()
    && firstDate.getDate() === secondDate.getDate()
    && firstDate.getMonth() === secondDate.getMonth();
}

export const userGroups={
    PROJECT_MANAGER:1,
    USER:2,
}
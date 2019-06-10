import {combineReducers} from 'redux';
import ActionType from '../actions/actionTypes';
const authenticationReducer= (user=null,action)=>{

    if (action.type===ActionType.GET_STATE || action.type===ActionType.LOGIN){
        return action.payload;
    }else if (action.type===ActionType.LOGOUT){
        return null;
    }
    return user;
}

const projectsReducer=(projects=[],action)=>{
    if (action.type===ActionType.GET_PROJECTS){
        return action.payload;
    }else if (action.type===ActionType.ADD_PROJECT)
        return [...projects,action.payload];
    else if (action.type===ActionType.DELETE_PROJECT){
        return projects.filter(p=>p.id!==action.payload);
    }else if (action.type===ActionType.FINISH_PROJECT){
        return projects.map(p=>p.id!==action.payload.id?p:{...p,...action.payload,finished:true});
    }else if (action.type===ActionType.EDIT_PROJECT){
        return projects.map(p=>p.id!==action.payload.id?p:{...p,...action.payload});

    }
    return projects;
}

const timesheetReducer=(timesheets=[],action)=>{
    if (action.type===ActionType.GET_TIMESHEETS){
        return action.payload.map(t=>{
            return {
                ...t,
                date:new Date(t.date),
                created:new Date(t.created)
            }
        });
    }else if (action.type===ActionType.ADD_TIMESHEET){
        return [...timesheets,{...action.payload,date:new Date(action.payload.date)}];
    }else if (action.type===ActionType.DELETE_TIMESHEET){
        return timesheets.filter(t=>t.id!==action.payload);
    }
    return timesheets;
}

const selectedDateReducer=(selectedDate=new Date(),action)=>{
    if (action.type===ActionType.SELECT_DATE)
    return action.payload;
    return selectedDate;
}

export const selectedMenuItemReducer=(selectedMenuItem="timesheet",action)=>{
    if (action.type===ActionType.SELECT_MENU){
        return action.payload;
    }
    return selectedMenuItem;
}


export default combineReducers({
    userData:authenticationReducer,
    projects:projectsReducer,
    timesheets:timesheetReducer,
    selectedDate:selectedDateReducer,
    selectedMenuItem:selectedMenuItemReducer
})
import ActionType from './actionTypes';
import axios from 'axios';


export const loginAction = user=> dispatch =>{
    return new Promise((resolve,reject)=>{
        axios.post('hub/user/login',user).then(res=>{
            if (res.status===200 && res.data.authorized){
                dispatch({type:ActionType.LOGIN,payload:res.data.user});
                resolve();
            }
            else {
                dispatch({type:ActionType.LOGIN,payload:res.data.user});
                reject();
            }
        }).catch(err=>reject());
    })
}

export const logoutAction =()=> dispatch =>{
    return new Promise((resolve,reject)=>{
        axios.get('hub/user/logout').then(res=>{
            if (res.status===200 && res.data){
                dispatch({type:ActionType.LOGOUT,payload:res.data});
                resolve();
            }
            else {
                reject();
            }
        }).catch(err=>reject());
    })
}

export const getStateAction = ()=> dispatch=>{
    return new Promise((resolve,reject)=>{
        axios.get('hub/user/state').then(res=>{
            if (res.status===200){
                dispatch({type:ActionType.GET_STATE,payload:res.data.user});
                resolve();
            }else reject();
        }).catch(err=>reject());
    });
    
}

export const getProjects = () => dispatch =>{
    return new Promise ((resolve,reject)=>{
        axios.get('hub/project').then(res=>{
            if (res.status===200){
                dispatch({type:ActionType.GET_PROJECTS,payload:res.data});
                resolve();
            }else{
                reject();
            }
        }).catch(err=> resolve());
    });
}

export const addProject = project =>  dispatch =>{
    return new Promise((resolve,reject)=>{
        axios.post('hub/project',project).then(res=>{
            if (res.status===200){
                dispatch({type:ActionType.ADD_PROJECT,payload:res.data});
                resolve(res);
            }else{
                reject();
            }
        }).catch(err=>reject());
    });
    
}

export const deleteProject= projectId => dispatch=>{
    return new Promise((resolve,reject)=>{
        axios.delete(`hub/project/${projectId}`).then(res=>{
            if (res.status===200 && res.data){
                dispatch({
                    type:ActionType.DELETE_PROJECT,
                    payload:projectId
                });
                resolve();
            }
        }).catch(err=>reject());
    });
}

export const getTimesheets=userId=>dispatch=>{
    return new Promise((resolve,reject)=>{
        axios.get(`hub/timesheet/byUser/${userId}`).then(res=>{
            if (res.status===200){
                dispatch({
                    type:ActionType.GET_TIMESHEETS,
                    payload:res.data
                });
                resolve();
            }else reject();
        }).catch(err=>reject());
    });
}

export const addTimesheet=timesheet=>dispatch=>{
    return new Promise((resolve,reject)=>{
        axios.post("hub/timesheet",timesheet).then(res=>{
            if (res.status===200){
                dispatch({
                    type:ActionType.ADD_TIMESHEET,
                    payload:res.data
                });
                resolve();
            }else reject();
        }).catch(err=>reject());
    });
}

export const deleteTimesheet=timesheetId=>dispatch=>{
    return new Promise((resolve,reject)=>{
        axios.delete(`hub/timesheet/${timesheetId}`).then(res=>{
            if (res.status===200){
                dispatch({
                    type:ActionType.DELETE_TIMESHEET,
                    payload:timesheetId
                });
                resolve();
            }else reject();
        }).catch(err=>reject());
    });
}

export const selectDate=(date)=>{
    return {
        type:ActionType.SELECT_DATE,
        payload:date
    }
}

export const selectMenuItem=key=>{
    return {
        type:ActionType.SELECT_MENU,
        payload:key
    }
}
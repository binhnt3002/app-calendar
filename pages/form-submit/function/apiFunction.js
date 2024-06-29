import { sendRequest } from "../../../utils/sendRequest";

const getCalendarList = (access_token) => {
    let listcalendar = [];
    const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/";
    const headers = {
        'Authorization': `Bearer ${access_token}`
    }

    return sendRequest(url, 'GET', headers, {})
}

const getGroupId = (access_token) => {
    const url = "https://open.larksuite.com/open-apis/im/v1/chats";
    const headers = {
        'Authorization': `Bearer ${access_token}`
    }

    return sendRequest(url, 'GET', headers, {});

}


const createEvent = (access_token,calendarId,data) => {
    const url = `https://open.larksuite.com/open-apis/calendar/v4/calendars/${calendarId}/events`;

    const headers = {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'  
    }

    const body = data;

    return sendRequest(url, 'POST', headers, body);
}


const createInvitation = (access_token,calendarId,eventID,data) => {
    const url = `https://open.larksuite.com/open-apis/calendar/v4/calendars/${calendarId}/events/${eventID}/attendees`;
    const headers = {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'  
    }

    const body = data;

    return sendRequest(url, 'POST', headers, body);
}




export { getCalendarList , createEvent, createInvitation, getGroupId }
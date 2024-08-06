import { sendRequest } from "../../utils/sendRequest";

const appVar = getApp();

const getCalendarList = (access_token) => {
  const url = "https://open.larksuite.com/open-apis/calendar/v4/calendars/";
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  return sendRequest(url, "GET", headers, {});
};

const getCalendar = (access_token, calendar_id) => {
  const url = `https://open.larksuite.com/open-apis/calendar/v4/calendars/${calendar_id}`;
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  return sendRequest(url, "GET", headers, {});
};

const getEvent = (access_token, calendar_id, event_id) => {
  const url = `https://open.larksuite.com/open-apis/calendar/v4/calendars/${calendar_id}/events/${event_id}`;
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  return sendRequest(url, "GET", headers, {});
};

const updateEvent = (access_token, calendar_id, event_id, data) => {
  const url = `https://open.larksuite.com/open-apis/calendar/v4/calendars/${calendar_id}/events/${event_id}`;
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  return sendRequest(url, "PATCH", headers, data);
};

const getGroupId = (access_token) => {
  const url = "https://open.larksuite.com/open-apis/im/v1/chats";
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  return sendRequest(url, "GET", headers, {});
};

const createEvent = (access_token, calendarId, data) => {
  const url = `https://open.larksuite.com/open-apis/calendar/v4/calendars/${calendarId}/events`;

  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  const body = data;

  return sendRequest(url, "POST", headers, body);
};

const createInvitation = (access_token, calendarId, eventID, data) => {
  const url = `https://open.larksuite.com/open-apis/calendar/v4/calendars/${calendarId}/events/${eventID}/attendees`;
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  const body = data;

  return sendRequest(url, "POST", headers, body);
};

const createRecord = (access_token, data,tableId) => {
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${appVar.GlobalConfig.baseId}/tables/${tableId}/records`;
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  const body = data;

  return sendRequest(url, "POST", headers, body);
};

const searchRecord = (access_token, data,tableId) => {
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${appVar.GlobalConfig.baseId}/tables/${tableId}/records/search`;
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  const body = data;

  return sendRequest(url, "POST", headers, body);
};

const updateRecord = (access_token, data,tableId,recordId) => {
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${appVar.GlobalConfig.baseId}/tables/${tableId}/records/${recordId}`;
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  const body = {
    ...data,
  };

  return sendRequest(url, "PUT", headers, body);
};

const getAllTableName = (access_token) => {
  const url = `https://open.larksuite.com/open-apis/bitable/v1/apps/${appVar.GlobalConfig.baseId2}/tables`;
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };
  return sendRequest(url, "GET", headers, {});
};

export {
  getCalendarList,
  createEvent,
  createInvitation,
  getGroupId,
  createRecord,
  getEvent,
  updateEvent,
  searchRecord,
  getCalendar,
  updateRecord,
  getAllTableName
};

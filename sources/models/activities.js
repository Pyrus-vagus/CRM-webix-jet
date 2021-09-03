const saveDate = webix.Date.dateToStr("%Y-%m-%d");
const getTime = webix.Date.strToDate("%H:%i");
const saveTime = webix.Date.dateToStr("%H:%i");
export const activities = new webix.DataCollection({
  url: "http://localhost:8096/api/v1/activities/",
  save: "rest->http://localhost:8096/api/v1/activities/",
  scheme: {
    $init: (obj) => {
      obj.DueDate = new Date(obj.DueDate);
      obj.Time = getTime(obj.DueDate);
    },
    $save: (obj) => {
      obj.DueDate = `${saveDate(obj.DueDate)} ${saveTime(obj.Time)}`;
    },
  },
});

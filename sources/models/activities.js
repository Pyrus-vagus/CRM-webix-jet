const saveDate = webix.Date.dateToStr("%Y-%m-%d");
const getTime = webix.Date.strToDate("%H:%i");
const saveTime = webix.Date.dateToStr("%H:%i");
const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (o) => {
			o.DueDate = new Date(o.DueDate);
			o.Time = getTime(o.DueDate);
		},
		$save: (o) => {
			o.DueDate = `${saveDate(o.DueDate)} ${saveTime(o.Time)}`;
		}
	}
});

export default activities;

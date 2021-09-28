const saveDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (o) => {
			o.FullName = `${o.FirstName} ${o.LastName}`;
			o.Birthday = new Date(o.Birthday);
			o.Birthday = webix.i18n.longDateFormatStr(o.Birthday);
			o.StartDate = new Date(o.StartDate);
		},
		$save: (o) => {
			o.Birthday = saveDate(o.Birthday);
			o.StartDate = saveDate(o.StartDate);
		}
	}
});

export default contacts;

const saveDate = webix.Date.dateToStr("%Y-%m-%d %h:%i");
export const contacts = new webix.DataCollection({
  url: "http://localhost:8096/api/v1/contacts/",
  save: "rest->http://localhost:8096/api/v1/contacts/",
  scheme: {
    $init: (obj) => {
      obj.FullName = `${obj.FirstName} ${obj.LastName}`;
      obj.Birthday = new Date(obj.Birthday);
      obj.Birthday = webix.i18n.longDateFormatStr(obj.Birthday);
      obj.StartDate = new Date(obj.StartDate);
    },
    $save: (obj) => {
      obj.Birthday = saveDate(obj.Birthday);
      obj.StartDate = saveDate(obj.StartDate);
    },
  },
});

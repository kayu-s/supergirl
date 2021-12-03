import { generateDates, getElement, paddingZero } from "../commons";

export const setTeleworkInputs = (): void => {
  chrome.storage.sync.get(
    {
      startTime: "2014-08-18T09:00:00",
      endTime: "2014-08-18T17:30:00",
      internalAccess: 0,
      device: 3,
      workDetail: "クラウド環境を用いたWebアプリケーションの開発",
      reason: 8,
      contact: 2,
      phoneNumber: "",
      remark: "土日祝除く",
    },
    (items) => {
      const startTime = new Date(items.startTime);
      const endTime = new Date(items.endTime);
      getElement("gi1_4STH").value = String(startTime.getHours());
      getElement("gi1_4STM").value = String(startTime.getMinutes());
      getElement("gi1_4ETH").value = String(endTime.getHours());
      getElement("gi1_4ETM").value = String(endTime.getMinutes());
      getElement("gi3_6").value = items.internalAccess;
      getElement("gi4_7").value = items.device;
      getElement("gi5_8").value = items.workDetail;
      getElement("gi6_15").value = items.reason;
      getElement("gi7_9").value = items.contact;
      getElement("gi8_10").value = items.phoneNumber;
      getElement("gi9_12").value = items.remark;
      const date = generateDates();
      const month = date.getMonth() + 1;
      getElement("sdate_date_mm").value = paddingZero(month);
      getElement("sdate_date_dd").value = "01";
      getElement("edate_date_yyyy").value = date.getFullYear().toString();
      getElement("edate_date_mm").value = paddingZero(month);
      getElement("edate_date_dd").value = paddingZero(date.getDate());
    }
  );
};

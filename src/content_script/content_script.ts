import * as distributer from "./app_script";
import { setTeleworkInputs } from "./funcs/telework";
import { famSignIn, msSignIn } from "./funcs/fam";
import { SaturnDatabase } from "../database/Company";
import { mode } from "../types/fam";
import { paddingZero, suppressZero } from "./commons";
import { mappingWorkPlaces, workPlaces } from "../types/register";
const handleCompanyFunc = () => {
  switch (sn.value) {
    case "root.cws.shuro.application.srw_app_gi02":
      console.log("在宅勤務申請");
      setTeleworkInputs();
      break;
    case "root.cws.shuro.personal.term_kinmu_input":
      console.log("勤怠入力");
      const target_date = document.getElementById("HD");
      if (target_date) {
        console.log("勤怠入力（個別）");
        if (localStorage.getItem("autoMode") === "false") return;
        if (!target_date.textContent) return;
        const yearMonthDate = target_date.textContent.match(/[0-9]+/g);
        if (!yearMonthDate) return;
        const key =
          yearMonthDate[0] +
          paddingZero(Number(yearMonthDate[1])) +
          paddingZero(Number(yearMonthDate[2]));

        const db = new SaturnDatabase();

        const data = db.workTime.where("id").equals(key!);
        data.each(async (data) => {
          if (data.beginTime) {
            const beginElm = await getElementById("KNMTMRNGSTH");
            await setValue(
              beginElm,
              suppressZero(data.beginTime.split(":")[0]!)
            );
            const endElm = await getElementById("KNMTMRNGSTM");
            await setValue(endElm, suppressZero(data.beginTime.split(":")[1]!));
          }

          if (data.endTime) {
            const beginElm = await getElementById("KNMTMRNGETH");
            await setValue(beginElm, suppressZero(data.endTime.split(":")[0]!));
            const endElm = await getElementById("KNMTMRNGETM");
            await setValue(endElm, suppressZero(data.endTime.split(":")[1]!));
          }

          if (data.workPlace) {
            const workPlaceElm = await getElementByQuerySelector(
              "select[name='GI_COMBOBOX13_Seq0S']"
            );
            await setValue(
              workPlaceElm,
              mappingWorkPlaces[data.workPlace as workPlaces].toString()
            );
          }

          if (data.report) {
            const reportElm = await getElementByQuerySelector("#JSKM textarea");
            await setValue(reportElm, data.report.toString());
          }

          if (data.costNumber1 || data.costNumber2) {
            const deleteCostNumberElms = await getDeleteCostNumbersElm();
            await deleteCostNumbers(deleteCostNumberElms);

            data.costNumber1 &&
              (await setCostNumber(
                "COLLECT_ID_PRJ_CD_WIDGET_KEY",
                data.costNumber1,
                data.hourOfCostNumber1 ?? 0,
                data.minuteOfCostNumber1 ?? 0,
                0
              ));
            data.costNumber2 &&
              (await setCostNumber(
                "COLLECT_ID_PRJ_CD_WIDGET_KEY",
                data.costNumber2,
                data.hourOfCostNumber2 ?? 0,
                data.minuteOfCostNumber2 ?? 0,
                1
              ));
          }
        });

        const setCostNumber = async (
          id: string,
          costNumber: string,
          hour: number,
          minute: number,
          index: number
        ) => {
          // 検索欄に登録番号入力
          const searchInputElm = await getElementById(id);
          await setValue(searchInputElm, costNumber);

          // 登録番号検索実行
          const searchElement: any = await getElementByQuerySelector(
            "input[value='検索実行']"
          );

          await wait(1000);

          await clickElement(searchElement);

          await wait(1000);

          const checkElm: any = await getElementById(
            "SEARCHED_LIST_WIDGET_KEY_0"
          );

          await clickElement(checkElm);

          await wait(1000);

          const addCostNumberElement: any = await getElementByQuerySelector(
            "input[value='↓編集欄に追加する']"
          );

          await clickElement(addCostNumberElement);

          await wait(1000);

          const hourElm: any = await getElementById(
            `PmDdEntryTimeInputWidget_${index}H`
          );
          const minuteElm: any = await getElementById(
            `PmDdEntryTimeInputWidget_${index}M`
          );

          await setValue(hourElm, hour.toString());
          await setValue(minuteElm, minute.toString());
          return new Promise((resolve) => {
            return resolve(true);
          });
        };

        const getDeleteCostNumbersElm = async () => {
          return new Promise((resolve) => {
            const deleteButtons: any =
              document.querySelectorAll(".PmEventSpan");
            return resolve(deleteButtons);
          });
        };

        const deleteCostNumbers = async (deleteButtons: any) => {
          return new Promise((resolve) => {
            deleteButtons.forEach((e: any) => {
              if (e.textContent === "削除") {
                e.click();
              }
            });
            return resolve(true);
          });
        };

        const wait = async (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        const setValue = (element: any, value: string) => {
          return new Promise((resolve) => {
            element.value = value;
            return resolve(true);
          });
        };

        const getElementByQuerySelectorAll = (query: string) => {
          return new Promise((resolve) => {
            const element: any = document.querySelectorAll(query);
            return resolve(element);
          });
        };

        const getElementByQuerySelector = (query: string) => {
          return new Promise((resolve) => {
            const element: HTMLInputElement = <HTMLInputElement>(
              document.querySelector(query)
            );
            return resolve(element);
          });
        };
        const getElementById = (id: string) => {
          return new Promise((resolve) => {
            const element: HTMLInputElement = <HTMLInputElement>(
              document.getElementById(id)
            );
            return resolve(element);
          });
        };

        const clickElement = (element: HTMLInputElement) => {
          return new Promise((resolve) => {
            element.click();
            return resolve(true);
          });
        };
      } else if (target_date === null) {
        console.log("勤怠入力（一覧）");
        distributer.workTimeInput();
      }
      break;
    case "root.cws.shuro.boss.matrix_daily_check":
      console.log("日次承認");
      // chrome.storage.sync.get(isApproveConfirm, (items) => {
      //   console.log(items.isApproveConfirm);
      //   items.isApproveConfirm && approveConfirm();
      // });
      break;
    default:
      console.log(`Un supported page. @SN: ${sn.value}`);
  }
};

const sn: HTMLInputElement = <HTMLInputElement>(
  document.querySelector("input[name='@SN']")
);

if (sn) handleCompanyFunc();

const url = location.href;
if (url.match("/.*famoffice.*/")) {
  chrome.storage.local.get(mode, (item) => {
    if (item.famSignInMode) famSignIn(url);
    return;
  });
}

if (url.match("/.*0f0d6287-57b1-4cc0-a00b-921260add3a0.*/")) {
  chrome.storage.local.get(mode, (item) => {
    if (item.famSignInMode) msSignIn();
  });
}

import "jspreadsheet-ce/dist/jspreadsheet.css";
import "jsuites/dist/jsuites.css";
import * as React from "react";
import { Fragment, useEffect, useRef, useState } from "react";
import jspreadsheet, {
  Column,
  JSpreadsheetElement,
  Options,
} from "jspreadsheet-ce";
import { Button, Grid, Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import SaveIcon from "@mui/icons-material/Save";
import CachedIcon from "@mui/icons-material/Cached";

import { SaturnDatabase } from "../../database/Company";
import LoadingButton from "@mui/lab/LoadingButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { mappingWorkPlaces } from "../../types/register";
import { paddingZero } from "../commons";
import { styled } from "@mui/system";

const CustomizedGrid = styled(Grid)`
  .jexcel_filter {
    height: 0;
    position: relative;
    top: -40px;
    right: -5px;
  }
`;

const rawYearMonth = document
  .querySelector("#APPROVALGRD tr:nth-child(2) td:nth-child(3) input")
  ?.getAttribute("name")
  ?.replace("BTNDTL", "")!;

const year = rawYearMonth && rawYearMonth.split("_")[0];
const month = rawYearMonth && paddingZero(Number(rawYearMonth.split("_")[1]));

const db = new SaturnDatabase();

const defaultTable: HTMLTableElement = document.getElementById(
  "APPROVALGRD"
) as HTMLTableElement;

// T
const tableToSheet = async (table: HTMLTableElement) => {
  const data: any = await getDataFromDB();
  if (!data) return;
  const array1: any = [
    [
      "月/日",
      "曜",
      "実行(種別)",
      "開始",
      "終了",
      "在宅/外出実績",
      "登録番号1",
      "実績(時間)1",
      "実績(分)1",
      "登録番号2",
      "実績(時間)2",
      "実績(分)2",
      "報告",
    ],
  ];

  Array.from(table.rows).forEach((row, rowIndex) => {
    if (rowIndex > table.rows.length - 3 || rowIndex === 0) return;
    const array2: any = [];
    Array.from(row.cells).forEach((col, colIndex) => {
      // After 4 columns, input DB data.
      if (colIndex === 2 || colIndex >= 4) return;
      array2.push(col.textContent);
    });
    const i = rowIndex - 1;
    if (data[i]) {
      array2.push(
        data[i].beginTime,
        data[i].endTime,
        data[i].workPlace,
        data[i].costNumber1,
        data[i].hourOfCostNumber1,
        data[i].minuteOfCostNumber1,
        data[i].costNumber2,
        data[i].hourOfCostNumber2,
        data[i].minuteOfCostNumber2,
        data[i].report
      );
    } else if (row.cells[3].textContent !== "休日") {
      array2.push("9:00", "17:30", "終日在宅（通勤出社なし）");
    }
    array1.push(array2);
  });
  return array1;
};

const getDataFromDB = async () => {
  if (!month) return;
  await db.open();
  const currentMonthData = await db.workTime
    .where({ yearMonth: year + month })
    .sortBy("yearMonth");
  await db.close();
  return new Promise((resolve) => {
    return resolve(currentMonthData);
  });
};

const data = await tableToSheet(defaultTable);
const headers = data && data.shift();
const columns: Column[] =
  headers &&
  headers.map((col: string, i: number) => {
    return {
      title: col,
      type: i === 5 && "dropdown",
      width:
        (i === 5 && 180) ||
        (i === 1 && 40) ||
        ([7, 8, 10, 11].includes(i) && 80),
      source: i === 5 && Object.keys(mappingWorkPlaces),
      align: i === 5 && "left",
      readOnly: i >= 3 ? false : true,
    };
  }); // FIXME: `Cannot read properties of undefined` in personnel page.

const options: Options = {
  defaultColWidth: 112,
  columns: columns,
  data: data,
  search: true,
  allowDeleteColumn: false,
  allowDeleteRow: false,
  allowInsertColumn: false,
  allowInsertRow: false,
  allowComments: true,
  csvFileName: `勤怠_${year}${month}`,
  columnSorting: false,
};

// options.columns!.push({ title: "登録", type: "checkbox" });
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export const EditableTable = () => {
  const ref: any = useRef(null);
  const [element, setElement] = useState<JSpreadsheetElement | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [autoMode, setAutoMode] = useState(
    localStorage.getItem("autoMode") === "true" ? true : false
  );

  useEffect(() => {
    if (!ref.current!.jspreadsheet) {
      setElement(jspreadsheet(ref.current, options));
    }
  }, [options]);

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoMode(e.target.checked);
    localStorage.setItem("autoMode", e.target.checked.toString());
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSave = () => {
    setLoading(true);
    setOpen(true);
    const data = element?.getData();

    data?.forEach(async (e) => {
      const data = e.map((e) => e.toString() || "");

      // change delimiter
      const rawMonthDate = data[0].toString().trim();
      // remove text like "[祝日]"
      const excludeHolidayText = rawMonthDate.match(/(.*)(?=\[)/);
      const monthDate = excludeHolidayText
        ? excludeHolidayText[0].trim()
        : rawMonthDate;
      const date = paddingZero(Number(monthDate.match(/(?<=\/).*/)));
      console.log("date", date, "monthDate", monthDate);
      await db.open();
      // Fixme: Dependency with index order
      await db.workTime.put({
        id: year + month + date,
        yearMonth: year + month,
        beginTime: data[3],
        endTime: data[4],
        workPlace: data[5],
        costNumber1: data[6],
        hourOfCostNumber1: Number(data[7]),
        minuteOfCostNumber1: Number(data[8]),
        costNumber2: data[9],
        hourOfCostNumber2: Number(data[10]),
        minuteOfCostNumber2: Number(data[11]),
        report: data[12],
      });
      await db.close();
      setLoading(false);
    });
  };

  const handleApply = () => {
    const startTimes: string[] = [];
    const endTimes: string[] = [];
    Array.from(defaultTable.rows).forEach((row, rowIndex) => {
      if (rowIndex > defaultTable.rows.length - 3 || rowIndex === 0) return;
      Array.from(row.cells).forEach((col, colIndex) => {
        if (colIndex !== 4) return;
        const currentWorkTimes = col.textContent!.split(" ～ ");
        startTimes.push(
          currentWorkTimes[0] === "00:00" ? "" : currentWorkTimes[0]
        );
        endTimes.push(
          currentWorkTimes[1] === "00:00" ? "" : currentWorkTimes[1]
        );
      });
    });
    console.log(startTimes);
    element?.setColumnData(3, startTimes);
    element?.setColumnData(4, endTimes);
  };

  return (
    <Fragment>
      <FormControl component="fieldset" variant="standard">
        <FormGroup>
          <FormControlLabel
            sx={{ position: "relative", top: 6 }}
            control={
              <Switch
                checked={autoMode}
                onChange={handleModeChange}
                name="auto-input"
              />
            }
            label="自動入力"
          />
        </FormGroup>
      </FormControl>
      <LoadingButton
        sx={{ height: "30px", margin: "8px 5px" }}
        color="primary"
        onClick={handleSave}
        loading={loading}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
      >
        保存
      </LoadingButton>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          保存されました🤗
        </Alert>
      </Snackbar>
      <Button
        startIcon={<CachedIcon />}
        sx={{ height: "30px", margin: "8px 5px" }}
        variant="contained"
        color="primary"
        onClick={handleApply}
      >
        開始・終了を反映
      </Button>
      <Button
        startIcon={<FileDownloadIcon />}
        sx={{ height: "30px", margin: "8px 5px" }}
        variant="contained"
        color="primary"
        onClick={() => element?.download(true)}
      >
        CSV出力
      </Button>
      <CustomizedGrid item xs={12}>
        <div ref={ref} />
      </CustomizedGrid>
    </Fragment>
  );
};

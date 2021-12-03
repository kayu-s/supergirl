import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { TimePicker, LocalizationProvider } from "@mui/lab";
import React, { useState, useEffect } from "react";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { MuiButtonAlert } from "../../components/atoms/MuiButtonAlert";
import * as Types from "../../types/options";
import { CustomizedContainer } from "../../components/atoms/CustomizedContainer";

export const Telework = () => {
  useEffect(() => {
    restoreOptions();
  }, []);

  const internalAccesses: Types.InternalAccess[] = [
    "----",
    "Splashtop",
    "シンクライアント",
    "その他",
  ];
  const devices: Types.Device[] = [
    "----",
    "会社貸与PC",
    "会社貸与タブレット",
    "個人所有PC",
    "個人所有タブレット",
  ];
  const contacts: Types.Contact[] = [
    "----",
    "会社携帯",
    "個人携帯",
    "自宅固定電話",
    "個人携帯（ＢＹＯＤ）",
    "ＢＰ社連絡先",
  ];
  const [startTime, setStartTime] = useState<Date | null>(
    new Date("2014-08-18T09:00:00")
  );
  const [endTime, setEndTime] = useState<Date | null>(
    new Date("2022-08-18T17:30:00")
  );
  const [internalAccess, setInternalAccess] = useState("");
  const [device, setDevice] = useState("");
  const [workDetail, setWorkDetail] = useState("");
  const [contact, setContact] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [remark, setRemark] = useState("");

  const restoreOptions = () => {
    chrome.storage.sync.get(
      [
        "startTime",
        "endTime",
        "internalAccess",
        "device",
        "workDetail",
        "contact",
        "phoneNumber",
        "remark",
      ],
      (items) => {
        setStartTime(new Date(items.startTime));
        setEndTime(new Date(items.endTime));
        setInternalAccess(items.internalAccess);
        setDevice(items.device);
        setWorkDetail(items.workDetail);
        setContact(items.contact);
        setPhoneNumber(items.phoneNumber);
        setRemark(items.remark);
      }
    );
  };

  const getDateString = (pickedDate: Date | null): string => {
    const paddingDate = (date: number) => {
      return ("0" + date).slice(-2);
    };
    return `2014-01-01T${paddingDate(pickedDate!.getHours())}:${paddingDate(
      pickedDate!.getMinutes()
    )}:${paddingDate(pickedDate!.getSeconds())}`;
  };

  const syncParams = {
    startTime: getDateString(startTime),
    endTime: getDateString(endTime),
    internalAccess: internalAccess,
    device: device,
    workDetail: workDetail,
    contact: contact,
    phoneNumber: phoneNumber,
    remark: remark,
  };

  return (
    <CustomizedContainer maxWidth="md">
      <Typography variant="h3" gutterBottom>
        在宅勤務申請
      </Typography>
      <Grid container spacing={4} sx={{ marginBottom: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid item xs>
            <TimePicker
              label="開始時間"
              renderInput={(params) => (
                <TextField variant="standard" {...params} />
              )}
              value={startTime}
              minutesStep={5}
              onChange={(e) => setStartTime(e as MaterialUiPickersDate)}
            />
          </Grid>
          <Grid item xs>
            <TimePicker
              label="終了時間"
              value={endTime}
              minutesStep={5}
              onChange={(e) => setEndTime(e as MaterialUiPickersDate)}
              renderInput={(params) => (
                <TextField variant="standard" {...params} />
              )}
            />
          </Grid>
        </LocalizationProvider>
      </Grid>
      <Grid container spacing={4} sx={{ marginBottom: 2 }}>
        <Grid item xs>
          <InputLabel id="label-internal-access">社内アクセス方法</InputLabel>
          <Select
            variant="standard"
            fullWidth
            labelId="label-internal-access"
            value={internalAccess}
            onChange={(e) => setInternalAccess(e.target.value as string)}
          >
            {internalAccesses.map((v, i) => (
              <MenuItem value={i}>{v}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs>
          <InputLabel id="label-use-device">使用機器</InputLabel>
          <Select
            variant="standard"
            fullWidth
            labelId="label-use-device"
            value={device}
            onChange={(e) => setDevice(e.target.value as string)}
          >
            {devices.map((v, i) => (
              <MenuItem value={i}>{v}</MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ marginBottom: 2 }}>
        <Grid item xs>
          <InputLabel id="label-contact">連絡先種別</InputLabel>
          <Select
            variant="standard"
            fullWidth
            labelId="label-contact"
            value={contact}
            onChange={(e) => setContact(e.target.value as string)}
          >
            {contacts.map((v, i) => (
              <MenuItem value={i}>{v}</MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs>
          <InputLabel id="label-phone-number">連絡先</InputLabel>
          <TextField
            id="label-phone-number"
            variant="standard"
            value={phoneNumber}
            placeholder="03-1234-5678"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} sx={{ marginBottom: 2 }}>
        <Grid item xs>
          <TextField
            label="業務内容"
            rows={4}
            multiline
            fullWidth
            value={workDetail}
            variant="outlined"
            placeholder="クラウド環境を用いたWebアプリケーションの開発"
            onChange={(e) => setWorkDetail(e.target.value)}
          />
        </Grid>
        <Grid item xs>
          <TextField
            label="備考"
            rows={4}
            multiline
            fullWidth
            value={remark}
            variant="outlined"
            placeholder="土日祝は除く"
            onChange={(e) => setRemark(e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs>
          <MuiButtonAlert syncParams={syncParams} />
        </Grid>
      </Grid>
    </CustomizedContainer>
  );
};

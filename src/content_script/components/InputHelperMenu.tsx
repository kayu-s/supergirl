import { connect } from "react-redux";
import React, { useEffect } from "react";
import MuiSwitch from "../../components/atoms/MuiSwitch";
import { EditableTable } from "./EditableTable";
import { RootState } from "../store/store";
import { Button, Grid, Badge } from "@mui/material";
import { RegisterModule } from "../store/modules/register-module";
import MuiEditSwitch from "../../components/atoms/MuiEditSwitch";

type Props = {
  mode: boolean;
  checkCount: number;
};

export function InputHelperMenu({ mode, checkCount }: Props) {
  const defaultTable: HTMLTableElement = document.getElementById(
    "APPROVALGRD"
  ) as HTMLTableElement;
  defaultTable.style.display = mode ? "none" : "table";

  return (
    <Grid container>
      <Grid>
        <MuiEditSwitch
          prevLabel="Default Mode"
          nextLabel="Editable Mode"
          dispatchEvent={RegisterModule.actions.changeTableMode}
          checked={mode}
        />
      </Grid>
      {mode && (
        <>
          <EditableTable />
        </>
      )}
    </Grid>
  );
}

const mapStateToProps = (state: RootState): Props => ({
  mode: state.register.mode,
  checkCount: state.register.checkCount,
});

export default connect(mapStateToProps)(InputHelperMenu);

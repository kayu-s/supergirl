import { getDefaultMiddleware, configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { OptionsModule } from "./modules/options-module";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./root-saga";

export const reducer = combineReducers({
  option: OptionsModule.reducer,
});

export type RootState = ReturnType<typeof reducer>;

const setupStore = () => {
  // Todo: fix depreciated
  const starterKitMiddleware = getDefaultMiddleware({ thunk: false });
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware, ...starterKitMiddleware];
  const store = configureStore({ reducer, middleware });
  sagaMiddleware.run(rootSaga);
  return store;
};

export const store = setupStore();

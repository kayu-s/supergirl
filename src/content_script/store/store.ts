import { getDefaultMiddleware, configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { RegisterModule } from "./modules/register-module";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./root-saga"

export const reducer = combineReducers({
    register: RegisterModule.reducer
});

export type RootState = ReturnType<typeof reducer>;

const setupStore = () => {
    // Todo: depreciated
    const starterKitMiddleware = getDefaultMiddleware({thunk: false})
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [sagaMiddleware, ...starterKitMiddleware];
    const store = configureStore({ reducer, middleware });
    sagaMiddleware.run(rootSaga);
    return store;
}

export const store = setupStore();
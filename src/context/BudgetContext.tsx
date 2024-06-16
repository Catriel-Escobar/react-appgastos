import { useReducer, createContext, Dispatch, ReactNode, useMemo } from "react";
import {
  BudgetActions,
  BudgetState,
  budgetReducer,
  inititalState,
} from "../reducers/budget-reducer";

type BudgetContextProps = {
  state: BudgetState;
  dispatch: Dispatch<BudgetActions>;
  totalGastado: number;
  saldoDisponible: number;
};

type BudgetProviderProps = {
  children: ReactNode;
};

export const BudgetContext = createContext<BudgetContextProps>(
  {} as BudgetContextProps
);

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const [state, dispatch] = useReducer(budgetReducer, inititalState);

  const totalGastado = useMemo(
    () => state.expenses.reduce((total, expense) => expense.amount + total, 0),
    [state.expenses]
  );
  const saldoDisponible = state.budget - totalGastado;
  return (
    <BudgetContext.Provider
      value={{
        state,
        dispatch,
        totalGastado,
        saldoDisponible,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

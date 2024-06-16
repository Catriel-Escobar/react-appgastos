import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useBudget } from "../hooks/useBudget";
import AmountDisplay from "./AmountDisplay";

export default function BudgetTracker() {
  const { state, totalGastado, saldoDisponible, dispatch } = useBudget();

  const porcentaje = +((totalGastado / state.budget) * 100).toFixed(2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="flex justify-center">
        <CircularProgressbar
          value={porcentaje}
          styles={buildStyles({
            pathColor: porcentaje === 100 ? "#DC2626" : "#3b82f6",
            trailColor: "#f5f5f5",
            textSize: 8,
            textColor: porcentaje === 100 ? "#DC2626" : "#3b82f6",
          })}
          text={`${porcentaje}% Gastado`}
        />
      </div>
      <div className="flex flex-col justify-center items-center gap-8">
        <button
          type="button"
          className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
          onClick={() => dispatch({ type: "reset-app" })}
        >
          Resetear app
        </button>
        <AmountDisplay label="Presupuesto" amount={state.budget} />
        <AmountDisplay label="Disponible" amount={saldoDisponible} />
        <AmountDisplay label="Gastado" amount={totalGastado} />
      </div>
    </div>
  );
}

import { categories } from "./data/categories";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import "react-date-picker/dist/DatePicker.css";
import { ChangeEvent, useEffect, useState } from "react";
import { DraftExpense, Value } from "../type";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date(),
  });
  const [error, setError] = useState("");
  const { dispatch, state, saldoDisponible } = useBudget();
  const [saldoAnterior, setSaldoAnterior] = useState(0);

  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter(
        (expense) => expense.id === state.editingId
      )[0];
      setSaldoAnterior(editingExpense.amount);
      setExpense(editingExpense);
    }
  }, [state.editingId]);

  //!handle change para los input
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isAmountField = ["amount"].includes(name);

    setExpense({
      ...expense,
      [name]: isAmountField ? Number(value) : value,
    });
  };

  //! handle change para el calendario
  const handleChangeDay = (value: Value) => {
    setExpense({
      ...expense,
      date: value,
    });
  };

  //? handle submit para guardar los datos.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(expense).includes("") || expense.amount == 0) {
      console.log("Error");
      setError("Todos los campos son obligatorios");
      return;
    }
    if (expense.amount - saldoAnterior > saldoDisponible) {
      setError("Estas  gastando mas de lo que tenes disponible");
      return;
    }
    if (state.editingId) {
      dispatch({
        type: "update-expense",
        payload: {
          expense: { id: state.editingId, ...expense },
        },
      });
      setExpense({
        amount: 0,
        expenseName: "",
        category: "",
        date: new Date(),
      });
      setSaldoAnterior(0);
    } else {
      dispatch({ type: "add-expense", payload: { expense } });
      setExpense({
        amount: 0,
        expenseName: "",
        category: "",
        date: new Date(),
      });
      setSaldoAnterior(0);
    }

    //reiniciar el state
  };
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
        {state.editingId ? "Actualizar Gasto" : "Nuevo Gasto"}
      </legend>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div className="flex flex-col gap-2">
        <label htmlFor="expenseName" className="text-xl">
          Nombre gasto:
        </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Add el Nombre del gasto"
          className="bg-slate-100 p-2"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Cantidad:
        </label>
        <input
          type="number"
          id="amount"
          placeholder="Add Cantidad del gasto, ej: 300"
          className="bg-slate-100 p-2"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-xl">
          Categoria:
        </label>
        <select
          id="category"
          className="bg-slate-100 p-2"
          name="category"
          value={expense.category}
          onChange={handleChange}
        >
          <option value=""> --- Seleccione ---</option>
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="text-xl">
          Fecha Gasto :
        </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          value={expense.date}
          onChange={handleChangeDay}
        />
      </div>
      <input
        type="submit"
        className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
        value={state.editingId ? "Actualizar Gasto" : "Registrar gasto"}
      />
    </form>
  );
}

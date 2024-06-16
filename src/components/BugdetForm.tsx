import { useMemo, useState } from "react";
import { useBudget } from "../hooks/useBudget";
const BugdetForm = () => {
  const [budget, setBudget] = useState(0);
  const { dispatch } = useBudget();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(e.target.valueAsNumber);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("definit presupuesto");
    dispatch({ type: "add-budget", payload: { budget } });
  };

  const isValid = useMemo(() => {
    return isNaN(budget) || budget <= 0;
  }, [budget]);

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-5">
        <label
          htmlFor="budget"
          className="text-4xl text-blue-600 font-bold text-center"
        >
          Definir Presupuesto
        </label>
        <input
          type="number"
          id="budget"
          className="w-full bg-white border border-gray-200 p-2"
          placeholder="Define tu presupuesto"
          name="budget"
          value={budget}
          onChange={handleChange}
        />

        <input
          type="submit"
          value={"Definir Presupuesto"}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-black uppercase disabled:opacity-40 disabled:hover:bg-blue-600"
          disabled={isValid}
        />
      </div>
    </form>
  );
};

export default BugdetForm;

import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Celular: React.FC = () => {
  const [phone, setPhone] = useState<string>(""); // Estado para capturar el número
  const [displayedPhone, setDisplayedPhone] = useState<string>(""); // Estado para mostrar el número

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Previene la recarga del formulario
    setDisplayedPhone(phone); // Actualiza el estado para mostrar el número
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-6 p-6 bg-white rounded-lg shadow-lg w-full max-w-[500px] items-center mx-auto'
    >
      <PhoneInput
        country={"ar"} // Argentina como predeterminado
        value={phone}
        onChange={setPhone}
        inputProps={{
          name: "phone",
          required: true,
        }}
        containerStyle={{ width: "100%" }}
        inputStyle={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "8px",
          border: "1px solid #801FC6",
        }}
        buttonStyle={{
          borderRadius: "8px 0 0 8px",
        }}
      />

      <button
        type='submit'
        className='w-full px-10 py-4 text-lg font-bold text-white transition-transform duration-300 bg-red-600 rounded-lg hover:bg-red-700 hover:scale-105'
      >
        Mostrar Número
      </button>

      {/* Muestra el número ingresado */}
      {displayedPhone && (
        <p className='mt-4 text-lg font-medium text-gray-800'>
          Número ingresado: {displayedPhone}
        </p>
      )}
    </form>
  );
};

export default Celular;

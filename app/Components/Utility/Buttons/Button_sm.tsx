import React from "react";

type ButtonSmProps = {
  active: boolean;
  execute: () => void;
  label?: string;
};

const Button_sm: React.FC<ButtonSmProps> = ({ active, execute, label = "Toggle" }) => {
  return (
    <button
    className='font-archivo bg-red-400'
      type="button"
      onClick={() => execute()}
      style={{
        padding: "10px 18px",
        borderRadius: "999px",
        // border: "1px solid",
        borderColor: active ? "#2563eb" : "#9ca3af",
        backgroundColor: active ? "#eff6ff" : "#f3f4f6",
        color: active ? "#000000" : "#374151",
        cursor: "pointer",
        transition: "all 150ms ease",
      }}
      aria-pressed={active}
    >
      {label}
    </button>
  );
};

export default Button_sm;

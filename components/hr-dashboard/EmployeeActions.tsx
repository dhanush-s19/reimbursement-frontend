"use client";

import React from "react";
import Button from "../ui/Button";

interface Props {
  onAdd: () => void;
}

function EmployeeActions({ onAdd }: Readonly<Props>) {
  const handleAdd = () => {
    onAdd();
  };

  return (
    <Button
      variant="secondary"
      type="button"
      onClick={handleAdd}
      className="text-white px-4 py-2 rounded-lg hover:bg-gray transition"
    >
      Add Employee
    </Button>
  );
}

export default React.memo(EmployeeActions);

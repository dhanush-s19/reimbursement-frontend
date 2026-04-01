import { Upload } from "lucide-react";
import Button from "../ui/Button";
import { Reimbursement } from "@/types/reimbursement";

interface ActionCellProps {
  row: Reimbursement;
  onSelect: (row: Reimbursement) => void;
}

const ActionCell = ({ row, onSelect }: ActionCellProps) => {
  if (row.type === "CERTIFICATE" && row.status === "HR_APPROVED") {
    return (
      <Button
        size="sm"
        variant="secondary"
        className="text-[11px] h-8 px-3 rounded-xl  hover:bg-gray-700 text-white border-none"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(row);
        }}
      >
        <Upload size={12} className="mr-1" /> Complete
      </Button>
    );
  }
  return <span className="text-gray-300 text-xs italic">No action</span>;
};

export default ActionCell;

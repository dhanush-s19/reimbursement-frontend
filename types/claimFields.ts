export const CLAIM_FIELDS = [
  { name: "title", label: "Expense Title", type: "text", placeholder: "e.g. Travel Expenses", gridCols: 2 },
  { name: "amount", label: "Amount", type: "number", placeholder: "0.00", gridCols: 1 },
  { name: "description", label: "Description", type: "textarea", placeholder: "Provide context...", gridCols: 2 },
  { name: "noInvoice", label: "I don't have an invoice (upload voucher)", type: "checkbox", gridCols: 2 },
  { 
    name: "invoiceNote", 
    label: "Explanation Note", 
    type: "textarea", 
    placeholder: "Why is the invoice missing?", 
    gridCols: 2,
    hideIf: (form: any) => !form.noInvoice 
  },
  { name: "files", label: "Upload Documents", type: "file", gridCols: 2 },
];
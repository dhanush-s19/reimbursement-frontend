import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "./ui/Button"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}:Readonly <PaginationProps>) {
  const visiblePages = Array.from(
    { length: Math.min(totalPages, 5) },
    (_, idx) => idx
  )

  return (
    <div className="px-4 py-2 sm:px-8 w-full">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <p className="text-sm text-gray-500 order-2 sm:order-1">
          Page{" "}
          <span className="font-bold text-gray-900">
            {currentPage + 1}
          </span>{" "}
          of {totalPages}
        </p>

        <nav className="flex items-center gap-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(currentPage - 1, 0))}
            disabled={currentPage === 0 || loading}
          >
            <ChevronLeft size={16} />
            <span className="ml-1">Prev</span>
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            {visiblePages.map((page) => (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "secondary" : "outline"}
                onClick={() => onPageChange(page)}
                className="w-9"
              >
                {page + 1}
              </Button>
            ))}

            {totalPages > 5 && (
              <span className="px-2 text-gray-400">...</span>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onPageChange(Math.min(currentPage + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1 || loading}
          >
            <span className="mr-1">Next</span>
            <ChevronRight size={16} />
          </Button>
        </nav>
      </div>
    </div>
  )
}